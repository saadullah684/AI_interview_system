from groq import Groq

# 🔥 IMPORTANT: keep API key safe (use env variable in real projects)
client = Groq(api_key="")


# =========================
# INTERVIEW QUESTION GENERATOR (FAST MODE)
# =========================
def generate_question(
    context,
    previous_score,
    history=None,
    emotion=None,
    posture=None
):

    # =========================
    # LIMIT HISTORY (SPEED BOOST)
    # =========================
    history_text = ""

    if history:
        for h in history[-3:]:   # ONLY LAST 3 (FAST)
            history_text += f"Q: {h.get('question','')}\nA: {h.get('answer','')}\n"

    # =========================
    # SHORT + CONTROLLED PROMPT (VERY IMPORTANT FOR SPEED)
    # =========================
    prompt = f"""
You are an AI job interviewer.

Candidate:
{context}

Score: {previous_score}
Emotion: {emotion}
Posture: {posture}

Recent History:
{history_text}

RULES:
- Ask ONLY ONE question
- Keep it VERY short (1 sentence)
- Do NOT explain anything
- Do NOT number or format
- Adjust difficulty based on score:
  low → easy question
  high → advanced question
- If emotion is negative → be slightly easier

Return ONLY the question.
"""

    # =========================
    # GROQ CALL (FAST CONFIG)
    # =========================
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",

        messages=[
            {
                "role": "system",
                "content": "You are a strict but helpful technical interviewer."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],

        temperature=0.2,   # 🔥 more stable + faster
        max_tokens=50      # 🔥 VERY IMPORTANT SPEED BOOST
    )

    return response.choices[0].message.content.strip()