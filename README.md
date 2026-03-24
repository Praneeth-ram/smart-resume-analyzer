# 🚀 Smart Resume Analyzer — Complete Setup Guide

## Tech Stack
- **Frontend**: React 18, React Router v6, Axios, React Dropzone, React Toastify
- **Backend**: FastAPI, SQLAlchemy, Pydantic v2, python-jose (JWT)
- **Database**: PostgreSQL
- **Integrations**: Google Drive API, Gmail SMTP

---

## 📁 Project Structure

```
smart-resume-analyzer/
├── backend/
│   ├── main.py                  # FastAPI app entry point
│   ├── database.py              # DB connection & session
│   ├── requirements.txt
│   ├── .env.example
│   ├── models/
│   │   └── models.py            # SQLAlchemy ORM models
│   ├── schemas/
│   │   └── schemas.py           # Pydantic request/response schemas
│   ├── routers/
│   │   ├── auth.py              # Register, Login, Profile creation
│   │   ├── jobs.py              # Job CRUD endpoints
│   │   ├── applications.py      # Apply for jobs
│   │   ├── resumes.py           # Resume upload + ATS scoring
│   │   └── hr.py                # HR dashboard, selection, email
│   ├── services/
│   │   ├── ats_service.py       # PDF/DOCX parsing + ATS scoring logic
│   │   ├── drive_service.py     # Google Drive upload
│   │   └── email_service.py     # SMTP email on candidate selection
│   └── utils/
│       └── auth.py              # JWT creation, password hashing, guards
└── frontend/
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js               # Routing configuration
        ├── index.js
        ├── index.css            # Global design system styles
        ├── api/
        │   └── index.js         # All Axios API calls
        ├── context/
        │   └── AuthContext.js   # Auth state (login/logout)
        ├── components/
        │   └── Navbar.js
        └── pages/
            ├── LandingPage.js
            ├── LoginPage.js
            ├── RegisterPage.js
            ├── student/
            │   ├── JobListPage.js        # Browse jobs
            │   ├── JobDetailPage.js      # Job description + Apply Now
            │   ├── ApplyPage.js          # Student details form
            │   ├── ResumeUploadPage.js   # Upload + ATS score display
            │   ├── MyApplicationsPage.js # Application tracking
            │   └── StudentDashboard.js
            └── hr/
                ├── HRDashboard.js        # Stats overview
                ├── HRJobsPage.js         # Manage job posts
                ├── CreateJobPage.js      # Post a new job
                └── ApplicationsPage.js  # Review candidates, select, email
```

---

## ⚙️ Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL 14+
- A Google Cloud project (for Drive integration)
- A Gmail account with App Password (for email)

---

## 🗄️ Step 1 — PostgreSQL Setup

```sql
-- Run in psql or pgAdmin
CREATE DATABASE smart_resume_db;
CREATE USER resume_user WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE smart_resume_db TO resume_user;
```

---

## 🐍 Step 2 — Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy and configure environment variables
cp .env.example .env
```

### Edit `.env`:
```
DATABASE_URL=postgresql://resume_user:yourpassword@localhost:5432/smart_resume_db
SECRET_KEY=replace-with-a-long-random-string-at-least-32-chars
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail@gmail.com
SMTP_PASSWORD=your-16-char-app-password
GOOGLE_SERVICE_ACCOUNT_FILE=service_account.json
HR_DRIVE_FOLDER_ID=your-google-drive-folder-id
```

### Run the backend:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API docs available at: http://localhost:8000/docs

---

## ⚛️ Step 3 — Frontend Setup

```bash
cd frontend

npm install

