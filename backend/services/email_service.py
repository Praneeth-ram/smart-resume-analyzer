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

def send_ats_rejection_email(
    to_email: str,
    student_name: str,
    job_title: str,
    company: str
):
    if not SMTP_USER or not SMTP_PASSWORD:
        print(f"[EMAIL SKIPPED - SMTP not configured] Would send to {to_email}")
        return False

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"Update regarding your application for {job_title} at {company}"
    msg["From"] = SMTP_USER
    msg["To"] = to_email

    body = f"""
    <html><body style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <div style="max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 30px;">
        <h2 style="color: #666;">Application Update</h2>
        <p>Dear {student_name},</p>
        <p>Thank you for taking the time to apply for the <strong>{job_title}</strong> position at <strong>{company}</strong>.</p>
        <p>Unfortunately, your application did not meet our initial screening criteria for this role, and we will not be moving forward with your candidacy at this time.</p>
        <p>We encourage you to continue developing your skills and apply for future roles that match your profile.</p>
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

def send_rag_rejection_email(
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
    msg["Subject"] = f"Update regarding your application for {job_title} at {company}"
    msg["From"] = SMTP_USER
    msg["To"] = to_email

    body = f"""
    <html><body style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <div style="max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 30px;">
        <h2 style="color: #666;">Application Update</h2>
        <p>Dear {student_name},</p>
        <p>Thank you for applying for the <strong>{job_title}</strong> position at <strong>{company}</strong>.</p>
        <p>After carefully reviewing your profile and assessing your skills against our requirements, we have decided to move forward with other candidates for this particular role.</p>
        {"<p><strong>Feedback:</strong> " + custom_message + "</p>" if custom_message else ""}
        <p>We appreciate your interest in our company and wish you the best in your job search.</p>
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

def send_ats_success_email(
    to_email: str,
    student_name: str,
    job_title: str,
    company: str
):
    if not SMTP_USER or not SMTP_PASSWORD:
        print(f"[EMAIL SKIPPED - SMTP not configured] Would send to {to_email}")
        return False

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"Great news! You passed the initial screening for {job_title} at {company}"
    msg["From"] = SMTP_USER
    msg["To"] = to_email

    body = f"""
    <html><body style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <div style="max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 30px;">
        <h2 style="color: #2563eb;">🎉 Application Update</h2>
        <p>Dear {student_name},</p>
        <p>We are excited to share that your application for the <strong>{job_title}</strong> position at <strong>{company}</strong> has successfully passed our initial ATS screening!</p>
        <p>Your profile is currently under review by our AI (Phase 2), and you will be notified soon regarding the next steps.</p>
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

def send_rag_success_email(
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
    msg["Subject"] = f"Congratulations! You've been shortlisted - {job_title} at {company}"
    msg["From"] = SMTP_USER
    msg["To"] = to_email

    body = f"""
    <html><body style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <div style="max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 30px;">
        <h2 style="color: #2563eb;">🎉 Excellent News, {student_name}!</h2>
        <p>We are thrilled to inform you that following a deeper evaluation of your profile, you have been <strong>shortlisted</strong> for the position of:</p>
        <div style="background: #f0f7ff; padding: 15px; border-left: 4px solid #2563eb; margin: 20px 0;">
          <strong style="font-size: 18px;">{job_title}</strong><br>
          <span style="color: #666;">{company}</span>
        </div>
        {"<p><strong>Feedback:</strong> " + custom_message + "</p>" if custom_message else ""}
        <p>Our HR team will be reviewing your application for final selection and contact you shortly with the next steps.</p>
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
