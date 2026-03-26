from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import yt_dlp
import os
import uuid
import asyncio
import time
import logging
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor

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

# ── Executor dedicado para tareas bloqueantes ────────────────────
executor = ThreadPoolExecutor(max_workers=4)

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
    # ── Auth ─────────────────────────────────────────────────────
    if API_SECRET and x_api_secret != API_SECRET:
        raise HTTPException(status_code=401, detail="Unauthorized")

    if not API_KEY:
        raise HTTPException(
            status_code=500,
            detail="Falta configurar OPENAI_API_KEY en Railway Variables"
        )

    start_total = time.time()
    # Usamos un directorio único por request para evitar colisiones
    job_id    = uuid.uuid4().hex
    job_dir   = TEMP_DIR / job_id
    job_dir.mkdir(parents=True, exist_ok=True)
    base_path = job_dir / "audio"

    try:
        # ── PASO 1: Descargar audio con yt-dlp ───────────────────
        logger.info(f"[YT-DLP] ⬇️ Descargando audio: {req.url[:60]}...")

        ydl_opts = {
            "format":       "bestaudio/best",
            # CORRECCIÓN CRÍTICA: outtmpl apunta al directorio del job,
            # sin extensión fija — yt-dlp elige la extensión correcta.
            "outtmpl":      str(base_path) + ".%(ext)s",
            "postprocessors": [{
                "key":              "FFmpegExtractAudio",
                "preferredcodec":   "mp3",
                "preferredquality": "128",
            }],
            "quiet":        True,
            "no_warnings":  True,
            "noplaylist":   True,
            # 25 MB máximo
            "max_filesize": 25 * 1024 * 1024,
        }

        loop = asyncio.get_event_loop()

        try:
            # Timeout de 120s para la descarga completa
            await asyncio.wait_for(
                loop.run_in_executor(executor, _download_audio, req.url, ydl_opts),
                timeout=120.0
            )
        except asyncio.TimeoutError:
            raise HTTPException(status_code=408, detail="Timeout: la descarga del video tardó más de 120 segundos.")

        # CORRECCIÓN CRÍTICA: buscar en el directorio del job, no por stem global
        actual_audio = _find_audio_in_dir(job_dir)
        if not actual_audio or not actual_audio.exists():
            raise HTTPException(
                status_code=422,
                detail="No se pudo descargar el audio. Verifica que la URL sea pública y válida."
            )

        size_mb = actual_audio.stat().st_size / 1024 / 1024
        logger.info(f"[YT-DLP] ✅ Audio listo: {actual_audio.name} ({size_mb:.1f}MB)")

        if size_mb > 24.5:
            raise HTTPException(
                status_code=413,
                detail=f"El audio pesa {size_mb:.1f}MB — supera el límite de 25MB de Whisper."
            )

        # ── PASO 2: Transcribir con Whisper vía requests directo ──
        logger.info(f"[OPENAI] ☁️ Enviando {actual_audio.name} a Whisper...")
        t2 = time.time()

        try:
            transcript, detected_lang = await asyncio.wait_for(
                loop.run_in_executor(
                    executor,
                    _transcribe_with_requests,
                    str(actual_audio),
                    req.language,
                ),
                timeout=180.0
            )
        except asyncio.TimeoutError:
            raise HTTPException(status_code=408, detail="Timeout: Whisper tardó más de 180 segundos.")

        t_whisper  = round((time.time() - t2) * 1000)
        t_total    = round((time.time() - start_total) * 1000)
        word_count = len(transcript.split())

        logger.info(f"[OPENAI] ✅ Transcripción en {t_whisper}ms — {word_count} palabras")

        if word_count < 3:
            raise HTTPException(
                status_code=422,
                detail="La transcripción resultó vacía o ininteligible. El video puede no tener audio o estar en un idioma no soportado."
            )

        return TranscribeResponse(
            transcript = transcript,
            language   = detected_lang,
            words      = word_count,
            time_ms    = t_total,
        )

    except HTTPException:
        # Re-lanzar HTTPException sin envolver
        raise
    except Exception as e:
        logger.error(f"[ERROR] ❌ {type(e).__name__}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"{type(e).__name__}: {str(e)}")

    finally:
        # Limpiar directorio completo del job
        _cleanup_job_dir(job_dir)


# ── Funciones síncronas ──────────────────────────────────────────

def _transcribe_with_requests(audio_path: str, language: str | None) -> tuple[str, str]:
    url = "https://api.openai.com/v1/audio/transcriptions"
    headers = {
        "Authorization": f"Bearer {API_KEY}"
    }
    data: dict = {
        "model": "whisper-1",
        "response_format": "verbose_json",
        "temperature": "0",
    }
    if language:
        data["language"] = language

    with open(audio_path, "rb") as f:
        files = {"file": (Path(audio_path).name, f, "audio/mpeg")}
        response = requests.post(
            url,
            headers=headers,
            data=data,
            files=files,
            timeout=170  # Ligeramente menor al asyncio timeout
        )

    if response.status_code != 200:
        raise Exception(f"OpenAI API Error ({response.status_code}): {response.text[:500]}")

    res_json      = response.json()
    transcript    = res_json.get("text", "").strip()
    detected_lang = res_json.get("language", language or "auto")
    return transcript, detected_lang


def _download_audio(url: str, opts: dict) -> None:
    with yt_dlp.YoutubeDL(opts) as ydl:
        ydl.download([url])


def _find_audio_in_dir(directory: Path) -> Path | None:
    """
    CORRECCIÓN CRÍTICA: busca cualquier archivo de audio en el directorio
    del job — no asume extensión ni nombre exacto.
    Prioriza .mp3 (post-procesado por FFmpeg), luego otros formatos.
    """
    priority = ["mp3", "m4a", "wav", "ogg", "webm", "opus", "flac"]
    # Primero buscar por extensión en orden de prioridad
    for ext in priority:
        matches = list(directory.glob(f"*.{ext}"))
        if matches:
            # Si hay varios, el más reciente
            return max(matches, key=lambda f: f.stat().st_mtime)
    # Fallback: cualquier archivo en el directorio
    all_files = [f for f in directory.iterdir() if f.is_file()]
    if all_files:
        return max(all_files, key=lambda f: f.stat().st_mtime)
    return None


def _cleanup_job_dir(job_dir: Path) -> None:
    """Limpia el directorio completo del job de forma segura."""
    try:
        if job_dir.exists():
            for f in job_dir.iterdir():
                try:
                    f.unlink()
                except Exception:
                    pass
            job_dir.rmdir()
    except Exception:
        pass