import numpy as np
from PIL import Image
from ultralytics import YOLO

# Load YOLO model globally
model = YOLO("https://res.cloudinary.com/dhz4ho3we/raw/upload/v1734624660/accivision/w3qkj1tvakh12ovpvbhv.pt")  # Replace with your YOLOv8 model

def detect_objects(image_bytes):
    try:
        # Convert image bytes to a Pillow Image
        image = Image.open(image_bytes)
        
        # Convert Pillow image to NumPy array (RGB format)
        image_np = np.array(image)

        # Perform inference using YOLO model
        results = model(image_np)

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
    except Exception as e:
        print(f"Error during object detection: {e}")
        return []
