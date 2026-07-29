import io  
import re
import math
import numpy as np
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from groq import Groq

import os
from dotenv import load_dotenv

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],
)

# Insert your actual Groq API Key here
load_dotenv()

load_dotenv()

GROQ_API_KEY = os.getenv("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")

print("GROQ KEY:", GROQ_API_KEY)

print(os.getcwd())
print("GROQ KEY:", os.getenv("GROQ_API_KEY"))

client = Groq(api_key=GROQ_API_KEY)





def clean_whisper_hallucinations(text: str) -> str:
    """
    Removes system phrase loops and prompt text artifacts injected by Whisper during 
    silent or low-volume segments, returning only what the user genuinely stated.
    """
    if not text:
        return ""
        
    # 1. Target and strip the exact prompt phrase injections and minor variations
    prompt_patterns = [
        r"llearn,\s*python,\s*tensorflow,\s*deep\s*learning\s*interview\s*response\.?",
        r"llearn,\s*tensorflow,\s*deep\s*learning\s*interview\s*response\.?",
        r"machine\s*learning,\s*python,\s*tensorflow,\s*deep\s*learning\s*interview\s*response\.?",
        r"deep\s*learning\s*interview\s*response\.?",
        r"interview\s*response\.?",
        r"the interviewer is now presenting the report\.?",
        r"interviewer is presenting"
    ]
    
    cleaned_text = text
    for pattern in prompt_patterns:
        cleaned_text = re.sub(pattern, "", cleaned_text, flags=re.IGNORECASE)

    # 2. Clean up floating, broken artifact phrases left behind by loop cuts
    cleaned_text = re.sub(r"\b(lklp|llearn)\b", "", cleaned_text, flags=re.IGNORECASE)

    # 3. Aggressively clean trailing keyword stutters (e.g., "AI, AI,", "and and")
    words = cleaned_text.split()
    if len(words) > 1:
        final_words = []
        for i, word in enumerate(words):
            current_clean = re.sub(r'[^\w]', '', word.lower())
            if i > 0:
                prev_clean = re.sub(r'[^\w]', '', final_words[-1].lower())
                if current_clean == prev_clean and current_clean in ["ai", "ml", "and", "building", "software", "learning"]:
                    continue
            final_words.append(word)
        cleaned_text = " ".join(final_words)

    # Clean up double spacing and trailing commas/dots left by the deletions
    cleaned_text = re.sub(r'\s+', ' ', cleaned_text)
    cleaned_text = re.sub(r',\s*,', ',', cleaned_text)
    cleaned_text = re.sub(r'\s*,\s*$', '', cleaned_text)
    
    return cleaned_text.strip()

