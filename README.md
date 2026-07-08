# 📄 AI Resume Analyzer

An AI-powered Resume Analyzer that evaluates resumes against job descriptions using Large Language Models (LLMs). The application provides ATS compatibility analysis, skill matching, keyword extraction, strengths, weaknesses, and personalized improvement suggestions through an interactive chat interface.

---

# 🚀 Features

- Upload resumes in PDF format
- Paste or upload job descriptions
- AI-powered resume analysis using Ollama LLM
- ATS compatibility scoring
- Skill gap analysis
- Keyword matching
- Resume strengths and weaknesses
- Personalized improvement recommendations
- Interactive chatbot for resume-related queries
- Modern and responsive web interface
- FastAPI backend with REST APIs
- Docker support for easy deployment

---

# 🛠 Technology Stack

### Frontend

- React.js
- Vite
- HTML5
- CSS3
- JavaScript

### Backend

- FastAPI
- Python
- Uvicorn
- Pydantic

### AI & NLP

- Ollama
- Llama 3.2
- LangChain
- Prompt Engineering

### Document Processing

- PyMuPDF (fitz)
- pdfplumber

### Deployment

- Docker
- Docker Compose

### Version Control

- Git
- GitHub

---

# 📂 Project Structure

```
resume-analyzer/
│
├── backend/
│   ├── api/
│   ├── services/
│   ├── models/
│   ├── utils/
│   ├── uploads/
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── docker-compose.yml
├── Dockerfile
├── README.md
└── .env.example
```

---

# ⚙️ Installation

## Clone the Repository

```bash
git clone https://github.com/yourusername/resume-analyzer.git

cd resume-analyzer
```

---

## Backend Setup

Create a virtual environment

```bash
python -m venv venv
```

Activate it

### Windows

```bash
venv\Scripts\activate
```

### Linux/macOS

```bash
source venv/bin/activate
```

Install dependencies

```bash
pip install -r backend/requirements.txt
```

Start the FastAPI server

```bash
uvicorn main:app --reload
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## Ollama Setup

Install Ollama

```bash
https://ollama.com
```

Pull the Llama model

```bash
ollama pull llama3.2
```

Run Ollama

```bash
ollama serve
```

---

# 🐳 Docker Deployment

Build and start the application

```bash
docker-compose up --build
```

---

# 💡 How It Works

1. Upload your resume (PDF).
2. Paste the target job description.
3. The backend extracts text from the resume.
4. The extracted content and job description are processed by the Ollama LLM.
5. The AI compares the resume with the job requirements.
6. A detailed analysis report is generated, including ATS score, skill match, keyword coverage, strengths, weaknesses, and recommendations.

---

# 📊 Analysis Report Includes

- ATS Compatibility Score
- Resume Summary
- Job Match Percentage
- Technical Skills Identified
- Missing Skills
- Keyword Analysis
- Experience Evaluation
- Education Assessment
- Strengths
- Weaknesses
- Resume Improvement Suggestions
- Final Recommendation

---

# 🎯 Applications

- Resume Screening
- ATS Optimization
- Career Guidance
- Job Readiness Assessment
- Interview Preparation
- Recruitment Assistance

---
