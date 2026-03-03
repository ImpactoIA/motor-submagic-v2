import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import {
  Zap, Search, Copy, CheckCircle2, AlertTriangle,
  Loader2, Target, Brain, Film, Flame,
  Clapperboard, Sparkles, MoveRight, Upload,
  Trash2, Link as LinkIcon, Plus, X,
  Clock, Layers,
  Gavel, AlertCircle, RefreshCw
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

const OmegaScriptView = ({ scriptData }: { scriptData: any }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'camara' | 'broll' | 'musica'>('camara');

  const scriptText =
    scriptData.guion_adaptado_al_nicho ||
    scriptData.guion_tecnico_completo ||
    scriptData.guion_completo;

  const planAudiovisual = scriptData.plan_audiovisual_profesional || null;
  const visualPlan      = planAudiovisual?.secuencia_temporal || scriptData.plan_visual_director || scriptData.plan_visual;
  const bRolls          = planAudiovisual?.b_rolls_estrategicos || [];
  const musica          = planAudiovisual?.musica || null;
  const ritmoCamara     = planAudiovisual?.ritmo_de_cortes || null;
  const efectos         = planAudiovisual?.efectos_de_retencion || null;
  const miniatura       = scriptData.miniatura_dominante || null;

  const copyScript = () => {
    if (!scriptText) return;
    navigator.clipboard.writeText(scriptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const words = scriptText?.trim().split(/\s+/).filter(Boolean).length || 0;
  const wordsBadge = words >= 180 ? { cls: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: `${words} palabras ✓` }
    : words < 150 ? { cls: 'bg-red-500/20 text-red-400 border-red-500/30', label: `${words} palabras ⚠ corto` }
    : { cls: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', label: `${words} palabras ~` };

  return (
    <div className="bg-[#080808] border border-green-500/30 rounded-2xl overflow-hidden shadow-[0_0_50px_-20px_rgba(34,197,94,0.15)]">
      {/* Header */}
      <div className="bg-green-900/10 border-b border-green-500/20 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-green-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">READY TO SHOOT</span>
            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider border ${wordsBadge.cls}`}>{wordsBadge.label}</span>
          </div>
          <h3 className="text-lg font-black text-white flex items-center gap-2 tracking-tight">
            <Clapperboard className="text-green-400" size={20} /> GUION DE PRODUCCIÓN
          </h3>
        </div>
        <button
          onClick={copyScript}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-black px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-lg active:scale-95 w-full sm:w-auto justify-center"
        >
          {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
          {copied ? 'COPIADO' : 'COPIAR TELEPROMPTER'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
        {/* Panel izquierdo: Dirección */}
        <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-white/5 bg-[#0c0c0c] flex flex-col">
          <div className="p-4 border-b border-white/5 bg-[#0f1115] sticky top-0 z-10">
            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <Film size={12} /> Dirección de Cámara & Audio
            </h4>
          </div>

          {planAudiovisual && (
            <div className="flex border-b border-white/5 px-4">
              {[
                { id: 'camara', label: '🎥 Cámara' },
                { id: 'broll',  label: '🎞 B-Roll' },
                { id: 'musica', label: '🎧 Música' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-2 text-[10px] font-black uppercase tracking-wider transition-all border-b-2 ${
                    activeTab === tab.id ? 'border-green-500 text-green-400' : 'border-transparent text-gray-600 hover:text-gray-400'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          <div className="p-4 space-y-6 overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-gray-800">
            {/* TAB CÁMARA */}
            {(!planAudiovisual || activeTab === 'camara') && visualPlan?.map((scene: any, idx: number) => (
              <div key={idx} className="relative pl-4 border-l-2 border-gray-800 text-xs group hover:border-green-500/50 transition-colors">
                <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-gray-800 border border-gray-700 group-hover:bg-green-500 group-hover:border-green-400 transition-colors" />
                <span className="text-green-400 font-mono font-bold block mb-2 text-[10px] bg-green-900/10 inline-block px-1.5 py-0.5 rounded">{scene.tiempo}</span>
                {scene.tipo_plano && <span className="text-[9px] text-blue-400 font-bold bg-blue-500/10 px-1.5 py-0.5 rounded ml-1">{scene.tipo_plano}</span>}
                {(scene.movimiento_camara || scene.accion_camara || scene.instruccion_produccion) && (
                  <div className="mb-2 mt-1.5 text-blue-300 font-bold flex items-start gap-1.5 leading-tight">
                    <span className="opacity-50 mt-0.5">🎥</span>
                    {scene.movimiento_camara || scene.accion_camara || scene.instruccion_produccion}
                  </div>
                )}
                <p className="text-gray-300 font-medium leading-relaxed mb-2">{scene.descripcion_visual || scene.accion_adaptada || scene.accion_en_pantalla}</p>
                {scene.texto_en_pantalla && <div className="bg-white/5 rounded px-2 py-1 mb-2 text-[10px] text-yellow-300 font-bold">📝 {scene.texto_en_pantalla}</div>}
                {scene.emocion_objetivo && <div className="text-[9px] text-rose-400 font-bold mb-1">❤ {scene.emocion_objetivo}</div>}
                {scene.efecto_retencion && <div className="text-[9px] text-purple-400 font-bold">⚡ {scene.efecto_retencion}</div>}
                {(scene.audio_sfx || scene.audio) && (
                  <div className="mt-2 pt-2 border-t border-white/5 text-orange-400/90 text-[10px] font-mono flex items-center gap-1.5">
                    <span className="opacity-70">🔊</span> {scene.audio_sfx || scene.audio}
                  </div>
                )}
              </div>
            ))}

            {/* TAB B-ROLL */}
            {planAudiovisual && activeTab === 'broll' && (
              <div className="space-y-4">
                {bRolls.length > 0 ? bRolls.map((br: any, idx: number) => (
                  <div key={idx} className="bg-[#080808] rounded-xl p-3 border border-white/5">
                    <span className="text-[9px] font-black text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20 inline-block mb-2">{br.momento}</span>
                    <p className="text-xs text-white font-bold mb-1">🎞 {br.que_mostrar}</p>
                    <p className="text-[10px] text-gray-400 mb-1">↳ {br.por_que_refuerza}</p>
                    <p className="text-[9px] text-rose-400 font-bold">❤ {br.emocion_generada}</p>
                  </div>
                )) : <p className="text-xs text-gray-600 text-center py-8">Sin b-rolls generados</p>}
              </div>
            )}

            {/* TAB MÚSICA */}
            {planAudiovisual && activeTab === 'musica' && (
              <div className="space-y-4">
                {musica && (
                  <div className="bg-[#080808] rounded-xl p-4 border border-orange-500/10">
                    <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest mb-3">🎧 Música</p>
                    <div className="space-y-2">
                      {[
                        { l: 'Estilo', v: musica.tipo, c: 'text-white' },
                        { l: 'BPM', v: musica.bpm_aproximado, c: 'text-orange-400' },
                        { l: 'Emoción', v: musica.emocion_dominante, c: 'text-white' },
                        { l: 'Entrada', v: musica.entrada_musica, c: 'text-white' },
                      ].map(item => (
                        <div key={item.l} className="flex justify-between text-xs">
                          <span className="text-gray-500">{item.l}</span>
                          <span className={`font-bold ${item.c}`}>{item.v}</span>
                        </div>
                      ))}
                      {musica.cambio_musical && <div className="pt-2 border-t border-white/5 text-[10px] text-yellow-300">🔄 {musica.cambio_musical}</div>}
                    </div>
                  </div>
                )}
                {ritmoCamara && (
                  <div className="bg-[#080808] rounded-xl p-4 border border-purple-500/10">
                    <p className="text-[9px] font-black text-purple-400 uppercase tracking-widest mb-3">✂ Ritmo de Cortes</p>
                    <span className="text-xs font-black text-white bg-purple-500/10 px-2 py-1 rounded-full border border-purple-500/20 inline-block">{ritmoCamara.patron_general}</span>
                    <p className="text-[10px] text-gray-400 leading-relaxed mt-2">{ritmoCamara.descripcion}</p>
                    {ritmoCamara.aceleraciones && <p className="text-[10px] text-green-400 mt-1">⚡ {ritmoCamara.aceleraciones}</p>}
                    {ritmoCamara.desaceleraciones && <p className="text-[10px] text-blue-400 mt-1">🐌 {ritmoCamara.desaceleraciones}</p>}
                  </div>
                )}
                {efectos && (
                  <div className="bg-[#080808] rounded-xl p-4 border border-cyan-500/10">
                    <p className="text-[9px] font-black text-cyan-400 uppercase tracking-widest mb-3">🔊 Efectos de Retención</p>
                    <div className="space-y-1.5">
                      {efectos.sonido_transicion && <p className="text-[10px] text-gray-300">🎵 {efectos.sonido_transicion}</p>}
                      {efectos.micro_silencios && <p className="text-[10px] text-gray-300">🔇 {efectos.micro_silencios}</p>}
                      {efectos.cambios_de_plano && <p className="text-[10px] text-gray-300">✂ {efectos.cambios_de_plano}</p>}
                    </div>
                  </div>
                )}
                {!musica && !ritmoCamara && !efectos && <p className="text-xs text-gray-600 text-center py-8">Sin datos de música generados</p>}
              </div>
            )}

            {!visualPlan && !planAudiovisual && (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <Film size={24} className="text-gray-700 mb-2" />
                <p className="text-xs text-gray-600">Plan visual generándose...</p>
              </div>
            )}
          </div>

          {/* 🖼 MINIATURA DOMINANTE */}
          {miniatura && (
            <div className="border-t border-white/5 p-4">
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3">🖼 Miniatura Dominante</p>
              <div className="bg-gradient-to-r from-gray-900 to-black rounded-xl p-4 border border-white/10 mb-3 text-center">
                <p className="text-xl font-black text-white leading-tight">{miniatura.frase_principal}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {miniatura.variante_agresiva && (
                  <div className="bg-red-500/5 border border-red-500/15 rounded-lg p-2 text-center">
                    <p className="text-[8px] text-red-400 font-black uppercase mb-1">Agresiva</p>
                    <p className="text-[11px] text-white font-bold">{miniatura.variante_agresiva}</p>
                  </div>
                )}
                {miniatura.variante_aspiracional && (
                  <div className="bg-blue-500/5 border border-blue-500/15 rounded-lg p-2 text-center">
                    <p className="text-[8px] text-blue-400 font-black uppercase mb-1">Aspiracional</p>
                    <p className="text-[11px] text-white font-bold">{miniatura.variante_aspiracional}</p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'CTR',        val: miniatura.ctr_score,           color: 'text-yellow-400' },
                  { label: 'Disrupción', val: miniatura.nivel_disrupcion,     color: 'text-red-400'    },
                  { label: 'Curiosidad', val: miniatura.nivel_gap_curiosidad, color: 'text-blue-400'   },
                  { label: 'Polariz.',   val: miniatura.nivel_polarizacion,   color: 'text-pink-400'   },
                ].map(m => (
                  <div key={m.label} className="text-center bg-[#080808] rounded-lg p-2 border border-white/5">
                    <p className={`text-lg font-black ${m.color}`}>{m.val}</p>
                    <p className="text-[8px] text-gray-600 uppercase">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Teleprompter */}
        <div className="lg:col-span-8 bg-[#080808] p-8 flex flex-col">
          <div className="prose prose-invert max-w-none flex-1">
            <div className="whitespace-pre-wrap font-mono text-base md:text-lg leading-loose text-gray-200 selection:bg-green-500/30">
              {scriptText}
            </div>
          </div>
        </div>
      </div>
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
      <div className="space-y-3">
        {[
          { label: '¿Qué la hace viral?',         val: data.que_hace_viral,           color: 'text-amber-300'  },
          { label: 'Creencia que rompe',           val: data.creencia_rota,            color: 'text-red-300'    },
          { label: 'Postura que instala',          val: data.postura_impuesta,         color: 'text-blue-300'   },
          { label: '¿Por qué genera conversación?',val: data.por_que_genera_conversacion, color: 'text-purple-300'},
          { label: 'Tensión que deja abierta',     val: data.tension_no_resuelta,      color: 'text-orange-300' },
        ].map(item => item.val ? (
          <div key={item.label} className="bg-[#080808] rounded-xl p-3 border border-white/5">
            <p className="text-[9px] text-gray-600 uppercase tracking-widest mb-1">{item.label}</p>
            <p className={`text-xs font-bold leading-relaxed ${item.color}`}>{item.val}</p>
          </div>
        ) : null)}
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

const IRProScoreCard = ({ score }: { score: any }) => {
  if (!score) return (
    <div className="bg-[#0f1115] border border-purple-500/30 rounded-2xl p-6">
      <h3 className="text-purple-400 text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
        <Zap size={12} fill="currentColor" /> Score Viral Estructural
      </h3>
      <div className="flex items-baseline gap-2 mb-6">
        <span className="text-5xl font-black text-white">—</span>
        <span className="text-gray-500 font-bold">/100</span>
      </div>
      <p className="text-gray-600 text-xs">Procesando motores...</p>
    </div>
  );
  return (
    <div className="bg-[#0f1115] border border-purple-500/30 rounded-2xl p-6 shadow-[0_0_30px_-10px_rgba(168,85,247,0.2)]">
      <h3 className="text-purple-400 text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
        <Zap size={12} fill="currentColor" /> Score Viral Estructural
      </h3>
      <div className="flex items-baseline gap-2 mb-6">
        <span className="text-5xl font-black text-white">{score?.viralidad_estructural_global || 0}</span>
        <span className="text-gray-500 font-bold">/100</span>
      </div>
      <div className="space-y-4">
        {[
          { label: 'Retención',   val: score?.retencion_estructural || 0, color: 'bg-blue-500'   },
          { label: 'Emoción',     val: score?.intensidad_emocional  || 0, color: 'bg-pink-500'   },
          { label: 'Polarización',val: score?.polarizacion          || 0, color: 'bg-orange-500' },
          { label: 'Atención',    val: score?.manipulacion_atencion || 0, color: 'bg-purple-500' },
          { label: 'Valor',       val: score?.densidad_valor        || 0, color: 'bg-green-500'  },
        ].map(item => (
          <div key={item.label} className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
              <span className="text-gray-400">{item.label}</span>
              <span className="text-white">{item.val}%</span>
            </div>
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
              <div style={{ width: `${item.val}%` }} className={`h-full ${item.color} transition-all duration-1000`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================================================================================
// ⚙️ MOTORES ACTIVOS
// ==================================================================================

const MotoresActivosCard = ({ output }: { output: any }) => {
  const motores = [
    { num: '01',  nombre: 'Estructura',   dato: output.adn_estructura?.patron_narrativo_detectado },
    { num: '02',  nombre: 'Emoción',      dato: output.curva_emocional?.emocion_dominante },
    { num: '03',  nombre: 'Loops',        dato: `${output.micro_loops?.total_loops || 0} loops` },
    { num: '04',  nombre: 'Polarización', dato: output.polarizacion?.posicionamiento_vs },
    { num: '07',  nombre: 'Valor',        dato: output.densidad_valor?.tipo_valor_dominante },
    { num: '09',  nombre: 'Guardado',     dato: `${output.activadores_guardado?.length || 0} triggers` },
    { num: '12',  nombre: 'Ritmo',        dato: output.ritmo_narrativo?.velocidad_progresion },
    { num: '14A', nombre: 'Género',       dato: output.adn_profundo?.genero_narrativo },
    { num: '14B', nombre: 'Idea Nuclear', dato: output.idea_nuclear_ganadora?.que_hace_viral?.substring(0, 40) },
    { num: '16',  nombre: 'TCA',          dato: output.analisis_tca?.nivel_tca_detectado ? `${output.analisis_tca.nivel_tca_detectado} — ${output.analisis_tca.sector_detectado || ''}` : null },
    { num: '17',  nombre: 'Posición',     dato: output.posicionamiento_y_proximos_pasos?.posiciona_como },
    { num: '15',  nombre: 'Blueprint',    dato: output.blueprint_replicable?.nombre_patron },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {motores.map(m => (
        <div key={m.num} className="bg-[#080808] border border-white/5 p-3 rounded-xl hover:border-green-500/20 transition-colors group">
          <div className="text-[9px] font-black text-gray-600 group-hover:text-green-500/50 mb-1 transition-colors">{m.num} {m.nombre}</div>
          <div className="text-[11px] text-gray-300 font-bold truncate uppercase tracking-tight">{m.dato || 'Analizando...'}</div>
        </div>
      ))}
    </div>
  );
};

// ==================================================================================
// 🔬 AUDITORÍA CON JUEZ VIRAL
// ==================================================================================

const OmegaAuditCard = ({ auditData, onAudit, isAuditing }: { auditData: any; onAudit: () => void; isAuditing: boolean }) => {
  if (!auditData) {
    return (
      <div className="flex justify-center">
        <button
          onClick={onAudit}
          disabled={isAuditing}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/50 rounded-xl text-purple-300 font-black uppercase tracking-widest transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100"
        >
          {isAuditing ? <RefreshCw className="animate-spin" size={18} /> : <Gavel size={18} />}
          {isAuditing ? 'JUZGANDO...' : 'AUDITAR CALIDAD (2 CR)'}
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

  const validUrls = urls.filter(u => u.trim());
  const urlCount  = uploadMode === 'file' ? 1 : Math.max(validUrls.length, 1);
  const cost      = computeCost(contentType, urlCount);

  useEffect(() => { loadUserData(); }, []);

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
    if (file.size > 100 * 1024 * 1024) { setErrorMsg('Archivo demasiado grande. Máximo 100MB.'); return; }
    const reader = new FileReader();
    reader.onloadend = () => { setUploadedVideoFile(reader.result as string); setUploadedFileName(file.name); };
    reader.readAsDataURL(file);
  };
  const handleClearUpload = () => { setUploadedVideoFile(null); setUploadedFileName(''); };

  const handleRunAudit = async () => {
    if (!result?.guion_generado || !userProfile) return;
    if ((userProfile.credits || 0) < 2) { alert('Necesitas 2 créditos para auditar.'); return; }
    setIsAuditing(true);
    const scriptText =
      result.guion_generado?.guion_tecnico_completo ||
      result.guion_generado?.guion_completo_adaptado ||
      result.guion_generado?.guion_completo || '';
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

      const { data, error } = await supabase.functions.invoke('process-url', { body: payload });
      if (error) throw error;
      if (!data.success) throw new Error(data.error || 'Error desconocido.');

      const resPro = data.generatedData;
      setIrProState({
        etapa: 'completo',
        iteracion: resPro.iteracion_loop || 0,
        scoreActual: resPro.score_final_obtenido || 0,
        output: resPro,
        guionGenerado: resPro.guion_adaptado_al_nicho,
        veredictoJuez: null,
        error: null,
      });
      setResult(resPro);
      if (refreshProfile) refreshProfile();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error de conexión con Titan Brain.');
      setIrProState(prev => ({ ...prev, etapa: 'idle', error: err.message }));
    } finally {
      setLoading(false);
    }
  };

  // ==================================================================================
  // 🎨 RENDER
  // ==================================================================================

  return (
    <div className="max-w-7xl mx-auto pb-32 px-4 sm:px-6 pt-12 animate-in fade-in duration-700">

      {/* HERO */}
      <div className="text-center mb-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-green-500/10 blur-[100px] pointer-events-none rounded-full" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#0f1115] border border-green-500/20 rounded-full text-[10px] font-black text-green-400 uppercase tracking-widest mb-6 shadow-lg cursor-default">
            <Flame size={12} fill="currentColor" /> Titan Engine Omega v3.0
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">
            CLONACIÓN <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-500 to-green-600">VIRAL</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Extrae la arquitectura matemática de 1 a 5 videos virales y replícala en tu nicho con fidelidad quirúrgica.
          </p>
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
            className={`w-full py-5 rounded-xl text-sm font-black uppercase tracking-widest flex justify-center items-center gap-3 transition-all shadow-lg mt-2 relative overflow-hidden group ${loading ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-white hover:bg-gray-100 text-black shadow-white/5 hover:shadow-white/20 transform hover:-translate-y-0.5'}`}>
            {loading ? (
              <><Loader2 size={20} className="animate-spin text-green-600" /><span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent animate-pulse">EXTRAYENDO ADN VIRAL...</span></>
            ) : (
              <><Zap size={20} className="group-hover:scale-110 transition-transform" /><span>EJECUTAR CLONACIÓN ({cost} CR)</span></>
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

      {/* ─── ZONA DE RESULTADOS ─── */}
      {result && result.guion_generado && (
        <div className="mt-20 space-y-10 animate-in slide-in-from-bottom-10 duration-1000">

          {/* Badge modo */}
          <div className="flex items-center justify-center gap-6 opacity-60">
            <div className="h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent w-40" />
            <span className="text-[10px] font-black text-green-400 uppercase tracking-[0.3em] flex items-center gap-2">
              <Sparkles size={12} />
              {result.modo === 'ingenieria_inversa_pro_hibrida' ? 'ARQUITECTURA HÍBRIDA GENERADA' : 'CLONACIÓN EXITOSA'}
            </span>
            <div className="h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent w-40" />
          </div>

          {/* SCORE + MOTORES */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4">
                <IRProScoreCard score={result.guion_generado?.score_viral_estructural} />
              </div>
              <div className="lg:col-span-8 bg-[#0f1115] border border-white/5 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                  <Brain className="text-green-500" size={18} />
                  <h3 className="text-white font-black text-sm uppercase tracking-tighter italic">Motores de Ingeniería Inversa Activos</h3>
                </div>
                <MotoresActivosCard output={result.guion_generado} />
              </div>
            </div>
          </div>

          {/* Multi-URL badge */}
          {(result.metadata_video?.urls_analizadas || 0) > 1 && (
            <div className="max-w-3xl mx-auto p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl text-xs text-blue-300 flex items-center gap-3">
              <Layers size={16} />
              <span>Arquitectura híbrida construida a partir de <strong>{result.metadata_video.urls_analizadas} videos</strong> analizados.</span>
            </div>
          )}

          <div className="space-y-8">

            {/* 1 ─── GUION (LO MÁS IMPORTANTE) */}
            <OmegaScriptView scriptData={result.guion_generado} />

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

            {/* 3 ─── TCA (MASIVIDAD) */}
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

            {/* 4 ─── SUPERIORIDAD + POSICIONAMIENTO */}
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

            {/* 5 ─── ACTIVADORES DE GUARDADO */}
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
              <div className={`rounded-xl border p-4 ${result.guion_generado._validacion_olimpo.score_validacion >= 7 ? 'bg-green-500/5 border-green-500/20' : result.guion_generado._validacion_olimpo.score_validacion >= 5 ? 'bg-yellow-500/5 border-yellow-500/20' : 'bg-orange-500/5 border-orange-500/20'}`}>
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
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
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
                  <p className="text-xs font-black text-orange-400 uppercase tracking-wide">
                    {result.guion_generado._motores_completos}/21 motores — {result.guion_generado._completitud_pct}% completado
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    Incompletos: {result.guion_generado._motores_faltantes?.join(', ')}
                  </p>
                </div>
              </div>
            )}

            {/* 7 ─── AUDITORÍA JUEZ VIRAL */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent flex-1" />
                <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em]">Auditoría de Calidad</span>
                <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent flex-1" />
              </div>
              <OmegaAuditCard auditData={auditResult} onAudit={handleRunAudit} isAuditing={isAuditing} />
            </div>

          </div>
        </div>
      )}
    </div>
  );
};