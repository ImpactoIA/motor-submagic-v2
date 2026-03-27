import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import {
  Zap, Search, Copy, CheckCircle2, AlertTriangle,
  Loader2, Target, Brain, Film, Flame,
  Clapperboard, Sparkles, MoveRight, Upload,
  Trash2, Link as LinkIcon, Plus, X,
  Clock, Layers, TrendingUp, Eye, Share2,
  Gavel, AlertCircle, RefreshCw, ChevronDown,
  PlayCircle, BarChart3, Cpu, Wand2
} from 'lucide-react';

// ==================================================================================
// 🧠 INTERFACES
// ==================================================================================

interface IRProState {
  etapa: "idle" | "analizando" | "refinando" | "generando" | "auditando" | "completo";
  iteracion: number;
  scoreActual: number;
  output: any | null;
  guionGenerado: string | null;
  veredictoJuez: any | null;
  error: string | null;
}

type ContentType = 'reel' | 'long' | 'masterclass';
type UploadMode  = 'url' | 'file';

interface CreditConfig {
  label: string;
  icon: string;
  costs: { single: number; multi23: number; multi45: number };
}

const CONTENT_CONFIGS: Record<ContentType, CreditConfig> = {
  reel:        { label: 'Reel / Short',  icon: '🎥', costs: { single: 20, multi23: 35, multi45: 50 } },
  long:        { label: 'Video Largo',   icon: '🎬', costs: { single: 55, multi23: 80, multi45: 105 } },
  masterclass: { label: 'Masterclass',   icon: '🎓', costs: { single: 75, multi23: 105, multi45: 135 } },
};

function computeCost(type: ContentType, urlCount: number): number {
  const cfg = CONTENT_CONFIGS[type].costs;
  if (urlCount <= 1) return cfg.single;
  if (urlCount <= 3) return cfg.multi23;
  return cfg.multi45;
}

// ==================================================================================
// 🎬 COMPONENTE: GUION + PLAN AUDIOVISUAL (lo más importante)
// ==================================================================================

// ==================================================================================
// ⚡ SNIPER RESULT VIEW
// ==================================================================================

