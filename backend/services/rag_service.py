# """
# Phase 2 — RAG + LLM semantic matching service.
# Uses Google Gemini for the reasoning step.
# """
# import os
# import re
# import json
# import numpy as np
# from typing import List, Tuple
# from sentence_transformers import SentenceTransformer
# import faiss
# import google.generativeai as genai

# _model = None

# def _get_model() -> SentenceTransformer:
#     global _model
#     if _model is None:
#         _model = SentenceTransformer("all-MiniLM-L6-v2")
#     return _model


# # ── Text chunking ─────────────────────────────────────────────────────────────
# def _chunk_text(text: str, chunk_size: int = 200, overlap: int = 40) -> List[str]:
#     words = text.split()
#     chunks = []
#     for i in range(0, len(words), chunk_size - overlap):
#         chunk = " ".join(words[i : i + chunk_size])
#         if chunk.strip():
#             chunks.append(chunk)
#     return chunks


# # ── FAISS index ───────────────────────────────────────────────────────────────
# def _build_index(chunks: List[str]) -> Tuple[faiss.IndexFlatIP, np.ndarray]:
#     model = _get_model()
#     embeddings = model.encode(chunks, normalize_embeddings=True)
#     embeddings = np.array(embeddings, dtype="float32")
#     index = faiss.IndexFlatIP(embeddings.shape[1])
#     index.add(embeddings)
#     return index, embeddings


# # ── Retrieval ─────────────────────────────────────────────────────────────────
# def _retrieve_top_chunks(
#     query_text: str,
#     chunks: List[str],
#     index: faiss.IndexFlatIP,
#     top_k: int = 5,
# ) -> List[Tuple[str, float]]:
#     model = _get_model()
#     q_emb = model.encode([query_text], normalize_embeddings=True).astype("float32")
#     scores, indices = index.search(q_emb, min(top_k, len(chunks)))
#     return [(chunks[i], float(scores[0][j])) for j, i in enumerate(indices[0]) if i >= 0]


# # ── Gemini reasoning ──────────────────────────────────────────────────────────
# def _llm_verdict(
#     top_chunks: List[Tuple[str, float]],
#     job_description: str,
#     job_requirements: str,
#     skills_required: str,
#     student_name: str,
# ) -> dict:
#     genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
#     model_name = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
#     model = genai.GenerativeModel(model_name)

#     context = "\n\n".join([
#         f"[Relevance {score:.2f}] {chunk}"
#         for chunk, score in top_chunks
#     ])

#     system_prompt = (
#         "You are a professional HR screening assistant. "
#         "Evaluate candidates objectively based only on the provided resume sections and job requirements. "
#         "Always respond with valid JSON only — no markdown, no extra text."
#     )

#     user_prompt = f"""Evaluate the candidate for this role.

# JOB DESCRIPTION:
# {job_description}

# REQUIRED SKILLS:
# {skills_required}

# REQUIREMENTS:
# {job_requirements}

# CANDIDATE: {student_name}
# RETRIEVED RESUME SECTIONS (most relevant to the role):
# {context}

# Respond in this EXACT JSON format:
# {{
#   "verdict": "SELECTED" or "REJECTED",
#   "semantic_score": <float 0.0 to 1.0>,
#   "strengths": ["strength 1", "strength 2", "strength 3"],
#   "gaps": ["gap 1", "gap 2"],
#   "reasoning": "<2-3 sentence explanation of the decision>",
#   "recommendation": "<1 sentence actionable message to HR>"
# }}"""

#     full_prompt = f"{system_prompt}\n\n{user_prompt}"
    
#     try:
#         response = model.generate_content(
#             full_prompt,
#             generation_config=genai.types.GenerationConfig(
#                 temperature=0.2,
#                 max_output_tokens=600,
#             )
#         )
#         raw = response.text.strip()
#     except Exception as e:
#         # fallback using similarity scores
#         avg_score = np.mean([s for _, s in top_chunks]) if top_chunks else 0

#         verdict = "SELECTED" if avg_score > 0.6 else "REJECTED"

