import edge_tts
import uuid
import asyncio

VOICE = "en-US-GuyNeural"


async def _tts(text, path, voice=VOICE):
    tts = edge_tts.Communicate(text, voice)
    await tts.save(path)


def run_async(coro):
    try:
        return asyncio.run(coro)
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        result = loop.run_until_complete(coro)
        loop.close()
        return result


def speak(text: str, tone: str = "neutral"):

    tone_prefix = {
        "neutral": "",
        "friendly": "Speak in a friendly tone. ",
        "strict": "Speak in a formal strict interviewer tone. ",
        "encouraging": "Speak in a supportive and encouraging tone. "
    }

    final_text = (tone_prefix.get(tone, "") + text).strip()[:250]
    file_name = f"{uuid.uuid4().hex}.mp3"

    run_async(_tts(final_text, file_name))

    return {
        "audio_file": file_name,
        "text": text,
        "tone": tone
    }