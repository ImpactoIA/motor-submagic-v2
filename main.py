from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import AsyncOpenAI
import yt_dlp
import os
import uuid
import asyncio
import time
import logging
from pathlib import Path

# ── Configuración ────────────────────────────────────────────────
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("motor-submagic")

app = FastAPI(title="Motor Submagic — Conectado a OpenAI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Conexión a OpenAI ────────────────────────────────────────────
# El servidor leerá tu llave desde las variables de Railway
API_KEY = os.getenv("OPENAI_API_KEY", "")
client = AsyncOpenAI(api_key=API_KEY)

API_SECRET = os.getenv("API_SECRET", "") 

TEMP_DIR = Path("/tmp/audio_downloads")
TEMP_DIR.mkdir(exist_ok=True)

# ── Modelos ──────────────────────────────────────────────────────
class TranscribeRequest(BaseModel):
    url: str
    language: str | None = None

class TranscribeResponse(BaseModel):
    transcript: str
    language: str
    words: int
    time_ms: int

# ── Endpoints ────────────────────────────────────────────────────
@app.get("/health")
async def health():
    return {"status": "ok", "motor": "OpenAI Cloud"}

@app.post("/transcribe", response_model=TranscribeResponse)
async def transcribe(req: TranscribeRequest, x_api_secret: str | None = Header(default=None)):
    if API_SECRET and x_api_secret != API_SECRET:
        raise HTTPException(status_code=401, detail="Unauthorized")

    if not API_KEY:
        raise HTTPException(status_code=500, detail="Falta configurar OPENAI_API_KEY en Railway")

    start_total = time.time()
    audio_path = TEMP_DIR / f"{uuid.uuid4()}.mp3"

    try:
        # 1. Descargar audio ligero
        logger.info(f"[YT-DLP] ⬇️ Descargando audio...")
        ydl_opts = {
            "format": "bestaudio/best",
            "outtmpl": str(audio_path).replace(".mp3", ".%(ext)s"),
            "postprocessors": [{"key": "FFmpegExtractAudio", "preferredcodec": "mp3", "preferredquality": "128"}],
            "quiet": True,
            "no_warnings": True,
            "noplaylist": True,
            "max_filesize": 25 * 1024 * 1024,
        }
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, _download_audio, req.url, ydl_opts)

        actual_audio = _find_audio_file(audio_path)
        if not actual_audio or not actual_audio.exists():
            raise HTTPException(status_code=422, detail="No se pudo descargar el audio.")

        # 2. Enviar a OpenAI API
        logger.info(f"[OPENAI] ☁️ Enviando audio a la nube...")
        t2 = time.time()
        
        with open(actual_audio, "rb") as f:
            response = await client.audio.transcriptions.create(
                model="whisper-1",
                file=f,
                language=req.language
            )

        transcript = response.text
        t_whisper = round((time.time() - t2) * 1000)
        t_total = round((time.time() - start_total) * 1000)
        word_count = len(transcript.split())

        logger.info(f"✅ Transcrito con OpenAI en {t_whisper}ms")

        return TranscribeResponse(
            transcript=transcript,
            language=req.language or "auto",
            words=word_count,
            time_ms=t_total,
        )

    except Exception as e:
        logger.error(f"[ERROR] ❌ {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        _cleanup_audio(audio_path)

def _download_audio(url: str, opts: dict) -> None:
    with yt_dlp.YoutubeDL(opts) as ydl:
        ydl.download([url])

def _find_audio_file(base_path: Path) -> Path | None:
    stem = base_path.stem
    for ext in ["mp3", "m4a", "webm", "ogg", "wav", "opus"]:
        candidate = base_path.parent / f"{stem}.{ext}"
        if candidate.exists():
            return candidate
    files = sorted(TEMP_DIR.glob(f"{stem}*"), key=lambda f: f.stat().st_mtime, reverse=True)
    return files[0] if files else None

def _cleanup_audio(base_path: Path) -> None:
    stem = base_path.stem
    for f in TEMP_DIR.glob(f"{stem}*"):
        try:
            f.unlink()
        except:
            pass