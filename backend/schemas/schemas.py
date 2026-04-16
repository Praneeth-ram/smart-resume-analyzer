from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date, datetime
from enum import Enum

class UserRole(str, Enum):
    student = "student"
    hr = "hr"

class ApplicationStatus(str, Enum):
    applied = "applied"
    ats_passed = "ats_passed"
    ats_failed = "ats_failed"
    shortlisted = "shortlisted"
    rejected = "rejected"
    selected = "selected"

# Auth Schemas
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    role: UserRole

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    user_id: int

# Student Schemas
class StudentProfileCreate(BaseModel):
    name: str
    email: EmailStr
    date_of_birth: date
    phone: Optional[str] = None

class StudentProfileOut(BaseModel):
    id: int
    user_id: int
    name: str
    email: str
    date_of_birth: Optional[date]
    phone: Optional[str]
    created_at: datetime
    class Config:
        from_attributes = True

# HR Schemas
class HRProfileCreate(BaseModel):
    name: str
    company_name: str
    department: Optional[str] = None

class HRProfileOut(BaseModel):
    id: int
    user_id: int
    name: str
    company_name: str
    department: Optional[str]
    created_at: datetime
    class Config:
        from_attributes = True

# Job Post Schemas
class JobPostCreate(BaseModel):
    title: str
    company: str
    location: Optional[str] = None
    job_type: Optional[str] = "Full-time"
    description: str
    requirements: Optional[str] = None
    skills_required: Optional[str] = None
    experience_required: Optional[str] = None
    salary_range: Optional[str] = None
    ats_threshold: float = 80.0
    deadline: date

class JobPostOut(BaseModel):
    id: int
    hr_id: int
    title: str
    company: str
    location: Optional[str]
    job_type: Optional[str]
    description: str
    requirements: Optional[str]
    skills_required: Optional[str]
    experience_required: Optional[str]
    salary_range: Optional[str]
    ats_threshold: float
    is_active: bool
    created_at: datetime
    deadline: Optional[date]
    status: str
    class Config:
        from_attributes = True

# Application Schemas
class ApplicationCreate(BaseModel):
    job_post_id: int
    student_name: str
    student_email: EmailStr
    date_of_birth: date
    phone: Optional[str] = None

class ApplicationOut(BaseModel):
    id: int
    student_id: int
    job_post_id: int
    status: ApplicationStatus
    ats_score: Optional[float]
    resume_filename: Optional[str]
    resume_filename: Optional[str]
    resume_available: bool 
    # resume_drive_link: Optional[str]
    applied_at: datetime
    class Config:
        from_attributes = True

class ATSScoreResponse(BaseModel):
    application_id: int
    ats_score: float
    threshold: float
    passed: bool
    matched_skills: List[str]
    missing_skills: List[str]
    feedback: str

class SelectionEmailRequest(BaseModel):
    application_id: int
    message: Optional[str] = None
