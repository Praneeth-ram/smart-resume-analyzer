from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from database import get_db
from models.models import Application, JobPost, StudentProfile, ApplicationStatus, User
from schemas.schemas import ATSScoreResponse
from services.ats_service import extract_resume_text, compute_ats_score, generate_feedback
from utils.auth import get_current_user

router = APIRouter()

ALLOWED_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "text/plain"
}

@router.post("/upload/{application_id}", response_model=ATSScoreResponse)
async def upload_resume(
    application_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # ✅ Validate file type
    if file.content_type not in ALLOWED_TYPES and not file.filename.endswith(
        (".pdf", ".docx", ".doc", ".txt")
    ):
        raise HTTPException(
            status_code=400,
            detail="Only PDF, DOCX, DOC, or TXT files are allowed"
        )

    # ✅ Get application
    application = db.query(Application).filter(
        Application.id == application_id
    ).first()

    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    # ✅ Verify ownership
    student_profile = db.query(StudentProfile).filter(
        StudentProfile.user_id == current_user.id
    ).first()

    if not student_profile or application.student_id != student_profile.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    # ✅ Get job details
    job = db.query(JobPost).filter(
        JobPost.id == application.job_post_id
    ).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # ✅ Read file
    file_bytes = await file.read()

    # ⭐ Remove old resume if re-upload
    application.resume_file = None
    application.resume_mimetype = None

    # ✅ Extract text
    resume_text = extract_resume_text(file_bytes, file.filename)

    # ✅ Compute ATS score
    score, matched_skills, missing_skills = compute_ats_score(
        resume_text=resume_text,
        job_description=job.description,
        job_requirements=job.requirements or "",
        skills_required=job.skills_required or "",
    )

    feedback = generate_feedback(
        score,
        job.ats_threshold,
        matched_skills,
        missing_skills
    )

    passed = score >= job.ats_threshold

    # ✅ Update ATS data
    application.ats_score = score
    application.resume_filename = file.filename

    if passed:
        application.status = ApplicationStatus.ats_passed

        # ⭐ Store resume in DB ONLY if ATS passed
        application.resume_file = file_bytes
        application.resume_mimetype = file.content_type or "application/pdf"

    else:
        application.status = ApplicationStatus.ats_failed

    db.commit()
    db.refresh(application)

    return ATSScoreResponse(
        application_id=application.id,
        ats_score=score,
        threshold=job.ats_threshold,
        passed=passed,
        matched_skills=matched_skills,
        missing_skills=missing_skills,
        feedback=feedback,
    )