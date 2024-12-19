import cv2
from ultralytics import YOLO

def detect_objects(image_path):
    model = YOLO("best.pt")  # Replace with your YOLOv8 model
    results = model(image_path)

    detections = []
    for result in results:
        for box in result.boxes:
            detections.append({
                "class": model.names[int(box.cls)],
                "confidence": float(box.conf),
                "bbox": box.xyxy.tolist(),
            })
            print(detections)
    return detections
