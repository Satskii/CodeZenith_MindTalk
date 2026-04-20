import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

SMTP_HOST     = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT     = int(os.getenv("SMTP_PORT", 587))
SMTP_USER     = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
FRONTEND_URL  = os.getenv("FRONTEND_URL", "http://localhost:5173")


def send_reset_email(to_email: str, reset_token: str, user_name: str):
    reset_link = f"{FRONTEND_URL}/reset-password?token={reset_token}"

    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Reset your MindTalk password"
    msg["From"]    = f"MindTalk <{SMTP_USER}>"
    msg["To"]      = to_email

    text = f"""Hi {user_name},

You requested a password reset for your MindTalk account.

Click the link below to reset your password (valid for 1 hour):
{reset_link}

If you didn't request this, you can safely ignore this email.

— The MindTalk Team
"""

    html = f"""
<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#f8fafc;border-radius:12px;">
  <h2 style="color:#1a6fd4;margin-bottom:8px;">MindTalk</h2>
  <p style="color:#374151;">Hi <strong>{user_name}</strong>,</p>
  <p style="color:#374151;">You requested a password reset. Click the button below — the link is valid for <strong>1 hour</strong>.</p>
  <a href="{reset_link}"
     style="display:inline-block;margin:20px 0;padding:12px 28px;background:#1a6fd4;color:#fff;
            border-radius:50px;text-decoration:none;font-weight:700;font-size:15px;">
    Reset Password
  </a>
  <p style="color:#6b7280;font-size:13px;">If you didn't request this, you can safely ignore this email.</p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
  <p style="color:#9ca3af;font-size:12px;">— The MindTalk Team</p>
</div>
"""

    msg.attach(MIMEText(text, "plain"))
    msg.attach(MIMEText(html, "html"))

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.ehlo()
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.sendmail(SMTP_USER, to_email, msg.as_string())
