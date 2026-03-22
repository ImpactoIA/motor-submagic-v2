# ==================================================================================
# 🐍 MOTOR SUBMAGIC — Microservicio FastAPI de Transcripción Ultra-Rápida
#
# Stack:
#   - yt-dlp       → descarga solo el audio en mp3 (~2s)
#   - faster-whisper → transcripción local con temperatura 0 (~5s)
#   - FastAPI      → servidor HTTP async
#
# Tiempo total estimado: 7-10 segundos vs 20-30s con Whisper API de OpenAI
#
# Deploy recomendado: Railway / Render / Fly.io (necesitas una máquina con CPU)
# Para GPU: usar beam_size=5, device="cuda" → baja a ~2s de transcripción
# ==================================================================================

from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from faster_whisper import WhisperModel
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

app = FastAPI(
    title="Motor Submagic — Transcripción Ultra-Rápida",
    description="yt-dlp + faster-whisper. Velocidad Enterprise.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción: reemplaza con tu dominio de Supabase
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

# ── Cargar modelo Whisper al arrancar (se carga UNA sola vez) ────
# Opciones de modelo por velocidad/precisión:
#   "tiny"   → ~1s  | precisión básica
#   "base"   → ~2s  | buena para voz clara
#   "small"  → ~4s  | recomendado para producción  ← USAR ESTE
#   "medium" → ~8s  | alta precisión
#   "large-v3" → ~15s | máxima precisión (necesita GPU)
#
# compute_type:
#   "int8"   → CPU optimizado (recomendado sin GPU)
#   "float16" → GPU (si tienes CUDA)

MODEL_SIZE    = os.getenv("WHISPER_MODEL", "small")
COMPUTE_TYPE  = os.getenv("WHISPER_COMPUTE", "int8")
DEVICE        = os.getenv("WHISPER_DEVICE", "cpu")
API_SECRET    = os.getenv("API_SECRET", "")  # Token de seguridad — configura en Railway

logger.info(f"🔄 Cargando modelo Whisper {MODEL_SIZE} ({COMPUTE_TYPE} en {DEVICE})...")
whisper_model = WhisperModel(MODEL_SIZE, device=DEVICE, compute_type=COMPUTE_TYPE)
logger.info(f"✅ Modelo Whisper cargado.")

# Directorio temporal para audios descargados
TEMP_DIR = Path("/tmp/audio_downloads")
TEMP_DIR.mkdir(exist_ok=True)


# ── Modelos de request/response ──────────────────────────────────

class TranscribeRequest(BaseModel):
    url: str
    language: str | None = None  # None = detección automática


class TranscribeResponse(BaseModel):
    transcript: str
    language:   str
    duration:   float
    words:      int
    time_ms:    int


class HealthResponse(BaseModel):
    status:      str
    model:       str
    compute:     str
    device:      str


# ── Endpoints ────────────────────────────────────────────────────

@app.get("/health", response_model=HealthResponse)
async def health():
    """Verifica que el servidor y el modelo estén listos."""
    return {
        "status":  "ok",
        "model":   MODEL_SIZE,
        "compute": COMPUTE_TYPE,
        "device":  DEVICE,
    }


@app.post("/transcribe", response_model=TranscribeResponse)
async def transcribe(
    req: TranscribeRequest,
    x_api_secret: str | None = Header(default=None)
):
    """
    Recibe una URL de TikTok/Instagram/YouTube/Facebook,
    descarga solo el audio y transcribe con faster-whisper.

    Headers:
        X-Api-Secret: token de autenticación (configura API_SECRET en env)

    Body:
        url:      URL del video
        language: código ISO opcional (es, en, pt, fr). None = auto-detect
    """

    # ── Validar secret ────────────────────────────────────────────
    if API_SECRET and x_api_secret != API_SECRET:
        raise HTTPException(status_code=401, detail="Unauthorized")

    start_total = time.time()
    audio_path  = TEMP_DIR / f"{uuid.uuid4()}.mp3"

    try:
        # ── PASO 1: Descargar solo el audio con yt-dlp ────────────
        logger.info(f"[YT-DLP] ⬇️ Descargando audio: {req.url[:60]}...")
        t1 = time.time()

        ydl_opts = {
            "format":            "bestaudio/best",
            "outtmpl":           str(audio_path).replace(".mp3", ".%(ext)s"),
            "postprocessors": [{
                "key":            "FFmpegExtractAudio",
                "preferredcodec": "mp3",
                "preferredquality": "128",  # 128kbps — suficiente para voz, mínimo peso
            }],
            "quiet":             True,
            "no_warnings":       True,
            "noplaylist":        True,
            "max_filesize":      25 * 1024 * 1024,  # 25MB — límite de seguridad
        }

        # yt-dlp es síncrono — lo corremos en un thread pool para no bloquear el event loop
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, _download_audio, req.url, ydl_opts)

        # yt-dlp puede cambiar la extensión — buscar el archivo real
        actual_audio = _find_audio_file(audio_path)
        if not actual_audio or not actual_audio.exists():
            raise HTTPException(status_code=422, detail="No se pudo descargar el audio del video.")

        t_download = round((time.time() - t1) * 1000)
        size_mb    = actual_audio.stat().st_size / 1024 / 1024
        logger.info(f"[YT-DLP] ✅ Audio descargado en {t_download}ms — {size_mb:.1f}MB")

        # ── PASO 2: Transcribir con faster-whisper ────────────────
        logger.info(f"[WHISPER] 🎤 Transcribiendo...")
        t2 = time.time()

        # temperature=0 → máxima precisión, sin alucinaciones
        # beam_size=5   → mejor calidad (reducir a 1 para máxima velocidad)
        segments, info = await loop.run_in_executor(
            None,
            lambda: whisper_model.transcribe(
                str(actual_audio),
                language          = req.language or None,  # None = auto-detect
                temperature       = 0,
                beam_size         = 1,
                vad_filter        = True,   # elimina silencio — más rápido y preciso
                vad_parameters    = {"min_silence_duration_ms": 500},
                word_timestamps   = False,  # no necesitamos timestamps por palabra
            )
        )

        # Concatenar todos los segmentos en un solo string
        transcript = " ".join(seg.text.strip() for seg in segments).strip()

        t_whisper    = round((time.time() - t2) * 1000)
        t_total      = round((time.time() - start_total) * 1000)
        word_count   = len(transcript.split())
        detected_lang = info.language or "auto"

        logger.info(f"[WHISPER] ✅ Transcripción en {t_whisper}ms — {word_count} palabras — idioma: {detected_lang}")
        logger.info(f"[TOTAL] ⚡ Proceso completo: {t_total}ms")

        return TranscribeResponse(
            transcript = transcript,
            language   = detected_lang,
            duration   = round(info.duration or 0, 2),
            words      = word_count,
            time_ms    = t_total,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[ERROR] ❌ {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error de transcripción: {str(e)}")

    finally:
        # Limpiar archivos temporales siempre
        _cleanup_audio(audio_path)


# ── Helpers privados ─────────────────────────────────────────────

def _download_audio(url: str, opts: dict) -> None:
    """Ejecuta yt-dlp en modo síncrono (llamado desde run_in_executor)."""
    with yt_dlp.YoutubeDL(opts) as ydl:
        ydl.download([url])


def _find_audio_file(base_path: Path) -> Path | None:
    """
    yt-dlp puede generar .mp3, .m4a, .webm, etc.
    Busca el archivo de audio real con cualquier extensión.
    """
    stem = base_path.stem
    for ext in ["mp3", "m4a", "webm", "ogg", "wav", "opus"]:
        candidate = base_path.parent / f"{stem}.{ext}"
        if candidate.exists():
            return candidate
    # Fallback: buscar cualquier archivo reciente en el directorio
    files = sorted(TEMP_DIR.glob(f"{stem}*"), key=lambda f: f.stat().st_mtime, reverse=True)
    return files[0] if files else None


def _cleanup_audio(base_path: Path) -> None:
    """Elimina todos los archivos temporales generados para esta request."""
    stem = base_path.stem
    for f in TEMP_DIR.glob(f"{stem}*"):
        try:
            f.unlink()
        except Exception:
            pass