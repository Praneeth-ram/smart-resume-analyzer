from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import date
from database import get_db
from models.models import JobPost, HRProfile, User
from schemas.schemas import JobPostCreate, JobPostOut
from utils.auth import get_current_user, require_role

router = APIRouter()

@router.get("/", response_model=List[JobPostOut])
def get_all_jobs(db: Session = Depends(get_db)):
    return db.query(JobPost).order_by(JobPost.created_at.desc()).all()
    # today = date.today()
    # jobs = db.query(JobPost).order_by(JobPost.created_at.desc()).all()

    # result = []
    # for job in jobs:
    #     if not job.is_active:
    #         status = "deactivated"
    #     elif job.deadline and job.deadline < today:
    #         status = "expired"
    #     else:
    #         status = "active"

    #     job_dict = {
    #         **job.__dict__,
    #         "status": status
    #     }

    #     result.append(job_dict)

    # return result

@router.get("/{job_id}", response_model=JobPostOut)
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(JobPost).filter(JobPost.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job
    # today = date.today()
    # job = db.query(JobPost).filter(
    #     JobPost.id == job_id,
    #     JobPost.deadline >= today
    # ).first()
    # if not job:
    #     raise HTTPException(status_code=404, detail="Job not found or deadline has passed")
    # return job

@router.post("/", response_model=JobPostOut)
def create_job(data: JobPostCreate, current_user: User = Depends(require_role("hr")), db: Session = Depends(get_db)):
    hr = db.query(HRProfile).filter(HRProfile.user_id == current_user.id).first()
    if not hr:
        raise HTTPException(status_code=400, detail="HR profile not found")
    job = JobPost(**data.dict(), hr_id=hr.id)
    db.add(job)
    db.commit()
    db.refresh(job)
    return job

@router.put("/{job_id}", response_model=JobPostOut)
def update_job(job_id: int, data: JobPostCreate, current_user: User = Depends(require_role("hr")), db: Session = Depends(get_db)):
    hr = db.query(HRProfile).filter(HRProfile.user_id == current_user.id).first()
    job = db.query(JobPost).filter(JobPost.id == job_id, JobPost.hr_id == hr.id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    for k, v in data.dict().items():
        setattr(job, k, v)
    db.commit()
    db.refresh(job)
    return job

@router.delete("/{job_id}")
def delete_job(job_id: int, current_user: User = Depends(require_role("hr")), db: Session = Depends(get_db)):
    hr = db.query(HRProfile).filter(HRProfile.user_id == current_user.id).first()
    job = db.query(JobPost).filter(JobPost.id == job_id, JobPost.hr_id == hr.id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    job.is_active = False
    db.commit()
    return {"message": "Job deactivated"}
