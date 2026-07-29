import numpy as np
import librosa
import joblib
from tensorflow.keras.models import load_model
model = load_model('lstm (2)/lstm/models/emotion_voice_model.h5')
le = joblib.load('lstm (2)/lstm/label_encoder.pkl')
def extract_features(audio, fs=22050):
    rms = np.sqrt(np.mean(audio ** 2))
    if rms < 0.03:
        return None, "silent"
    audio = librosa.util.normalize(audio)
    audio, _ = librosa.effects.trim(audio, top_db=20)
    if len(audio) < fs * 0.5:
        return None, "too_short"
    mfcc = librosa.feature.mfcc(y=audio, sr=fs, n_mfcc=40)
    delta = librosa.feature.delta(mfcc)
    delta2 = librosa.feature.delta(mfcc, order=2)
    features = np.concatenate((mfcc, delta, delta2), axis=0).T
    max_len = 130
    if features.shape[0] > max_len:
        features = features[:max_len]
    else:
        features = np.pad(features, ((0, max_len - features.shape[0]), (0, 0)))
    return np.expand_dims(features, axis=0), "ok"

def predict_emotion_from_audio(audio_np, fs=22050):
    features, status = extract_features(audio_np, fs)
    if status != "ok":
        return {
            "status": status,
            "emotion": "neutral",
            "confidence": 0.0
        }
    pred = model.predict(features, verbose=0)[0]
    idx = int(np.argmax(pred))
    conf = float(np.max(pred))
    return {
        "status": "success",
        "emotion": le.inverse_transform([idx])[0],
        "confidence": conf
    }