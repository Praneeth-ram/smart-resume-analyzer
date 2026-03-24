import re
import io
from typing import Tuple, List
import PyPDF2
from docx import Document

def extract_text_from_pdf(file_bytes: bytes) -> str:
    reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text.lower()

def extract_text_from_docx(file_bytes: bytes) -> str:
    doc = Document(io.BytesIO(file_bytes))
    return "\n".join([para.text for para in doc.paragraphs]).lower()

def extract_resume_text(file_bytes: bytes, filename: str) -> str:
    filename_lower = filename.lower()
    if filename_lower.endswith(".pdf"):
        return extract_text_from_pdf(file_bytes)
    elif filename_lower.endswith((".docx", ".doc")):
        return extract_text_from_docx(file_bytes)
    else:
        return file_bytes.decode("utf-8", errors="ignore").lower()

def parse_skills(skills_str: str) -> List[str]:
    if not skills_str:
        return []
    skills = [s.strip().lower() for s in re.split(r"[,;\n]", skills_str) if s.strip()]
    return skills

def compute_ats_score(
    resume_text: str,
    job_description: str,
    job_requirements: str,
    skills_required: str,
) -> Tuple[float, List[str], List[str]]:
    resume_text = resume_text.lower()
    jd_text = (job_description + " " + (job_requirements or "")).lower()

    required_skills = parse_skills(skills_required or "")

    # Skill matching (40% weight)
    matched_skills = []
    missing_skills = []
    for skill in required_skills:
        if skill in resume_text:
            matched_skills.append(skill)
        else:
            missing_skills.append(skill)

    skill_score = (len(matched_skills) / len(required_skills) * 100) if required_skills else 50.0

    # Keyword overlap from JD (40% weight)
    jd_words = set(re.findall(r"\b[a-z]{4,}\b", jd_text))
    resume_words = set(re.findall(r"\b[a-z]{4,}\b", resume_text))
    common_words = {"with", "that", "this", "have", "from", "they", "will", "your", "what", "about",
                    "more", "also", "into", "than", "then", "when", "which", "their", "there"}
    jd_words -= common_words
    keyword_overlap = len(jd_words & resume_words) / len(jd_words) * 100 if jd_words else 50.0
    keyword_overlap = min(keyword_overlap * 1.5, 100)  # scale up

    # Resume completeness check (20% weight)
    completeness_checks = [
        bool(re.search(r"education|bachelor|master|degree|university|college", resume_text)),
        bool(re.search(r"experience|worked|job|internship|project", resume_text)),
        bool(re.search(r"skill|proficient|knowledge|expertise", resume_text)),
        bool(re.search(r"\d{4}", resume_text)),  # has years
        len(resume_text) > 300,
    ]
    completeness_score = sum(completeness_checks) / len(completeness_checks) * 100

    # Weighted final score
    final_score = round(
        (skill_score * 0.40) + (keyword_overlap * 0.40) + (completeness_score * 0.20), 2
    )
    final_score = min(final_score, 100.0)

    return final_score, matched_skills, missing_skills

def generate_feedback(score: float, threshold: float, matched: List[str], missing: List[str]) -> str:
    if score >= threshold:
        return (
            f"Great match! Your resume scored {score:.1f}% which meets our threshold of {threshold:.0f}%. "
            f"You matched {len(matched)} key skills. Your application has been forwarded to HR."
        )
    else:
        tips = []
        if missing:
            tips.append(f"Add these missing skills: {', '.join(missing[:5])}")
        tips.append("Include more relevant keywords from the job description.")
        tips.append("Ensure your resume includes Education, Experience, and Skills sections.")
        return (
            f"Your resume scored {score:.1f}% which is below the threshold of {threshold:.0f}%. "
            f"Tips to improve: {' | '.join(tips)}"
        )
