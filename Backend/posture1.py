import pandas as pd
import numpy as np
import joblib
import pickle
MODEL_DIR = "Ann/posture/posture_model"
model = joblib.load(f"{MODEL_DIR}/model.pkl")
le = pickle.load(open(f"{MODEL_DIR}/label_encoder.pkl", "rb"))
columns = pickle.load(open(f"{MODEL_DIR}/columns.pkl", "rb"))
def predict_confidence(input_dict):
    df = pd.DataFrame([input_dict])
    df = pd.get_dummies(df)
    df = df.reindex(columns=columns, fill_value=0)
    pred = model.predict(df)[0]
    prob = model.predict_proba(df)[0]
    label = le.inverse_transform([pred])[0]
    conf = float(np.max(prob))
    return {
        "label": label,
        "confidence": conf,
        "llm_context": f"Posture: {label}"
    }