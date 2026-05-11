import json
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from database import get_db
from models.models import Application, JobPost, StudentProfile, ApplicationStatus, User
from services.rag_service import run_rag_analysis
from services.ats_service import extract_resume_text
from services.drive_service import upload_resume_to_drive
from services.email_service import send_selection_email, send_rag_rejection_email, send_rag_success_email
from utils.auth import require_role, get_current_user
import httpx, os

router = APIRouter()

@router.post("/analyze/{application_id}")
async def run_rag(
    application_id: int,
    current_user: User = Depends(require_role("hr")),
    db: Session = Depends(get_db),
):
    """HR triggers Phase 2 RAG+LLM analysis on an ATS-passed application."""
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    if app.status not in [ApplicationStatus.ats_passed, ApplicationStatus.shortlisted]:
        raise HTTPException(status_code=400, detail="Application must have passed ATS first")

    student = db.query(StudentProfile).filter(StudentProfile.id == app.student_id).first()
    job     = db.query(JobPost).filter(JobPost.id == app.job_post_id).first()

    # Re-fetch resume bytes from Drive link or stored file
    # For simplicity we store the resume text in a new column OR re-read from file path
    # Here we use the stored resume text approach (see Step 5 for adding resume_text column)
    if not app.resume_text:
        raise HTTPException(status_code=400, detail="Resume text not stored. Upload resume first.")

    result = run_rag_analysis(
        resume_text=app.resume_text,
        job_description=job.description,
        job_requirements=job.requirements or "",
        skills_required=job.skills_required or "",
        student_name=student.name,
    )

    # Persist results
    app.rag_verdict   = result["verdict"]
    app.rag_score     = result["semantic_score"]
    app.rag_reasoning = result["reasoning"]
    app.rag_strengths = json.dumps(result.get("strengths", []))
    app.rag_gaps      = json.dumps(result.get("gaps", []))

    if result["verdict"] == "SELECTED":
        app.status = ApplicationStatus.selected
        send_rag_success_email(
            to_email=student.email,
            student_name=student.name,
            job_title=job.title,
            company=job.company,
            custom_message=result.get("recommendation", ""),
        )
    else:
        app.status = ApplicationStatus.rejected
        send_rag_rejection_email(
            to_email=student.email,
            student_name=student.name,
            job_title=job.title,
            company=job.company,
            custom_message=result.get("reasoning", "")
        )

    db.commit()
    db.refresh(app)

    return {
        "application_id": app.id,
        "verdict": result["verdict"],
        "semantic_score": result["semantic_score"],
        "strengths": result.get("strengths", []),
        "gaps": result.get("gaps", []),
        "reasoning": result["reasoning"],
        "recommendation": result.get("recommendation", ""),
        "top_chunks": result.get("top_chunks", []),
    }


@router.get("/result/{application_id}")
def get_rag_result(
    application_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Fetch stored RAG result for any application."""
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Not found")
    import json
    return {
        "rag_verdict":   app.rag_verdict,
        "rag_score":     app.rag_score,
        "rag_reasoning": app.rag_reasoning,
        "rag_strengths": json.loads(app.rag_strengths) if app.rag_strengths else [],
        "rag_gaps":      json.loads(app.rag_gaps) if app.rag_gaps else [],
    }