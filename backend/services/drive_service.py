import os
import io
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload

SCOPES = ["https://www.googleapis.com/auth/drive.file"]
SERVICE_ACCOUNT_FILE = os.getenv("GOOGLE_SERVICE_ACCOUNT_FILE", "service_account.json")
HR_DRIVE_FOLDER_ID = os.getenv("HR_DRIVE_FOLDER_ID", "")

def get_drive_service():
    if not os.path.exists(SERVICE_ACCOUNT_FILE):
        return None
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES
    )
    return build("drive", "v3", credentials=credentials)

def upload_resume_to_drive(
    file_bytes: bytes,
    filename: str,
    student_name: str,
    job_title: str,
    mimetype: str = "application/pdf"
) -> str:
    service = get_drive_service()
    if not service:
        return f"[Drive not configured] {filename}"

    drive_filename = f"{student_name}_{job_title}_{filename}".replace(" ", "_")
    file_metadata = {"name": drive_filename}
    if HR_DRIVE_FOLDER_ID:
        file_metadata["parents"] = [HR_DRIVE_FOLDER_ID]

    media = MediaIoBaseUpload(io.BytesIO(file_bytes), mimetype=mimetype)
    uploaded = service.files().create(
        body=file_metadata, media_body=media, fields="id, webViewLink", supportsAllDrives=True,
    ).execute()

    # Make publicly viewable (optional: restrict to HR email)
    service.permissions().create(
        fileId=uploaded["id"],
        body={"type": "anyone", "role": "reader"},
        supportsAllDrives=True,
    ).execute()

    return uploaded.get("webViewLink", "")
