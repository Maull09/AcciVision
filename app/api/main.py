from fastapi import FastAPI, Form, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from detection import detect_objects
from mailing import send_email
from pydantic import BaseModel
from fastapi.responses import FileResponse
import os
from uuid import uuid4
from dotenv import load_dotenv

load_dotenv()

UPLOAD_DIR = "public/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI()

app.mount("/uploads", StaticFiles(directory="public/uploads"), name="uploads")

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

@app.get("/images/{filename}")
async def get_image(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if os.path.exists(file_path):
        return FileResponse(file_path)
    return {"error": "File not found"}, 404

@app.post("/process_detection", response_model=DetectionResponse)
async def process_detection(
    province: str = Form(...),
    city: str = Form(...),
    district: str = Form(...),
    description: str = Form(...),
    image: UploadFile = File(...),
    userId: str = Form(...),
):
    # Save the uploaded image with a unique filename
    unique_filename = f"{image.filename}"
    image_path = os.path.join(UPLOAD_DIR, unique_filename)
    with open(image_path, "wb") as buffer:
        buffer.write(await image.read())

    # Perform detection
    detections = detect_objects(image_path)
    detection_status = "detected" if len(detections) > 0 and detections[0]["class"] == "car-crash" else "not_detected"

    # Send email 
    if detection_status == "detected":
        email_status = send_email({
        "recipient_email": os.getenv("EMAIL_RECEIVER"),
        "province": province,
        "city": city,
        "district": district,
        "description": description,
        "image_path": image_path,
        }) 
    else:
        email_status = {"success": False, "message": "No email sent because no car crash detected."}
    
    print(email_status)
        
    return DetectionResponse(
        detectionStatus=detection_status,
        emailStatus=email_status,
        # imagePath=f"/images/{unique_filename}"
    )

if __name__ == '__main__':
  import uvicorn
  uvicorn.run("main:app", host='localhost', port=8000, reload=True)
