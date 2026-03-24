from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.models import User, StudentProfile, HRProfile, UserRole
from schemas.schemas import UserRegister, UserLogin, Token, StudentProfileCreate, HRProfileCreate
from utils.auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter()

@router.post("/register", response_model=Token)
def register(data: UserRegister, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(email=data.email, hashed_password=hash_password(data.password), role=data.role)
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token({"sub": str(user.id), "role": user.role})
    return {"access_token": token, "token_type": "bearer", "role": user.role, "user_id": str(user.id)}

@router.post("/login", response_model=Token)
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": str(user.id), "role": user.role})
    return {"access_token": token, "token_type": "bearer", "role": user.role, "user_id": str(user.id)}

@router.post("/student/profile")
def create_student_profile(data: StudentProfileCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != UserRole.student:
        raise HTTPException(status_code=403, detail="Only students can create student profiles")
    existing = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Profile already exists")
    profile = StudentProfile(**data.dict(), user_id=current_user.id)
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile

@router.post("/hr/profile")
def create_hr_profile(data: HRProfileCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != UserRole.hr:
        raise HTTPException(status_code=403, detail="Only HR can create HR profiles")
    existing = db.query(HRProfile).filter(HRProfile.user_id == current_user.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Profile already exists")
    profile = HRProfile(**data.dict(), user_id=current_user.id)
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    result = {"id": current_user.id, "email": current_user.email, "role": current_user.role}
    if current_user.role == UserRole.student:
        profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
        result["profile"] = profile
    elif current_user.role == UserRole.hr:
        profile = db.query(HRProfile).filter(HRProfile.user_id == current_user.id).first()
        result["profile"] = profile
    return result
