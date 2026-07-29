import cv2
import numpy as np
from tensorflow.keras.models import load_model
model = load_model("cnn/cnn02/cnn/models/emotion_cnn.h5")
emotion_labels = [
    "Angry", "Disgust", "Fear",
    "Happy", "Sad", "Surprise", "Neutral"
]
face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)
def emotion_to_state(emotion):
    if emotion in ["Sad", "Fear", "Angry", "Disgust"]:
        return "stressed"
    elif emotion == "Neutral":
        return "neutral"
    return "positive"
def detect_emotion(frame):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.2,
        minNeighbors=4,
        minSize=(120, 120)
    )
    if len(faces) == 0:
        return {
            "dominant_emotion": "Neutral",
            "dominant_confidence": 0.0,
            "state": "neutral",
            "stability": 0.0,
            "face_count": 0
        }
    x, y, w, h = faces[0]   # ONLY 1 FACE
    face = gray[y:y+h, x:x+w]
    face = cv2.resize(face, (48, 48))
    face = face.astype("float32") / 255.0
    face = np.expand_dims(face, axis=(0, -1))
    pred = model.predict(face, verbose=0)[0]
    idx = int(np.argmax(pred))
    conf = float(np.max(pred))
    emotion = emotion_labels[idx]
    return {
        "dominant_emotion": emotion,
        "dominant_confidence": conf,
        "state": emotion_to_state(emotion),
        "stability": 1.0,
        "face_count": 1
    }