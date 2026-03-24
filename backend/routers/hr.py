from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.models import Application, JobPost, HRProfile, StudentProfile, User, ApplicationStatus
from schemas.schemas import SelectionEmailRequest
from services.email_service import send_selection_email
from utils.auth import require_role
from fastapi.responses import Response

router = APIRouter()

@router.get("/applications/{job_id}")
def get_job_applications(
    job_id: int,
    current_user: User = Depends(require_role("hr")),
    db: Session = Depends(get_db)
):
    hr = db.query(HRProfile).filter(HRProfile.user_id == current_user.id).first()
    job = db.query(JobPost).filter(JobPost.id == job_id, JobPost.hr_id == hr.id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    applications = db.query(Application).filter(Application.job_post_id == job_id).all()

    result = []
    for app in applications:
        student = db.query(StudentProfile).filter(StudentProfile.id == app.student_id).first()

        result.append({
            "application_id": app.id,
            "student_name": student.name if student else "N/A",
            "student_email": student.email if student else "N/A",
            "date_of_birth": str(student.date_of_birth) if student else "N/A",
            "phone": student.phone if student else "N/A",
            "ats_score": app.ats_score,
            "status": app.status,
            "resume_filename": app.resume_filename,
            "applied_at": app.applied_at,
        })

    return result


@router.get("/dashboard")
def hr_dashboard(
    current_user: User = Depends(require_role("hr")),
    db: Session = Depends(get_db)
):
    hr = db.query(HRProfile).filter(HRProfile.user_id == current_user.id).first()
    if not hr:
        raise HTTPException(status_code=404, detail="HR profile not found")

    jobs = db.query(JobPost).filter(JobPost.hr_id == hr.id).all()

    total_applications = 0
    ats_passed = 0
    selected = 0

    for job in jobs:
        apps = db.query(Application).filter(Application.job_post_id == job.id).all()

        total_applications += len(apps)

        ats_passed += len([
            a for a in apps
            if a.status in [
                ApplicationStatus.ats_passed,
                ApplicationStatus.shortlisted,
                ApplicationStatus.selected
            ]
        ])

        selected += len([
            a for a in apps
            if a.status == ApplicationStatus.selected
        ])

    return {
        "hr_name": hr.name,
        "company_name": hr.company_name,
        "total_jobs": len(jobs),
        "active_jobs": len([j for j in jobs if j.is_active]),
        "total_applications": total_applications,
        "ats_passed": ats_passed,
        "selected": selected,
    }


@router.post("/select-candidate")
def select_candidate(
    data: SelectionEmailRequest,
    current_user: User = Depends(require_role("hr")),
    db: Session = Depends(get_db)
):
    application = db.query(Application).filter(Application.id == data.application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    student = db.query(StudentProfile).filter(StudentProfile.id == application.student_id).first()
    job = db.query(JobPost).filter(JobPost.id == application.job_post_id).first()
    hr = db.query(HRProfile).filter(HRProfile.user_id == current_user.id).first()

    if job.hr_id != hr.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    application.status = ApplicationStatus.selected
    db.commit()

    email_sent = send_selection_email(
        to_email=student.email,
        student_name=student.name,
        job_title=job.title,
        company=hr.company_name,
        custom_message=data.message or "",
    )

    return {
        "message": "Candidate selected successfully",
        "email_sent": email_sent,
        "student_name": student.name,
        "student_email": student.email,
    }


@router.post("/shortlist/{application_id}")
def shortlist_candidate(
    application_id: int,
    current_user: User = Depends(require_role("hr")),
    db: Session = Depends(get_db)
):
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    application.status = ApplicationStatus.shortlisted
    db.commit()

    return {"message": "Candidate shortlisted"}


@router.post("/reject/{application_id}")
def reject_candidate(
    application_id: int,
    current_user: User = Depends(require_role("hr")),
    db: Session = Depends(get_db)
):
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    application.status = ApplicationStatus.rejected
    db.commit()

    return {"message": "Candidate rejected"}


# ⭐ NEW Resume View API (DB Streaming)
@router.get("/resume/{application_id}/view")
def view_resume(
    application_id: int,
    current_user: User = Depends(require_role("hr")),
    db: Session = Depends(get_db)
):
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    hr = db.query(HRProfile).filter(HRProfile.user_id == current_user.id).first()
    job = db.query(JobPost).filter(JobPost.id == application.job_post_id).first()

    if job.hr_id != hr.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    if not application.resume_file:
        raise HTTPException(
            status_code=404,
            detail="Resume not available. ATS score below threshold."
        )

    return Response(
        content=application.resume_file,
        media_type=application.resume_mimetype,
        headers={
            "Content-Disposition":
            f"inline; filename={application.resume_filename}"
        }
    )