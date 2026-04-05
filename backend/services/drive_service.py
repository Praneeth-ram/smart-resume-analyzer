import os
import io
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload
from googleapiclient.errors import HttpError

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
) -> tuple[str, str | None]:
    """
    Upload resume to Google Drive.
    Returns: (drive_link, error_message)
    - If successful: (drive_link, None)
    - If failed: ("", error_message)
    """
    service = get_drive_service()
    if not service:
        return "", "Google Drive not configured. Service account JSON file not found."

    if not HR_DRIVE_FOLDER_ID:
        return "", "HR_DRIVE_FOLDER_ID environment variable not set."

    try:
        drive_filename = f"{student_name}_{job_title}_{filename}".replace(" ", "_")
        file_metadata = {"name": drive_filename, "parents": [HR_DRIVE_FOLDER_ID]}

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

        return uploaded.get("webViewLink", ""), None

    except HttpError as e:
        error_msg = str(e)
        if "Service Accounts do not have storage quota" in error_msg or "storageQuotaExceeded" in error_msg:
            return "", (
                "Google Drive upload failed: Service account cannot upload to personal Google Drive. "
                "Use a Google Shared Drive instead. See documentation: "
                "https://developers.google.com/workspace/drive/api/guides/about-shareddrives"
            )
        return "", f"Google Drive upload failed: {error_msg}"
    except Exception as e:
        return "", f"Unexpected error during Drive upload: {str(e)}"