// ── Score ADN Card (reemplaza IRProScoreCard con datos reales) ────
const ScoreAdnCard = ({ scoreAdn }: { scoreAdn: any }) => {
  if (!scoreAdn) return null;
  const global = scoreAdn.global || 0;
  const label  = global >= 85 ? '🔥 VIRAL POTENCIAL'
               : global >= 70 ? '⚡ ALTA VIRALIDAD'
               : global >= 50 ? '📈 EN DESARROLLO'
               : '⚠ NECESITA MEJORAS';
  const color  = global >= 85 ? 'text-green-400' : global >= 70 ? 'text-purple-400' : global >= 50 ? 'text-yellow-400' : 'text-red-400';
  const radius = 46;
  const circ   = 2 * Math.PI * radius;
  const prog   = (global / 100) * circ;
  const strokeColor = global >= 85 ? '#22c55e' : global >= 70 ? '#a855f7' : global >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className="bg-[#0f1115] border border-purple-500/30 rounded-2xl p-6 h-full flex flex-col shadow-[0_0_30px_-10px_rgba(168,85,247,0.2)]">
      <h3 className="text-purple-400 text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
        <Zap size={12} fill="currentColor" /> Score ADN Viral
      </h3>
      <div className="flex items-center gap-5 mb-5">
        <div className="relative flex items-center justify-center" style={{ width: 110, height: 110 }}>
          <svg width={110} height={110} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={55} cy={55} r={radius} fill="none" stroke="#1a1a2e" strokeWidth={8} />
            <circle cx={55} cy={55} r={radius} fill="none" stroke={strokeColor} strokeWidth={8}
              strokeDasharray={`${circ}`} strokeDashoffset={circ - prog} strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)', filter: `drop-shadow(0 0 8px ${strokeColor}60)` }} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-white leading-none">{global}</span>
            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">/100</span>
          </div>
        </div>
        <div>
          <p className={`text-xs font-black mb-1 ${color}`}>{label}</p>
          {scoreAdn.diagnostico && (
            <p className="text-[10px] text-gray-500 leading-relaxed">{scoreAdn.diagnostico}</p>
          )}
        </div>
      </div>
      <div className="space-y-2 flex-1">
        {[
          { label: 'Retención',    val: scoreAdn.retencion    || 0, color: 'bg-blue-500',   peso: '25%' },
          { label: 'Emoción',      val: scoreAdn.emocion      || 0, color: 'bg-pink-500',   peso: '20%' },
          { label: 'Atención',     val: scoreAdn.atencion     || 0, color: 'bg-purple-500', peso: '20%' },
          { label: 'Valor',        val: scoreAdn.valor        || 0, color: 'bg-green-500',  peso: '15%' },
          { label: 'Polarización', val: scoreAdn.polarizacion || 0, color: 'bg-orange-500', peso: '10%' },
        ].map(item => (
          <div key={item.label} className="space-y-1">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tighter">
              <span className="text-gray-500 flex items-center gap-1.5">
                {item.label}
                <span className="text-gray-700 font-normal normal-case tracking-normal text-[9px]">({item.peso})</span>
              </span>
              <span className={`font-black ${item.val >= 80 ? 'text-green-400' : item.val >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                {item.val}<span className="text-gray-600 font-normal">%</span>
              </span>
            </div>
            <div className="h-2 bg-gray-800/80 rounded-full overflow-hidden">
              <div style={{ width: `${item.val}%`, transition: 'width 1.4s cubic-bezier(0.4,0,0.2,1)' }}
                className={`h-full ${item.color} rounded-full`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Plan Audiovisual Tabla por Escenas ────────────────────────────
const PlanAudiovisualTabla = ({ planAV }: { planAV: any }) => {
  const [escenaActiva, setEscenaActiva] = useState<number>(0);
  const [copiedPrompt, setCopiedPrompt] = useState<number | null>(null);

  const escenas = Array.isArray(planAV?.escenas) ? planAV.escenas : [];
  const ritmo   = planAV?.ritmo_de_cortes || '';
  const musica  = planAV?.musica_completa || {};

  if (escenas.length === 0) return null;

  const tipoColors: Record<string, string> = {
    HOOK:            'bg-green-500/20 text-green-400 border-green-500/30',
    DESARROLLO_1:    'bg-blue-500/20 text-blue-400 border-blue-500/30',
    DESARROLLO_2:    'bg-orange-500/20 text-orange-400 border-orange-500/30',
    CIERRE_CIRCULAR: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  };

  const copyPrompt = (prompt: string, idx: number) => {
    if (!prompt) return;
    navigator?.clipboard?.writeText(prompt).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = prompt;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    });
    setCopiedPrompt(idx);
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  const escena = escenas[escenaActiva];

  return (
    <div className="bg-[#080808] border border-blue-500/20 rounded-2xl overflow-hidden shadow-[0_0_40px_-15px_rgba(59,130,246,0.15)]">
      {/* Header */}
      <div className="bg-blue-900/10 border-b border-blue-500/20 p-5 flex items-center gap-3">
        <Film size={18} className="text-blue-400" />
        <div>
          <h3 className="text-white font-black text-sm tracking-tight">Plan Audiovisual Pro</h3>
          <p className="text-[10px] text-gray-500 mt-0.5">Asesoría completa escena por escena · Prompts listos para IA</p>
        </div>
      </div>

      {/* Tabs de escenas */}
      <div className="flex border-b border-white/5 overflow-x-auto">
        {escenas.map((e: any, i: number) => (
          <button key={i} onClick={() => setEscenaActiva(i)}
            className={`flex-1 min-w-[100px] px-4 py-3 text-[10px] font-black uppercase tracking-wider transition-all border-b-2 ${
              escenaActiva === i
                ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                : 'border-transparent text-gray-600 hover:text-gray-400 hover:bg-white/3'
            }`}>
            <span className="block text-[9px] text-gray-600 font-normal mb-0.5">{e.momento}</span>
            {e.tipo?.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Contenido de la escena activa */}
      {escena && (
        <div className="p-5 space-y-4">

          {/* Badge tipo + momento */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${tipoColors[escena.tipo] || 'bg-white/5 text-gray-400 border-white/10'}`}>
              {escena.tipo?.replace(/_/g, ' ')}
            </span>
            <span className="text-[10px] text-gray-600 font-bold">⏱ {escena.momento}</span>
          </div>

          {/* Tabla principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

            {/* Descripción escena */}
            <div className="bg-[#0f1115] rounded-xl p-4 border border-white/5">
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">🎬 Descripción de Escena</p>
              <p className="text-xs text-gray-200 leading-relaxed">{escena.descripcion_escena || '—'}</p>
            </div>

            {/* Cámara */}
            <div className="bg-[#0f1115] rounded-xl p-4 border border-white/5">
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">📷 Cámara</p>
              <p className="text-xs text-cyan-300 font-bold mb-1">{escena.angulo_camara || '—'}</p>
              <p className="text-[10px] text-gray-400">{escena.movimiento || '—'}</p>
            </div>

            {/* Caption */}
            <div className="bg-[#0f1115] rounded-xl p-4 border border-yellow-500/10">
              <p className="text-[9px] font-black text-yellow-500 uppercase tracking-widest mb-2">✍️ Caption en Pantalla</p>
              <p className="text-sm font-black text-yellow-200 tracking-tight">{escena.caption || '—'}</p>
            </div>

            {/* SFX / Música */}
            <div className="bg-[#0f1115] rounded-xl p-4 border border-green-500/10">
              <p className="text-[9px] font-black text-green-500 uppercase tracking-widest mb-2">🎵 Sonido / Música</p>
              <p className="text-xs text-green-200 leading-relaxed">{escena.sfx || '—'}</p>
            </div>

            {/* Por qué retiene */}
            <div className="md:col-span-2 bg-purple-500/5 rounded-xl p-4 border border-purple-500/15">
              <p className="text-[9px] font-black text-purple-400 uppercase tracking-widest mb-2">🧠 Por qué retiene al espectador</p>
              <p className="text-xs text-gray-300 leading-relaxed">{escena.por_que_retiene || '—'}</p>
            </div>

            {/* Prompt B-Roll */}
            {escena.prompt_broll && (
              <div className="md:col-span-2 bg-[#0a0f1a] rounded-xl p-4 border border-blue-500/20">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">
                    🤖 Prompt B-Roll — Copia en Midjourney / Runway / Sora
                  </p>
                  <button onClick={() => copyPrompt(escena.prompt_broll, escenaActiva)}
                    className="flex items-center gap-1.5 text-[9px] font-black px-2.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 transition-all active:scale-95">
                    {copiedPrompt === escenaActiva ? <CheckCircle2 size={11} /> : <Copy size={11} />}
                    {copiedPrompt === escenaActiva ? 'COPIADO' : 'COPIAR'}
                  </button>
                </div>
                <p className="text-[11px] text-blue-100 font-mono leading-relaxed bg-black/30 rounded-lg p-3 border border-blue-500/10">
                  {escena.prompt_broll}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer: Ritmo de cortes + Música */}
      <div className="border-t border-white/5 p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {ritmo && (
          <div className="bg-[#0f1115] rounded-xl p-4 border border-white/5">
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">✂️ Ritmo de Cortes</p>
            <p className="text-xs text-gray-300 leading-relaxed">{ritmo}</p>
          </div>
        )}
        {musica.genero && (
          <div className="bg-[#0f1115] rounded-xl p-4 border border-green-500/10">
            <p className="text-[9px] font-black text-green-500 uppercase tracking-widest mb-2">🎶 Música Completa</p>
            <div className="space-y-1">
              <p className="text-xs text-green-200 font-bold">{musica.genero} · {musica.bpm} BPM</p>
              {musica.referencia && <p className="text-[10px] text-gray-400">Ref: {musica.referencia}</p>}
              {musica.cuando_entra && <p className="text-[10px] text-gray-500">Entra: {musica.cuando_entra}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SniperResultView = ({ result, contentType = 'reel' }: { result: any; contentType?: string }) => {
  const [copiedGuion, setCopiedGuion] = useState(false);
  const [copiedMini,  setCopiedMini]  = useState(false);

  const guion      = result.guion_adaptado_teleprompter || result.guion_teleprompter || result.guion_adaptado_espejo || '';
  const planAV     = result.plan_audiovisual_pro || result.plan_audiovisual || {};
  const adnViral   = Array.isArray(result.adn_viral) ? result.adn_viral : [];
  const idea       = result.idea_ganadora || '';
  const fraseMini  = result.miniatura_circular?.frase_principal || result.frase_miniatura || '';
  const transcFiel = result.transcripcion_fiel || '';
  const scoreAdn   = result.score_adn || null;
  const varianteB  = result.miniatura_circular?.variante_b || '';

  const words    = guion.trim().split(/\s+/).filter(Boolean).length;
  const minWords = contentType === 'masterclass' ? 400 : contentType === 'long' ? 250 : 150;
  const wordsBadge = words >= minWords
    ? { cls: 'bg-green-500/20 text-green-400 border-green-500/30', label: `${words} palabras ✓` }
    : { cls: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', label: `${words} palabras ⚠` };

  const copy = (text: string, setter: (v: boolean) => void) => {
    if (!text) return;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  return (
    <div className="space-y-4">

      {/* ── BLOQUE 0: TRANSCRIPCIÓN FIEL ── */}
      {transcFiel && (
        <details className="bg-[#080b10] border border-white/10 rounded-2xl overflow-hidden">
          <summary className="p-4 cursor-pointer flex items-center justify-between hover:bg-white/3 transition-colors select-none">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <span>📝</span> Transcripción Fiel del Video Original
              <span className="text-[9px] font-normal text-gray-600 normal-case tracking-normal">(click para expandir)</span>
            </span>
            <ChevronDown size={14} className="text-gray-600" />
          </summary>
          <div className="px-5 pb-5 border-t border-white/5">
            <p className="text-xs text-gray-400 leading-relaxed whitespace-pre-line font-mono mt-4 max-h-52 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800">
              {transcFiel}
            </p>
          </div>
        </details>
      )}

      {/* ── BLOQUE 1: IDEA GANADORA + ADN VIRAL ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Idea Ganadora */}
        <div className="bg-[#080b10] border border-yellow-500/20 rounded-2xl p-5 shadow-[0_0_40px_-15px_rgba(234,179,8,0.15)]">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-black text-yellow-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles size={12} /> Idea Ganadora
            </span>
          </div>
          <p className="text-sm text-gray-200 leading-relaxed">{idea || 'No disponible'}</p>
        </div>

        {/* ADN Viral */}
        <div className="bg-[#080b10] border border-purple-500/20 rounded-2xl p-5 shadow-[0_0_40px_-15px_rgba(168,85,247,0.15)]">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-black text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
              <Brain size={12} /> ADN Viral — 3 Elementos
            </span>
          </div>
          <div className="space-y-2">
            {adnViral.length > 0 ? adnViral.map((el: string, i: number) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="shrink-0 w-5 h-5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-400 text-[10px] font-black flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <p className="text-xs text-gray-300 leading-relaxed">{el}</p>
              </div>
            )) : (
              <p className="text-xs text-gray-500">No disponible</p>
            )}
          </div>
        </div>
      </div>

      {/* ── BLOQUE 2: FRASE MINIATURA ── */}
      {fraseMini && (
        <div className="bg-[#080b10] border border-orange-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_0_40px_-15px_rgba(249,115,22,0.2)]">
          <div className="flex-1">
            <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Eye size={11} /> Frase para Miniatura
            </p>
            <p className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              {fraseMini}
            </p>
            {varianteB && (
              <p className="text-[10px] text-gray-500 mt-1.5">
                Variante B: <span className="text-gray-400 italic">"{varianteB}"</span>
              </p>
            )}
            <p className="text-[10px] text-gray-600 mt-1">Teoría Circular aplicada · Alto impacto visual</p>
          </div>
          <button
            onClick={() => copy(fraseMini, setCopiedMini)}
            className="shrink-0 flex items-center gap-2 bg-orange-600/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-300 px-3 py-2 rounded-lg text-xs font-bold transition-all active:scale-95"
          >
            {copiedMini ? <CheckCircle2 size={14} /> : <Copy size={14} />}
            {copiedMini ? 'Copiado' : 'Copiar'}
          </button>
        </div>
      )}

      {/* ── BLOQUE 3: GUION TELEPROMPTER ── */}
      <div className="bg-[#080808] border border-green-500/30 rounded-2xl overflow-hidden shadow-[0_0_50px_-20px_rgba(34,197,94,0.15)]">
        <div className="bg-green-900/10 border-b border-green-500/20 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-green-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">READY TO SHOOT</span>
              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider border ${wordsBadge.cls}`}>
                {wordsBadge.label}
              </span>
            </div>
            <h3 className="text-lg font-black text-white flex items-center gap-2 tracking-tight">
              <Clapperboard className="text-green-400" size={20} /> Guion Teleprompter
            </h3>
          </div>
          <button
            onClick={() => copy(guion, setCopiedGuion)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-black px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-lg active:scale-95 w-full sm:w-auto justify-center"
          >
            {copiedGuion ? <CheckCircle2 size={16} /> : <Copy size={16} />}
            {copiedGuion ? 'COPIADO' : 'COPIAR TELEPROMPTER'}
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[500px]">
          {guion ? (
            <p className="text-sm text-gray-100 leading-[1.9] whitespace-pre-line font-mono">{guion}</p>
          ) : (
            <p className="text-sm text-gray-500 italic">Guion no disponible.</p>
          )}
        </div>
      </div>

      {/* ── BLOQUE 4: SCORE ADN (datos reales) ── */}
      {scoreAdn && <ScoreAdnCard scoreAdn={scoreAdn} />}

      {/* ── BLOQUE 5: PLAN AUDIOVISUAL PRO (tabla por escenas) ── */}
      <PlanAudiovisualTabla planAV={planAV} />

    </div>
  );
};

// ==================================================================================
// 🧬 ADN PROFUNDO — Género, Emoción, Frame dominante
// ==================================================================================

const AdnProfundoCard = ({ data }: { data: any }) => {
  if (!data) return null;
  const generoColors: Record<string, string> = {
    'Confesional':          'text-pink-400 bg-pink-500/10 border-pink-500/20',
    'Drama real':           'text-red-400 bg-red-500/10 border-red-500/20',
    'Historia de poder':    'text-amber-400 bg-amber-500/10 border-amber-500/20',
    'Denuncia':             'text-orange-400 bg-orange-500/10 border-orange-500/20',
    'Opinión polarizante':  'text-purple-400 bg-purple-500/10 border-purple-500/20',
    'Autoridad estratégica':'text-blue-400 bg-blue-500/10 border-blue-500/20',
    'Revelación':           'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    'Educativo':            'text-green-400 bg-green-500/10 border-green-500/20',
    'Historia de fracaso':  'text-gray-400 bg-gray-500/10 border-gray-500/20',
  };
  const genero = data.genero_narrativo || 'No detectado';
  const badgeColor = generoColors[genero] || 'text-gray-400 bg-gray-500/10 border-gray-500/20';

  return (
    <div className="bg-[#0f1115] border border-red-500/30 rounded-2xl p-6">
      <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
        <Flame size={12} /> ADN Viral Profundo
      </h4>
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`text-xs font-black uppercase px-3 py-1.5 rounded-full border ${badgeColor}`}>{genero}</span>
        {data.emocion_nucleo && (
          <span className="text-xs font-black uppercase px-3 py-1.5 rounded-full border text-rose-400 bg-rose-500/10 border-rose-500/20">{data.emocion_nucleo}</span>
        )}
        {data.tipo_tension && (
          <span className="text-xs font-black uppercase px-3 py-1.5 rounded-full border text-yellow-400 bg-yellow-500/10 border-yellow-500/20">Tensión {data.tipo_tension}</span>
        )}
      </div>
      {data.frame_dominante && (
        <div className="space-y-2 mb-4">
          <div className="bg-[#080808] rounded-xl p-3 border border-red-500/10">
            <p className="text-[9px] text-gray-600 uppercase tracking-widest mb-1">Creencia que ataca</p>
            <p className="text-xs text-red-300 font-bold">{data.frame_dominante.creencia_que_ataca}</p>
          </div>
          <div className="bg-[#080808] rounded-xl p-3 border border-green-500/10">
            <p className="text-[9px] text-gray-600 uppercase tracking-widest mb-1">Nuevo marco propuesto</p>
            <p className="text-xs text-green-300 font-bold">{data.frame_dominante.nuevo_marco}</p>
          </div>
          {data.frame_dominante.frase_nucleo && (
            <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 rounded-xl p-3 border border-orange-500/20">
              <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Frase núcleo del frame</p>
              <p className="text-sm text-white font-black italic">"{data.frame_dominante.frase_nucleo}"</p>
            </div>
          )}
        </div>
      )}
      {data.polarizacion_implicita && (
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#080808] rounded-lg px-3 py-2 border border-white/5">
            <p className="text-[9px] text-green-500 uppercase tracking-widest mb-1">✓ De acuerdo</p>
            <p className="text-[10px] text-gray-300">{data.polarizacion_implicita.bando_A}</p>
          </div>
          <div className="bg-[#080808] rounded-lg px-3 py-2 border border-white/5">
            <p className="text-[9px] text-red-500 uppercase tracking-widest mb-1">✗ En contra</p>
            <p className="text-[10px] text-gray-300">{data.polarizacion_implicita.bando_B}</p>
          </div>
          {data.polarizacion_implicita.tension_irresuelta && (
            <div className="col-span-2 bg-[#080808] rounded-lg px-3 py-2 border border-purple-500/10">
              <p className="text-[9px] text-purple-400 uppercase tracking-widest mb-1">Tensión sin resolver</p>
              <p className="text-[10px] text-gray-300 italic">{data.polarizacion_implicita.tension_irresuelta}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ==================================================================================
// ⚡ IDEA NUCLEAR GANADORA
// ==================================================================================

const IdeaNuclearCard = ({ data }: { data: any }) => {
  if (!data) return null;
  return (
    <div className="bg-[#0f1115] border border-amber-500/30 rounded-2xl p-6">
      <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
        <Zap size={12} fill="currentColor" className="text-amber-400" /> Idea Nuclear Ganadora
      </h4>

      {/* Motor viral — campo más importante */}
      {data.que_hace_viral && (
        <div className="bg-gradient-to-r from-amber-900/20 to-orange-900/10 rounded-xl p-4 border border-amber-500/25 mb-3">
          <p className="text-[8px] text-amber-500 uppercase tracking-widest mb-1 font-black">⚡ Motor viral — por qué explota</p>
          <p className="text-sm text-amber-200 font-black leading-relaxed">{data.que_hace_viral}</p>
        </div>
      )}

      <div className="space-y-2.5">
        {data.creencia_rota && (
          <div className="bg-[#080808] rounded-xl p-3 border border-red-500/15">
            <p className="text-[8px] text-red-400 uppercase tracking-widest mb-1 font-black">💥 Creencia que destruye</p>
            <p className="text-xs text-red-200 font-bold leading-relaxed">{data.creencia_rota}</p>
          </div>
        )}
        {data.postura_impuesta && (
          <div className="bg-[#080808] rounded-xl p-3 border border-blue-500/15">
            <p className="text-[8px] text-blue-400 uppercase tracking-widest mb-1 font-black">🧠 Postura que instala en la mente</p>
            <p className="text-xs text-blue-200 font-bold leading-relaxed">{data.postura_impuesta}</p>
          </div>
        )}
        {data.por_que_genera_conversacion && (
          <div className="bg-[#080808] rounded-xl p-3 border border-purple-500/15">
            <p className="text-[8px] text-purple-400 uppercase tracking-widest mb-1 font-black">💬 Por qué genera conversación</p>
            <p className="text-xs text-purple-200 font-bold leading-relaxed">{data.por_que_genera_conversacion}</p>
          </div>
        )}
        {data.tension_no_resuelta && (
          <div className="bg-[#080808] rounded-xl p-3 border border-orange-500/15">
            <p className="text-[8px] text-orange-400 uppercase tracking-widest mb-1 font-black">🎣 Tensión que deja abierta</p>
            <p className="text-xs text-orange-200 font-bold leading-relaxed">{data.tension_no_resuelta}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ==================================================================================
// 👑 CÓMO SUPERAR AL ORIGINAL
// ==================================================================================

const SistemaSuperioridadCard = ({ data }: { data: any }) => {
  if (!data) return null;
  return (
    <div className="bg-[#0f1115] border border-emerald-500/30 rounded-2xl p-6">
      <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
        <MoveRight size={12} className="text-emerald-400" /> Cómo Superar al Original
      </h4>
      <div className="space-y-2">
        {[
          { label: 'Mayor claridad',           val: data.mayor_claridad,           icon: '🎯' },
          { label: 'Mayor intensidad',         val: data.mayor_intensidad,         icon: '⚡' },
          { label: 'Mayor polarización',       val: data.mayor_polarizacion,       icon: '🔥' },
          { label: 'Mejor estructura emocional',val: data.mejor_estructura_emocional, icon: '📈' },
          { label: 'Mejor cierre',             val: data.mejor_cierre,             icon: '🏁' },
          { label: 'Ventaja de nicho',         val: data.ventaja_de_nicho,         icon: '👑' },
        ].map(item => item.val ? (
          <div key={item.label} className="flex items-start gap-3 bg-[#080808] rounded-xl p-3 border border-white/5">
            <span className="text-base mt-0.5">{item.icon}</span>
            <div>
              <p className="text-[9px] text-gray-600 uppercase tracking-widest">{item.label}</p>
              <p className="text-xs text-emerald-300 font-bold mt-0.5 leading-relaxed">{item.val}</p>
            </div>
          </div>
        ) : null)}
      </div>
    </div>
  );
};

// ==================================================================================
// 🎯 POSICIONAMIENTO + PRÓXIMOS CONTENIDOS
// ==================================================================================

const PosicionamientoCard = ({ data }: { data: any }) => {
  if (!data) return null;
  const posColorMap: Record<string, string> = {
    'Mentor firme':        'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
    'Líder estratégico':   'text-blue-400 bg-blue-500/10 border-blue-500/30',
    'Autoridad ética':     'text-purple-400 bg-purple-500/10 border-purple-500/30',
    'Visionario':          'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    'Analista frío':       'text-gray-400 bg-gray-500/10 border-gray-500/30',
    'Testigo honesto':     'text-green-400 bg-green-500/10 border-green-500/30',
  };
  const pos = data.posiciona_como || '';
  const badgeColor = posColorMap[pos] || 'text-white bg-white/5 border-white/10';

  return (
    <div className="bg-[#0f1115] border border-blue-500/30 rounded-2xl p-6">
      <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
        <Target size={12} /> Posicionamiento + Próximos Pasos
      </h4>
      <div className="flex items-center gap-3 mb-4">
        <span className={`text-sm font-black uppercase px-4 py-2 rounded-xl border ${badgeColor}`}>{pos || 'Detectando...'}</span>
      </div>
      {data.razon_posicionamiento && (
        <p className="text-xs text-gray-400 leading-relaxed mb-5 bg-[#080808] rounded-xl p-3 border border-white/5">{data.razon_posicionamiento}</p>
      )}
      {data.proximos_contenidos?.length > 0 && (
        <div>
          <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3">3 Próximos Contenidos Estratégicos</p>
          <div className="space-y-3">
            {data.proximos_contenidos.map((c: any, i: number) => (
              <div key={i} className="bg-[#080808] rounded-xl p-3 border border-white/5 hover:border-blue-500/20 transition-colors">
                <div className="flex items-start gap-2">
                  <span className="text-blue-400 font-black text-xs shrink-0 mt-0.5">{i + 1}.</span>
                  <div className="flex-1">
                    <p className="text-xs text-white font-black leading-tight mb-1">"{c.titulo}"</p>
                    <div className="flex gap-2 flex-wrap mt-1">
                      {c.genero && <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">{c.genero}</span>}
                      {c.tension && <span className="text-[9px] px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 font-bold">Tensión {c.tension}</span>}
                    </div>
                    {c.por_que_ahora && <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">{c.por_que_ahora}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ==================================================================================
// 🎯 TCA — NIVEL DE MASIVIDAD
// ==================================================================================

const TcaCard = ({ tca, mapa, nicho }: { tca: any; mapa: any; nicho?: string }) => {
  if (!tca) return null;
  const nivelColors: Record<string, string> = {
    N0: 'text-gray-400 border-gray-700',
    N1: 'text-blue-400 border-blue-500/30',
    N2: 'text-cyan-400 border-cyan-500/30',
    N3: 'text-green-400 border-green-500/30',
    N4: 'text-red-400 border-red-500/30',
  };
  const nivelLabels: Record<string, string> = {
    N0: 'Micronicho técnico', N1: 'Nicho general', N2: 'Temática amplia',
    N3: 'Sector masivo', N4: 'Mainstream sin filtro',
  };
  const nivel = tca.nivel_tca_detectado || 'N1';
  const colorClass = nivelColors[nivel] || nivelColors.N1;

  return (
    <div className={`bg-[#0f1115] border rounded-2xl p-6 ${colorClass.split(' ')[1]}`}>
      <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-5 flex items-center gap-2">
        <Target size={12} /> Análisis TCA — Nivel de Masividad
      </h4>
      <div className="flex items-center gap-4 mb-5">
        <div className={`text-5xl font-black ${colorClass.split(' ')[0]}`}>{nivel}</div>
        <div className="flex-1">
          <p className={`text-sm font-black ${colorClass.split(' ')[0]}`}>{nivelLabels[nivel]}</p>
          <p className="text-[10px] text-gray-500 mt-1">{tca.sector_detectado} — {tca.tipo_alcance}</p>
          <div className="mt-2 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div style={{ width: `${tca.mass_appeal_score}%` }} className="h-full bg-gradient-to-r from-cyan-600 to-green-400 transition-all duration-1000" />
          </div>
          <p className="text-[9px] text-gray-600 mt-1">Mass Appeal: {tca.mass_appeal_score}/100</p>
        </div>
      </div>
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-4 text-xs font-bold ${tca.equilibrio_masividad_calificacion ? 'bg-green-500/10 text-green-300 border border-green-500/20' : 'bg-orange-500/10 text-orange-300 border border-orange-500/20'}`}>
        <span>{tca.equilibrio_masividad_calificacion ? '✓' : '⚠'}</span>
        {tca.diagnostico_tca}
      </div>
      <div className="space-y-2 mb-4">
        {[
          { label: 'Capa visible',      val: tca.capa_visible,              color: 'text-cyan-400'   },
          { label: 'Capa estratégica',  val: tca.capa_estrategica,          color: 'text-purple-400' },
          { label: 'Filtro implícito',  val: tca.filtro_audiencia_implicito, color: 'text-yellow-400' },
          { label: 'Tráfico que atrae', val: tca.tipo_trafico_que_atrae,    color: 'text-gray-300'   },
        ].map(item => (
          <div key={item.label} className="bg-[#080808] rounded-lg px-3 py-2 border border-white/5">
            <p className="text-[9px] text-gray-600 uppercase tracking-widest">{item.label}</p>
            <p className={`text-xs font-bold mt-0.5 ${item.color}`}>{item.val || '—'}</p>
          </div>
        ))}
      </div>
      {mapa && (
        <div className="border-t border-white/5 pt-4">
          <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3">Mapa de Expansión → {nicho || 'Tu Nicho'}</p>
          <div className="space-y-2">
            <div className="bg-[#080808] rounded-lg px-3 py-2 border border-white/5">
              <p className="text-[9px] text-gray-600 uppercase">Nuevo hook sectorial</p>
              <p className="text-xs font-bold text-white mt-0.5 italic">"{mapa.nuevo_hook_sectorial}"</p>
            </div>
            {mapa.version_equilibrio_ideal && (
              <div className="bg-[#080808] rounded-lg px-3 py-2 border border-green-500/10">
                <p className="text-[9px] text-gray-600 uppercase">Versión equilibrio ideal (N2-N3)</p>
                <p className="text-[10px] text-gray-300 mt-0.5">{mapa.version_equilibrio_ideal}</p>
              </div>
            )}
            {mapa.advertencia_micronicho && (
              <div className="px-3 py-2 bg-orange-500/10 border border-orange-500/20 rounded-lg text-[10px] text-orange-300">⚠ {mapa.advertencia_micronicho}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ==================================================================================
// ✨ ACTIVADORES DE GUARDADO
// ==================================================================================

const ActivadoresCard = ({ data }: { data: any[] }) => {
  if (!data || data.length === 0) return null;
  const colorTipo: Record<string, string> = {
    frase_memorable:       'text-purple-400 bg-purple-500/10 border-purple-500/20',
    reencuadre:            'text-blue-400 bg-blue-500/10 border-blue-500/20',
    dato_contraintuitivo:  'text-orange-400 bg-orange-500/10 border-orange-500/20',
    formula_repetible:     'text-green-400 bg-green-500/10 border-green-500/20',
    revelacion:            'text-pink-400 bg-pink-500/10 border-pink-500/20',
  };
  return (
    <div className="bg-[#0f1115] border border-purple-500/30 rounded-2xl p-6">
      <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
        <Sparkles size={12} /> Activadores de Guardado
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {data.slice(0, 6).map((act: any, idx: number) => (
          <div key={idx} className="bg-[#080808] rounded-xl p-3 border border-white/5 hover:border-purple-500/20 transition-colors">
            <span className={`inline-block text-[9px] font-black px-2 py-0.5 rounded-full border mb-2 ${colorTipo[act.tipo] || 'text-gray-400 bg-gray-500/10 border-gray-500/20'}`}>
              {act.tipo?.replace(/_/g, ' ') || 'activador'}
            </span>
            <p className="text-xs text-white font-bold leading-relaxed">"{act.contenido || act.frase || act.descripcion}"</p>
            {act.por_que_genera_guardado && <p className="text-[10px] text-gray-500 mt-1.5 leading-relaxed">{act.por_que_genera_guardado}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================================================================================
// 📊 SCORE VIRAL ESTRUCTURAL
// ==================================================================================

const ScoreRing = ({ value, size = 120 }: { value: number; size?: number }) => {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = ((value || 0) / 100) * circumference;
  const color = value >= 80 ? '#22c55e' : value >= 60 ? '#a855f7' : value >= 40 ? '#f59e0b' : '#ef4444';
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#1a1a2e" strokeWidth={8} />
        <circle
          cx={size/2} cy={size/2} r={radius} fill="none"
          stroke={color} strokeWidth={8}
          strokeDasharray={`${circumference}`}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)', filter: `drop-shadow(0 0 8px ${color}60)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-white leading-none">{value || 0}</span>
        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">/100</span>
      </div>
    </div>
  );
};

const IRProScoreCard = ({ score }: { score: any }) => {
  if (!score) return (
    <div className="bg-[#0f1115] border border-purple-500/30 rounded-2xl p-6 h-full flex flex-col">
      <h3 className="text-purple-400 text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
        <Zap size={12} fill="currentColor" /> Score Viral Estructural
      </h3>
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <ScoreRing value={0} size={120} />
        <div className="flex items-center gap-2 text-gray-600 text-xs">
          <Loader2 size={12} className="animate-spin" /> Procesando motores...
        </div>
      </div>
    </div>
  );
  const global = score?.viralidad_estructural_global || 0;
  const label = global >= 85 ? '🔥 VIRAL POTENCIAL' : global >= 70 ? '⚡ ALTA VIRALIDAD' : global >= 50 ? '📈 EN DESARROLLO' : '⚠ NECESITA MEJORAS';
  return (
    <div className="bg-[#0f1115] border border-purple-500/30 rounded-2xl p-6 shadow-[0_0_30px_-10px_rgba(168,85,247,0.2)] h-full flex flex-col">
      <h3 className="text-purple-400 text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
        <Zap size={12} fill="currentColor" /> Score Viral Estructural
      </h3>
      <div className="flex items-center gap-6 mb-6">
        <ScoreRing value={global} size={110} />
        <div>
          <p className="text-xs font-black text-white mb-1">{label}</p>
          {score?.recomendacion_express && (
            <p className="text-[10px] text-gray-500 leading-relaxed line-clamp-3">{score.recomendacion_express}</p>
          )}
        </div>
      </div>
      <div className="space-y-2.5 flex-1">
        {[
          { label: 'Retención',    val: score?.retencion_estructural || 0, color: 'bg-blue-500',   peso: '25%' },
          { label: 'Emoción',      val: score?.intensidad_emocional  || 0, color: 'bg-pink-500',   peso: '20%' },
          { label: 'Atención',     val: score?.manipulacion_atencion || 0, color: 'bg-purple-500', peso: '20%' },
          { label: 'Valor',        val: score?.densidad_valor        || 0, color: 'bg-green-500',  peso: '15%' },
          { label: 'Polarización', val: score?.polarizacion          || 0, color: 'bg-orange-500', peso: '10%' },
        ].map(item => (
          <div key={item.label} className="space-y-1">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tighter">
              <span className="text-gray-500 flex items-center gap-1.5">
                {item.label}
                <span className="text-gray-700 font-normal normal-case tracking-normal text-[9px]">({item.peso})</span>
              </span>
              <span className={`font-black ${item.val >= 80 ? 'text-green-400' : item.val >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                {item.val}<span className="text-gray-600 font-normal">%</span>
              </span>
            </div>
            <div className="h-2 bg-gray-800/80 rounded-full overflow-hidden">
              <div
                style={{ width: `${item.val}%`, transition: 'width 1.4s cubic-bezier(0.4,0,0.2,1)' }}
                className={`h-full ${item.color} rounded-full`}
              />
            </div>
          </div>
        ))}
        {score?.recomendacion_express && (
          <div className="pt-2 border-t border-white/5">
            <p className="text-[9px] text-gray-600 uppercase tracking-widest mb-1">Diagnóstico</p>
            <p className="text-[10px] text-gray-400 leading-relaxed">{score.recomendacion_express}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ==================================================================================
// ⚙️ MOTORES ACTIVOS
// ==================================================================================

const MotoresActivosCard = ({ output }: { output: any }) => {
  const motores = [
    { num: '01',  nombre: 'Estructura',    dato: output.adn_estructura?.patron_narrativo_detectado,                                         icon: '🏗', color: 'green'   },
    { num: '02',  nombre: 'Emoción',       dato: output.curva_emocional?.emocion_dominante,                                                  icon: '❤️', color: 'pink'    },
    { num: '03',  nombre: 'Loops',         dato: (output.micro_loops?.total != null ? output.micro_loops.total : output.metricas_micro_loops?.total_loops != null ? output.metricas_micro_loops.total_loops : null) !== null ? `${output.micro_loops?.total ?? output.metricas_micro_loops?.total_loops} loops` : null, icon: '🔄', color: 'blue'    },
    { num: '04',  nombre: 'Polarización',  dato: output.polarizacion?.nivel_confrontacion != null ? `${output.polarizacion.nivel_confrontacion}/100` : output.polarizacion?.posicionamiento_vs, icon: '⚡', color: 'orange'  },
    { num: '05',  nombre: 'Identidad',     dato: output.identidad_verbal?.ritmo_sintactico,                                                  icon: '🗣', color: 'violet'  },
    { num: '06',  nombre: 'Autoridad',     dato: output.status_y_posicionamiento?.tipo_autoridad,                                            icon: '👑', color: 'amber'   },
    { num: '07',  nombre: 'Valor',         dato: output.densidad_valor?.tipo_valor_dominante,                                                icon: '💎', color: 'cyan'    },
    { num: '08',  nombre: 'Atención',      dato: output.manipulacion_atencion?.golpes_narrativos?.length != null ? `${output.manipulacion_atencion.golpes_narrativos.length} golpes` : null, icon: '🎯', color: 'fuchsia' },
    { num: '09',  nombre: 'Guardado',      dato: output.activadores_guardado?.length != null ? `${output.activadores_guardado.length} triggers` : null, icon: '💾', color: 'purple'  },
    { num: '10',  nombre: 'Adaptación',    dato: output.adaptabilidad_nicho?.sofisticacion_audiencia_target,                                 icon: '🔧', color: 'sky'     },
    { num: '11',  nombre: 'Anti-Cliché',   dato: output.elementos_cliche_detectados?.length != null ? `${output.elementos_cliche_detectados.length} detectados` : null, icon: '🚫', color: 'red'     },
    { num: '12',  nombre: 'Ritmo',         dato: output.ritmo_narrativo?.velocidad_progresion,                                               icon: '🎵', color: 'yellow'  },
    { num: '13',  nombre: 'Score ADN',     dato: output.score_viral_estructural?.viralidad_estructural_global != null ? `${output.score_viral_estructural.viralidad_estructural_global}/100` : null, icon: '📊', color: 'emerald' },
    { num: '14A', nombre: 'Género',        dato: output.adn_profundo?.genero_narrativo,                                                      icon: '🎭', color: 'rose'    },
    { num: '14B', nombre: 'Idea Nuclear',  dato: output.idea_nuclear_ganadora?.que_hace_viral?.substring(0, 35),                             icon: '☢️', color: 'orange'  },
    { num: '14C', nombre: 'Superioridad',  dato: output.sistema_superioridad?.ventaja_de_nicho?.substring(0, 35),                            icon: '🏆', color: 'amber'   },
    { num: '14D', nombre: 'Conflicto',     dato: output.intensidad_conflictual?.nivel_riesgo_original,                                       icon: '🔥', color: 'red'     },
    { num: '15',  nombre: 'Blueprint',     dato: output.blueprint_replicable?.nombre_patron,                                                 icon: '📐', color: 'lime'    },
    { num: '16',  nombre: 'TCA',           dato: output.analisis_tca?.nivel_tca_detectado ? `${output.analisis_tca.nivel_tca_detectado} — ${output.analisis_tca.sector_detectado || ''}` : null, icon: '📡', color: 'teal'    },
    { num: '17',  nombre: 'Posición',      dato: output.posicionamiento_y_proximos_pasos?.posiciona_como,                                    icon: '🎯', color: 'indigo'  },
    { num: '18',  nombre: 'Fidelidad',     dato: output.indice_fidelidad?.indice_fidelidad != null ? `${output.indice_fidelidad.indice_fidelidad}/100` : null, icon: '🔬', color: 'violet'  },
  ];
  const colorMap: Record<string, string> = {
    green:   'border-green-500/20 hover:border-green-500/40 hover:bg-green-500/5',
    pink:    'border-pink-500/20 hover:border-pink-500/40 hover:bg-pink-500/5',
    blue:    'border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-500/5',
    orange:  'border-orange-500/20 hover:border-orange-500/40 hover:bg-orange-500/5',
    cyan:    'border-cyan-500/20 hover:border-cyan-500/40 hover:bg-cyan-500/5',
    purple:  'border-purple-500/20 hover:border-purple-500/40 hover:bg-purple-500/5',
    yellow:  'border-yellow-500/20 hover:border-yellow-500/40 hover:bg-yellow-500/5',
    rose:    'border-rose-500/20 hover:border-rose-500/40 hover:bg-rose-500/5',
    red:     'border-red-500/20 hover:border-red-500/40 hover:bg-red-500/5',
    teal:    'border-teal-500/20 hover:border-teal-500/40 hover:bg-teal-500/5',
    indigo:  'border-indigo-500/20 hover:border-indigo-500/40 hover:bg-indigo-500/5',
    lime:    'border-lime-500/20 hover:border-lime-500/40 hover:bg-lime-500/5',
    violet:  'border-violet-500/20 hover:border-violet-500/40 hover:bg-violet-500/5',
    amber:   'border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-500/5',
    fuchsia: 'border-fuchsia-500/20 hover:border-fuchsia-500/40 hover:bg-fuchsia-500/5',
    sky:     'border-sky-500/20 hover:border-sky-500/40 hover:bg-sky-500/5',
    emerald: 'border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-500/5',
  };
  const numColor: Record<string, string> = {
    green:   'text-green-500',   pink:    'text-pink-500',   blue:    'text-blue-500',
    orange:  'text-orange-500',  cyan:    'text-cyan-500',   purple:  'text-purple-500',
    yellow:  'text-yellow-500',  rose:    'text-rose-500',   red:     'text-red-500',
    teal:    'text-teal-500',    indigo:  'text-indigo-400', lime:    'text-lime-500',
    violet:  'text-violet-400',  amber:   'text-amber-400',  fuchsia: 'text-fuchsia-400',
    sky:     'text-sky-400',     emerald: 'text-emerald-400',
  };
  const completados = motores.filter(m => m.dato && !m.dato.includes('Analizando')).length;
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{completados}/{motores.length} motores activos</span>
        <div className="h-1.5 flex-1 mx-4 bg-gray-800 rounded-full overflow-hidden">
          <div style={{ width: `${(completados / motores.length) * 100}%`, transition: 'width 1s ease' }} className="h-full bg-gradient-to-r from-green-600 to-emerald-400 rounded-full" />
        </div>
        <span className="text-[10px] text-green-400 font-black">{Math.round((completados / motores.length) * 100)}%</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {motores.map(m => (
          <div key={m.num} className={`bg-[#080808] border p-3 rounded-xl transition-all group cursor-default ${colorMap[m.color]}`}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-sm leading-none">{m.icon}</span>
              <span className={`text-[9px] font-black uppercase tracking-widest ${numColor[m.color]}`}>{m.num}</span>
              <span className="text-[9px] text-gray-600 font-bold uppercase">{m.nombre}</span>
            </div>
            <div className={`text-[11px] font-bold truncate uppercase tracking-tight ${m.dato ? 'text-gray-200' : 'text-gray-700'}`}>
              {m.dato || 'Analizando...'}
            </div>
            {m.dato && <div className={`mt-1.5 h-0.5 w-full rounded-full bg-current opacity-20 ${numColor[m.color]}`} />}
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================================================================================
// 🔬 AUDITORÍA CON JUEZ VIRAL
// ==================================================================================

const OmegaAuditCard = ({ auditData, onAudit, isAuditing, listoParaAuditoria }: { auditData: any; onAudit: () => void; isAuditing: boolean; listoParaAuditoria?: boolean }) => {
  if (!auditData) {
    return (
      <div className="flex flex-col items-center gap-3">
        {listoParaAuditoria === false && (
          <div className="w-full max-w-sm px-4 py-2.5 bg-orange-500/10 border border-orange-500/20 rounded-xl text-[10px] text-orange-300 text-center">
            ⚠ Pre-análisis indica preparación insuficiente. El resultado del juicio puede ser impreciso.
          </div>
        )}
        <button
          onClick={onAudit}
          disabled={isAuditing}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/50 rounded-xl text-purple-300 font-black uppercase tracking-widest transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100"
        >
          {isAuditing ? <RefreshCw className="animate-spin" size={18} /> : <Gavel size={18} />}
          {isAuditing ? 'JUZGANDO...' : listoParaAuditoria === false ? 'AUDITAR DE TODAS FORMAS (2 CR)' : 'AUDITAR CALIDAD (2 CR)'}
        </button>
      </div>
    );
  }
  const score = auditData.veredicto_final?.score_total || 0;
  const color = score >= 90 ? 'text-purple-400' : score >= 70 ? 'text-green-400' : 'text-yellow-400';
  return (
    <div className="bg-[#0f1115] border border-purple-500/30 rounded-2xl p-6">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center border-b border-white/5 pb-6 mb-6">
        <div className="flex-1">
          <h4 className="text-purple-400 text-xs font-black uppercase tracking-widest mb-1">Veredicto del Juez</h4>
          <p className="text-white text-lg font-bold">{auditData.veredicto_final?.clasificacion}</p>
        </div>
        <div className="text-center bg-purple-900/10 px-6 py-3 rounded-xl border border-purple-500/20">
          <span className={`text-4xl font-black ${color}`}>{score}</span>
          <span className="text-xs text-gray-500 block font-bold uppercase mt-1">Viral Score</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h5 className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <CheckCircle2 size={12} /> Fortalezas
          </h5>
          <ul className="space-y-2">
            {auditData.fortalezas_clave?.slice(0, 3).map((f: string, i: number) => (
              <li key={i} className="text-xs text-gray-300 flex items-start gap-2"><span className="text-green-500 mt-0.5">▪</span> {f}</li>
            ))}
          </ul>
        </div>
        <div>
          <h5 className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <AlertTriangle size={12} /> Puntos Críticos
          </h5>
          <ul className="space-y-2">
            {auditData.debilidades_criticas?.slice(0, 3).map((d: any, i: number) => (
              <li key={i} className="text-xs text-gray-300 flex items-start gap-2"><span className="text-red-500 mt-0.5">▪</span> {d.problema || d}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// ==================================================================================
// 💰 BADGE DE COSTO
// ==================================================================================

const CreditBadge = ({ contentType, urlCount }: { contentType: ContentType; urlCount: number }) => {
  const cost = computeCost(contentType, urlCount);
  const cfg = CONTENT_CONFIGS[contentType];
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0f1115] border border-green-500/20 rounded-lg text-xs">
      <span>{cfg.icon}</span>
      <span className="text-gray-400">{cfg.label}</span>
      {urlCount > 1 && <><span className="text-gray-600">·</span><span className="text-blue-400 font-bold">{urlCount} URLs</span></>}
      <span className="text-gray-600">·</span>
      <span className="text-green-400 font-black">{cost} CR</span>
    </div>
  );
};

// ==================================================================================
// ⏳ LOADING PROGRESS OVERLAY
// ==================================================================================

const ETAPAS_LOADING = [
  { id: 'analizando',  label: 'Descargando & transcribiendo video',   icon: '🎬', pct: 15 },
  { id: 'extrayendo',  label: 'Extrayendo ADN viral estructural',       icon: '🧬', pct: 35 },
  { id: 'calculando',  label: 'Calculando motores de ingeniería',       icon: '⚙️', pct: 55 },
  { id: 'generando',   label: 'Generando guion adaptado al nicho',      icon: '✍️', pct: 75 },
  { id: 'validando',   label: 'Validando con sistema Olimpo V300',      icon: '🏛', pct: 90 },
  { id: 'finalizando', label: 'Empaquetando blueprint replicable',      icon: '📐', pct: 98 },
];

const LoadingOverlay = ({ isLoading, contentType }: { isLoading: boolean; contentType: ContentType }) => {
  const [etapaIdx, setEtapaIdx] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (!isLoading) { setEtapaIdx(0); return; }
    const durations = contentType === 'masterclass' ? [4000, 7000, 8000, 10000, 6000, 5000]
      : contentType === 'long' ? [3000, 5000, 6000, 8000, 5000, 4000]
      : [2000, 3000, 4000, 6000, 4000, 3000];
    let idx = 0;
    const advance = () => {
      idx++;
      if (idx < ETAPAS_LOADING.length) {
        setEtapaIdx(idx);
        t = setTimeout(advance, durations[idx]);
      }
    };
    let t = setTimeout(advance, durations[0]);
    return () => clearTimeout(t);
  }, [isLoading, contentType]);

  useEffect(() => {
    if (!isLoading) return;
    const t = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 400);
    return () => clearInterval(t);
  }, [isLoading]);

  if (!isLoading) return null;

  const etapa = ETAPAS_LOADING[etapaIdx];
  const pct = etapa.pct;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="bg-[#0a0a0f] border border-green-500/20 rounded-3xl p-8 md:p-12 max-w-md w-full mx-4 shadow-[0_0_100px_-30px_rgba(34,197,94,0.3)]">
        {/* Animated brain */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-900/40 to-emerald-900/20 border border-green-500/30 flex items-center justify-center">
              <Cpu size={36} className="text-green-400 animate-pulse" />
            </div>
            <div className="absolute -inset-2 rounded-3xl border border-green-500/10 animate-ping" style={{ animationDuration: '2s' }} />
          </div>
        </div>
        {/* Title */}
        <div className="text-center mb-6">
          <div className="text-[10px] font-black text-green-500 uppercase tracking-[0.4em] mb-2">Titan Engine Omega</div>
          <h3 className="text-xl font-black text-white tracking-tight">Procesando{dots}</h3>
        </div>
        {/* Etapas */}
        <div className="space-y-2 mb-6">
          {ETAPAS_LOADING.map((e, i) => (
            <div key={e.id} className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-500 ${i === etapaIdx ? 'bg-green-500/10 border border-green-500/20' : i < etapaIdx ? 'opacity-40' : 'opacity-20'}`}>
              <span className="text-base leading-none">{e.icon}</span>
              <span className={`text-xs font-bold flex-1 ${i === etapaIdx ? 'text-green-300' : 'text-gray-500'}`}>{e.label}</span>
              {i < etapaIdx && <CheckCircle2 size={14} className="text-green-500 shrink-0" />}
              {i === etapaIdx && <Loader2 size={14} className="text-green-400 animate-spin shrink-0" />}
            </div>
          ))}
        </div>
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] text-gray-500 font-bold">
            <span>PROGRESO</span><span className="text-green-400">{pct}%</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              style={{ width: `${pct}%`, transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)' }}
              className="h-full bg-gradient-to-r from-green-600 via-emerald-500 to-green-400 rounded-full relative"
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================================================================================
// 🚀 COMPONENTE PRINCIPAL
// ==================================================================================

export const TitanViral = () => {
  const { userProfile, refreshProfile } = useAuth();

  const [uploadMode, setUploadMode] = useState<UploadMode>('url');
  const [urls, setUrls] = useState<string[]>(['']);
  const [topicInput, setTopicInput] = useState('');
  const [uploadedVideoFile, setUploadedVideoFile] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [irProState, setIrProState] = useState<IRProState>({
    etapa: 'idle', iteracion: 0, scoreActual: 0,
    output: null, guionGenerado: null, veredictoJuez: null, error: null,
  });
  const [auditResult, setAuditResult] = useState<any>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [contentType, setContentType] = useState<ContentType>('reel');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('TikTok');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('es');
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>('');
  const [selectedExpertId, setSelectedExpertId] = useState<string>('');
  const [selectedKnowledgeBaseId, setSelectedKnowledgeBaseId] = useState<string>('');
  const [avatars, setAvatars] = useState<any[]>([]);
  const [experts, setExperts] = useState<any[]>([]);
  const [knowledgeBases, setKnowledgeBases] = useState<any[]>([]);
  const [generationId, setGenerationId]   = useState<string | null>(null);
  const [cloudStatus, setCloudStatus]     = useState<'idle' | 'processing' | 'completed' | 'error'>('idle');

  const validUrls = urls.filter(u => u.trim());
  const urlCount  = uploadMode === 'file' ? 1 : Math.max(validUrls.length, 1);
  const cost      = computeCost(contentType, urlCount);

  useEffect(() => { loadUserData(); }, []);
  useEffect(() => {
    if (!generationId) return;

    console.log(`[REALTIME] 📡 Suscribiendo a generation_id=${generationId}`);

    const channel = supabase
      .channel(`recreate-${generationId}`)
      .on(
        'postgres_changes',
        {
          event:  'UPDATE',
          schema: 'public',
          table:  'viral_generations',
          filter: `id=eq.${generationId}`,
        },
        (payload: any) => {
          const updated = payload.new;
          console.log(`[REALTIME] 📬 status=${updated.status}`);

          if (updated.status === 'completed' && updated.content) {
            const raw = updated.content;
            const resPro = raw?.guion_generado
              ? raw
              : { guion_generado: raw, autopsia: raw, modo: raw?.modo || 'sniper_enterprise', metadata_video: raw?.metadata_video || {} };

            setIrProState({
              etapa: 'completo', iteracion: 0,
              scoreActual: resPro.score_viral_estructural?.viralidad_estructural_global || 0,
              output: null, guionGenerado: null, veredictoJuez: null, error: null,
            });
            setResult(resPro);
            setCloudStatus('completed');
            setLoading(false);
            setGenerationId(null);
            if (refreshProfile) refreshProfile();
            supabase.removeChannel(channel);

          } else if (updated.status === 'error') {
            const errMsg = updated.content?.error || 'El proceso en la nube falló. Intenta de nuevo.';
            setErrorMsg(errMsg);
            setIrProState(prev => ({ ...prev, etapa: 'idle', error: errMsg }));
            setCloudStatus('error');
            setLoading(false);
            setGenerationId(null);
            supabase.removeChannel(channel);
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [generationId]);

  const loadUserData = async () => {
    try {
      const [{ data: avatarsData }, { data: expertsData }, { data: kbData }] = await Promise.all([
        supabase.from('avatars').select('id, name').eq('user_id', userProfile?.id).order('created_at', { ascending: false }),
        supabase.from('expert_profiles').select('id, name, niche').eq('user_id', userProfile?.id).order('created_at', { ascending: false }),
        supabase.from('documents').select('id, title').eq('user_id', userProfile?.id).order('created_at', { ascending: false }),
      ]);
      if (avatarsData)  setAvatars(avatarsData);
      if (expertsData)  setExperts(expertsData);
      if (kbData)       setKnowledgeBases(kbData);
      if (userProfile?.active_expert_id) setSelectedExpertId(userProfile.active_expert_id);
    } catch (err) { console.error('Error cargando datos:', err); }
  };

  const handleUrlChange = (idx: number, val: string) => {
    setUrls(prev => { const next = [...prev]; next[idx] = val; return next; });
  };
  const addUrl = () => { if (urls.length >= 5) return; setUrls(prev => [...prev, '']); };
  const removeUrl = (idx: number) => {
    if (urls.length === 1) { setUrls(['']); return; }
    setUrls(prev => prev.filter((_, i) => i !== idx));
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const validTypes = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo'];
    if (!validTypes.includes(file.type)) { setErrorMsg('Tipo no soportado. Usa MP4, MOV, WEBM o AVI.'); return; }
    if (file.size > 10 * 1024 * 1024) { setErrorMsg('El video es demasiado pesado (Máximo 10MB). Por favor, comprímelo o intenta subir un fragmento más corto.'); return; }
    setUploadedVideoFile(file); // Guardamos el File directamente
    setUploadedFileName(file.name);
  };
  const handleClearUpload = () => { setUploadedVideoFile(null); setUploadedFileName(''); };

  const handleRunAudit = async () => {
    if (!result?.guion_generado || !userProfile) return;
    if ((userProfile.credits || 0) < 2) { alert('Necesitas 2 créditos para auditar.'); return; }
    setIsAuditing(true);
    // ✅ FIX BUG #1 — usar campos reales del backend (recreate)
    const scriptText =
  result.guion_adaptado_teleprompter ||
  result.guion_generado?.guion_adaptado_espejo ||
  result.guion_generado?.guion_adaptado_al_nicho || '';
    try {
      const { data, error } = await supabase.functions.invoke('process-url', {
        body: { selectedMode: 'juez_viral', text: scriptText, expertId: selectedExpertId || undefined, avatarId: selectedAvatarId || undefined, estimatedCost: 2 }
      });
      if (error) throw error;
      if (!data.success && !data.generatedData) throw new Error(data.error || 'Error al auditar');
      setAuditResult(data.generatedData || data);
      if (refreshProfile) refreshProfile();
    } catch (e: any) {
      alert('Error al conectar con el Juez Viral: ' + e.message);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleClone = async () => {
    if (uploadMode === 'url' && validUrls.length === 0) return setErrorMsg('Necesito al menos una URL.');
    if (uploadMode === 'file' && !uploadedVideoFile) return setErrorMsg('Sube un video primero.');
    if (!topicInput.trim()) return setErrorMsg('Dime sobre qué TEMA quieres adaptar el guion.');
    if ((userProfile?.credits || 0) < cost) return setErrorMsg(`Créditos insuficientes. Requieres ${cost} créditos.`);

    setAuditResult(null);
    setLoading(true);
    setErrorMsg(null);
    setResult(null);
    setIrProState(prev => ({ ...prev, etapa: 'analizando', error: null }));

    try {
      const payload: any = {
        selectedMode: 'recreate',
        estimatedCost: cost,
        text: topicInput,
        expertId: selectedExpertId || undefined,
        avatarId: selectedAvatarId || undefined,
        knowledgeBaseId: selectedKnowledgeBaseId || undefined,
        settings: { platform: selectedPlatform, contentType, urlCount, outputLanguage: selectedLanguage },
      };
      if (uploadMode === 'url') {
        payload.urls = validUrls;
        payload.url  = validUrls[0];
      } else {
        payload.uploadedVideo    = uploadedVideoFile;
        payload.uploadedFileName = uploadedFileName;
      }

      // ✅ CONFIGURACIÓN DE TIMEOUT Y HEADERS (FIX V800)
      const isFileUpload = uploadMode === 'file' && uploadedVideoFile instanceof File;
      let requestBody: any;

      if (isFileUpload) {
        const formData = new FormData();
        formData.append('selectedMode', payload.selectedMode);
        formData.append('estimatedCost', String(payload.estimatedCost));
        formData.append('text', payload.text);
        if (payload.expertId) formData.append('expertId', payload.expertId);
        if (payload.avatarId) formData.append('avatarId', payload.avatarId);
        if (payload.knowledgeBaseId) formData.append('knowledgeBaseId', payload.knowledgeBaseId);
        formData.append('settings', JSON.stringify(payload.settings));
        formData.append('uploadedVideo', uploadedVideoFile);
        formData.append('uploadedFileName', uploadedFileName);
        requestBody = formData;
      } else {
        requestBody = payload;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(),30000); // 300 segundos de espera para la IA

      // 🛑 IMPORTANTE: No enviamos headers. Supabase detectará automáticamente si es JSON o FormData.
      const { data, error } = await supabase.functions.invoke('process-url', { 
        body: requestBody,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (error) {
        const errorMsg = parseBackendError(error);
        setErrorMsg(errorMsg);
        setIrProState(prev => ({ ...prev, etapa: 'idle', error: errorMsg }));
        setLoading(false);
        return;
      }

      if (!data.success && data.action === 'REDIRECT_TO_AVATAR') {
        setErrorMsg('⚡ Necesitas configurar tu Avatar antes de generar contenido. Ve a Configuración → Avatar y crea tu perfil.');
        setIrProState(prev => ({ ...prev, etapa: 'idle', error: null }));
        setLoading(false);
        return;
      }

      if (!data.success) {
        const errorMsg = parseBackendError(data.error || 'Error desconocido.');
        setErrorMsg(errorMsg);
        setIrProState(prev => ({ ...prev, etapa: 'idle', error: errorMsg }));
        setLoading(false);
        return;
      }

      // ⚡ RESPUESTA ASÍNCRONA — backend devuelve generation_id
      if (data.async && data.generation_id) {
        console.log(`[REALTIME] 📡 generation_id=${data.generation_id}`);
        setGenerationId(data.generation_id);
        setCloudStatus('processing');
        setIrProState(prev => ({ ...prev, etapa: 'generando' }));
        return; // loading se mantiene true — Realtime lo apaga
      }

      // Fallback sincrónico
      const raw = data.generatedData;
      const resPro = raw?.guion_generado
        ? raw
        : { guion_generado: raw, autopsia: raw, modo: raw?.modo || 'sniper_enterprise', metadata_video: raw?.metadata_video || {} };

      setIrProState({
        etapa: 'completo', iteracion: 0,
        scoreActual: resPro.score_viral_estructural?.viralidad_estructural_global || 0,
        output: null, guionGenerado: null, veredictoJuez: null, error: null,
      });
      setResult(resPro);
      setLoading(false);
      if (refreshProfile) refreshProfile();
    } catch (err: any) {
      // ✅ PARSEO INTELIGENTE DE ERRORES
      const errorMsg = parseBackendError(err);
      setErrorMsg(errorMsg);
      setIrProState(prev => ({ ...prev, etapa: 'idle', error: errorMsg }));
    } finally {
      setLoading(false);
    }
  };

  // ✅ FUNCIONES DE APOYO: PARSEO DE ERRORES
  const parseBackendError = (error: any): string => {
    // Caso 1: Error es un string JSON
    if (typeof error === 'string') {
      try {
        const parsed = JSON.parse(error);
        if (parsed.error === 'timeout' && parsed.mensaje) {
          return `⏱️ ${parsed.mensaje}`;
        }
        return parsed.message || parsed.error || error;
      } catch {
        // No es JSON, devolver como está
        return error;
      }
    }

    // Caso 2: Error es un objeto con message o error
    if (typeof error === 'object' && error !== null) {
      if (error.error === 'timeout' && error.mensaje) {
        return `⏱️ ${error.mensaje}`;
      }
      if (error.message) {
        return error.message;
      }
      if (error.error) {
        return error.error;
      }
      // Intentar serializar el objeto para extraer texto
      try {
        const str = JSON.stringify(error);
        return str.length < 200 ? str : 'Error inesperado. Por favor, intenta de nuevo.';
      } catch {
        return 'Error inesperado. Por favor, intenta de nuevo.';
      }
    }

    // Caso 3: Error genérico
    return error?.toString() || 'Error de conexión. Por favor, verifica tu internet e intenta de nuevo.';
  };

  // ==================================================================================
  // 🎨 RENDER
  // ==================================================================================

  return (
    <div className="max-w-7xl mx-auto pb-32 px-4 sm:px-6 pt-12 animate-in fade-in duration-700">

      {/* LOADING OVERLAY */}
      <LoadingOverlay isLoading={loading} contentType={contentType} />

      {/* HERO */}
      <div className="text-center mb-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[250px] bg-green-500/8 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[150px] bg-emerald-500/12 blur-[80px] pointer-events-none rounded-full" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#0f1115] border border-green-500/25 rounded-full text-[10px] font-black text-green-400 uppercase tracking-widest mb-6 shadow-lg cursor-default">
            <Flame size={11} fill="currentColor" /> Titan Engine Omega v3.0
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse ml-1" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">
            CLONACIÓN <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-green-600">VIRAL</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Extrae la arquitectura matemática de 1 a 5 videos virales y replícala en tu nicho con fidelidad quirúrgica.
          </p>
          {/* Stats row */}
          <div className="flex items-center justify-center gap-8 mt-8 opacity-50">
            {[
              { icon: <Cpu size={14}/>, label: '21 Motores IA' },
              { icon: <BarChart3 size={14}/>, label: 'Score Estructural' },
              { icon: <Wand2 size={14}/>, label: 'Blueprint Replicable' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[11px] text-gray-500 font-bold">
                <span className="text-green-600">{s.icon}</span>{s.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PANEL DE CONTROL */}
      <div className="max-w-3xl mx-auto bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-2 shadow-2xl relative z-20">
        <div className="bg-[#0f1115] rounded-[1.5rem] p-6 md:p-8 space-y-6 border border-white/5">

          {/* TIPO DE CONTENIDO */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">1. Tipo de Contenido</label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.entries(CONTENT_CONFIGS) as [ContentType, CreditConfig][]).map(([key, cfg]) => (
                <button key={key} onClick={() => setContentType(key)}
                  className={`py-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1.5 border ${contentType === key ? 'bg-green-500/15 text-green-400 border-green-500/40 shadow-inner' : 'bg-[#080808] text-gray-500 border-white/5 hover:text-gray-300 hover:border-white/10'}`}>
                  <span className="text-lg">{cfg.icon}</span>
                  <span className="uppercase tracking-wider">{cfg.label}</span>
                  <span className={`text-[10px] ${contentType === key ? 'text-green-300' : 'text-gray-600'}`}>desde {cfg.costs.single} cr</span>
                </button>
              ))}
            </div>
          </div>

          {/* PLATAFORMA */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">2. Plataforma Destino</label>
            <div className="flex gap-2 flex-wrap">
              {['TikTok', 'Reels', 'YouTube', 'LinkedIn', 'Facebook'].map(p => (
                <button key={p} onClick={() => setSelectedPlatform(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${selectedPlatform === p ? 'bg-blue-500/15 text-blue-400 border-blue-500/30' : 'bg-[#080808] text-gray-500 border-white/5 hover:text-gray-300'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* IDIOMA DE SALIDA */}
          <div>
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-3">
              <span className="text-base">🌍</span> Idioma del guion de salida
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { code: 'es', flag: '🇪🇸', label: 'Español',   sub: 'Salida en español'  },
                { code: 'en', flag: '🇺🇸', label: 'English',   sub: 'Output in English'  },
                { code: 'pt', flag: '🇧🇷', label: 'Português', sub: 'Saída em português' },
                { code: 'fr', flag: '🇫🇷', label: 'Français',  sub: 'Sortie en français' },
              ].map(lang => (
                <button key={lang.code} type="button" onClick={() => setSelectedLanguage(lang.code)}
                  className={`relative flex flex-col items-center gap-1 px-3 py-3 rounded-xl border text-center transition-all duration-200 ${selectedLanguage === lang.code ? 'bg-green-500/10 border-green-500/60 shadow-[0_0_12px_-3px_rgba(34,197,94,0.4)]' : 'bg-white/2 border-white/8 hover:border-white/20 hover:bg-white/5'}`}>
                  {selectedLanguage === lang.code && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_6px_rgba(34,197,94,0.8)]" />}
                  <span className="text-xl">{lang.flag}</span>
                  <span className={`text-[11px] font-black ${selectedLanguage === lang.code ? 'text-green-400' : 'text-white'}`}>{lang.label}</span>
                  <span className="text-[9px] text-gray-600 leading-tight">{lang.sub}</span>
                </button>
              ))}
            </div>
            {selectedLanguage !== 'es' && (
              <div className="mt-2 flex items-start gap-2 bg-blue-500/5 border border-blue-500/20 rounded-lg px-3 py-2">
                <span className="text-blue-400 text-sm mt-0.5">⚡</span>
                <p className="text-[10px] text-blue-400/80 leading-relaxed">
                  El ADN viral se extrae en cualquier idioma. El guion final se escribe en <strong>
                  {selectedLanguage === 'en' ? 'English' : selectedLanguage === 'pt' ? 'Português' : selectedLanguage === 'fr' ? 'Français' : 'Español'}
                  </strong> — adaptado culturalmente, no traducido.
                </p>
              </div>
            )}
          </div>

          {/* MODO URL / FILE */}
          <div className="space-y-3">
            <div className="flex gap-2 p-1 bg-[#080808] rounded-lg border border-white/5">
              <button onClick={() => setUploadMode('url')}
                className={`flex-1 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${uploadMode === 'url' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'text-gray-500 hover:text-gray-400'}`}>
                <LinkIcon size={14} className="inline mr-2" /> URL(s) del Video
              </button>
              <button onClick={() => setUploadMode('file')}
                className={`flex-1 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${uploadMode === 'file' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'text-gray-500 hover:text-gray-400'}`}>
                <Upload size={14} className="inline mr-2" /> Subir Archivo
              </button>
            </div>

            {uploadMode === 'url' && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1 flex justify-between items-center">
                  <span>3. Video(s) Viral(es) — máx 5</span>
                  <span className="text-green-500 text-[9px]">TIKTOK / REELS / YOUTUBE</span>
                </label>
                {urls.map((u, idx) => (
                  <div key={idx} className="relative flex items-center gap-2">
                    <div className="relative flex-1">
                      <input type="text" value={u} onChange={e => handleUrlChange(idx, e.target.value)}
                        placeholder={`https://... (URL ${idx + 1})`}
                        className="w-full bg-[#080808] border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500/20 outline-none transition-all font-mono shadow-inner" />
                      <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    </div>
                    {urls.length > 1 && (
                      <button onClick={() => removeUrl(idx)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors flex-shrink-0">
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
                {urls.length < 5 && (
                  <button onClick={addUrl} className="w-full py-2.5 border border-dashed border-white/10 rounded-xl text-xs text-gray-500 hover:text-green-400 hover:border-green-500/30 transition-all flex items-center justify-center gap-2">
                    <Plus size={14} /> Agregar otra URL (análisis híbrido)
                  </button>
                )}
                {validUrls.length > 1 && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/5 border border-blue-500/20 rounded-lg text-[11px] text-blue-300">
                    <Layers size={12} />
                    <span className="font-bold">Modo Híbrido:</span>
                    <span>Arquitectura combinada de {validUrls.length} videos</span>
                  </div>
                )}
              </div>
            )}

            {uploadMode === 'file' && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">3. Subir Video</label>
                {!uploadedVideoFile ? (
                  <label className="block w-full bg-[#080808] border-2 border-dashed border-white/10 rounded-xl py-8 cursor-pointer hover:border-green-500/30 transition-all group">
                    <input type="file" accept="video/mp4,video/quicktime,video/webm,video/x-msvideo" onChange={handleVideoUpload} className="hidden" />
                    <div className="text-center">
                      <Upload size={32} className="mx-auto text-gray-600 group-hover:text-green-500 transition-colors mb-3" />
                      <p className="text-sm text-gray-400 font-medium">Arrastra tu video o haz clic para seleccionar</p>
                      <p className="text-xs text-gray-600 mt-1">MP4, MOV, WEBM, AVI (Max 100MB)</p>
                    </div>
                  </label>
                ) : (
                  <div className="bg-[#080808] border border-green-500/20 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/10 rounded-lg"><Film size={20} className="text-green-500" /></div>
                      <div>
                        <p className="text-white text-sm font-medium truncate max-w-[200px]">{uploadedFileName}</p>
                        <p className="text-gray-500 text-xs">Video listo para análisis</p>
                      </div>
                    </div>
                    <button onClick={handleClearUpload} className="p-2 hover:bg-red-500/10 rounded-lg transition-colors">
                      <Trash2 size={18} className="text-red-500" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-center -my-2 opacity-30"><MoveRight className="rotate-90 md:rotate-0" size={24} /></div>

          {/* TEMA DESTINO */}
          <div className="space-y-2 group">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">
              {uploadMode === 'url' ? '4' : '3'}. Tu Nicho / Tema (Destino)
            </label>
            <div className="relative transition-transform group-focus-within:scale-[1.01] duration-200">
              <input type="text" value={topicInput} onChange={e => setTopicInput(e.target.value)}
                placeholder="Ej: Lanzamientos digitales, Marketing para dentistas..."
                className="w-full bg-[#080808] border border-green-500/20 rounded-xl py-4 pl-12 pr-4 text-white text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500/20 outline-none transition-all shadow-inner" />
              <Target size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500" />
            </div>
          </div>

          {/* CONTEXTO AVANZADO */}
          <div className="pt-4 border-t border-white/5 space-y-3">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
              {uploadMode === 'url' ? '5' : '4'}. Contexto Avanzado (Opcional)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { label: 'Avatar',           value: selectedAvatarId,        setter: setSelectedAvatarId,        items: avatars,        nameKey: 'name'  },
                { label: 'Perfil Experto',   value: selectedExpertId,        setter: setSelectedExpertId,        items: experts,        nameKey: 'name'  },
                { label: 'Base Conocimiento',value: selectedKnowledgeBaseId, setter: setSelectedKnowledgeBaseId, items: knowledgeBases, nameKey: 'title' },
              ].map(({ label, value, setter, items, nameKey }) => (
                <div key={label}>
                  <label className="text-[9px] text-gray-600 uppercase tracking-wide block mb-1 pl-1">{label}</label>
                  <select value={value} onChange={e => setter(e.target.value)}
                    className="w-full bg-[#080808] border border-white/10 rounded-lg py-2 px-3 text-white text-xs focus:border-green-500 outline-none">
                    <option value="">Ninguno</option>
                    {items.map((item: any) => <option key={item.id} value={item.id}>{item[nameKey]}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* COSTO */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#080808] rounded-xl border border-white/5">
            <div className="flex items-center gap-3">
              <Clock size={14} className="text-gray-500" />
              <span className="text-xs text-gray-400">Costo estimado:</span>
            </div>
            <CreditBadge contentType={contentType} urlCount={urlCount} />
          </div>

          {/* BOTÓN PRINCIPAL */}
          <button onClick={handleClone} disabled={loading}
            className={`w-full py-5 rounded-xl text-sm font-black uppercase tracking-widest flex justify-center items-center gap-3 transition-all shadow-lg mt-2 relative overflow-hidden group ${loading ? 'bg-gray-800/80 text-gray-600 cursor-not-allowed border border-white/5' : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black shadow-green-500/20 hover:shadow-green-500/40 transform hover:-translate-y-0.5 border border-green-400/30'}`}>
            {!loading && <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />}
            {loading ? (
              <><Loader2 size={20} className="animate-spin text-green-600" /><span className="text-green-600 animate-pulse">PROCESANDO...</span></>
            ) : (
              <><Zap size={20} className="group-hover:scale-110 transition-transform fill-current" /><span>EJECUTAR CLONACIÓN — {cost} CR</span></>
            )}
          </button>

          {errorMsg && (
            <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-300 text-xs font-medium animate-in slide-in-from-top-2">
              <AlertTriangle size={16} className="shrink-0 text-red-500" />
              {errorMsg}
            </div>
          )}
        </div>
      </div>

      {/* ── PROCESANDO EN LA NUBE (estado asíncrono) ── */}
      {cloudStatus === 'processing' && !result && (
        <div className="mt-8 bg-[#080b10] border border-blue-500/20 rounded-2xl p-8 flex flex-col items-center gap-6 shadow-[0_0_60px_-20px_rgba(59,130,246,0.2)]">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-blue-500/20" />
            <div className="w-16 h-16 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin absolute inset-0" />
            <Cpu className="text-blue-400 absolute inset-0 m-auto" size={22} />
          </div>
          <div className="text-center space-y-2">
            <p className="text-white font-black text-lg tracking-tight">Procesando en la nube...</p>
            <p className="text-gray-400 text-sm max-w-md">
              El motor <span className="text-blue-400 font-bold">Sniper Enterprise</span> está
              analizando el ADN viral y generando tu guion. Tarda entre 20 y 40 segundos.
              <span className="text-gray-500"> No cierres esta ventana.</span>
            </p>
          </div>
          <div className="w-full max-w-sm space-y-2">
            {[
              { icon: '🕷️', label: 'Scraping y transcripción del video' },
              { icon: '🧬', label: 'Extracción de ADN viral' },
              { icon: '✍️', label: 'Generación del guion adaptado' },
              { icon: '🎬', label: 'Plan audiovisual y miniatura' },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/3 rounded-lg px-3 py-2 border border-white/5">
                <span className="text-base">{step.icon}</span>
                <span className="text-[11px] text-gray-400 font-medium">{step.label}</span>
                <Loader2 size={11} className="ml-auto text-blue-400 animate-spin shrink-0" />
              </div>
            ))}
          </div>
          <p className="text-[10px] text-gray-600 flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Escuchando resultados via Supabase Realtime
          </p>
        </div>
      )}

      {/* ─── ZONA DE RESULTADOS ─── */}
      {result && (
        result.guion_adaptado_teleprompter ||
        result.guion_generado?.guion_adaptado_espejo ||
        result.guion_generado?.guion_adaptado_al_nicho ||
        result.guion_generado?.guion_tecnico_completo
      ) && (
        <div className="mt-20 space-y-10 animate-in slide-in-from-bottom-10 duration-1000">

          {/* Success header */}
          <div className="flex items-center justify-center gap-6">
            <div className="h-px bg-gradient-to-r from-transparent via-green-500/40 to-transparent flex-1" />
            <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/25 rounded-full px-5 py-2">
              <CheckCircle2 size={14} className="text-green-400" />
              <span className="text-[11px] font-black text-green-400 uppercase tracking-[0.25em]">
                {result.modo === 'ingenieria_inversa_pro_hibrida' ? 'ARQUITECTURA HÍBRIDA GENERADA' : 'CLONACIÓN EXITOSA'}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-green-500/40 to-transparent flex-1" />
          </div>

          {/* Stats de proceso */}
          {result.guion_generado?.loop_info && (
            <div className="flex items-center justify-center flex-wrap gap-4 text-[10px] text-gray-600 font-bold uppercase tracking-widest">
              <span className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-green-500" />
                📝 {result.guion_generado.loop_info.palabras_guion} palabras
              </span>
              <span className="w-px h-3 bg-gray-800" />
              <span className="flex items-center gap-1.5">
                🔬 ADN Score: <span className="text-green-400">{result.guion_generado.loop_info.score_adn}/100</span>
              </span>
              <span className="w-px h-3 bg-gray-800" />
              <span className="flex items-center gap-1.5">
                🪙 {result.guion_generado.loop_info.tokens_totales?.toLocaleString()} tokens
              </span>
              <span className="w-px h-3 bg-gray-800" />
              <span className="flex items-center gap-1.5">
                ⚙️ {result.guion_generado.loop_info.arquitectura}
              </span>
            </div>
          )}

          {/* SCORE ADN — datos reales del análisis */}
          {result.score_adn && (
            <div className="max-w-6xl mx-auto">
              <ScoreAdnCard scoreAdn={result.score_adn} />
            </div>
          )}

          {/* Multi-URL badge */}
          {(result.metadata_video?.urls_analizadas || 0) > 1 && (
            <div className="max-w-3xl mx-auto p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl text-xs text-blue-300 flex items-center gap-3">
              <Layers size={16} />
              <span>Arquitectura híbrida construida a partir de <strong>{result.metadata_video.urls_analizadas} videos</strong> analizados.</span>
            </div>
          )}

          <div className="space-y-8">

            {/* 0 ─── BRIEFING PRE-GRABACIÓN — Lo más importante */}
            {(result.guion_generado.hook_primeros_3_segundos || result.guion_generado.frase_de_oro || result.guion_generado.como_supera_al_original) && (
              <div className="bg-gradient-to-br from-[#0a0f0a] to-[#080808] border border-green-500/20 rounded-2xl p-6 shadow-[0_0_40px_-15px_rgba(34,197,94,0.2)]">
                <div className="flex items-center gap-2 mb-5">
                  <Flame size={14} fill="currentColor" className="text-green-400" />
                  <h3 className="text-[11px] font-black text-green-400 uppercase tracking-[0.3em]">Briefing de Grabación — Lee esto primero</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {result.guion_generado.hook_primeros_3_segundos && (
                    <div className="bg-green-500/5 border border-green-500/25 rounded-xl p-4">
                      <p className="text-[8px] text-green-500 font-black uppercase tracking-widest mb-2">🎯 Hook — 3 segundos</p>
                      <p className="text-sm text-green-100 font-black leading-relaxed italic">"{result.guion_generado.hook_primeros_3_segundos}"</p>
                    </div>
                  )}
                  {result.guion_generado.frase_de_oro && (
                    <div className="bg-yellow-500/5 border border-yellow-500/25 rounded-xl p-4">
                      <p className="text-[8px] text-yellow-400 font-black uppercase tracking-widest mb-2">⭐ Frase de Oro</p>
                      <p className="text-sm text-yellow-100 font-black leading-relaxed italic">"{result.guion_generado.frase_de_oro}"</p>
                    </div>
                  )}
                  {result.guion_generado.punto_de_no_retorno && (
                    <div className="bg-red-500/5 border border-red-500/25 rounded-xl p-4">
                      <p className="text-[8px] text-red-400 font-black uppercase tracking-widest mb-2">💥 Punto de No Retorno</p>
                      <p className="text-sm text-red-100 font-black leading-relaxed italic">"{result.guion_generado.punto_de_no_retorno}"</p>
                    </div>
                  )}
                </div>
                {result.guion_generado.como_supera_al_original && (
                  <div className="mt-3 bg-[#080808] rounded-xl px-4 py-3 border border-white/5">
                    <p className="text-[8px] text-emerald-400 font-black uppercase tracking-widest mb-1">👑 Cómo supera al video original</p>
                    <p className="text-xs text-gray-300 leading-relaxed">{result.guion_generado.como_supera_al_original}</p>
                  </div>
                )}
              </div>
            )}

            {/* 1 ─── GUION (LO MÁS IMPORTANTE) */}
            <SniperResultView result={result} contentType={contentType} />

            {/* 1B ─── 5 HOOKS ALTERNATIVOS */}
            {result.guion_generado.hooks_alternativos?.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent flex-1" />
                  <span className="text-[10px] font-black text-yellow-400 uppercase tracking-[0.3em]">🎯 5 Hooks Alternativos</span>
                  <div className="h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent flex-1" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {result.guion_generado.hooks_alternativos.map((h: any, i: number) => {
                    const colors: Record<string, string> = {
                      curiosidad:     'border-blue-500/30 bg-blue-500/5 text-blue-400',
                      polemica:       'border-red-500/30 bg-red-500/5 text-red-400',
                      autoridad:      'border-yellow-500/30 bg-yellow-500/5 text-yellow-400',
                      descubrimiento: 'border-purple-500/30 bg-purple-500/5 text-purple-400',
                      advertencia:    'border-orange-500/30 bg-orange-500/5 text-orange-400',
                    };
                    const c = colors[h.tipo] || 'border-white/10 bg-white/5 text-gray-400';
                    return (
                      <div key={i} className={`rounded-xl border p-4 ${c.split(' ').slice(0,2).join(' ')}`}>
                        <p className={`text-[9px] font-black uppercase tracking-widest mb-2 ${c.split(' ')[2]}`}>{h.tipo}</p>
                        <p className="text-xs text-white font-bold leading-relaxed italic">"{h.hook}"</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 1C ─── ESTRUCTURA NARRATIVA + GATILLOS PSICOLÓGICOS */}
            {(result.guion_generado.estructura_narrativa_detectada || result.guion_generado.gatillos_psicologicos?.length > 0) && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent flex-1" />
                  <span className="text-[10px] font-black text-pink-400 uppercase tracking-[0.3em]">🧠 Estructura & Gatillos Psicológicos</span>
                  <div className="h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent flex-1" />
                </div>
                <div className="bg-[#0f1115] border border-pink-500/20 rounded-2xl p-6 space-y-4">
                  {result.guion_generado.estructura_narrativa_detectada && (
                    <div className="bg-[#080808] rounded-xl px-4 py-3 border border-white/5">
                      <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Estructura Narrativa Detectada</p>
                      <p className="text-sm font-black text-pink-300">{result.guion_generado.estructura_narrativa_detectada}</p>
                    </div>
                  )}
                  {result.guion_generado.gatillos_psicologicos?.length > 0 && (
                    <div className="space-y-2">
                      {result.guion_generado.gatillos_psicologicos.map((g: any, i: number) => (
                        <div key={i} className="bg-[#080808] rounded-xl px-4 py-3 border border-white/5 grid grid-cols-3 gap-3">
                          <div>
                            <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Gatillo</p>
                            <p className="text-xs font-black text-pink-300">{g.gatillo}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Dónde aparece</p>
                            <p className="text-xs text-gray-300">{g.donde_aparece}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Efecto</p>
                            <p className="text-xs text-gray-300">{g.efecto}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2 ─── ADN + IDEA NUCLEAR */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent flex-1" />
                <span className="text-[10px] font-black text-red-400 uppercase tracking-[0.3em]">ADN Viral & Idea Ganadora</span>
                <div className="h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent flex-1" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {result.guion_generado.adn_profundo && <AdnProfundoCard data={result.guion_generado.adn_profundo} />}
                {result.guion_generado.idea_nuclear_ganadora && <IdeaNuclearCard data={result.guion_generado.idea_nuclear_ganadora} />}
              </div>
            </div>

            {/* 3 ─── INTENSIDAD DEL CONFLICTO ORIGINAL — Motor más valioso sin UI */}
            {result.guion_generado.intensidad_conflictual && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent flex-1" />
                  <span className="text-[10px] font-black text-red-400 uppercase tracking-[0.3em]">🔥 Intensidad del Conflicto Original</span>
                  <div className="h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent flex-1" />
                </div>
                <div className="bg-[#0f1115] border border-red-500/20 rounded-2xl p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    <div className="bg-[#080808] rounded-xl p-3 border border-white/5 text-center">
                      <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Riesgo Original</p>
                      <p className="text-3xl font-black text-red-400">{result.guion_generado.intensidad_conflictual?.nivel_riesgo_original}</p>
                    </div>
                    <div className="bg-[#080808] rounded-xl p-3 border border-white/5 text-center">
                      <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Incomodidad</p>
                      <p className="text-3xl font-black text-orange-400">{result.guion_generado.intensidad_conflictual?.nivel_incomodidad}</p>
                    </div>
                    <div className="col-span-2 bg-[#080808] rounded-xl p-3 border border-white/5">
                      <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Decisión Impopular</p>
                      <p className="text-xs text-red-300 font-bold leading-relaxed">{result.guion_generado.intensidad_conflictual?.decision_impopular}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-[#080808] rounded-xl p-3 border border-white/5">
                      <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Escena concreta principal</p>
                      <p className="text-xs text-orange-300 font-bold leading-relaxed">{result.guion_generado.intensidad_conflictual.escena_concreta_principal}</p>
                    </div>
                    <div className="bg-[#080808] rounded-xl p-3 border border-white/5">
                      <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Consecuencia real</p>
                      <p className="text-xs text-yellow-300 font-bold leading-relaxed">{result.guion_generado.intensidad_conflictual.consecuencia_real}</p>
                    </div>
                    <div className="col-span-1 sm:col-span-2 bg-gradient-to-r from-green-900/20 to-emerald-900/10 rounded-xl p-3 border border-green-500/20">
                      <p className="text-[9px] text-green-400 uppercase tracking-widest mb-1 font-black">✅ Equivalente en tu nicho</p>
                      <p className="text-xs text-green-200 font-bold leading-relaxed">{result.guion_generado.intensidad_conflictual.equivalente_en_nicho}</p>
                    </div>
                    {result.guion_generado.intensidad_conflictual.por_que_incomoda && (
                      <div className="col-span-1 sm:col-span-2 bg-[#080808] rounded-xl p-3 border border-white/5">
                        <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Por qué incomoda</p>
                        <p className="text-xs text-gray-300 leading-relaxed">{result.guion_generado.intensidad_conflictual.por_que_incomoda}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 4 ─── MICRO-LOOPS — Análisis de retención */}
            {result.guion_generado.metricas_micro_loops && (result.guion_generado.metricas_micro_loops.total_loops > 0) && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent flex-1" />
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">🔄 Arquitectura de Micro-Loops</span>
                  <div className="h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent flex-1" />
                </div>
                <div className="bg-[#0f1115] border border-blue-500/20 rounded-2xl p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    {[
                      { label: 'Total Loops', val: result.guion_generado.metricas_micro_loops.total_loops, c: 'text-blue-400' },
                      { label: 'Resueltos', val: result.guion_generado.metricas_micro_loops.loops_resueltos, c: 'text-green-400' },
                      { label: 'Sin resolver', val: result.guion_generado.metricas_micro_loops.sin_resolver, c: 'text-orange-400' },
                      { label: 'Frecuencia avg', val: result.guion_generado.metricas_micro_loops.frecuencia_promedio_seg ? `${result.guion_generado.metricas_micro_loops.frecuencia_promedio_seg}s` : '—', c: 'text-cyan-400' },
                    ].map(item => (
                      <div key={item.label} className="bg-[#080808] rounded-xl p-3 border border-white/5 text-center">
                        <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">{item.label}</p>
                        <p className={`text-2xl font-black ${item.c}`}>{item.val}</p>
                      </div>
                    ))}
                  </div>
                  {result.guion_generado.metricas_micro_loops.efectividad_potencial && (
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold mb-3 ${result.guion_generado.metricas_micro_loops.efectividad_potencial === 'alta' ? 'bg-green-500/10 text-green-300 border border-green-500/20' : result.guion_generado.metricas_micro_loops.efectividad_potencial === 'media' ? 'bg-yellow-500/10 text-yellow-300 border border-yellow-500/20' : 'bg-orange-500/10 text-orange-300 border border-orange-500/20'}`}>
                      <span>Efectividad potencial: {result.guion_generado.metricas_micro_loops.efectividad_potencial?.toUpperCase()}</span>
                    </div>
                  )}
                  {result.guion_generado.metricas_micro_loops.diagnostico_loops && (
                    <p className="text-[10px] text-gray-400 leading-relaxed">{result.guion_generado.metricas_micro_loops.diagnostico_loops}</p>
                  )}
                </div>
              </div>
            )}

            {/* 6 ─── TCA (MASIVIDAD) */}
            {result.guion_generado.analisis_tca && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent flex-1" />
                  <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em]">Análisis de Masividad TCA</span>
                  <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent flex-1" />
                </div>
                <TcaCard
                  tca={result.guion_generado.analisis_tca}
                  mapa={result.guion_generado.mapa_de_adaptacion}
                  nicho={result.metadata_video?.nicho_usuario || ''}
                />
              </div>
            )}

            {/* 7 ─── SUPERIORIDAD + POSICIONAMIENTO */}
            {(result.guion_generado.sistema_superioridad || result.guion_generado.posicionamiento_y_proximos_pasos) && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent flex-1" />
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">Estrategia & Posicionamiento</span>
                  <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent flex-1" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {result.guion_generado.sistema_superioridad && <SistemaSuperioridadCard data={result.guion_generado.sistema_superioridad} />}
                  {result.guion_generado.posicionamiento_y_proximos_pasos && <PosicionamientoCard data={result.guion_generado.posicionamiento_y_proximos_pasos} />}
                </div>
              </div>
            )}

            {/* 8 ─── ACTIVADORES DE GUARDADO */}
            {result.guion_generado.activadores_guardado?.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent flex-1" />
                  <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em]">Activadores de Guardado</span>
                  <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent flex-1" />
                </div>
                <ActivadoresCard data={result.guion_generado.activadores_guardado} />
              </div>
            )}

            {/* 6 ─── VALIDACIÓN OLIMPO */}
            {result.guion_generado._validacion_olimpo && (
              <div className={`rounded-xl border p-4 ${(result.guion_generado._validacion_olimpo?.score_validacion || 0) >= 7 ? 'bg-green-500/5 border-green-500/20' : (result.guion_generado._validacion_olimpo?.score_validacion || 0) >= 5 ? 'bg-yellow-500/5 border-yellow-500/20' : 'bg-orange-500/5 border-orange-500/20'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <Sparkles size={14} className={result.guion_generado._validacion_olimpo.score_validacion >= 7 ? 'text-green-400' : result.guion_generado._validacion_olimpo.score_validacion >= 5 ? 'text-yellow-400' : 'text-orange-400'} />
                  <div>
                    <p className={`text-xs font-black uppercase tracking-wide ${result.guion_generado._validacion_olimpo.score_validacion >= 7 ? 'text-green-400' : result.guion_generado._validacion_olimpo.score_validacion >= 5 ? 'text-yellow-400' : 'text-orange-400'}`}>
                      Validación OLIMPO: {result.guion_generado._validacion_olimpo.score_validacion}/10 checks
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {result.guion_generado._validacion_olimpo.score_validacion >= 7 ? 'ADN viral íntegro — guion listo para dominar' : result.guion_generado._validacion_olimpo.score_validacion >= 5 ? 'Análisis completo — revisar checks pendientes' : 'Análisis incompleto — regenerar recomendado'}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {[
                    { key: 'arquitectura_completa', label: 'Arquitectura' },
                    { key: 'loops_detectados', label: 'Loops' },
                    { key: 'tca_identificado', label: 'TCA' },
                    { key: 'adn_estructural_mantenido', label: 'ADN' },
                    { key: 'genero_narrativo_respetado', label: 'Género' },
                    { key: 'emocion_nucleo_presente', label: 'Emoción' },
                    { key: 'teleprompter_sin_etiquetas', label: 'Teleprompter' },
                    { key: 'equilibrio_ideal_detectado', label: 'Equilibrio' },
                    { key: 'filtro_implicito_extraido', label: 'Filtro' },
                    { key: 'adaptacion_sin_micronicho', label: 'Sin Micronicho' },
                    { key: 'conflicto_original_preservado', label: 'Conflicto' },
                    { key: 'riesgo_narrativo_mantenido', label: 'Riesgo' },
                    { key: 'intensidad_equivalente_o_superior', label: 'Intensidad' },
                    { key: 'guion_concreto_no_abstracto', label: 'Concreto' },
                    { key: 'punto_critico_presente', label: 'Punto Crítico' },
                    { key: 'decision_clara_presente', label: 'Decisión' },
                  ].map(c => {
                    const val = result.guion_generado._validacion_olimpo[c.key];
                    return (
                      <div key={c.key} className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[9px] font-black uppercase border ${val ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-gray-800 border-gray-700 text-gray-600'}`}>
                        <span>{val ? '✓' : '✗'}</span><span>{c.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* MOTORES INCOMPLETOS */}
            {result.guion_generado._motores_faltantes?.length > 0 && (
              <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl px-4 py-3 flex items-center gap-3">
                <AlertCircle size={14} className="text-orange-400 shrink-0" />
                <div>
                  {/* ✅ FIX BUG #3 — motor count dinámico */}
                  <p className="text-xs font-black text-orange-400 uppercase tracking-wide">
                    {result.guion_generado._motores_completos}/{(result.guion_generado._motores_completos || 0) + (result.guion_generado._motores_faltantes?.length || 0)} motores — {result.guion_generado._completitud_pct}% completado
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    Incompletos: {result.guion_generado._motores_faltantes?.join(', ')}
                  </p>
                </div>
              </div>
            )}

            {/* 6B ─── EQUIVALENCIA ESTRUCTURAL V1000 */}
            {result.guion_generado.equivalencia_estructural_v1000 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent flex-1" />
                  <span className="text-[10px] font-black text-orange-400 uppercase tracking-[0.3em]">Equivalencia Estructural V1000</span>
                  <div className="h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent flex-1" />
                </div>
                <div className="bg-[#0c0c0c] border border-orange-500/20 rounded-xl p-4 space-y-4">

                  {/* Fila 1: Género y Conflicto */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-black/40 rounded-lg p-3 border border-white/5">
                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-wider mb-1">Género Narrativo</p>
                      <p className="text-[10px] text-orange-300 font-bold">{result.guion_generado.equivalencia_estructural_v1000.genero_narrativo_original}</p>
                      <p className="text-[9px] text-gray-600 mt-0.5">→ Adaptado: <span className="text-white">{result.guion_generado.equivalencia_estructural_v1000.genero_narrativo_adaptado}</span></p>
                    </div>
                    <div className="bg-black/40 rounded-lg p-3 border border-white/5">
                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-wider mb-1">Tipo de Conflicto</p>
                      <p className="text-[10px] text-orange-300 font-bold">{result.guion_generado.equivalencia_estructural_v1000.tipo_conflicto_original}</p>
                      <p className="text-[9px] text-gray-600 mt-0.5">→ Adaptado: <span className="text-white">{result.guion_generado.equivalencia_estructural_v1000.tipo_conflicto_adaptado}</span></p>
                    </div>
                  </div>

                  {/* Fila 2: Riesgo e Intensidad */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-black/40 rounded-lg p-3 border border-white/5 text-center">
                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-wider mb-1">Riesgo Original</p>
                      <p className="text-lg font-black text-orange-400">{result.guion_generado.equivalencia_estructural_v1000.riesgo_narrativo_original}</p>
                    </div>
                    <div className="bg-black/40 rounded-lg p-3 border border-white/5 text-center">
                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-wider mb-1">Riesgo Adaptado</p>
                      <p className={`text-lg font-black ${result.guion_generado.equivalencia_estructural_v1000.riesgo_narrativo_adaptado >= result.guion_generado.equivalencia_estructural_v1000.riesgo_narrativo_original ? 'text-green-400' : 'text-red-400'}`}>
                        {result.guion_generado.equivalencia_estructural_v1000.riesgo_narrativo_adaptado}
                      </p>
                    </div>
                    <div className="bg-black/40 rounded-lg p-3 border border-white/5 text-center">
                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-wider mb-1">Intensidad Original</p>
                      <p className="text-[10px] font-black text-orange-300">{result.guion_generado.equivalencia_estructural_v1000.intensidad_emocional_original}</p>
                    </div>
                    <div className="bg-black/40 rounded-lg p-3 border border-white/5 text-center">
                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-wider mb-1">Intensidad Adaptada</p>
                      <p className="text-[10px] font-black text-green-300">{result.guion_generado.equivalencia_estructural_v1000.intensidad_emocional_adaptada}</p>
                    </div>
                  </div>

                  {/* Fila 3: Bandos */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-green-500/5 rounded-lg p-3 border border-green-500/15">
                      <p className="text-[9px] font-black text-green-500 uppercase tracking-wider mb-1">✓ Bando A (de acuerdo)</p>
                      <p className="text-[10px] text-gray-300">{result.guion_generado.equivalencia_estructural_v1000.bando_A_adaptado}</p>
                    </div>
                    <div className="bg-red-500/5 rounded-lg p-3 border border-red-500/15">
                      <p className="text-[9px] font-black text-red-400 uppercase tracking-wider mb-1">✗ Bando B (en contra)</p>
                      <p className="text-[10px] text-gray-300">{result.guion_generado.equivalencia_estructural_v1000.bando_B_adaptado}</p>
                    </div>
                  </div>

                  {/* Fila 4: Checks críticos + Score */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {[
                      { key: 'punto_critico_detectado', label: 'Punto Crítico' },
                      { key: 'decision_clara_detectada', label: 'Decisión Clara' },
                      { key: 'abstraccion_detectada', label: 'Sin Abstracción', invert: true },
                    ].map(c => {
                      const raw = result.guion_generado.equivalencia_estructural_v1000[c.key];
                      const val = c.invert ? !raw : raw;
                      return (
                        <span key={c.key} className={`text-[9px] font-black px-2 py-1 rounded-lg border uppercase ${val ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                          {val ? '✓' : '✗'} {c.label}
                        </span>
                      );
                    })}
                    <span className="ml-auto text-[10px] font-black text-orange-300 bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-lg">
                      Fidelidad: {result.guion_generado.equivalencia_estructural_v1000.fidelidad_mecanismo_score}/100
                    </span>
                  </div>

                  {/* Alerta si hay suavizamiento */}
                  {result.guion_generado.equivalencia_estructural_v1000.alerta_suavizamiento &&
                   result.guion_generado.equivalencia_estructural_v1000.alerta_suavizamiento !== 'null' && (
                    <div className="flex items-start gap-2 bg-red-500/5 border border-red-500/20 rounded-lg px-3 py-2">
                      <AlertTriangle size={12} className="text-red-400 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-red-300">{result.guion_generado.equivalencia_estructural_v1000.alerta_suavizamiento}</p>
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* 10 ─── PRE-ANÁLISIS JUEZ + AUDITORÍA */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent flex-1" />
                <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em]">Auditoría de Calidad</span>
                <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent flex-1" />
              </div>

              {/* Paquete Juez Viral — pre-análisis gratuito */}
              {result.guion_generado?.paquete_juez_viral && (
                <div className="mb-4 bg-[#0d0d18] border border-purple-500/20 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black text-purple-300 uppercase tracking-widest flex items-center gap-2">
                      🧠 Pre-análisis del Juez Viral
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${result.guion_generado.paquete_juez_viral.score_preparacion || 0}%` }}
                          className={`h-full rounded-full ${(result.guion_generado.paquete_juez_viral.score_preparacion || 0) >= 70 ? 'bg-green-500' : 'bg-orange-500'}`}
                        />
                      </div>
                      <span className={`text-xs font-black ${(result.guion_generado.paquete_juez_viral.score_preparacion || 0) >= 70 ? 'text-green-400' : 'text-orange-400'}`}>
                        {result.guion_generado.paquete_juez_viral.score_preparacion}%
                      </span>
                    </div>
                  </div>
                  {result.guion_generado.paquete_juez_viral.resumen_adn?.patron_detectado && (
                    <p className="text-[10px] text-gray-400 mb-3">
                      Patrón: <span className="text-purple-300 font-bold">{result.guion_generado.paquete_juez_viral.resumen_adn.patron_detectado}</span>
                    </p>
                  )}
                  {result.guion_generado.paquete_juez_viral.alertas_criticas?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {result.guion_generado.paquete_juez_viral.alertas_criticas.map((a: string, i: number) => (
                        <span key={i} className="text-[9px] bg-orange-500/10 border border-orange-500/20 text-orange-300 px-2 py-1 rounded-lg font-bold">⚠ {a}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <OmegaAuditCard
                auditData={auditResult}
                onAudit={handleRunAudit}
                isAuditing={isAuditing}
                listoParaAuditoria={result.guion_generado?.listo_para_auditoria}
              />
            </div>

          </div>
        </div>
      )}
    </div>
  );
};