from fastapi import FastAPI, Form, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from mailing import send_email
from pydantic import BaseModel
from dotenv import load_dotenv
import cloudinary.uploader
import os
from uuid import uuid4

load_dotenv()

# Initialize Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DetectionResponse(BaseModel):
    detectionStatus: str
    emailStatus: dict
    imageUrl: str

from ultralytics import YOLO
import requests

def detect_objects(image_bytes):
    # Convert bytes to image
    from PIL import Image
    from io import BytesIO
    image = Image.open(BytesIO(image_bytes))

    # Load the model dynamically
    model = YOLO("https://res.cloudinary.com/dhz4ho3we/raw/upload/v1734624660/accivision/w3qkj1tvakh12ovpvbhv.pt")  # Replace with your YOLOv8 model

    # Perform inference
    results = model(image)

    # Parse results
    detections = []
    for result in results:
        for box in result.boxes:
            detections.append({
                "class": model.names[int(box.cls)],
                "confidence": float(box.conf),
                "bbox": box.xyxy.tolist(),
            })
    return detections

import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from dotenv import load_dotenv
from typing import Dict
import requests  # To download the image from the URL

# Load environment variables from .env file
load_dotenv()

def send_email(report_details: Dict) -> Dict:
    """
    Send an email with report details and attach an image.

    :param report_details: Dictionary containing email details.
    :return: Dictionary with success status and message.
    """
    # Load credentials from environment variables
    sender_email = os.getenv("EMAIL_SENDER")
    sender_password = os.getenv("EMAIL_PASSWORD")
    recipient_email = report_details.get("recipient_email")
    image_url = report_details.get("image_url")  # URL of the image on Cloudinary

    if not sender_email or not sender_password:
        return {"success": False, "message": "Sender email or password not configured."}

    if not recipient_email:
        return {"success": False, "message": "Recipient email is missing."}

    # Email content
    subject = "Laporan Kecelakaan Baru"
    body = f"""
    Laporan Baru:
    Provinsi: {report_details.get("province", "N/A")}
    Kota: {report_details.get("city", "N/A")}
    Kecamatan: {report_details.get("district", "N/A")}
    Deskripsi: {report_details.get("description", "N/A")}
    """

    try:
        # Construct the email message
        message = MIMEMultipart()
        message["From"] = sender_email
        message["To"] = recipient_email
        message["Subject"] = subject
        message.attach(MIMEText(body, "plain"))

        # Download the image from the URL
        if image_url:
            response = requests.get(image_url)
            response.raise_for_status()  # Raise an error for HTTP issues
            filename = os.path.basename(image_url)

            # Attach the downloaded image
            part = MIMEBase("application", "octet-stream")
            part.set_payload(response.content)
            encoders.encode_base64(part)
            part.add_header(
                "Content-Disposition",
                f"attachment; filename={filename}",
            )
            message.attach(part)

        # Send email via SMTP server
        print("Connecting to the SMTP server...")
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(sender_email, sender_password)
        print("Sending email...")
        server.sendmail(sender_email, recipient_email, message.as_string())
        server.quit()
        print("Email sent successfully.")
        return {"success": True, "message": "Email sent successfully."}

    except Exception as e:
        print(f"Failed to send email: {e}")
        return {"success": False, "message": f"Failed to send email: {e}"}


@app.post("/process_detection", response_model=DetectionResponse)
async def process_detection(
    province: str = Form(...),
    city: str = Form(...),
    district: str = Form(...),
    description: str = Form(...),
    image: UploadFile = File(...),
    userId: str = Form(...),
):
    try:
        # Log the start of the process
        print(f"Processing detection for userId: {userId}")

        # Upload image to Cloudinary
        print("Uploading image to Cloudinary...")
        upload_result = cloudinary.uploader.upload(
            file=image.file,
            folder="accivision/uploads",
            public_id=f"{userId}_{uuid4()}",
            resource_type="image",
        )
        image_url = upload_result["secure_url"]
        print(f"Image uploaded successfully: {image_url}")

        # Read the file as bytes for YOLO detection
        print("Reading image file for detection...")
        image.file.seek(0)  # Reset file pointer
        image_bytes = await image.read()

        # Perform detection
        print("Performing object detection...")
        detections = detect_objects(image_bytes)  # Pass bytes to detection logic
        print(f"Detections: {detections}")

        detection_status = "detected" if detections and detections[0]["class"] == "car-crash" else "not_detected"
        print(f"Detection status: {detection_status}")

        # Send email
        if detection_status == "detected":
            print("Sending email notification...")
            email_status = send_email({
                "recipient_email": os.getenv("EMAIL_RECEIVER"),
                "province": province,
                "city": city,
                "district": district,
                "description": description,
                "image_url": image_url,
            })
            print(f"Email sent successfully: {email_status}")
        else:
            email_status = {"success": False, "message": "No email sent because no car crash detected."}
            print("No car crash detected; skipping email.")

        return DetectionResponse(
            detectionStatus=detection_status,
            emailStatus=email_status,
            imageUrl=image_url,
        )
    except Exception as e:
        # Log the exception details
        print(f"Error during process_detection: {str(e)}")
        raise HTTPException(status_code=500, detail={"error": str(e)})


# if __name__ == '__main__':
#     import uvicorn
#     uvicorn.run("main:app", host='localhost', port=8000, reload=True)
