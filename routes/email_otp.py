import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from fastapi import APIRouter, BackgroundTasks

from utils.helpers import generate_otp
from schemas.routes.email import EmailRequest
from config.config import settings

router = APIRouter(prefix="/email_otp", tags=["email-otp"])



def send_email_task(to_email: str, subject: str, body: str, code: str):
    
    """ Sender email task via Basic STMP Library Functions
        Note: Default is configured to gmail
    """
    # Alternative: HTML VERSION ---> Fallback --> plain text version
    msg = MIMEMultipart("alternative")
    msg["From"] = settings.smtp.SENDER_EMAIL
    msg["To"] = to_email
    msg["Subject"] = subject
    
    
    html_content = f"""
        <html>
        <body>
            <h2 style="color: green;">Your OTP Code</h2>
            <p style="font-size: 18px;">Hi there! Your OTP is: <strong>{code}</strong></p>
            <p>Use this code to complete your login.</p>
        </body>
        </html>
    """
    msg.attach(MIMEText(html_content, "html"))
    
    with smtplib.SMTP(settings.smtp.SMTP_SERVER, settings.smtp.SMTP_PORT) as server:
        server.starttls()
        server.login(settings.smtp.SENDER_EMAIL, settings.smtp.SENDER_PASSWORD)
        server.send_message(msg)
        
        
@router.post("/send")
async def send_email(request: EmailRequest, background_tasks: BackgroundTasks):
    # Launch the task in the background so response returns immediately
    subject = "A new user has requested email OTP"
    otp_code = generate_otp()
    body = f"Hi, you 6-digit OTP code is {otp_code}"
    background_tasks.add_task(
        send_email_task, request.to, subject, body, otp_code
    )
    return {"otp": otp_code, "message": f"Email to {request.to} is being sent in background"}