npm start
```

Frontend runs at: http://localhost:3000

The `"proxy": "http://localhost:8000"` in `package.json` routes all `/api` calls to FastAPI.

---

## 📧 Step 4 — Gmail App Password (for email notifications)

1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification**
3. Search for **App Passwords**
4. Generate a new app password for "Mail"
5. Copy the 16-character password into your `.env` as `SMTP_PASSWORD`

> ⚠️ Never use your real Gmail password — always use an App Password.

---

## ☁️ Step 5 — Google Drive Integration

### A. Create a Service Account:
1. Go to https://console.cloud.google.com
2. Create a new project (e.g. `smart-resume-analyzer`)
3. Enable the **Google Drive API**
4. Go to **IAM & Admin → Service Accounts**
5. Create a service account, download the **JSON key**
6. Rename the file to `service_account.json` and place it in the `backend/` folder

### B. Set up a Drive Folder:
1. In Google Drive, create a new folder (e.g. `HR Resumes`)
2. Right-click → **Share** → share with the service account email (e.g. `xxx@project.iam.gserviceaccount.com`) as **Editor**
3. Copy the folder ID from the URL (the part after `/folders/`)
4. Paste it into your `.env` as `HR_DRIVE_FOLDER_ID`

> 💡 If `service_account.json` is missing, the app still works — resumes just won't be uploaded to Drive.

---

## 🔄 Complete User Workflow

### Student Flow:
1. Go to http://localhost:3000
2. Click **Browse Jobs**
3. Click on a job → read description → click **Apply Now**
4. Login/Register as a Student if not already
5. Fill in **Name, Email, Date of Birth, Phone** → Submit
6. On the Resume Upload page, drag & drop or select a PDF/DOCX resume
7. Click **Analyze & Get ATS Score**
8. View your score, matched/missing skills, and feedback
9. If score ≥ threshold → resume is sent to HR's Google Drive

### HR Flow:
1. Register as **HR / Company**
2. Click **Post a Job** → fill in job title, description, required skills, ATS threshold
3. Go to **Dashboard** → see stats
4. Go to **My Jobs** → click **View Applications** on any job
5. See all candidates with ATS scores
6. Filter by status (ATS Passed, Shortlisted, etc.)
7. Click **⭐ Shortlist** to shortlist a candidate
8. Click **🎉 Select** → add optional message → confirm
9. Candidate automatically receives a congratulation email

---

## 🛠️ API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register student or HR |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/auth/me` | Get current user info |
| POST | `/api/auth/student/profile` | Create student profile |
| POST | `/api/auth/hr/profile` | Create HR profile |
| GET | `/api/jobs/` | List all active jobs |
| GET | `/api/jobs/{id}` | Get single job details |
| POST | `/api/jobs/` | Create job post (HR only) |
| PUT | `/api/jobs/{id}` | Update job post (HR only) |
| DELETE | `/api/jobs/{id}` | Deactivate job (HR only) |
| POST | `/api/applications/` | Apply for a job |
| GET | `/api/applications/my` | Get student's applications |
| POST | `/api/resumes/upload/{application_id}` | Upload resume + get ATS score |
| GET | `/api/hr/dashboard` | HR stats overview |
| GET | `/api/hr/applications/{job_id}` | List candidates for a job |
| POST | `/api/hr/select-candidate` | Select candidate + send email |
| POST | `/api/hr/shortlist/{id}` | Shortlist a candidate |
| POST | `/api/hr/reject/{id}` | Reject a candidate |

---

## 🧠 ATS Scoring Algorithm

The ATS score is computed from 3 components:

| Component | Weight | Description |
|-----------|--------|-------------|
| **Skill Matching** | 40% | How many required skills are found in the resume text |
| **Keyword Overlap** | 40% | Overlap between JD keywords and resume keywords |
| **Resume Completeness** | 20% | Checks for Education, Experience, Skills sections, dates |

A score ≥ threshold (default 80%) allows the resume to be:
- Stored in HR's Google Drive
- Marked as `ats_passed` in the database
- Visible to HR for review/shortlisting/selection

---

## 🗃️ Database Schema (ER Summary)

```
users (id, email, hashed_password, role, is_active, created_at)
  │
  ├─► student_profiles (id, user_id→users, name, email, date_of_birth, phone)
  │       │
  │       └─► applications (id, student_id→student_profiles, job_post_id→job_posts,
  │                          status, ats_score, resume_filename, resume_drive_link)
  │
  └─► hr_profiles (id, user_id→users, name, company_name, department)
          │
          └─► job_posts (id, hr_id→hr_profiles, title, company, description,
                         requirements, skills_required, ats_threshold, deadline, ...)
```

---

## 🐳 Optional: Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: smart_resume_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    env_file: ./backend/.env
    depends_on:
      - db
    command: uvicorn main:app --host 0.0.0.0 --port 8000 --reload

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  pgdata:
```

---

## 🔧 Troubleshooting

| Issue | Fix |
|-------|-----|
| `CORS error` | Ensure backend allows `http://localhost:3000` in `main.py` |
| `401 Unauthorized` | Token expired — log in again |
| `Drive upload fails` | Check `service_account.json` path and folder sharing |
| `Email not sending` | Verify Gmail App Password and 2FA is enabled |
| `DB connection error` | Verify PostgreSQL is running and `DATABASE_URL` is correct |
| `ATS score always low` | Ensure resume has relevant keywords matching the job description |
| `PDF parse fails` | Install `PyPDF2` — check `pip install PyPDF2` |

---

## 📦 Production Deployment Tips

- Use **Gunicorn** with Uvicorn workers for backend: `gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker`
- Build frontend: `npm run build` — serve with **Nginx**
- Use **environment variables** (not `.env` files) in production
- Set a strong `SECRET_KEY` (32+ random characters)
- Use **SSL/HTTPS** for all endpoints
- Store `service_account.json` as a secret or use IAM roles
- Consider **Redis** for rate limiting ATS scoring requests

---

*Built with ❤️ — Smart Resume Analyzer v1.0*