#         return {
#             "verdict": verdict,
#             "semantic_score": float(avg_score),
#             "strengths": ["Relevant skills found"] if verdict == "SELECTED" else [],
#             "gaps": ["Insufficient match with job description"],
#             "reasoning": f"Fallback mode used due to API error: {str(e)[:80]}",
#             "recommendation": "Proceed with caution" if verdict == "SELECTED" else "Reject",
#         }

#     try:
#         return json.loads(raw)
#     except Exception:
#         return {
#             "verdict": "REJECTED",
#             "semantic_score": 0.0,
#             "strengths": [],
#             "gaps": ["Could not parse LLM response"],
#             "reasoning": raw[:300],
#             "recommendation": "Manual review required.",
#         }


# # ── Public entry point ────────────────────────────────────────────────────────
# def run_rag_analysis(
#     resume_text: str,
#     job_description: str,
#     job_requirements: str,
#     skills_required: str,
#     student_name: str,
# ) -> dict:
#     chunks = _chunk_text(resume_text)
#     if not chunks:
#         return {
#             "verdict": "REJECTED",
#             "semantic_score": 0.0,
#             "strengths": [],
#             "gaps": ["Resume text is empty or unreadable"],
#             "reasoning": "Could not extract text from resume.",
#             "recommendation": "Ask candidate to resubmit in PDF/DOCX format.",
#             "top_chunks": [],
#         }

#     index, _ = _build_index(chunks)
#     jd_query  = f"{job_description} {job_requirements} {skills_required}"
#     top_chunks = _retrieve_top_chunks(jd_query, chunks, index, top_k=5)

#     result = _llm_verdict(
#         top_chunks, job_description, job_requirements, skills_required, student_name
#     )
#     result["top_chunks"] = [
#         {"text": c, "score": round(s, 3)} for c, s in top_chunks
#     ]
#     return result

"""
Phase 2 — RAG + LLM semantic matching service.
Uses Ollama (phi3) for reasoning (local LLM).
"""

import os
import re
import json
import numpy as np
from typing import List, Tuple
from sentence_transformers import SentenceTransformer
import faiss
import ollama  # ✅ replaced transformers


# ── Embedding model ─────────────────────────────────────────────
_embedding_model = None

def _get_embedding_model() -> SentenceTransformer:
    global _embedding_model
    if _embedding_model is None:
        _embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
    return _embedding_model


# ── Text chunking ─────────────────────────────────────────────
def _chunk_text(text: str, chunk_size: int = 200, overlap: int = 40) -> List[str]:
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size - overlap):
        chunk = " ".join(words[i : i + chunk_size])
        if chunk.strip():
            chunks.append(chunk)
    return chunks


# ── FAISS index ───────────────────────────────────────────────
def _build_index(chunks: List[str]) -> Tuple[faiss.IndexFlatIP, np.ndarray]:
    model = _get_embedding_model()
    embeddings = model.encode(chunks, normalize_embeddings=True)
    embeddings = np.array(embeddings, dtype="float32")
    index = faiss.IndexFlatIP(embeddings.shape[1])
    index.add(embeddings)
    return index, embeddings


# ── Retrieval ─────────────────────────────────────────────────
def _retrieve_top_chunks(
    query_text: str,
    chunks: List[str],
    index: faiss.IndexFlatIP,
    top_k: int = 5,
) -> List[Tuple[str, float]]:
    model = _get_embedding_model()
    q_emb = model.encode([query_text], normalize_embeddings=True).astype("float32")
    scores, indices = index.search(q_emb, min(top_k, len(chunks)))
    return [
        (chunks[i], float(scores[0][j]))
        for j, i in enumerate(indices[0])
        if i >= 0
    ]


