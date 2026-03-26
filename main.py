from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests  # ← Usamos requests directo, nada de la librería problemática de OpenAI
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

app = FastAPI(title="Motor Submagic — Transcripción Directa")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Variables de entorno ─────────────────────────────────────────
API_KEY    = os.getenv("OPENAI_API_KEY", "")
API_SECRET = os.getenv("API_SECRET", "")

# ── Directorio temporal ──────────────────────────────────────────
TEMP_DIR = Path("/tmp/audio_downloads")
TEMP_DIR.mkdir(exist_ok=True)

# ── Modelos de request/response ──────────────────────────────────
class TranscribeRequest(BaseModel):
    url: str
    language: str | None = None

class TranscribeResponse(BaseModel):
    transcript: str
    language:   str
    words:      int
    time_ms:    int

# ── Endpoints ────────────────────────────────────────────────────
@app.get("/health")
async def health():
    return {
        "status": "ok",
        "motor":  "OpenAI Whisper (Requests Directo)",
        "openai": "configurado" if API_KEY else "FALTA OPENAI_API_KEY",
    }

@app.post("/transcribe", response_model=TranscribeResponse)
async def transcribe(
    req: TranscribeRequest,
    x_api_secret: str | None = Header(default=None)
):
    if API_SECRET and x_api_secret != API_SECRET:
        raise HTTPException(status_code=401, detail="Unauthorized")

    if not API_KEY:
        raise HTTPException(
            status_code=500,
            detail="Falta configurar OPENAI_API_KEY en Railway Variables"
        )

    start_total = time.time()
    audio_path  = TEMP_DIR / f"{uuid.uuid4()}.mp3"

    try:
        # ── PASO 1: Descargar audio con yt-dlp ───────────────────
        logger.info(f"[YT-DLP] ⬇️ Descargando audio: {req.url[:60]}...")

        ydl_opts = {
            "format":       "bestaudio/best",
            "outtmpl":      str(audio_path).replace(".mp3", ".%(ext)s"),
            "postprocessors": [{
                "key":              "FFmpegExtractAudio",
                "preferredcodec":   "mp3",
                "preferredquality": "128",
            }],
            "quiet":        True,
            "no_warnings":  True,
            "noplaylist":   True,
            "max_filesize": 25 * 1024 * 1024,
        }

        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, _download_audio, req.url, ydl_opts)

        actual_audio = _find_audio_file(audio_path)
        if not actual_audio or not actual_audio.exists():
            raise HTTPException(status_code=422, detail="No se pudo descargar el audio.")

        size_mb = actual_audio.stat().st_size / 1024 / 1024
        logger.info(f"[YT-DLP] ✅ Audio listo: {size_mb:.1f}MB")

        # ── PASO 2: Transcribir (Conexión Directa a API OpenAI) ───
        logger.info(f"[OPENAI] ☁️ Enviando audio a Whisper (Vía Directa)...")
        t2 = time.time()

        transcript, detected_lang = await loop.run_in_executor(
            None,
            _transcribe_with_requests,
            str(actual_audio),
            req.language,
        )

        t_whisper  = round((time.time() - t2) * 1000)
        t_total    = round((time.time() - start_total) * 1000)
        word_count = len(transcript.split())

        logger.info(f"[OPENAI] ✅ Transcripción en {t_whisper}ms — {word_count} palabras")

        return TranscribeResponse(
            transcript = transcript,
            language   = detected_lang,
            words      = word_count,
            time_ms    = t_total,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[ERROR] ❌ {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        _cleanup_audio(audio_path)

# ── Funciones síncronas ─────────────────────────────────────────
def _transcribe_with_requests(audio_path: str, language: str | None) -> tuple[str, str]:
    url = "https://api.openai.com/v1/audio/transcriptions"
    headers = {
        "Authorization": f"Bearer {API_KEY}"
    }
    data = {
        "model": "whisper-1",
        "response_format": "verbose_json",
        "temperature": "0"
    }
    if language:
        data["language"] = language

    with open(audio_path, "rb") as f:
        files = {"file": (Path(audio_path).name, f, "audio/mpeg")}
        # Aquí hacemos la petición web clásica y blindada
        response = requests.post(url, headers=headers, data=data, files=files, timeout=120)
    
    if response.status_code != 200:
        raise Exception(f"OpenAI API Error ({response.status_code}): {response.text}")

    res_json = response.json()
    transcript = res_json.get("text", "")
    detected_lang = res_json.get("language", language or "auto")
    return transcript, detected_lang

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
        except Exception:
            pass