import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import {
  Zap, Copy, CheckCircle2, AlertTriangle,
  Loader2, Target, Brain, Film,
  Clapperboard, Upload, Trash2,
  Link as LinkIcon, Plus, X, Eye,
  RefreshCw, PlayCircle, Cpu,
  Camera, Volume2, Repeat2, Music,
  Lightbulb, Crosshair, Search,
  Youtube, Instagram, Facebook, ChevronDown,
  User, BookOpen, Layers
} from 'lucide-react';

// ==================================================================================
// 🧠 TYPES & CONSTANTS
// ==================================================================================

type ContentType    = 'reel' | 'long' | 'masterclass';
type UploadMode     = 'url' | 'file';
type OutputLanguage = 'es' | 'en' | 'pt' | 'fr';

interface IRProState {
  etapa:  'idle' | 'analizando' | 'completo';
  output: any | null;
  error:  string | null;
}

interface CreditConfig {
  label: string;
  icon:  string;
  costs: { single: number; multi23: number; multi45: number };
}

const CONTENT_CONFIGS: Record<ContentType, CreditConfig> = {
  reel:        { label: 'Reel / Short', icon: '🎥', costs: { single: 20,  multi23: 35,  multi45: 50  } },
  long:        { label: 'Video Largo',  icon: '🎬', costs: { single: 55,  multi23: 80,  multi45: 105 } },
  masterclass: { label: 'Masterclass',  icon: '🎓', costs: { single: 75,  multi23: 105, multi45: 135 } },
};

const LANGUAGE_OPTIONS: { value: OutputLanguage; flag: string; label: string }[] = [
  { value: 'es', flag: '🇪🇸', label: 'Español'   },
  { value: 'en', flag: '🇺🇸', label: 'English'   },
  { value: 'pt', flag: '🇧🇷', label: 'Português' },
  { value: 'fr', flag: '🇫🇷', label: 'Français'  },
];

const PLATFORM_OPTIONS: { value: string; label: string; icon: React.ReactNode }[] = [
  { value: 'TikTok',    label: 'TikTok',    icon: <Music      size={13} /> },
  { value: 'Instagram', label: 'Instagram', icon: <Instagram  size={13} /> },
  { value: 'YouTube',   label: 'YouTube',   icon: <Youtube    size={13} /> },
  { value: 'Facebook',  label: 'Facebook',  icon: <Facebook   size={13} /> },
];

function computeCost(type: ContentType, urlCount: number): number {
  const cfg = CONTENT_CONFIGS[type].costs;
  if (urlCount <= 1) return cfg.single;
  if (urlCount <= 3) return cfg.multi23;
  return cfg.multi45;
}

// ==================================================================================
// 🗂️ HOOK: COPY TEXT
// ==================================================================================

function useCopyText() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (text: string, key: string) => {
    if (!text) return;
    navigator?.clipboard?.writeText(text).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    });
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };
  return { copied, copy };
}

// ==================================================================================
// 🔄 HOOK: POLLING
// ==================================================================================

function usePolling(
  generationId: string | null,
  onComplete: (data: any) => void,
  onError:    (msg: string) => void
) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const attemptsRef = useRef(0);
  const MAX = 60; // 5 min @ 5s/intento

  useEffect(() => {
    if (!generationId) return;
    attemptsRef.current = 0;

    intervalRef.current = setInterval(async () => {
      attemptsRef.current += 1;
      if (attemptsRef.current > MAX) {
        clearInterval(intervalRef.current!);
        onError('El análisis está tardando demasiado. Intenta de nuevo en unos minutos.');
        return;
      }
      try {
        const { data, error } = await supabase
          .from('viral_generations')
          .select('status, content')
          .eq('id', generationId)
          .single();
        if (error) return;
        if (data?.status === 'completed') {
          clearInterval(intervalRef.current!);
          onComplete(data.content);
        } else if (data?.status === 'error') {
          clearInterval(intervalRef.current!);
          onError(data.content?.error || 'Error en el servidor. Intenta de nuevo.');
        }
      } catch (_) {}
    }, 5000);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [generationId]);
}

// ==================================================================================
// 🃏 PRIMITIVOS DE UI
// ==================================================================================

const DashCard = ({
  children, accent = 'purple', className = ''
}: { children: React.ReactNode; accent?: string; className?: string }) => {
  const borders: Record<string, string> = {
    purple: 'border-purple-500/25 shadow-[0_0_30px_-10px_rgba(168,85,247,0.12)]',
    green:  'border-green-500/25  shadow-[0_0_30px_-10px_rgba(34,197,94,0.12)]',
    blue:   'border-blue-500/25   shadow-[0_0_30px_-10px_rgba(59,130,246,0.12)]',
    orange: 'border-orange-500/25 shadow-[0_0_30px_-10px_rgba(249,115,22,0.12)]',
    red:    'border-red-500/25    shadow-[0_0_30px_-10px_rgba(239,68,68,0.12)]',
  };
  return (
    <div className={`bg-[#080b10] border rounded-2xl overflow-hidden ${borders[accent] ?? borders.purple} ${className}`}>
      {children}
    </div>
  );
};

