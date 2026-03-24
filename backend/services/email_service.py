import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")

def send_selection_email(
    to_email: str,
    student_name: str,
    job_title: str,
    company: str,
    custom_message: str = ""
):
    if not SMTP_USER or not SMTP_PASSWORD:
        print(f"[EMAIL SKIPPED - SMTP not configured] Would send to {to_email}")
        return False

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"Congratulations! You've been selected - {job_title} at {company}"
    msg["From"] = SMTP_USER
    msg["To"] = to_email

    body = f"""
    <html><body style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <div style="max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 30px;">
        <h2 style="color: #2563eb;">🎉 Congratulations, {student_name}!</h2>
        <p>We are thrilled to inform you that you have been <strong>selected</strong> for the position of:</p>
        <div style="background: #f0f7ff; padding: 15px; border-left: 4px solid #2563eb; margin: 20px 0;">
          <strong style="font-size: 18px;">{job_title}</strong><br>
          <span style="color: #666;">{company}</span>
        </div>
        {"<p>" + custom_message + "</p>" if custom_message else ""}
        <p>Our HR team will contact you shortly with the next steps. Please keep an eye on your email for further instructions.</p>
        <p style="margin-top: 30px; color: #666; font-size: 14px;">
          Best regards,<br>
          <strong>HR Team - {company}</strong>
        </p>
      </div>
    </body></html>
    """

    msg.attach(MIMEText(body, "html"))
    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(SMTP_USER, to_email, msg.as_string())
        return True
    except Exception as e:
        print(f"Email error: {e}")
        return False