# ── LLM reasoning (Ollama phi3) ─────────────────────────────────
def _llm_verdict(
    top_chunks: List[Tuple[str, float]],
    job_description: str,
    job_requirements: str,
    skills_required: str,
    student_name: str,
) -> dict:

    context = "\n\n".join([
        f"[Semantic Relevance {score:.2f}] {chunk}"
        for chunk, score in top_chunks
    ])

    prompt = f"""
You are a professional HR screening assistant.

Evaluate the candidate objectively based ONLY on the given data.

JOB DESCRIPTION:
{job_description}

REQUIRED SKILLS:
{skills_required}

REQUIREMENTS:
{job_requirements}

CANDIDATE:
{student_name}

RELEVANT RESUME SECTIONS:
{context}

STRICTLY return ONLY valid JSON:
{{
  "verdict": "SELECTED" or "REJECTED",
  "semantic_score": 0.0 to 1.0,
  "strengths": ["..."],
  "gaps": ["..."],
  "reasoning": "...",
  "recommendation": "..."
}}
"""

    try:
        response = ollama.chat(
            model="phi3",
            messages=[{"role": "user", "content": prompt}]
        )

        raw = response["message"]["content"]

        # Clean markdown if model adds it
        raw = re.sub(r"```json|```", "", raw).strip()

        # Extract JSON block
        start = raw.find("{")
        end = raw.rfind("}") + 1
        raw = raw[start:end]

    except Exception as e:
        avg_score = float(np.mean([s for _, s in top_chunks])) if top_chunks else 0.0
        verdict = "SELECTED" if avg_score >= 0.60 else "REJECTED"

        return {
            "verdict": verdict,
            "semantic_score": round(avg_score, 4),
            "strengths": [],
            "gaps": ["Ollama failed"],
            "reasoning": str(e),
            "recommendation": "Check Ollama setup",
        }

    # Parse JSON safely
    try:
        parsed = json.loads(raw)

        parsed.setdefault("verdict", "REJECTED")
        parsed.setdefault("semantic_score", 0.0)
        parsed.setdefault("strengths", [])
        parsed.setdefault("gaps", [])
        parsed.setdefault("reasoning", "No reasoning provided.")
        parsed.setdefault("recommendation", "Manual review required.")

        parsed["semantic_score"] = max(0.0, min(1.0, float(parsed["semantic_score"])))

        if parsed["verdict"] not in ("SELECTED", "REJECTED"):
            parsed["verdict"] = "REJECTED"

        return parsed

    except Exception:
        return {
            "verdict": "REJECTED",
            "semantic_score": 0.0,
            "strengths": [],
            "gaps": ["Invalid JSON from Ollama"],
            "reasoning": raw[:400],
            "recommendation": "Manual review required.",
        }


# ── Public entry point ─────────────────────────────────────────
def run_rag_analysis(
    resume_text: str,
    job_description: str,
    job_requirements: str,
    skills_required: str,
    student_name: str,
) -> dict:

    if not resume_text or not resume_text.strip():
        return {
            "verdict": "REJECTED",
            "semantic_score": 0.0,
            "strengths": [],
            "gaps": ["Resume text is empty or unreadable"],
            "reasoning": "No text could be extracted.",
            "recommendation": "Ask candidate to re-upload resume.",
            "top_chunks": [],
        }

    # Step 1: Chunk
    chunks = _chunk_text(resume_text)

    if not chunks:
        return {
            "verdict": "REJECTED",
            "semantic_score": 0.0,
            "strengths": [],
            "gaps": ["No usable text chunks"],
            "reasoning": "Resume contained insufficient content.",
            "recommendation": "Ask candidate for detailed resume.",
            "top_chunks": [],
        }

    # Step 2: Build index
    index, _ = _build_index(chunks)

    # Step 3: Retrieve
    jd_query = f"{job_description} {job_requirements} {skills_required}"
    top_chunks = _retrieve_top_chunks(jd_query, chunks, index, top_k=5)

    # Step 4: LLM reasoning
    result = _llm_verdict(
        top_chunks,
        job_description,
        job_requirements,
        skills_required,
        student_name,
    )

    # Step 5: Attach chunks
    result["top_chunks"] = [
        {"text": c, "score": round(s, 3)}
        for c, s in top_chunks
    ]

    return result