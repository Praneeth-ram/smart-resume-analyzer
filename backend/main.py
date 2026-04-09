from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import rag

from dotenv import load_dotenv
load_dotenv()

from routers import jobs, applications, resumes, hr, auth
from database import engine, Base

# VERY IMPORTANT → import models so tables register
from models import models  

app = FastAPI(
    title="Smart Resume Analyzer API",
    version="1.0.0"
)

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["Jobs"])
app.include_router(applications.router, prefix="/api/applications", tags=["Applications"])
app.include_router(resumes.router, prefix="/api/resumes", tags=["Resumes"])
app.include_router(hr.router, prefix="/api/hr", tags=["HR"])
app.include_router(rag.router, prefix="/api/rag", tags=["RAG"])

@app.get("/")
def root():
    return {"message": "Smart Resume Analyzer API is running"}