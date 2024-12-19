# from ultralytics import YOLO
# import requests

# def get_model():
#     model_url = "https://res.cloudinary.com/dhz4ho3we/raw/upload/v1734624660/accivision/w3qkj1tvakh12ovpvbhv.pt"
#     response = requests.get(model_url)
#     with open("best.pt", "wb") as f:
#         f.write(response.content)
#     return YOLO("best.pt")

# def detect_objects(image_bytes):
#     # Convert bytes to image
#     from PIL import Image
#     from io import BytesIO
#     image = Image.open(BytesIO(image_bytes))

#     # Load the model dynamically
#     model = get_model()

#     # Perform inference
#     results = model(image)

#     # Parse results
#     detections = []
#     for result in results:
#         for box in result.boxes:
#             detections.append({
#                 "class": model.names[int(box.cls)],
#                 "confidence": float(box.conf),
#                 "bbox": box.xyxy.tolist(),
#             })
#     return detections