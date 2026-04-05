from sqlalchemy import Column, Integer, String, Text, Date, DateTime, Float, Boolean, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum
from sqlalchemy import LargeBinary

class UserRole(str, enum.Enum):
    student = "student"
    hr = "hr"

class ApplicationStatus(str, enum.Enum):
    applied = "applied"
    ats_passed = "ats_passed"
    ats_failed = "ats_failed"
    shortlisted = "shortlisted"
    rejected = "rejected"
    selected = "selected"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    student_profile = relationship("StudentProfile", back_populates="user", uselist=False)
    hr_profile = relationship("HRProfile", back_populates="user", uselist=False)

class StudentProfile(Base):
    __tablename__ = "student_profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    date_of_birth = Column(Date)
    phone = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user = relationship("User", back_populates="student_profile")
    applications = relationship("Application", back_populates="student")

class HRProfile(Base):
    __tablename__ = "hr_profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    name = Column(String, nullable=False)
    company_name = Column(String, nullable=False)
    department = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user = relationship("User", back_populates="hr_profile")
    job_posts = relationship("JobPost", back_populates="hr")

class JobPost(Base):
    __tablename__ = "job_posts"
    id = Column(Integer, primary_key=True, index=True)
    hr_id = Column(Integer, ForeignKey("hr_profiles.id"))
    title = Column(String, nullable=False)
    company = Column(String, nullable=False)
    location = Column(String)
    job_type = Column(String)  # Full-time, Part-time, Remote
    description = Column(Text, nullable=False)
    requirements = Column(Text)
    skills_required = Column(Text)  # comma-separated
    experience_required = Column(String)
    salary_range = Column(String)
    ats_threshold = Column(Float, default=80.0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deadline = Column(Date)
    hr = relationship("HRProfile", back_populates="job_posts")
    applications = relationship("Application", back_populates="job_post")

class Application(Base):
    __tablename__ = "applications"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.id"))
    job_post_id = Column(Integer, ForeignKey("job_posts.id"))
    status = Column(Enum(ApplicationStatus), default=ApplicationStatus.applied)
    ats_score = Column(Float, nullable=True)
    resume_filename = Column(String, nullable=True)
    resume_drive_link = Column(String, nullable=True)
    resume_file = Column(LargeBinary, nullable=True)
    resume_mimetype = Column(String, nullable=True)
    applied_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    student = relationship("StudentProfile", back_populates="applications")
    job_post = relationship("JobPost", back_populates="applications")
