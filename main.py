from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI          # ← cliente SÍNCRONO, no Async
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

app = FastAPI(title="Motor Submagic — Transcripción con OpenAI Whisper")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Variables de entorno ─────────────────────────────────────────
API_KEY    = os.getenv("OPENAI_API_KEY", "")
API_SECRET = os.getenv("API_SECRET", "")

# ── Cliente OpenAI SÍNCRONO (se llama desde run_in_executor) ─────
# NO usar AsyncOpenAI — genera conflicto con el event loop de FastAPI
openai_client = OpenAI(api_key=API_KEY)

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
        "motor":  "OpenAI Whisper via Railway",
        "openai": "configurado" if API_KEY else "FALTA OPENAI_API_KEY",
    }


@app.post("/transcribe", response_model=TranscribeResponse)
async def transcribe(
    req: TranscribeRequest,
    x_api_secret: str | None = Header(default=None)
):
    # Validar secret
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
            raise HTTPException(
                status_code=422,
                detail="No se pudo descargar el audio del video."
            )

        size_mb = actual_audio.stat().st_size / 1024 / 1024
        logger.info(f"[YT-DLP] ✅ Audio listo: {size_mb:.1f}MB")

        # ── PASO 2: Transcribir con OpenAI Whisper ───────────────
        logger.info(f"[OPENAI] ☁️ Enviando audio a Whisper...")
        t2 = time.time()

        transcript, detected_lang = await loop.run_in_executor(
            None,
            _transcribe_with_openai,
            str(actual_audio),
            req.language,
        )

        t_whisper  = round((time.time() - t2) * 1000)
        t_total    = round((time.time() - start_total) * 1000)
        word_count = len(transcript.split())

        logger.info(
            f"[OPENAI] ✅ Transcripción en {t_whisper}ms — "
            f"{word_count} palabras — idioma: {detected_lang}"
        )
        logger.info(f"[TOTAL] ⚡ Proceso completo: {t_total}ms")

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


# ── Funciones síncronas (se ejecutan en thread pool) ────────────

def _transcribe_with_openai(audio_path: str, language: str | None) -> tuple[str, str]:
    with open(audio_path, "rb") as f:
        response = openai_client.audio.transcriptions.create(
            model           = "whisper-1",
            file            = f,
            language        = language or None,
            temperature     = 0,
            response_format = "verbose_json",
        )
    transcript    = response.text or ""
    detected_lang = getattr(response, "language", None) or language or "auto"
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
    files = sorted(
        TEMP_DIR.glob(f"{stem}*"),
        key=lambda f: f.stat().st_mtime,
        reverse=True
    )
    return files[0] if files else None


def _cleanup_audio(base_path: Path) -> None:
    stem = base_path.stem
    for f in TEMP_DIR.glob(f"{stem}*"):
        try:
            f.unlink()
        except Exception:
            pass