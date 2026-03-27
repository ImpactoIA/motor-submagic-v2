# ViralApp

> Motor de clonación viral con IA — extrae el ADN de videos virales y los replica en cualquier nicho.

[![Railway](https://img.shields.io/badge/Railway-Active-brightgreen?logo=railway)](https://motor-submagic-production.up.railway.app/health)
[![Supabase](https://img.shields.io/badge/Supabase-Edge_Functions-green?logo=supabase)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Vercel-Production-black?logo=vercel)](https://vercel.com)

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                        USUARIO                              │
│                   (Browser / Vercel)                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              SUPABASE EDGE FUNCTIONS                        │
│         supabase/functions/process-url/                     │
│                                                             │
│  index.ts ──► handlers/ ──► prompts/ ──► GPT-4o-mini       │
│                    │                                        │
│                    └──► lib/analizaredes.ts                 │
└────────────────────────┬────────────────────────────────────┘
                         │ (URL de video)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              RAILWAY — Motor Python                         │
│              fase2-python/main.py                           │
│                                                             │
│  yt-dlp (descarga audio) ──► OpenAI Whisper (transcribe)   │
└─────────────────────────────────────────────────────────────┘
```

---

## Repositorios

| Repo | Plataforma | Rama | Descripción |
|------|-----------|------|-------------|
| `ViralApp` | Vercel + Supabase | `main` | Frontend React + Edge Functions |
| `motor-submagic-v2` | Railway | `main` | Motor Python transcripción |

> ⚠️ **Regla de oro:** `TitanViral.tsx` y todo `supabase/` van en `ViralApp`. `main.py`, `requirements.txt` y `Dockerfile` van en `motor-submagic-v2`.

---

## Estructura del proyecto

```
ViralApp/
├── src/
│   ├── pages/
│   │   ├── TitanViral.tsx          # Clonación Viral (Sniper Enterprise)
│   │   ├── AnalyzeViral.tsx        # Autopsia Viral
│   │   ├── ScriptGenerator.tsx     # Generador de Guiones
│   │   └── ...
│   ├── components/
│   ├── context/                    # AuthContext
│   ├── hooks/
│   └── lib/
│       └── supabase.ts             # Cliente Supabase
│
├── supabase/
│   └── functions/
│       └── process-url/
│           ├── index.ts            # Router principal ← NO TOCAR sin entender
│           ├── handlers/
│           │   ├── autopsia-viral.ts   # Autopsia + Recreate (Sniper)
│           │   ├── script-generator.ts
│           │   └── other-handlers.ts
│           ├── prompts/
│           │   ├── ingenieria-inversa.ts  # Prompt Sniper Enterprise
│           │   ├── autopsia-viral.ts
│           │   └── ...
│           └── lib/
│               ├── analizaredes.ts    # Orquestador Railway + Whisper ← CRÍTICO
│               ├── types.ts
│               ├── security.ts
│               └── logger.ts
│
├── fase2-python/                   # ← Repo separado: motor-submagic-v2
│   ├── main.py                     # FastAPI + yt-dlp + Whisper
│   ├── requirements.txt
│   └── Dockerfile
│
├── .env                            # Variables locales (NO subir a git)
├── .env.example                    # Plantilla pública
└── README.md
```

---

## Variables de entorno

### Supabase Edge Functions
Configurar en **Supabase Dashboard → Settings → Edge Functions → Secrets**

```
OPENAI_API_KEY=sk-...        # GPT-4o-mini + Whisper
API_SECRET=...               # Autenticar llamadas a Railway
APIFY_API_TOKEN=...          # Scraping comentarios YouTube (opcional)
```

### Railway
Configurar en **Railway Dashboard → tu servicio → Variables**

```
OPENAI_API_KEY=sk-...        # Whisper transcripción
API_SECRET=...               # Debe coincidir con Supabase
PORT=8000                    # Railway lo inyecta automáticamente
```

### Local (`.env`)
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

---

## Deploy

### Frontend + Supabase (repo `ViralApp`)

```bash
cd C:\ViralApp

git add .
git commit -m "tipo: descripción corta del cambio"
git push origin main

# Vercel redespliegua automáticamente
# Luego desplegar Edge Functions:
supabase functions deploy process-url --project-ref TU_PROJECT_REF
```

### Motor Python (repo `motor-submagic-v2`)

```bash
cd C:\ViralApp\fase2-python

git add main.py requirements.txt Dockerfile
git commit -m "tipo: descripción corta del cambio"
git push origin main

# Railway redespliegua automáticamente (~2 min)
```

### Verificar que todo está vivo

```bash
# Railway
curl https://motor-submagic-production.up.railway.app/health -UseBasicParsing

# Respuesta esperada:
# {"status":"ok","motor":"OpenAI Whisper","openai":"configurado"}
```

---

## Convención de commits

```
feat:     nueva funcionalidad
fix:      corrección de bug
refactor: refactorización sin cambio funcional
perf:     mejora de rendimiento
docs:     cambios en documentación
chore:    tareas de mantenimiento
```

---

## Servicios externos

| Servicio | Dashboard | Para qué |
|----------|-----------|----------|
| Railway | [railway.app](https://railway.app) | Motor yt-dlp + Whisper |
| Supabase | [supabase.com](https://supabase.com) | Edge Functions + DB + Auth |
| Vercel | [vercel.com](https://vercel.com) | Frontend React |
| OpenAI | [platform.openai.com](https://platform.openai.com) | GPT-4o-mini + Whisper |
| Apify | [apify.com](https://apify.com) | Scraping YouTube |

---

## Checklist de deploy

```
[ ] ¿Es un cambio de frontend o supabase?  → push en ViralApp
[ ] ¿Es un cambio de Python/Railway?        → push en motor-submagic-v2
[ ] ¿Cambiaron variables de entorno?        → actualizar en Dashboard
[ ] ¿Se desplegó Supabase?                  → supabase functions deploy
[ ] ¿Railway está vivo?                     → curl /health
[ ] ¿Vercel desplegó sin errores?           → Vercel Dashboard → Deployments
```

---

## Archivos críticos

> Estos archivos conectan todos los servicios. Un error aquí rompe toda la app.

| Archivo | Por qué es crítico |
|---------|-------------------|
| `supabase/functions/process-url/index.ts` | Router principal — enruta todos los modos |
| `supabase/functions/process-url/lib/analizaredes.ts` | Conecta Railway con Supabase |
| `fase2-python/main.py` | Descarga audio y transcribe con Whisper |
| `src/lib/supabase.ts` | Cliente — si se rompe, nada funciona |
| `src/pages/TitanViral.tsx` | Frontend Sniper Enterprise |