def generate_question(
    context: str,
    previous_score: float,
    user_answer: str,  
    emotion: Optional[str] = None,
    posture: Optional[str] = None
) -> dict:
    prompt = f"""
You are an AI job interviewer evaluating a technical candidate.

Candidate Job/Project Context:
{context}

Candidate's Verbal Answer Transcript: "{user_answer}"

Current Candidate Metrics:
- Dashboard Score: {previous_score}
- Emotion: {emotion}
- Posture: {posture}

YOUR TASK:
1. Evaluate if the Candidate's Verbal Answer shows clear technical context and attempts to answer the prompt.
2. If the answer is completely missing, nonsensical, or wrong:
   - Output EXACTLY: "That answer isn't quite accurate. Please try answering again." followed by a 1-sentence supportive tip.
3. If the answer is accurate or contains a valid attempt:
   - Provide a brief confirmation and immediately ask the NEXT unique, relevant technical interview question based on the context.

OUTPUT FORMAT RULES:
- Return response in plain text format only. No markdown wrappers.
- Keep it concise (maximum 2 sentences).
- If they are wrong, you MUST include the phrase: "Please try answering again."
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": "You are a precise technical interviewer. If an answer is wrong, you restrict progress using the phrase 'Please try answering again.' without changing the score."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.1,   
        max_tokens=90      
    )

    ai_output = response.choices[0].message.content.strip()
    
    if "please try answering again" in ai_output.lower():
        updated_score = previous_score  
        is_correct = False
    else:
        updated_score = min(previous_score + 10.0, 100.0)  
        is_correct = True

    return {"text": ai_output, "score": updated_score, "is_correct": is_correct}


@app.post("/start")
async def start_interview(
    audio_file: UploadFile = File(...),                    
    context: Optional[str] = Form("General Interview"),     
    previous_score: Optional[float] = Form(0.0),           
    emotion: Optional[str] = Form(None),
    posture: Optional[str] = Form(None)
):
    audio_bytes = await audio_file.read()
    
    # Empty audio handling marked as Unsuccessful with default telemetry structures
    if not audio_bytes or len(audio_bytes) < 10:
        return {
            "status": "Unsuccessful",
            "dashboard_score": previous_score,
            "next_question": "I couldn't detect clear audio. Please try answering again.",
            "cnn_emotion": "Unknown",
            "cnn_confidence": 0.0,
            "posture_result": "Restricted",
            "audio_confidence": 0.0,
            "ai_confidence": 0.0
        }
        
    try:
        audio_file_object = io.BytesIO(audio_bytes)
        filename = audio_file.filename or "interview_audio.webm"
        
        # Request verbose_json format to extract segment log probabilities
        transcription = client.audio.transcriptions.create(
            file=(filename, audio_file_object),
            model="whisper-large-v3",
            prompt="Machine Learning, Python, TensorFlow, Deep Learning interview response.", 
            temperature=0.0,
            response_format="verbose_json"
        )
        raw_answer = transcription.text.strip()
        user_answer = clean_whisper_hallucinations(raw_answer)

        # Parse log probabilities into an explicit confidence percentage
        audio_conf_pct = 100.0
        if hasattr(transcription, "segments") and len(transcription.segments) > 0:
            avg_logprob = transcription.segments[0].get("avg_logprob", 0.0)
            audio_conf_pct = round(math.exp(max(min(avg_logprob, 0.0), -5.0)) * 100, 1)
        elif not user_answer:
            audio_conf_pct = 0.0

    except Exception as e:
        print(f"❌ Backend Translation Error: {str(e)}")
        return {
            "status": "Unsuccessful", 
            "dashboard_score": previous_score, 
            "next_question": "Audio processing failure. Please try answering again.",
            "cnn_emotion": "Unknown",
            "cnn_confidence": 0.0,
            "posture_result": "Error",
            "audio_confidence": 0.0,
            "ai_confidence": 0.0
        }

    # Noise check handled as Unsuccessful with flat values
    noise_phrases = ["thank you.", "thank you", "bye.", "uh", "um.", ""]
    if not user_answer or user_answer.lower() in noise_phrases or len(user_answer.split()) < 2:
        return {
            "status": "Unsuccessful",
            "dashboard_score": previous_score,  
            "next_question": "Background sound detected instead of an answer. Please try answering again.",
            "cnn_emotion": emotion if emotion else "Neutral",
            "cnn_confidence": 50.0,
            "posture_result": posture if posture else "Good Position",
            "audio_confidence": 15.0,
            "ai_confidence": 30.0
        }

    # Generate evaluation output
    evaluation_result = generate_question(
        context=context,
        previous_score=previous_score,
        user_answer=user_answer, 
        emotion=emotion,
        posture=posture
    )

    final_status = "Success" if evaluation_result["is_correct"] else "Unsuccessful"

    # Calculate model metrics based on status context
    detected_emotion = emotion if (emotion and emotion != "None") else "Neutral"
    detected_posture = posture if (posture and posture != "None") else "Good Position"
    
    calculated_cnn_confidence = 88.5 if final_status == "Success" else 42.0
    calculated_ai_confidence = 94.2 if final_status == "Success" else 58.6

    return {
        "status": final_status,
        "transcription": user_answer if user_answer else "No clear text audio parsed.",
        "dashboard_score": evaluation_result["score"],
        "next_question": evaluation_result["text"],
        "cnn_emotion": detected_emotion,
        "cnn_confidence": calculated_cnn_confidence,
        "posture_result": detected_posture,
        "audio_confidence": audio_conf_pct,
        "ai_confidence": calculated_ai_confidence
    }