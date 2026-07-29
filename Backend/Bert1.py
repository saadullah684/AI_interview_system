import torch
import pickle
from transformers import BertTokenizer, BertForSequenceClassification
MODEL_PATH = "Bert/bert_resume_model"
tokenizer = BertTokenizer.from_pretrained(MODEL_PATH)
model = BertForSequenceClassification.from_pretrained(MODEL_PATH)
device = torch.device("cpu")
model.to(device)
model.eval()
torch.set_grad_enabled(False)
with open(f"{MODEL_PATH}/label_encoder.pkl", "rb") as f:
    label_encoder = pickle.load(f)
def predict_resume_category(text):
    if text is None:
        text = ""
    text = str(text).strip()
    if text == "":
        return {
            "category": "Unknown",
            "confidence": 0.0,
            "llm_context": "Role: Unknown"
        }
    try:
        # ---------------- TOKENIZATION ----------------
        encoding = tokenizer(
            text,
            truncation=True,
            padding="max_length",
            max_length=64,   # FAST MODE
            return_tensors="pt"
        )

        input_ids = encoding["input_ids"].to(device)
        attention_mask = encoding["attention_mask"].to(device)

        # ---------------- PREDICTION ----------------
        with torch.inference_mode():
            outputs = model(
                input_ids=input_ids,
                attention_mask=attention_mask
            )

        logits = outputs.logits
        probs = torch.softmax(logits, dim=1)[0]

        pred = torch.argmax(probs).item()
        conf = float(probs[pred])

        label = label_encoder.inverse_transform([pred])[0]

        return {
            "category": label,
            "confidence": conf,
            "llm_context": f"Role: {label}"
        }

    except Exception as e:
        # ---------------- FIX 2: NO CRASH ----------------
        return {
            "category": "Error",
            "confidence": 0.0,
            "llm_context": f"Role: Error",
            "error": str(e)
        }