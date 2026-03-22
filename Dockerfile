FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .

# Instalamos las herramientas base primero
RUN pip install --no-cache-dir --upgrade pip "setuptools<70.0.0" wheel

# Instalamos todo SIN aislamiento para que Whisper no use versiones rotas
RUN pip install --no-cache-dir -r requirements.txt --no-build-isolation --extra-index-url https://download.pytorch.org/whl/cpu

COPY . .
EXPOSE 8000
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}