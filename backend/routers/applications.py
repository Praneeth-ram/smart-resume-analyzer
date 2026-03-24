from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.models import Application, StudentProfile, JobPost, User
from schemas.schemas import ApplicationCreate, ApplicationOut
from utils.auth import get_current_user

router = APIRouter()


def build_application_response(app: Application):
    return {
        "id": app.id,
        "student_id": app.student_id,
        "job_post_id": app.job_post_id,
        "status": app.status,
        "ats_score": app.ats_score,
        "resume_filename": app.resume_filename,
        "resume_available": True if app.resume_file else False,
        "applied_at": app.applied_at
    }


@router.post("/", response_model=ApplicationOut)
def apply_for_job(
    data: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(
        StudentProfile.user_id == current_user.id
    ).first()

    if not profile:
        profile = StudentProfile(
            user_id=current_user.id,
            name=data.student_name,
            email=data.student_email,
            date_of_birth=data.date_of_birth,
            phone=data.phone,
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)

    existing = db.query(Application).filter(
        Application.student_id == profile.id,
        Application.job_post_id == data.job_post_id
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Already applied for this job")

    job = db.query(JobPost).filter(JobPost.id == data.job_post_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    application = Application(
        student_id=profile.id,
        job_post_id=data.job_post_id
    )

    db.add(application)
    db.commit()
    db.refresh(application)

    return build_application_response(application)


@router.get("/my", response_model=List[ApplicationOut])
def get_my_applications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(
        StudentProfile.user_id == current_user.id
    ).first()

    if not profile:
        return []

    applications = db.query(Application).filter(
        Application.student_id == profile.id
    ).all()

    return [build_application_response(app) for app in applications]


@router.get("/{application_id}", response_model=ApplicationOut)
def get_application(
    application_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    app = db.query(Application).filter(
        Application.id == application_id
    ).first()

    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    return build_application_response(app)