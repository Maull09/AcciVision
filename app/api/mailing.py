import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def send_email(report_details):
    # Load credentials from environment variables
    sender_email = os.getenv("EMAIL_SENDER")
    sender_password = os.getenv("EMAIL_PASSWORD")
    recipient_email = report_details["recipient_email"]
    image_path = report_details["image_path"]  # Path gambar yang dilampirkan

    # Email content
    subject = "Laporan Kecelakaan Baru"
    body = f"""
    Laporan Baru:
    Provinsi: {report_details["province"]}
    Kota: {report_details["city"]}
    Kecamatan: {report_details["district"]}
    Deskripsi: {report_details["description"]}
    """

    # Construct the email message
    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = recipient_email
    message["Subject"] = subject
    message.attach(MIMEText(body, "plain"))

    # Attach the image file if it exists
    if image_path and os.path.exists(image_path):
        try:
            with open(image_path, "rb") as attachment:
                part = MIMEBase("application", "octet-stream")
                part.set_payload(attachment.read())
                encoders.encode_base64(part)
                part.add_header(
                    "Content-Disposition",
                    f"attachment; filename= {os.path.basename(image_path)}",
                )
                message.attach(part)
        except Exception as e:
            print(f"Failed to attach image: {e}")
    
    try:
        # Send email via SMTP server
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, recipient_email, message.as_string())
        server.quit()
        return {"success": True, "message": "Email sent successfully"}
    except Exception as e:
        return {"success": False, "message": f"Failed to send email: {e}"}