const CardHeader = ({
  icon: Icon, label, accent = 'purple', badge
}: { icon: React.ElementType; label: string; accent?: string; badge?: string }) => {
  const styles: Record<string, string> = {
    purple: 'text-purple-400 bg-purple-500/8  border-b border-purple-500/20',
    green:  'text-green-400  bg-green-500/8   border-b border-green-500/20',
    blue:   'text-blue-400   bg-blue-500/8    border-b border-blue-500/20',
    orange: 'text-orange-400 bg-orange-500/8  border-b border-orange-500/20',
    red:    'text-red-400    bg-red-500/8     border-b border-red-500/20',
  };
  const s = styles[accent] ?? styles.purple;
  const iconColor = s.split(' ')[0];
  return (
    <div className={`flex items-center justify-between px-5 py-3.5 ${s}`}>
      <div className="flex items-center gap-2.5">
        <Icon size={14} className={iconColor} />
        <span className="text-[11px] font-black uppercase tracking-widest text-white/75">{label}</span>
      </div>
      {badge && (
        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-gray-500">
          {badge}
        </span>
      )}
    </div>
  );
};

// ── Select nativo estilizado ─────────────────────────────────────────
const StyledSelect = ({
  value, onChange, icon: Icon, label, children
}: {
  value: string;
  onChange: (v: string) => void;
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
      <Icon size={10} /> {label}
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full appearance-none bg-[#0f1115] border border-white/10 rounded-xl
          px-3 py-2.5 text-xs text-white pr-8
          focus:outline-none focus:border-purple-500/50 transition-colors cursor-pointer"
      >
        {children}
      </select>
      <ChevronDown size={12}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
    </div>
  </div>
);

// ==================================================================================
// 📺 TARJETA 1 — TELEPROMPTER
// ==================================================================================

const TeleprompterCard = ({ guion }: { guion: string }) => {
  const { copied, copy } = useCopyText();
  const words = guion ? guion.trim().split(/\s+/).length : 0;
  const mins  = Math.max(1, Math.round(words / 130));

  return (
    <DashCard accent="green">
      <CardHeader icon={Clapperboard} label="Guion Teleprompter" accent="green"
        badge={words > 0 ? `~${mins} min · ${words} palabras` : undefined} />
      <div className="p-5">
        {guion ? (
          <pre className="text-sm text-gray-100 leading-[1.95] whitespace-pre-wrap font-mono
            max-h-[480px] overflow-y-auto pr-2
            scrollbar-thin scrollbar-thumb-green-900/60 scrollbar-track-transparent">
            {guion}
          </pre>
        ) : (
          <p className="text-sm text-gray-600 italic py-6 text-center">Guion no disponible.</p>
        )}
        <button
          onClick={() => copy(guion, 'guion')}
          className="mt-5 w-full flex items-center justify-center gap-2
            bg-green-600 hover:bg-green-500 text-black font-black text-xs
            uppercase tracking-wider py-2.5 rounded-xl transition-all active:scale-[0.97] shadow-lg"
        >
          {copied === 'guion' ? <CheckCircle2 size={15} /> : <Copy size={15} />}
          {copied === 'guion' ? 'COPIADO ✓' : 'COPIAR TELEPROMPTER'}
        </button>
      </div>
    </DashCard>
  );
};

// ==================================================================================
// 🎬 TARJETA 2 — PLAN AUDIOVISUAL
// ==================================================================================

const PlanAudiovisualCard = ({ planAV }: { planAV: any }) => {
  const [tab, setTab]    = useState(0);
  const { copied, copy } = useCopyText();

  const escenas = Array.isArray(planAV?.escenas) ? planAV.escenas : [];
  const ritmo   = planAV?.ritmo_de_cortes || '';
  const musica  = planAV?.musica_completa || {};

  if (escenas.length === 0 && !ritmo) return null;

  const tipoConfig: Record<string, string> = {
    HOOK:            'bg-green-500/10 text-green-400 border-green-500/30',
    DESARROLLO_1:    'bg-blue-500/10 text-blue-400 border-blue-500/30',
    DESARROLLO_2:    'bg-orange-500/10 text-orange-400 border-orange-500/30',
    CIERRE_CIRCULAR: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  };

  const escena = escenas[tab];

  return (
    <DashCard accent="blue">
      <CardHeader icon={Film} label="Plan Audiovisual Pro" accent="blue"
        badge={`${escenas.length} escenas`} />

      {escenas.length > 0 && (
        <div className="flex border-b border-white/5 overflow-x-auto">
          {escenas.map((e: any, i: number) => (
            <button key={i} onClick={() => setTab(i)}
              className={`flex-1 min-w-[90px] px-3 py-3 text-[9px] font-black uppercase tracking-wider
                transition-all border-b-2
                ${tab === i
                  ? 'border-blue-500 text-blue-300 bg-blue-500/5'
                  : 'border-transparent text-gray-600 hover:text-gray-400'}`}>
              <span className="block text-[8px] text-gray-600 font-normal mb-0.5">{e.momento}</span>
              {e.tipo?.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      )}

      {escena && (
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className={`text-[9px] font-black px-2.5 py-1 rounded-full border
              ${tipoConfig[escena.tipo] ?? 'bg-white/5 text-gray-400 border-white/10'}`}>
              {escena.tipo?.replace(/_/g, ' ')}
            </span>
            <span className="text-[9px] text-gray-600 font-bold">⏱ {escena.momento}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-[#0f1115] rounded-xl p-3.5 border border-white/5">
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">🎬 Escena</p>
              <p className="text-xs text-gray-200 leading-relaxed">{escena.descripcion_escena || '—'}</p>
            </div>
            <div className="bg-[#0f1115] rounded-xl p-3.5 border border-white/5">
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                <Camera size={9} /> Cámara
              </p>
              <p className="text-xs text-cyan-300 font-bold mb-1">{escena.angulo_camara || '—'}</p>
              <p className="text-[10px] text-gray-400">{escena.movimiento || '—'}</p>
            </div>
            <div className="bg-[#0f1115] rounded-xl p-3.5 border border-yellow-500/10">
              <p className="text-[9px] font-black text-yellow-500 uppercase tracking-widest mb-1.5">✍️ Caption</p>
              <p className="text-sm font-black text-yellow-200 tracking-tight">{escena.caption || '—'}</p>
            </div>
            <div className="bg-[#0f1115] rounded-xl p-3.5 border border-green-500/10">
              <p className="text-[9px] font-black text-green-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                <Volume2 size={9} /> Sonido
              </p>
              <p className="text-xs text-green-200 leading-relaxed">{escena.sfx || '—'}</p>
            </div>
            <div className="md:col-span-2 bg-purple-500/5 rounded-xl p-3.5 border border-purple-500/15">
              <p className="text-[9px] font-black text-purple-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                <Brain size={9} /> Por qué retiene
              </p>
              <p className="text-xs text-gray-300 leading-relaxed">{escena.por_que_retiene || '—'}</p>
            </div>
            {escena.prompt_broll && (
              <div className="md:col-span-2 bg-[#070d18] rounded-xl p-3.5 border border-blue-500/20">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">
                    🤖 Prompt B-Roll · Midjourney / Runway / Sora
                  </p>
                  <button onClick={() => copy(escena.prompt_broll, `broll-${tab}`)}
                    className="flex items-center gap-1.5 text-[9px] font-black px-2 py-1.5 rounded-lg
                      bg-blue-600/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300
                      transition-all active:scale-95">
                    {copied === `broll-${tab}` ? <CheckCircle2 size={10} /> : <Copy size={10} />}
                    {copied === `broll-${tab}` ? 'COPIADO' : 'COPIAR'}
                  </button>
                </div>
                <p className="text-[11px] text-blue-100 font-mono leading-relaxed bg-black/30 rounded-lg p-3 border border-blue-500/10 select-all">
                  {escena.prompt_broll}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="border-t border-white/5 p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {ritmo && (
          <div className="bg-[#0f1115] rounded-xl p-3.5 border border-white/5">
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
              <Repeat2 size={9} /> Ritmo de Cortes
            </p>
            <p className="text-xs text-gray-300 leading-relaxed">{ritmo}</p>
          </div>
        )}
        {musica?.genero && (
          <div className="bg-[#0f1115] rounded-xl p-3.5 border border-green-500/10">
            <p className="text-[9px] font-black text-green-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
              <Music size={9} /> Música
            </p>
            <p className="text-xs text-green-200 font-bold">{musica.genero} · {musica.bpm} BPM</p>
            {musica.referencia   && <p className="text-[10px] text-gray-400 mt-1">Ref: {musica.referencia}</p>}
            {musica.cuando_entra && <p className="text-[10px] text-gray-500">Entra: {musica.cuando_entra}</p>}
          </div>
        )}
      </div>
    </DashCard>
  );
};

// ==================================================================================
// 🎯 TARJETA 3 — MINIATURA & TEORÍA CIRCULAR
// ==================================================================================

const MiniaturaCard = ({ miniatura }: { miniatura: any }) => {
  const { copied, copy } = useCopyText();
  if (!miniatura?.frase_principal) return null;
  const { frase_principal, por_que_genera_clic, variante_b } = miniatura;

  return (
    <DashCard accent="orange">
      <CardHeader icon={Eye} label="Miniatura & Teoría Circular" accent="orange" />
      <div className="p-5 space-y-4">
        <div className="bg-[#0f1115] rounded-xl p-5 border border-orange-500/20 text-center">
          <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest mb-3">
            Frase para Miniatura
          </p>
          <p className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            {frase_principal}
          </p>
          <button
            onClick={() => copy(frase_principal, 'miniatura')}
            className="mt-4 inline-flex items-center gap-2 bg-orange-600/20 hover:bg-orange-500/30
              border border-orange-500/30 text-orange-300 px-4 py-2 rounded-lg text-xs font-bold
              transition-all active:scale-95"
          >
            {copied === 'miniatura' ? <CheckCircle2 size={13} /> : <Copy size={13} />}
            {copied === 'miniatura' ? 'Copiado' : 'Copiar frase'}
          </button>
        </div>
        {por_que_genera_clic && (
          <div className="bg-[#0f1115] rounded-xl p-4 border border-white/5">
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1">
              <Brain size={9} /> Mecanismo psicológico
            </p>
            <p className="text-xs text-gray-200 leading-relaxed">{por_que_genera_clic}</p>
          </div>
        )}
        <div className="bg-gradient-to-r from-purple-900/20 to-orange-900/20 rounded-xl p-4 border border-purple-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Repeat2 size={12} className="text-purple-400" />
            <p className="text-[9px] font-black text-purple-400 uppercase tracking-widest">
              Teoría Circular de Alcance
            </p>
          </div>
          <p className="text-[10px] text-gray-300 leading-relaxed">
            La primera y última frase del guion forman un loop. El espectador siente que el video cerró el círculo,
            forzando el re-watch y multiplicando la retención acumulada.
          </p>
        </div>
        {variante_b && (
          <div className="bg-[#0f1115] rounded-xl p-4 border border-dashed border-white/10">
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">Variante B — A/B Test</p>
            <p className="text-sm font-bold text-gray-300 italic">"{variante_b}"</p>
          </div>
        )}
      </div>
    </DashCard>
  );
};

// ==================================================================================
// 🧬 TARJETA 4 — ADN VIRAL & IDEA NUCLEAR
// ==================================================================================

const AdnIdeaCard = ({
  adnViral, ideaGanadora, scoreAdn
}: { adnViral: string[]; ideaGanadora: string; scoreAdn: any }) => {
  const global      = scoreAdn?.global || 0;
  const label       = global >= 85 ? '🔥 Viral Potencial'
                    : global >= 70 ? '⚡ Alta Viralidad'
                    : global >= 50 ? '📈 En Desarrollo'
                    : '⚠ Necesita Mejoras';
  const strokeColor = global >= 85 ? '#22c55e' : global >= 70 ? '#a855f7' : global >= 50 ? '#f59e0b' : '#ef4444';
  const textColor   = global >= 85 ? 'text-green-400'
                    : global >= 70 ? 'text-purple-400'
                    : global >= 50 ? 'text-yellow-400'
                    : 'text-red-400';
  const radius = 40;
  const circ   = 2 * Math.PI * radius;
  const prog   = (global / 100) * circ;

  return (
    <DashCard accent="red">
      <CardHeader icon={Zap} label="ADN Viral & Idea Nuclear" accent="red" />
      <div className="p-5 space-y-5">
        {ideaGanadora && (
          <div className="bg-[#0f1115] rounded-xl p-4 border border-red-500/15">
            <div className="flex items-center gap-1.5 mb-2">
              <Lightbulb size={11} className="text-yellow-400" />
              <p className="text-[9px] font-black text-yellow-400 uppercase tracking-widest">
                Idea Nuclear Ganadora
              </p>
            </div>
            <p className="text-xs text-gray-200 leading-relaxed">{ideaGanadora}</p>
          </div>
        )}

        {scoreAdn && (
          <div className="bg-[#0f1115] rounded-xl p-4 border border-white/5">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative shrink-0" style={{ width: 92, height: 92 }}>
                <svg width={92} height={92} style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx={46} cy={46} r={radius} fill="none" stroke="#1a1a2e" strokeWidth={7} />
                  <circle cx={46} cy={46} r={radius} fill="none" stroke={strokeColor} strokeWidth={7}
                    strokeDasharray={`${circ}`} strokeDashoffset={circ - prog} strokeLinecap="round"
                    style={{
                      transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)',
                      filter: `drop-shadow(0 0 6px ${strokeColor}40)`,
                    }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-white leading-none">{global}</span>
                  <span className="text-[8px] text-gray-500 font-bold uppercase">/100</span>
                </div>
              </div>
              <div>
                <p className={`text-xs font-black mb-1 ${textColor}`}>{label}</p>
                {scoreAdn.diagnostico && (
                  <p className="text-[10px] text-gray-500 leading-relaxed max-w-[200px]">
                    {scoreAdn.diagnostico}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Retención',    val: scoreAdn.retencion    || 0, color: 'bg-blue-500'   },
                { label: 'Emoción',      val: scoreAdn.emocion      || 0, color: 'bg-pink-500'   },
                { label: 'Atención',     val: scoreAdn.atencion     || 0, color: 'bg-purple-500' },
                { label: 'Valor',        val: scoreAdn.valor        || 0, color: 'bg-green-500'  },
                { label: 'Polarización', val: scoreAdn.polarizacion || 0, color: 'bg-orange-500' },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-tighter mb-0.5">
                    <span className="text-gray-500">{item.label}</span>
                    <span className={`font-black ${
                      item.val >= 80 ? 'text-green-400'
                      : item.val >= 60 ? 'text-yellow-400'
                      : 'text-red-400'
                    }`}>
                      {item.val}<span className="text-gray-600 font-normal">%</span>
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-800/80 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${item.val}%`, transition: 'width 1.4s cubic-bezier(0.4,0,0.2,1)' }}
                      className={`h-full ${item.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {Array.isArray(adnViral) && adnViral.filter(Boolean).length > 0 && (
          <div className="space-y-2">
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1">
              <Crosshair size={9} /> Disparadores Psicológicos
            </p>
            {adnViral.map((trigger: string, i: number) => (
              <div key={i}
                className="flex items-start gap-3 bg-[#0f1115] rounded-xl p-3.5 border border-red-500/10">
                <span className="shrink-0 w-5 h-5 rounded-full bg-red-500/20 border border-red-500/30
                  text-red-400 text-[10px] font-black flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <p className="text-xs text-gray-300 leading-relaxed">{trigger}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashCard>
  );
};

// ==================================================================================
// 📝 TRANSCRIPCIÓN COLAPSABLE
// ==================================================================================

const TranscripcionCard = ({ transcripcion }: { transcripcion: string }) => {
  const { copied, copy } = useCopyText();
  const [expanded, setExpanded] = useState(false);
  if (!transcripcion) return null;

  const preview = transcripcion.length > 600
    ? transcripcion.slice(0, 600) + '...'
    : transcripcion;

  return (
    <DashCard accent="purple">
      <CardHeader icon={Cpu} label="Transcripción Original" accent="purple" />
      <div className="p-5">
        <pre className="text-xs text-gray-400 leading-relaxed font-mono whitespace-pre-wrap">
          {expanded ? transcripcion : preview}
        </pre>
        <div className="flex items-center gap-3 mt-4">
          {transcripcion.length > 600 && (
            <button
              onClick={() => setExpanded(p => !p)}
              className="text-[10px] font-bold text-purple-400 hover:text-purple-300 transition-colors"
            >
              {expanded ? '▲ Colapsar' : '▼ Ver completo'}
            </button>
          )}
          <button
            onClick={() => copy(transcripcion, 'transcripcion')}
            className="ml-auto flex items-center gap-1.5 bg-purple-600/15 hover:bg-purple-500/25
              border border-purple-500/25 text-purple-300 px-3 py-1.5 rounded-lg text-[10px] font-bold
              transition-all active:scale-95"
          >
            {copied === 'transcripcion' ? <CheckCircle2 size={11} /> : <Copy size={11} />}
            {copied === 'transcripcion' ? 'Copiado' : 'Copiar'}
          </button>
        </div>
      </div>
    </DashCard>
  );
};

// ==================================================================================
// 🏆 VISTA DE RESULTADOS — CEO DASHBOARD
// ==================================================================================

const SniperResultView = ({ result }: { result: any }) => {
  const transcripcionFiel  = result?.transcripcion_fiel          || '';
  const ideaGanadora       = result?.idea_ganadora               || '';
  const adnViral: string[] = Array.isArray(result?.adn_viral) ? result.adn_viral : [];
  const guion              = result?.guion_adaptado_teleprompter || '';
  const planAV             = result?.plan_audiovisual_pro        || null;
  const miniatura          = result?.miniatura_circular          || null;
  const scoreAdn           = result?.guion_generado?.score_adn   || result?.score_adn || null;
  const meta               = result?.metadata_video              || {};

  return (
    <div className="space-y-6">
      {/* Metadata badges */}
      {meta.platform && (
        <div className="flex flex-wrap gap-2 px-1">
          {[
            { label: meta.platform?.toUpperCase(),                            color: 'text-blue-400   bg-blue-500/10   border-blue-500/20'   },
            meta.duration_seconds > 0 && { label: `${Math.round(meta.duration_seconds)}s`, color: 'text-gray-400 bg-white/5 border-white/10' },
            meta.whisper_used         && { label: 'Whisper IA',               color: 'text-green-400  bg-green-500/10  border-green-500/20'  },
            meta.urls_analizadas > 1  && { label: `${meta.urls_analizadas} URLs`, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
          ].filter(Boolean).map((b: any, i: number) => (
            <span key={i} className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full border ${b.color}`}>
              {b.label}
            </span>
          ))}
        </div>
      )}
      <TeleprompterCard  guion={guion} />
      <PlanAudiovisualCard planAV={planAV} />
      <MiniaturaCard     miniatura={miniatura} />
      <AdnIdeaCard       adnViral={adnViral} ideaGanadora={ideaGanadora} scoreAdn={scoreAdn} />
      <TranscripcionCard transcripcion={transcripcionFiel} />
    </div>
  );
};

// ==================================================================================
// 🔵 INDICADOR DE PROGRESO
// ==================================================================================

const ProgressSteps = () => {
  const steps = ['Descargando video', 'Transcribiendo audio', 'Analizando ADN viral', 'Generando guion'];
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive(p => Math.min(p + 1, steps.length - 1)), 8000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="space-y-2 py-3">
      {steps.map((s, i) => (
        <div key={s} className={`flex items-center gap-3 text-xs transition-all ${i <= active ? 'text-white' : 'text-gray-600'}`}>
          <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
            i < active    ? 'bg-green-500 border-green-500 text-black'
            : i === active ? 'border-purple-500 bg-purple-500/20 text-purple-300'
            : 'border-gray-700 text-gray-700'
          }`}>
            {i < active ? <CheckCircle2 size={11} /> : <span className="text-[9px] font-black">{i + 1}</span>}
          </div>
          <span className={`font-bold ${i === active ? 'text-purple-300' : ''}`}>{s}</span>
          {i === active && <Loader2 size={12} className="animate-spin text-purple-400 ml-auto" />}
        </div>
      ))}
    </div>
  );
};

// ==================================================================================
// 🚀 COMPONENTE PRINCIPAL — declaración única, exportación nombrada al final
// ==================================================================================

function TitanViral() {
  const { user } = useAuth();

  // ── Input state ───────────────────────────────────────────────
  const [urls,             setUrls]             = useState<string[]>(['']);
  const [uploadMode,       setUploadMode]       = useState<UploadMode>('url');
  const [uploadedFile,     setUploadedFile]     = useState<{ base64: string; name: string } | null>(null);
  const [topic,            setTopic]            = useState('');
  const [contentType,      setContentType]      = useState<ContentType>('reel');
  const [platform,         setPlatform]         = useState('TikTok');
  const [selectedLanguage, setSelectedLanguage] = useState<OutputLanguage>('es');

  // ── Context selectors ─────────────────────────────────────────
  const [selectedAvatarId,        setSelectedAvatarId]        = useState('');
  const [selectedExpertId,        setSelectedExpertId]        = useState('');
  const [selectedKnowledgeBaseId, setSelectedKnowledgeBaseId] = useState('');

  // ── Context data fetched from Supabase ────────────────────────
  const [avatars,        setAvatars]        = useState<{ id: string; name: string }[]>([]);
  const [experts,        setExperts]        = useState<{ id: string; name: string }[]>([]);
  const [knowledgeBases, setKnowledgeBases] = useState<{ id: string; name: string }[]>([]);
  const [loadingContext, setLoadingContext] = useState(false);

  // ── Process state ─────────────────────────────────────────────
  const [state,        setState]        = useState<IRProState>({ etapa: 'idle', output: null, error: null });
  const [generationId, setGenerationId] = useState<string | null>(null);

  // ── Polling ───────────────────────────────────────────────────
  usePolling(
    generationId,
    (content) => setState({ etapa: 'completo', output: content, error: null }),
    (msg)     => setState(s => ({ ...s, etapa: 'idle', error: msg }))
  );

  // ── Fetch context data on mount ───────────────────────────────
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoadingContext(true);
      try {
        const [{ data: av }, { data: ex }, { data: kb }] = await Promise.all([
          supabase.from('avatars').select('id, name').eq('user_id', user.id).order('name'),
          supabase.from('expert_profiles').select('id, name').eq('user_id', user.id).order('name'),
          supabase.from('knowledge_bases').select('id, name').eq('user_id', user.id).order('name'),
        ]);
        setAvatars(av        ?? []);
        setExperts(ex        ?? []);
        setKnowledgeBases(kb ?? []);
      } catch (_) {
        // Non-fatal: dropdowns just remain empty
      } finally {
        setLoadingContext(false);
      }
    };
    load();
  }, [user]);

  // ── Computed ──────────────────────────────────────────────────
  const urlCount  = urls.filter(u => u.trim()).length || (uploadedFile ? 1 : 0);
  const totalCost = computeCost(contentType, urlCount);

  // ── File upload handler ───────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setUploadedFile({ base64: reader.result as string, name: file.name });
    reader.readAsDataURL(file);
  };

  // ── Submit ────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (state.etapa === 'analizando') return;
    setState({ etapa: 'analizando', output: null, error: null });
    setGenerationId(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Sesión expirada. Vuelve a iniciar sesión.');

      const activeUrls = urls.filter(u => u.trim());

      // Settings compartidos entre ambos paths de envío
      const settingsPayload = {
        contentType,
        platform,
        outputLanguage: selectedLanguage,         // ← variable, nunca hardcodeado
      };

      let bodyData: FormData | string;
      const headers: Record<string, string> = {
        Authorization: `Bearer ${session.access_token}`,
      };

      if (uploadedFile) {
        // ── Path FormData (video subido) ──────────────────────
        const fd = new FormData();
        fd.append('selectedMode',    'recreate');
        fd.append('text',            topic);
        fd.append('uploadedVideo',   uploadedFile.base64);
        fd.append('uploadedFileName',uploadedFile.name);
        fd.append('settings',        JSON.stringify(settingsPayload));
        fd.append('estimatedCost',   String(totalCost));
        // Context IDs — solo si tienen valor
        if (selectedAvatarId)        fd.append('avatarId',        selectedAvatarId);
        if (selectedExpertId)        fd.append('expertId',        selectedExpertId);
        if (selectedKnowledgeBaseId) fd.append('knowledgeBaseId', selectedKnowledgeBaseId);
        bodyData = fd;

      } else {
        // ── Path JSON (URL) ───────────────────────────────────
        headers['Content-Type'] = 'application/json';
        bodyData = JSON.stringify({
          selectedMode:    'recreate',
          urls:            activeUrls,
          url:             activeUrls[0]                  || null,
          text:            topic,
          platform,
          estimatedCost:   totalCost,
          avatarId:        selectedAvatarId               || undefined,
          expertId:        selectedExpertId               || undefined,
          knowledgeBaseId: selectedKnowledgeBaseId        || undefined,
          settings:        settingsPayload,
        });
      }

      const res  = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/titan-engine`,
        { method: 'POST', headers, body: bodyData }
      );
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Error desconocido del servidor.');

      // Respuesta síncrona directa
      if (json.generatedData) {
        setState({ etapa: 'completo', output: json.generatedData, error: null });
        return;
      }
      // Modo asíncrono con polling
      if (json.generationId) {
        setGenerationId(json.generationId);
        return;
      }
      throw new Error('Respuesta inesperada del servidor.');

    } catch (err: any) {
      setState({ etapa: 'idle', output: null, error: err.message });
    }
  };

  const handleReset = () => {
    setState({ etapa: 'idle', output: null, error: null });
    setGenerationId(null);
  };

  // ── RENDER ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#050608] text-white px-4 py-8 max-w-4xl mx-auto">

      {/* ── HEADER ──────────────────────────────────────────── */}
      <div className="mb-8 flex items-center gap-3">
        <div className="p-2 bg-purple-500/15 rounded-xl border border-purple-500/25">
          <Crosshair size={18} className="text-purple-400" />
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-black tracking-tight">Ingeniería Inversa Viral</h1>
          <p className="text-[11px] text-gray-500">Clona el ADN de cualquier video y adáptalo a tu nicho</p>
        </div>
        {state.etapa === 'completo' && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 hover:text-white
              border border-white/10 hover:border-white/25 px-3 py-2 rounded-xl transition-all"
          >
            <RefreshCw size={12} /> Nuevo análisis
          </button>
        )}
      </div>

      {/* ── FORMULARIO ──────────────────────────────────────── */}
      {state.etapa !== 'completo' && (
        <div className="space-y-5 mb-8">

          {/* 1 ── Toggle URL / Archivo */}
          <div className="flex gap-2">
            {(['url', 'file'] as UploadMode[]).map(m => (
              <button
                key={m}
                onClick={() => setUploadMode(m)}
                className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl border transition-all
                  ${uploadMode === m
                    ? 'bg-purple-600/20 border-purple-500/50 text-purple-300'
                    : 'bg-[#0f1115] border-white/8 text-gray-500 hover:text-gray-300'}`}
              >
                {m === 'url'
                  ? <><LinkIcon size={12} className="inline mr-1.5" />URL</>
                  : <><Upload   size={12} className="inline mr-1.5" />Subir video</>}
              </button>
            ))}
          </div>

          {/* 2 ── Inputs URL */}
          {uploadMode === 'url' && (
            <div className="space-y-2">
              {urls.map((u, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={u}
                    onChange={e => setUrls(prev => { const n = [...prev]; n[i] = e.target.value; return n; })}
                    placeholder="https://tiktok.com/@...  ·  instagram.com/reel/...  ·  youtube.com/..."
                    className="flex-1 bg-[#0f1115] border border-white/10 rounded-xl px-4 py-3
                      text-xs text-white placeholder-gray-600
                      focus:outline-none focus:border-purple-500/50 transition-colors"
                  />
                  {urls.length > 1 && (
                    <button
                      onClick={() => setUrls(p => p.filter((_, j) => j !== i))}
                      className="p-3 text-gray-600 hover:text-red-400 border border-white/8
                        rounded-xl hover:border-red-500/30 transition-all"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
              {urls.length < 5 && (
                <button
                  onClick={() => setUrls(p => [...p, ''])}
                  className="text-[10px] font-bold text-gray-500 hover:text-purple-400
                    flex items-center gap-1.5 transition-colors"
                >
                  <Plus size={11} /> Agregar otra URL
                </button>
              )}
            </div>
          )}

          {/* 3 ── Subir video */}
          {uploadMode === 'file' && (
            !uploadedFile ? (
              <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed
                border-white/10 rounded-xl cursor-pointer
                hover:border-purple-500/40 hover:bg-purple-500/5 transition-all">
                <Upload size={20} className="text-gray-500 mb-2" />
                <p className="text-xs text-gray-500">MP4, MOV, AVI — máx. 100 MB</p>
                <input type="file" accept="video/*" className="hidden" onChange={handleFileChange} />
              </label>
            ) : (
              <div className="flex items-center gap-3 bg-[#0f1115] border border-green-500/25 rounded-xl px-4 py-3">
                <PlayCircle size={18} className="text-green-400" />
                <span className="text-xs text-gray-300 flex-1 truncate">{uploadedFile.name}</span>
                <button onClick={() => setUploadedFile(null)}
                  className="text-gray-500 hover:text-red-400 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            )
          )}

          {/* 4 ── NICHO / TEMA — campo grande y destacado */}
          <div>
            <label className="block text-[10px] font-black text-purple-400 uppercase tracking-widest mb-2
              flex items-center gap-1.5">
              <Target size={11} /> Tu Nicho / Tema Destino
              <span className="text-gray-600 font-normal normal-case tracking-normal ml-1">
                — dale dirección a la IA
              </span>
            </label>
            <div className="relative">
              <Search size={15}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              <input
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="Ej: finanzas personales, nutrición, mindset emprendedor, fitness..."
                className="w-full bg-[#0f1115] border-2 border-purple-500/30 rounded-xl
                  pl-10 pr-4 py-3.5 text-sm text-white placeholder-gray-600
                  focus:outline-none focus:border-purple-500/65 transition-colors"
              />
            </div>
          </div>

          {/* 5 ── Idioma de salida */}
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">
              Idioma de Salida
            </label>
            <div className="grid grid-cols-4 gap-2">
              {LANGUAGE_OPTIONS.map(lang => (
                <button
                  key={lang.value}
                  onClick={() => setSelectedLanguage(lang.value)}
                  className={`flex flex-col items-center gap-1.5 py-2.5 rounded-xl border text-xs font-bold
                    transition-all
                    ${selectedLanguage === lang.value
                      ? 'bg-purple-600/20 border-purple-500/50 text-purple-200'
                      : 'bg-[#0f1115] border-white/8 text-gray-500 hover:text-gray-300 hover:border-white/15'}`}
                >
                  <span className="text-xl leading-none">{lang.flag}</span>
                  <span className="text-[9px] font-black uppercase tracking-wider">{lang.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 6 ── Tipo de contenido + Plataforma */}
          <div className="grid grid-cols-2 gap-4">

            {/* Tipo */}
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2
                flex items-center gap-1">
                <Layers size={10} /> Tipo de Contenido
              </label>
              <div className="flex flex-col gap-1.5">
                {(Object.keys(CONTENT_CONFIGS) as ContentType[]).map(t => (
                  <button
                    key={t}
                    onClick={() => setContentType(t)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold
                      transition-all
                      ${contentType === t
                        ? 'bg-purple-600/15 border-purple-500/40 text-white'
                        : 'bg-[#0f1115] border-white/8 text-gray-500 hover:text-gray-300'}`}
                  >
                    <span>{CONTENT_CONFIGS[t].icon}</span> {CONTENT_CONFIGS[t].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Plataforma — con iconos */}
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2
                flex items-center gap-1">
                <Music size={10} /> Plataforma Destino
              </label>
              <div className="flex flex-col gap-1.5">
                {PLATFORM_OPTIONS.map(p => (
                  <button
                    key={p.value}
                    onClick={() => setPlatform(p.value)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold
                      transition-all
                      ${platform === p.value
                        ? 'bg-purple-600/15 border-purple-500/40 text-white'
                        : 'bg-[#0f1115] border-white/8 text-gray-500 hover:text-gray-300'}`}
                  >
                    <span className={platform === p.value ? 'text-purple-300' : 'text-gray-600'}>
                      {p.icon}
                    </span>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 7 ── Contexto Avanzado */}
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3
              flex items-center gap-1.5">
              <Brain size={10} /> Contexto Avanzado
              <span className="text-gray-700 font-normal normal-case tracking-normal ml-1">— opcional</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

              <StyledSelect
                value={selectedAvatarId}
                onChange={setSelectedAvatarId}
                icon={User}
                label="Avatar"
              >
                <option value="">Sin avatar</option>
                {avatars.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </StyledSelect>

              <StyledSelect
                value={selectedExpertId}
                onChange={setSelectedExpertId}
                icon={Crosshair}
                label="Perfil Experto"
              >
                <option value="">Sin experto</option>
                {experts.map(e => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </StyledSelect>

              <StyledSelect
                value={selectedKnowledgeBaseId}
                onChange={setSelectedKnowledgeBaseId}
                icon={BookOpen}
                label="Base de Conocimiento"
              >
                <option value="">Sin base</option>
                {knowledgeBases.map(kb => (
                  <option key={kb.id} value={kb.id}>{kb.name}</option>
                ))}
              </StyledSelect>

            </div>
            {loadingContext && (
              <p className="text-[10px] text-gray-600 mt-2 flex items-center gap-1.5">
                <Loader2 size={10} className="animate-spin" /> Cargando tus perfiles...
              </p>
            )}
          </div>

          {/* 8 ── Error display */}
          {state.error && (
            <div className="flex items-start gap-3 bg-red-500/8 border border-red-500/25 rounded-xl px-4 py-3">
              <AlertTriangle size={14} className="text-red-400 shrink-0 mt-0.5" />
              <p className="text-xs text-red-300 leading-relaxed">{state.error}</p>
            </div>
          )}

          {/* 9 ── CTA Button */}
          <button
            onClick={handleSubmit}
            disabled={state.etapa === 'analizando'}
            className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-wider transition-all
              flex items-center justify-center gap-2.5
              ${state.etapa === 'analizando'
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : `bg-gradient-to-r from-purple-700 to-violet-600
                   hover:from-purple-600 hover:to-violet-500 text-white
                   shadow-[0_0_30px_-8px_rgba(168,85,247,0.5)]
                   hover:shadow-[0_0_40px_-8px_rgba(168,85,247,0.7)]
                   active:scale-[0.98]`}`}
          >
            {state.etapa === 'analizando' ? (
              <><Loader2 size={17} className="animate-spin" /> Analizando...</>
            ) : (
              <><Crosshair size={17} /> Clonar ADN Viral · {totalCost} CR</>
            )}
          </button>

          {/* 10 ── Progress steps */}
          {state.etapa === 'analizando' && <ProgressSteps />}

        </div>
      )}

      {/* ── RESULTADOS ────────────────────────────────────────── */}
      {state.etapa === 'completo' && state.output && (
        <SniperResultView result={state.output} />
      )}

    </div>
  );
}

// ==================================================================================
// EXPORTACIÓN NOMBRADA — compatible con React Router (sin export default)
// ==================================================================================

export { TitanViral };