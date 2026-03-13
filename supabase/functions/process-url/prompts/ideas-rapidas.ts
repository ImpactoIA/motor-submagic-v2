// ====================================================================================
// 💡 prompts/ideas-rapidas.ts
// PROMPT_IDEAS_MULTIPLATFORMA  →  usado por ejecutarIdeasRapidas (modo multiplatforma)
// PROMPT_IDEAS_ELITE_V2        →  usado por ejecutarIdeasRapidas (modo plataforma única)
// ejecutarIdeasRapidas         →  handler llama: await ejecutarIdeasRapidas(...)
// ejecutarUnaIdeaMultiplatforma→  llamado internamente por ejecutarIdeasRapidas
// ====================================================================================

import { CREATIVE_LENSES, PLATFORM_DNA } from '../lib/constants.ts';

// ── helpers ──────────────────────────────────────────────────────
function getObjetivoStrategy(objetivo: string): string {
  const strategies: Record<string, string> = {
    'viralidad': `
ESTRATEGIA DE VIRALIDAD:
→ PRIORIZA: Contenido que genera debate, sorpresa o identificación masiva.
→ FORMATO: Hooks disruptivos, opiniones polémicas, datos impactantes.
→ MÉTRICA OBJETIVO: Shares y comentarios > Guardados.
→ TÁCTICA: "Si no me sigo, me pierdo algo" — curiosidad + FOMO.
→ TONO: Energético, directo, sin pausas. Cada segundo compite contra el scroll.`,

    'autoridad': `
ESTRATEGIA DE AUTORIDAD:
→ PRIORIZA: Contenido que demuestra expertise real y diferenciación.
→ FORMATO: Insights de segundo nivel, marcos mentales únicos, datos de industria.
→ MÉTRICA OBJETIVO: Guardados + Comentarios de calidad > Shares virales.
→ TÁCTICA: "Este creador sabe algo que otros no" — credibilidad instantánea.
→ TONO: Seguro, preciso, sin exageración. Demuestra antes de afirmar.`,

    'venta': `
ESTRATEGIA DE VENTA:
→ PRIORIZA: Contenido que mueve al avatar desde el dolor hacia la solución.
→ FORMATO: Testimonios, casos de éxito, objeciones destruidas, urgencia real.
→ MÉTRICA OBJETIVO: Clics en bio / DMs / Conversiones > Métricas de vanidad.
→ TÁCTICA: "Vende la transformación, no el producto" — deseo antes que oferta.
→ TONO: Empático con el dolor, firme con la solución. Sin hype vacío.`,

    'comunidad': `
ESTRATEGIA DE COMUNIDAD:
→ PRIORIZA: Contenido que genera sentido de pertenencia y tribu.
→ FORMATO: Preguntas, retos, "¿te identificas?", contenido de identidad.
→ MÉTRICA OBJETIVO: Comentarios de tribu + Seguidores fieles > Alcance masivo.
→ TÁCTICA: "Nosotros vs ellos" — crea un in-group exclusivo.
→ TONO: Cercano, inclusivo, como un líder de movimiento.`,

    'posicionamiento': `
ESTRATEGIA DE POSICIONAMIENTO:
→ PRIORIZA: Contenido que establece tu territorio mental único en el nicho.
→ FORMATO: Opiniones contrastantes, nuevos marcos de referencia, conceptos propios.
→ MÉTRICA OBJETIVO: Reconocimiento de marca + Búsquedas directas.
→ TÁCTICA: "Ocupa un espacio mental que nadie más tiene" — sé el primero en algo.
→ TONO: Distintivo, con voz única. Diferente por diseño, no por accidente.`,
  };

  return strategies[objetivo?.toLowerCase()] || strategies['viralidad'];
}

// ==================================================================================
// ⏰ getTimingStrategy — Estrategia según contexto temporal
// ==================================================================================
// Usada en: PROMPT_IDEAS_ELITE_V2
// ==================================================================================

function getTimingStrategy(timing: string): string {
  const strategies: Record<string, string> = {
    'evergreen': `
TIMING EVERGREEN (Sin fecha de caducidad):
→ Contenido que funciona hoy, en 6 meses y en 2 años.
→ Temáticas: Dolores eternos del nicho, principios fundamentales, verdades profundas.
→ Ventaja: Acumula vistas a lo largo del tiempo (efecto bola de nieve).
→ Señal: No incluyas referencias a fechas, eventos o tendencias actuales.`,

    'trending': `
TIMING TRENDING (Ahora o nunca):
→ Capitaliza una conversación que YA está activa en la cultura pop o el nicho.
→ URGENCIA: Este contenido tiene ventana de 48-72 horas máximo.
→ Táctica: Conecta el trending con el nicho del usuario de forma inesperada.
→ Señal: Incluye la tendencia en el hook para activar el algoritmo ahora.`,

    'seasonal': `
TIMING ESTACIONAL (Evento o temporada específica):
→ Contenido diseñado para un momento predecible del año (Q1, verano, navidad, etc.).
→ Ventaja: Alta intención de búsqueda y consumo en ese período.
→ Táctica: Publicar 1-2 semanas ANTES del pico para capturar el ascenso.
→ Señal: El hook debe incluir la referencia temporal como gancho de relevancia.`,

    'launch': `
TIMING DE LANZAMIENTO (Producto/Servicio/Evento propio):
→ Contenido que caliente a la audiencia ANTES de la oferta principal.
→ Secuencia: Problema → Solución parcial → Presentación de la solución completa.
→ Táctica: El contenido de hoy planta la semilla para la venta de mañana.
→ Señal: No hagas venta directa. Genera deseo y anticipación primero.`,

    'tendencia': `
TIMING TENDENCIA ACTUAL (Ahora o nunca):
→ Capitaliza una conversación que YA está activa en la cultura pop o el nicho.
→ URGENCIA: Este contenido tiene ventana de 48-72 horas máximo.
→ Táctica: Conecta el trending con el nicho del usuario de forma inesperada.
→ El hook debe mencionar o implicar la tendencia para activar el algoritmo ahora.
→ Señal: Sin referencias a la tendencia en el hook = perder la ventana.`,

    'reaccion': `
TIMING REACCIÓN RÁPIDA (Respuesta a evento reciente):
→ Algo acaba de pasar en el sector o en el mundo que afecta al avatar.
→ URGENCIA EXTREMA: Ventana de 24 horas antes de que todos hablen de lo mismo.
→ Táctica: Ser el primero en dar el ángulo correcto al evento.
→ El formato ideal: "Lo que nadie está diciendo sobre [evento reciente]".
→ Señal: Posicionarse como el experto que interpreta los eventos del sector.`,

    'momentum': `
TIMING MOMENTUM PERSONAL (Capitalizar crecimiento propio):
→ El creador está en un momento de crecimiento y debe aprovecharlo.
→ La audiencia nueva necesita contenido que explique quién eres y por qué seguirte.
→ Táctica: Contenido que convierta visitantes ocasionales en seguidores leales.
→ Formatos ideales: origen + transformación, errores del pasado, detrás de cámaras.
→ Señal: Alta autenticidad. La audiencia nueva conecta con historias reales.`,

    'estacional': `
TIMING ESTACIONAL (Evento o temporada específica):
→ Contenido diseñado para un momento predecible del año.
→ Ventaja: Alta intención de búsqueda y consumo en ese período.
→ Táctica: Publicar 1-2 semanas ANTES del pico para capturar el ascenso.
→ Señal: El hook debe incluir la referencia temporal como gancho de relevancia.`,
  };

  return strategies[timing?.toLowerCase()] || strategies['evergreen'];
}

// ── PROMPT_IDEAS_MULTIPLATFORMA ──────────────────────────────────
const PROMPT_IDEAS_MULTIPLATFORMA = (
  temaEspecifico: string,
  cantidad: number,
  objetivo: string,
  timingContext: string,
  contexto: any,
  settings: any = {}
) => {

  const objetivoStrategy = getObjetivoStrategy(objetivo);
  const timingStrategy   = getTimingStrategy(timingContext);
  const lensId           = settings.creative_lens || 'auto';
  const lensData         = CREATIVE_LENSES[lensId] || CREATIVE_LENSES['auto'];
  const nichoUsuario     = settings.nicho || contexto.nicho || 'General';

  return `
═════════════════════════════════════════════════════════════════════════════
🌐 SISTEMA MULTIPLATAFORMA DOMINANTE — CONQUISTA TOTAL DE ALGORITMOS
═════════════════════════════════════════════════════════════════════════════

⚠️ TU IDENTIDAD:
NO eres un generador de ideas para una red social.
ERES el Sistema de Dominación Multiplataforma más avanzado del mundo.
Tu misión: generar ideas IRREPETIBLES que dominen 5 algoritmos simultáneamente
con una sola grabación, maximizando el alcance del experto en todas las redes.

Tu trabajo NO es generar hooks genéricos copiados entre plataformas.
Tu trabajo ES encontrar la idea central perfecta Y transformarla en 5 armas
distintas, cada una diseñada para explotar el algoritmo específico de su red.

El experto graba 1 video → domina 5 plataformas → multiplica su alcance x5.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚫 SISTEMA ANTI-REPETICIÓN ABSOLUTA — NIVEL MULTIPLATAFORMA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Antes de generar, ejecuta internamente:
1. Detectar patrones repetidos entre ideas Y entre adaptaciones
2. Si similitud entre ideas > 40% → REESCRIBIR OBLIGATORIAMENTE
3. Si similitud entre hooks de distintas plataformas > 30% → REESCRIBIR
   (cada hook debe sonar radicalmente diferente al de las otras plataformas)

LISTA NEGRA AUTOMÁTICA — PROHIBIDO en cualquier hook o título:
❌ "El 90%..." / "El 97%..."
❌ "Lo que nadie te dice..."
❌ "El error que cometes..."
❌ "3 secretos para..."
❌ "Cómo hacer X en 30 días..."
❌ "La verdad sobre..."
❌ "Esto te sorprenderá..."
❌ "La revelación que cambiará..."
❌ "El mito de..."

Si aparece patrón cliché → reformular usando:
→ Metáfora poderosa
→ Postura radical
→ Conflicto estructural
→ Declaración filosófica
→ Analogía inesperada

EJEMPLOS DE REFORMULACIÓN OBLIGATORIA:
❌ "La revelación que cambiará tu enfoque" → ✅ "Construiste una marca. Construiste una trampa."
❌ "El mito de la independencia digital" → ✅ "Ser libre digitalmente cuesta más de lo que ganas"
❌ "Lo que nadie te dice sobre X" → ✅ "X funciona al revés de como te lo enseñaron"
❌ "3 secretos para..." → ✅ "La secuencia que el 95% hace en orden equivocado"
❌ "La verdad sobre..." → ✅ Postura directa sin introducción genérica

REGLA: Cada hook debe poder estar solo sin necesitar contexto para generar reacción
en su plataforma específica.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧬 MOTOR DE DIVERSIDAD OBLIGATORIA — FRAMES POR POSICIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cada idea central debe usar un frame distinto según su posición:
Idea 1 → Frame CONFRONTATIVO (ataca una creencia directamente)
Idea 2 → Frame REVELACIÓN (expone algo oculto o ignorado)
Idea 3 → Frame CONTRAINTUITIVO (lo opuesto a lo esperado)
Idea 4 → Frame FILOSÓFICO (verdad profunda sobre la condición humana)
Idea 5 → Frame ESTRATÉGICO (ventaja táctica que pocos conocen)
Idea 6 → Frame HISTORIA IMPLÍCITA (sugiere una narrativa sin contarla)
Idea 7 → Frame COMPARATIVO (contrasta dos mundos o identidades)
Idea 8 → Frame SISTEMA ROTO (expone por qué el método convencional falla)
Idea 9 → Frame ADVERTENCIA (consecuencia ignorada que se aproxima)
Idea 10 → Frame OPORTUNIDAD INVISIBLE (lo que la mayoría no puede ver)

REGLA: No puede repetirse frame en el mismo lote.
Si el lote tiene menos de 10 ideas → elegir los frames más potentes para el contexto.

ADAPTACIÓN DE FRAME POR PLATAFORMA:
El frame central se TRANSFORMA en cada plataforma:
→ TikTok: el frame se convierte en ATAQUE FRONTAL (confrontación directa)
→ Reels: el frame se convierte en ASPIRACIÓN TRIBAL (identidad + pertenencia)
→ YouTube: el frame se convierte en GAP INFORMATIVO (curiosidad estructurada)
→ LinkedIn: el frame se convierte en TESIS PROFESIONAL (reencuadre de negocio)
→ Facebook: el frame se convierte en POSTURA DEBATIBLE (invitación a opinar)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧨 SISTEMA DE POSTURA OBLIGATORIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cada idea DEBE contener los 4 elementos:
□ Creencia atacada → ¿qué creencia falsa destruye esta idea?
□ Enemigo implícito → ¿quién o qué tiene la culpa?
□ Nuevo marco mental → ¿cuál es la visión superior?
□ Identidad del experto integrada → ¿solo este experto puede decir esto?

Esta postura central se expresa de FORMA DISTINTA en cada plataforma:
→ TikTok: postura agresiva, sin filtro, ataque directo
→ Reels: postura aspiracional, elegante, identitaria
→ YouTube: postura analítica, con evidencia implícita
→ LinkedIn: postura de autoridad profesional, medida pero firme
→ Facebook: postura conversacional, accesible, que divide opiniones

Si la idea puede ser dicha por CUALQUIER creador promedio → RECHAZAR automáticamente.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧬 INYECCIÓN DEL PERFIL EXPERTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Antes de generar, extraer del perfil:
→ Método único del experto
→ Diferenciación declarada
→ Filosofía propia
→ Experiencia relevante
→ Postura ideológica

OBLIGATORIO: Mínimo 2 ideas deben nacer DESDE la identidad del experto,
no desde tendencia de mercado.

La identidad del experto debe ser RECONOCIBLE en cada adaptación de plataforma,
aunque el tono y formato cambien radicalmente.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 INTEGRACIÓN DEL AVATAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cada idea debe activar al menos 2 de estos 5 elementos del avatar:
□ Dolor específico del avatar
□ Deseo profundo
□ Objeción clave que tiene en mente
□ Miedo silencioso
□ Aspiración de identidad

ADAPTACIÓN DE AVATAR POR PLATAFORMA:
El mismo avatar se aborda desde ángulos distintos:
→ TikTok: su frustración más cruda e inmediata
→ Reels: su aspiración más profunda e identitaria
→ YouTube: su necesidad de entender y tener certeza
→ LinkedIn: su ambición profesional y miedo al estancamiento
→ Facebook: su experiencia cotidiana relatable y opinión latente

La idea debe sentirse diseñada para "esa persona exacta" en "esa plataforma exacta".

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧱 MATRIZ DE ÁNGULOS ESTRATÉGICOS — SIN REPETICIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El motor debe usar ángulos distintos por idea central:
Psicológico | Económico | Identidad | Estatus | Riesgo | Futuro
Sistema roto | Cultural | Moral | Filosófico | Histórico | Poder
Comparativo | Técnico accesible | Invisible

REGLA: No puede repetirse ángulo en el mismo lote.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧨 SISTEMA DE RIESGO EMOCIONAL OBLIGATORIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cada idea debe activar al menos uno:
□ Pérdida (algo valioso que se está perdiendo)
□ Estatus (amenaza o aspiración de posición social)
□ Vergüenza (error que cometen sin saberlo)
□ Urgencia (ventana que se cierra)
□ Oportunidad ignorada (lo que otros ya aprovechan)
□ Identidad amenazada (quién eres vs quién podrías ser)
□ Conflicto invisible (tensión que existe pero nadie nombra)

AMPLIFICACIÓN POR PLATAFORMA:
El mismo riesgo emocional se AMPLIFICA de forma distinta:
→ TikTok: amplificar URGENCIA + VERGÜENZA (impacto inmediato)
→ Reels: amplificar IDENTIDAD + ESTATUS (quién quieres ser)
→ YouTube: amplificar PÉRDIDA + OPORTUNIDAD IGNORADA (costo de no saber)
→ LinkedIn: amplificar ESTATUS + FUTURO PROFESIONAL (consecuencias de carrera)
→ Facebook: amplificar CONFLICTO INVISIBLE + PÉRDIDA (debate comunidad)

Sin emoción activa → idea inválida → regenerar.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 MODO GURÚ ESTRATÉGICO — VALIDACIÓN FINAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Antes de entregar el resultado, preguntarse por cada idea Y cada adaptación:
□ ¿Eleva la percepción de autoridad del experto en esa plataforma?
□ ¿Posiciona al experto como líder del sector?
□ ¿Rompe el consenso del nicho?
□ ¿Tiene potencial real de viralidad en esa plataforma específica?
□ ¿Suena completamente diferente al mercado?
□ ¿El hook de TikTok pararía el scroll en 0.5 segundos?
□ ¿El hook de Reels generaría guardados y compartidos?
□ ¿El hook de YouTube haría clic desde la miniatura?
□ ¿El hook de LinkedIn generaría reposts de profesionales?
□ ¿El hook de Facebook generaría 50+ comentarios de debate?

Si 2 o más respuestas son NO en cualquier adaptación → reescribir esa adaptación.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ MOTOR 1 — EXPANSIÓN TCA (Teoría Circular de Alcance)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NICHO DEL USUARIO: "${nichoUsuario}"
TEMA INGRESADO: "${temaEspecifico}"

MAPA DE NIVELES:
N1 = Micronicho técnico — solo expertos → PROHIBIDO (genera 300 vistas)
N2 = Temática principal — profesionales del sector → VÁLIDO ✓
N3 = Sector masivo — personas con el problema → VÁLIDO ✓
N4 = Mainstream irrelevante — audiencia basura → PROHIBIDO

REGLA OBLIGATORIA: Posicionar TODAS las ideas en intersección N2-N3.
En modo multiplataforma esto es CRÍTICO — la idea central debe funcionar
para millones de personas en 5 redes distintas simultáneamente.

SECTORES UNIVERSALES (usa el más relevante):
→ Dinero / Libertad Financiera / Inversión / Negocios
→ Salud / Energía / Cuerpo / Longevidad
→ Relaciones / Familia / Amor / Comunicación
→ Desarrollo Personal / Mentalidad / Identidad / Éxito
→ Trabajo / Carrera / Productividad / Independencia

PROCESO DE EXPANSIÓN OBLIGATORIO:
1. Detectar el nivel actual del tema (N1/N2/N3/N4)
2. Si está en N1 → subir al sector universal más relevante
3. Encontrar la tensión que conecta el micronicho con el sector masivo
4. Formular el tema expandido en lenguaje de sector (sin jerga técnica)
5. Verificar que ese tema expandido tiene tracción en las 5 plataformas

VALIDACIÓN: mass_appeal_score debe ser ≥ 75 (más alto que modo normal)
En multiplataforma la idea debe tener alcance masivo garantizado.
Si una idea no llega a 75 → reformular antes de incluirla.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ MOTOR 2 — INTERSECCIÓN ESTRATÉGICA MULTIPLATAFORMA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cada idea debe cruzar estos 3 elementos simultáneamente:

ELEMENTO A — DOLOR DEL AVATAR:
${contexto.dolor_principal ? `"${contexto.dolor_principal}"` : 'Miedo a quedarse atrás, fracasar o perder lo logrado'}

ELEMENTO B — TRANSFORMACIÓN DEL EXPERTO:
${contexto.expertProfile?.transformation_promise || contexto.posicionamiento || 'Lograr el resultado deseado por el camino correcto'}

ELEMENTO C — SECTOR MASIVO (TCA):
El sector universal que conecta el nicho con millones en TODAS las plataformas

CRITERIO ADICIONAL MULTIPLATAFORMA — ELEMENTO D:
La idea debe tener ángulo emocional que resuene en los 5 contextos de consumo:
→ Consumo rápido (TikTok/Reels: 15-60s)
→ Consumo reflexivo (YouTube: profundidad)
→ Consumo profesional (LinkedIn: carrera/negocio)
→ Consumo social (Facebook: debate comunidad)

Si la idea no conecta los 4 elementos → se rechaza.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ MOTOR 3 — TENSIÓN MASIVA MULTIPLATAFORMA (mínimo 3 de 5)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

En modo multiplataforma cada idea debe activar al menos 3 mecanismos
(uno más que el modo normal) para garantizar tracción en todas las redes:

✓ Rompe una creencia popular del sector
✓ Polariza (no todos estarán de acuerdo — genera debate)
✓ Desafía una decisión común que muchos están tomando
✓ Ataca un error invisible que el avatar comete sin saberlo
✓ Genera comparación directa (los que logran X vs los que no)

PROHIBIDO: Ideas informativas neutras.
Una idea informativa neutra = idea muerta en 5 plataformas = rechazada.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ MOTOR 4 — FILTRO ANTI-MICRONICHO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROHIBIDO en títulos y hooks:
❌ Términos técnicos del nicho (CTR, ROAS, lookalike, periodización, etc.)
❌ Nombres de métodos propietarios específicos
❌ Frameworks internos del experto
❌ Jerga que solo entiende el 5% del sector
❌ Siglas sin explicar

En modo multiplataforma esto es DOBLE CRÍTICO:
Una idea con jerga técnica falla en 5 plataformas simultáneamente.

Test de validación: ¿Lo entendería alguien completamente fuera del nicho?
Si NO → reescribir en lenguaje sectorial antes de generar adaptaciones.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ MOTOR 5 — CALIFICACIÓN IMPLÍCITA CROSS-PLATFORM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Aunque la idea es masiva, debe atraer audiencia RELEVANTE en todas las redes.
La "señal de afinidad" debe funcionar en los 5 contextos de consumo.

EJEMPLO MALO: "Cómo ser millonario" → audiencia basura en las 5 plataformas
EJEMPLO CORRECTO: "Por qué escalar tu negocio antes de estabilizarlo te arruina"
→ Masivo PERO filtra hacia emprendedores reales en TikTok, Reels, YouTube, LinkedIn y Facebook

La señal de afinidad debe conectar con:
${contexto.avatar_ideal || 'el prospecto ideal del experto'}
...en cualquier contexto de consumo de contenido.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ MOTOR 6 — FORMATO GANADOR + VARIACIÓN ESTRUCTURAL + ADN DE PLATAFORMA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Distribuir las ${cantidad} ideas centrales entre estos 7 formatos:

1. PREGUNTA CONFRONTATIVA — se adapta así por plataforma:
   TikTok: pregunta agresiva de 4 palabras | Reels: pregunta aspiracional |
   YouTube: pregunta con gap | LinkedIn: pregunta de tesis | Facebook: pregunta relatable

2. DECLARACIÓN DISRUPTIVA — postura radical sin clichés
3. COMPARACIÓN DIRECTA — dos mundos o identidades contrastadas
4. ERROR INVISIBLE — conflicto estructural, sin estadística genérica
5. ESTADÍSTICA CONTRAINTUITIVA — dato real sorprendente
6. ESCENARIO HIPOTÉTICO — condición que revela verdad
7. MITO VS REALIDAD — creencia popular destruida

REGLA DE VARIACIÓN ESTRUCTURAL:
→ Si una idea usa PREGUNTA → la siguiente NO puede usar pregunta
→ Si una usa ESTADÍSTICA → la siguiente no puede usar estadística
→ Si una usa DECLARACIÓN ABSOLUTA → la siguiente usa contraste o metáfora
→ Diversidad estructural obligatoria en todo el lote

ADN ESTRICTO POR PLATAFORMA — CADA ADAPTACIÓN DEBE RESPETARLO:

🎵 TikTok:
→ Hook: máx 4 palabras, shock INMEDIATO, confrontación directa en primeras 2 palabras
→ Ritmo: FRENÉTICO — el hook debe parar el scroll en 0.5 segundos
→ Lenguaje: coloquial, directo, "slang" natural
→ CTA: debate/comentarios/polémica
→ Polarización: nivel_polarizacion ≥ 65 OBLIGATORIO
→ PROHIBIDO: frases largas, explicaciones, tono amable, contexto previo
→ PROHIBIDO: presentaciones ("Hola soy..." "Hoy te voy a hablar de...")

📸 Reels:
→ Hook: aspiracional o tribal, elegante pero disruptivo, máx 8 palabras
→ Ritmo: RÍTMICO — sincronizado con emoción, no solo con audio
→ Lenguaje: estético, aspiracional, cercano, identitario
→ CTA: guardados + compartidos (utilidad + identificación)
→ Polarización: nivel_polarizacion ≥ 50 OBLIGATORIO
→ PROHIBIDO: agresividad excesiva, jerga técnica, shock sin elegancia

🎬 YouTube:
→ Hook: gap informativo fuerte + promesa de valor profundo implícita
→ Ritmo: DINÁMICO pero con pausas para enfatizar
→ Lenguaje: analítico, autoridad, explicativo sin ser aburrido
→ CTA: suscripción + guardar para después
→ Polarización: nivel_polarizacion ≥ 55 OBLIGATORIO
→ PROHIBIDO: spoilers del contenido, repetir el título, hooks vagos

💼 LinkedIn:
→ Hook: tesis profesional provocadora — reencuadre de negocio o carrera
→ Ritmo: PAUSADO Y PROFESIONAL — espacio para reflexionar
→ Lenguaje: negocios, lecciones de experiencia, insight estratégico
→ CTA: repost + conectar + debate intelectual
→ Polarización: nivel_polarizacion ≥ 50 OBLIGATORIO
→ PROHIBIDO: emotividad excesiva, slang, shock sin sustancia

👥 Facebook:
→ Hook: pregunta debatible O situación cotidiana completamente relatable
→ Ritmo: CONVERSACIONAL — pausas naturales, como hablar con un amigo
→ Lenguaje: cercano, familiar, coloquial, sin jerga técnica ni de internet
→ CTA: comentarios + etiquetar + compartir con amigos
→ Polarización: nivel_polarizacion ≥ 50 OBLIGATORIO
→ PROHIBIDO: shock agresivo, ritmo frenético, jerga de internet
→ OBLIGATORIO: tono cálido, historia relatable o afirmación que divide opiniones
→ Ganchos deben empezar con situación cotidiana o pregunta comunidad

⚠️ Si cualquier adaptación no respeta el ADN de su plataforma → RECHAZAR y regenerar.
Un hook de TikTok en Facebook = contenido muerto. Un hook de Facebook en TikTok = scroll ignorado.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ MOTOR 7 — SCORE DE ALCANCE IMPERIO MULTIPLATAFORMA (0-100)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Para cada IDEA CENTRAL calcular internamente:

+25 pts: Interés universal (dinero/salud/estatus/relaciones/libertad)
+20 pts: Tensión activada (rompe creencia o ataca error invisible)
+20 pts: Sin requisito técnico (lo entiende cualquier persona)
+20 pts: Potencial de debate (genera opiniones divididas)
+15 pts: Señal de afinidad (filtra hacia prospecto relevante)

SCORING ADICIONAL DE DOMINACIÓN:
+10 pts extra: Originalidad — no puede ser dicha por creador promedio
+10 pts extra: Diferenciación — ángulo único no saturado en el nicho
+10 pts extra: Adaptabilidad multiplataforma — funciona en las 5 redes
-20 pts: Cliché detectado en cualquier hook o título
-15 pts: Puede ser dicha por cualquier creador → penalización
-20 pts: Hook copiado entre plataformas (no adaptado) → penalización grave

Para cada ADAPTACIÓN calcular:
→ ctr_score: potencial de click/stop en esa plataforma (0-100)
→ nivel_polarizacion: nivel de debate que generará (0-100)
→ retencion_score: probabilidad de completado del video (0-100)

UMBRALES OBLIGATORIOS — IDEA CENTRAL:
→ mass_appeal_score ≥ 75 → si no: reformular
→ Originalidad > 75 → si no: regenerar
→ Diferenciación > 70 → si no: regenerar

UMBRALES OBLIGATORIOS — CADA ADAPTACIÓN:
→ ctr_score ≥ 70 → si no: reescribir el hook
→ TikTok: nivel_polarizacion ≥ 65
→ Reels: nivel_polarizacion ≥ 50
→ YouTube: nivel_polarizacion ≥ 55
→ LinkedIn: nivel_polarizacion ≥ 50
→ Facebook: nivel_polarizacion ≥ 50

⚠️ nivel_polarizacion NO puede ser 0, 1, 2, 3 o 4 en ninguna adaptación.
Idea tibia = idea rechazada en las 5 plataformas.

NO incluir ideas ni adaptaciones que no superen los umbrales.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎭 LENTE CREATIVO ACTIVO: ${lensData.label}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Filtrar TODAS las ideas Y adaptaciones bajo este tono:
"${lensData.instruction}"

El lente se aplica con INTENSIDAD VARIABLE según plataforma:
→ TikTok: intensidad MÁXIMA del lente
→ Reels: intensidad ELEGANTE del lente
→ YouTube: intensidad ANALÍTICA del lente
→ LinkedIn: intensidad PROFESIONAL del lente
→ Facebook: intensidad CONVERSACIONAL del lente

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 OBJETIVO: ${objetivo.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${objetivoStrategy}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏰ TIMING: ${timingContext.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${timingStrategy}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 PERFIL DEL SISTEMA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXPERTO:
- Nicho: ${contexto.nicho || nichoUsuario}
- Posicionamiento: ${contexto.expertProfile?.unique_positioning || contexto.posicionamiento || 'Experto práctico'}
- Transformación: ${contexto.expertProfile?.transformation_promise || 'Llevar al avatar del punto A al punto B'}
- Enemigo Común: ${contexto.expertProfile?.enemy || 'No definido'}
${contexto.expertProfile?.point_a ? `- Punto A (dolor): "${contexto.expertProfile.point_a}"` : ''}
${contexto.expertProfile?.point_b ? `- Punto B (destino): "${contexto.expertProfile.point_b}"` : ''}
${contexto.expertProfile?.mental_territory ? `- Territorio Mental: "${contexto.expertProfile.mental_territory}"` : ''}

AVATAR:
- Perfil: ${contexto.avatar_ideal || 'Audiencia general'}
- Dolor Principal: ${contexto.dolor_principal || 'No definido'}
- Deseo Principal: ${contexto.deseo_principal || 'No definido'}

${contexto.knowledge_base_content ? `
BASE DE CONOCIMIENTO:
"${contexto.knowledge_base_content.substring(0, 800)}..."
⚠️ Usa ESTE conocimiento. No inventes contenido genérico.
` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📤 OUTPUT JSON OBLIGATORIO — MODO MULTIPLATAFORMA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Responde SOLO con este JSON válido. Sin markdown. Sin texto extra.

{
  "analisis_estrategico": {
    "objetivo_dominante": "${objetivo}",
    "lente_aplicado": "${lensData.label}",
    "sector_detectado": "sector universal identificado",
    "nivel_tca_original": "N1 | N2 | N3",
    "expansion_realizada": "cómo se expandió el tema para funcionar en 5 plataformas",
    "razonamiento": "por qué estas ideas dominan múltiples plataformas simultáneamente",
    "advertencias": ["advertencia relevante"],
    "oportunidades": ["oportunidad de mercado detectada"]
  },
  "ideas": [
    {
      "id": 1,
      "titulo": "Título central de la idea — masivo N2-N3 sin jerga",
      "concepto": "Descripción de la intersección estratégica y por qué funciona en 5 plataformas",
      "idea_expandida_tca": "Tema expandido listo para enviar al Generador V600 sin reexpandir",

      "tca": {
        "nivel_tca": "N2 | N2.5 | N3",
        "sector_utilizado": "sector masivo",
        "interseccion_detectada": "avatar_dolor + experto_transformacion + sector",
        "mass_appeal_score": 0,
        "breakdown_score": {
          "interes_universal": 0,
          "tension_activada": 0,
          "sin_requisito_tecnico": 0,
          "potencial_debate": 0,
          "senal_afinidad": 0
        },
        "potencial_millonario": true,
        "nivel_polarizacion": 0,
        "razonamiento_estrategico": "por qué esta idea puede llegar a millones en 5 redes"
      },

      "frame_usado": "CONFRONTATIVO | REVELACIÓN | CONTRAINTUITIVO | FILOSÓFICO | ESTRATÉGICO | HISTORIA_IMPLÍCITA | COMPARATIVO | SISTEMA_ROTO | ADVERTENCIA | OPORTUNIDAD_INVISIBLE",
      "angulo_estrategico": "Psicológico | Económico | Identidad | Estatus | Riesgo | Futuro | Sistema roto | Cultural | Moral | Filosófico",
      "postura_dominante": {
        "creencia_atacada": "creencia falsa que esta idea destruye",
        "enemigo_implicito": "quién o qué tiene la culpa",
        "nuevo_marco_mental": "la visión superior que propone el experto",
        "solo_este_experto_puede_decirlo": true
      },
      "riesgo_emocional_activado": "Pérdida | Estatus | Vergüenza | Urgencia | Oportunidad ignorada | Identidad amenazada | Conflicto invisible",
      "originalidad_score": 0,
      "diferenciacion_score": 0,
      "formato_ganador": "PREGUNTA_CONFRONTATIVA | DECLARACION_DISRUPTIVA | COMPARACION_DIRECTA | ERROR_INVISIBLE | ESTADISTICA_CONTRAINTUITIVA | ESCENARIO_HIPOTETICO | MITO_VS_REALIDAD",
      "tensiones_activadas": ["tensión 1", "tensión 2", "tensión 3"],
      "estructura_sugerida": "PAS | AIDA | Winner Rocket | Storytelling",
      "disparador_principal": "Miedo | Curiosidad | Ambición | Rabia | Orgullo",
      "objetivo_principal": "${objetivo}",
      "contexto_temporal": "${timingContext}",
      "validacion_guru": {
        "eleva_autoridad": true,
        "posiciona_como_lider": true,
        "rompe_consenso": true,
        "potencial_viral_real": true,
        "suena_diferente_al_mercado": true,
        "funciona_en_5_plataformas": true
      },

      "adaptaciones": {
        "TikTok": {
          "hook": "2-4 palabras MAX — shock inmediato",
          "gancho_completo": "Primera línea exacta del video para TikTok — sin presentación",
          "caption_sugerido": "Caption corto para TikTok con CTA de comentario/debate",
          "miniatura_frase": "2-3 palabras para overlay de texto en video TikTok",
          "emocion_objetivo": "emoción que activa en los primeros 2 segundos",
          "ctr_score": 0,
          "nivel_polarizacion": 0,
          "retencion_score": 0,
          "mejor_horario": "horario óptimo para TikTok",
          "duracion_ideal": "15-45s",
          "formato_visual": "descripción del formato visual ideal para TikTok",
          "mecanismo_retencion": "qué hace que vean el video completo en TikTok",
          "keywords": ["#tag1", "#tag2"]
        },
        "Reels": {
          "hook": "Hook aspiracional o tribal — máx 8 palabras elegantes",
          "gancho_completo": "Primera línea exacta del video para Reels",
          "caption_sugerido": "Caption para Reels con CTA de guardado y compartido",
          "miniatura_frase": "Frase elegante para portada/cover de Reels",
          "emocion_objetivo": "emoción identitaria o aspiracional que activa",
          "ctr_score": 0,
          "nivel_polarizacion": 0,
          "retencion_score": 0,
          "mejor_horario": "horario óptimo para Reels",
          "duracion_ideal": "30-60s",
          "formato_visual": "descripción del formato visual ideal para Reels",
          "mecanismo_retencion": "qué hace que guarden o compartan en Reels",
          "keywords": ["#tag1", "#tag2"]
        },
        "YouTube": {
          "hook": "Gap informativo fuerte con promesa implícita de valor",
          "gancho_completo": "Primera línea exacta del video para YouTube",
          "caption_sugerido": "Descripción YouTube optimizada con keywords de búsqueda",
          "miniatura_frase": "4-6 palabras de alto CTR para miniatura YouTube",
          "emocion_objetivo": "emoción de curiosidad o necesidad de saber que activa",
          "ctr_score": 0,
          "nivel_polarizacion": 0,
          "retencion_score": 0,
          "mejor_horario": "horario óptimo para YouTube",
          "duracion_ideal": "60s Short o 8-15min largo",
          "formato_visual": "descripción del formato visual ideal para YouTube",
          "mecanismo_retencion": "qué hace que vean más del 70% del video",
          "keywords": ["#tag1", "#tag2"]
        },
        "LinkedIn": {
          "hook": "Tesis profesional provocadora — reencuadre de negocio o carrera",
          "gancho_completo": "Primera línea exacta del video para LinkedIn",
          "caption_sugerido": "Caption LinkedIn con insight profesional + CTA de repost",
          "miniatura_frase": "Frase de autoridad profesional para miniatura LinkedIn",
          "emocion_objetivo": "emoción profesional — ambición, alerta o reencuadre que activa",
          "ctr_score": 0,
          "nivel_polarizacion": 0,
          "retencion_score": 0,
          "mejor_horario": "horario óptimo para LinkedIn (martes-jueves mañana)",
          "duracion_ideal": "45-90s",
          "formato_visual": "descripción del formato visual ideal para LinkedIn",
          "mecanismo_retencion": "qué hace que compartan con su red profesional",
          "keywords": ["#tag1", "#tag2"]
        },
        "Facebook": {
          "hook": "Pregunta debatible O situación cotidiana completamente relatable",
          "gancho_completo": "Primera línea exacta del video para Facebook — tono conversacional",
          "caption_sugerido": "Caption Facebook con pregunta final que genera 50+ comentarios",
          "miniatura_frase": "Frase conversacional clara para miniatura Facebook",
          "emocion_objetivo": "emoción comunitaria — identificación, debate o nostalgia que activa",
          "ctr_score": 0,
          "nivel_polarizacion": 0,
          "retencion_score": 0,
          "mejor_horario": "horario óptimo para Facebook (tarde-noche)",
          "duracion_ideal": "60s-3min",
          "formato_visual": "descripción del formato visual ideal para Facebook",
          "mecanismo_retencion": "qué genera la conversación en comentarios",
          "keywords": ["#tag1", "#tag2"]
        }
      },

      "plan_produccion": {
        "video_base": "Descripción exacta del video base a grabar — UNA SOLA GRABACIÓN",
        "duracion_grabacion": "duración óptima del video base que funciona en todas las plataformas",
        "elementos_visuales_clave": ["elemento visual 1", "elemento visual 2"],
        "musica_recomendada": "estilo de música con energía que funciona en TikTok y Reels",
        "subtitulos_obligatorios": true,
        "edicion_minima": "cambios mínimos de edición por plataforma si aplica",
        "orden_publicacion": ["1. plataforma con mayor tracción inicial", "2. segunda", "3. tercera", "4. cuarta", "5. quinta"],
        "razon_orden": "por qué publicar en ese orden específico para maximizar algoritmos"
      }
    }
  ],
  "mejor_idea_recomendada": {
    "idea_id": 1,
    "razon": "por qué esta idea domina las 5 plataformas simultáneamente",
    "plataforma_prioritaria": "en qué plataforma publicar primero y por qué algoritmo",
    "por_que_ahora": "timing perfecto para este contenido en este momento",
    "plan_rapido": "1. Graba el video base\\n2. Adapta captions por plataforma\\n3. Publica en orden estratégico",
    "conexion_con_generador": "Lista para enviar directamente al Generador V600"
  },
  "recomendacion_top": {
    "idea_id": 1,
    "razon": "por qué esta idea ahora",
    "por_que_ahora": "timing perfecto porque...",
    "plan_rapido": "1. Paso 1\\n2. Paso 2\\n3. Paso 3"
  },
  "estrategia_embudo": "TOFU",
  "insights_estrategicos": {
    "tendencia_detectada": "tendencia activa en múltiples plataformas simultáneamente",
    "brecha_mercado": "lo que ningún creador del nicho está haciendo en las 5 redes",
    "advertencia": "qué evitar absolutamente en modo multiplataforma",
    "siguiente_paso_logico": "próximo contenido que mantiene el momentum en todas las redes"
  }
}

REGLAS FINALES ANTES DE RESPONDER:
✓ Genera EXACTAMENTE ${cantidad} idea(s) central(es)
✓ Cada idea tiene adaptaciones RADICALMENTE DISTINTAS para las 5 plataformas
✓ mass_appeal_score ≥ 75 en cada idea (más alto que modo normal)
✓ Originalidad > 75 y Diferenciación > 70 en cada idea
✓ Ningún hook con jerga técnica en ninguna plataforma
✓ Ningún cliché de la lista negra en ningún hook
✓ TikTok: nivel_polarizacion ≥ 65 | Reels ≥ 50 | YouTube ≥ 55 | LinkedIn ≥ 50 | Facebook ≥ 50
✓ ctr_score ≥ 70 en todas las adaptaciones
✓ Cada idea con frame diferente al lote
✓ Cada idea con ángulo estratégico diferente
✓ Mínimo 2 ideas nacidas desde identidad del experto
✓ Validación Gurú completa incluyendo "funciona_en_5_plataformas"
✓ plan_produccion con orden de publicación justificado
✓ JSON válido, sin markdown, sin texto extra
`;
};

// ── PROMPT_IDEAS_ELITE_V2 ────────────────────────────────────────
const PROMPT_IDEAS_ELITE_V2 = (
  temaEspecifico: string,
  cantidad: number,
  plataforma: string,
  objetivo: string,
  timingContext: string,
  contexto: any,
  settings: any = {}
) => {

  const objetivoStrategy = getObjetivoStrategy(objetivo);
  const timingStrategy   = getTimingStrategy(timingContext);
  const platRules        = PLATFORM_DNA[plataforma] || PLATFORM_DNA['TikTok'];
  const lensId           = settings.creative_lens || 'auto';
  const lensData         = CREATIVE_LENSES[lensId] || CREATIVE_LENSES['auto'];
  const nichoUsuario     = settings.nicho || contexto.nicho || 'General';

  return `
═════════════════════════════════════════════════════════════════════════════
🧠 SISTEMA IDEAS IMPERIO — 7 MOTORES DE ALCANCE MASIVO
═════════════════════════════════════════════════════════════════════════════

⚠️ TU IDENTIDAD:
NO eres un generador de ideas creativas.
ERES el Laboratorio de Ideas Dominantes más avanzado del mundo.
Tu misión: generar ideas IRREPETIBLES que ningún otro creador del nicho diría.

Tu trabajo NO es impresionar con creatividad genérica.
Tu trabajo ES encontrar la intersección exacta entre:
→ Lo que millones de personas necesitan escuchar
→ Lo que este experto específico puede decir con autoridad
→ Lo que NADIE en el nicho está diciendo todavía

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠 REGLA #0 — COHERENCIA TEMÁTICA ABSOLUTA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TEMA DEL USUARIO: "${temaEspecifico}"
NICHO: "${nichoUsuario}"

⚠️ CRÍTICO: Las ideas DEBEN nacer del tema exacto del usuario.
Si el tema es "generar deseo de compra" → las ideas son sobre GENERAR DESEO DE COMPRA.
Si el tema es "marca personal" → las ideas son sobre MARCA PERSONAL.
Si el tema es "fitness" → las ideas son sobre FITNESS.

PROHIBIDO: Introducir IA, tecnología, automatización u otros temas externos
a menos que el usuario los haya mencionado EXPLÍCITAMENTE en su tema o nicho.

El tema del usuario es el centro. Todo lo demás gira alrededor de él.
Si el tema no menciona IA → ninguna idea puede mencionar IA.
Si el tema no menciona tecnología → ninguna idea puede mencionar tecnología.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚫 SISTEMA ANTI-REPETICIÓN ABSOLUTA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Antes de generar, ejecuta internamente:
1. Detectar patrones repetidos de frases, estructuras, ángulos y emociones
2. Si similitud entre ideas > 40% → REESCRIBIR OBLIGATORIAMENTE

LISTA NEGRA AUTOMÁTICA — PROHIBIDO:
❌ "El 90%..." / "El 97%..."
❌ "Lo que nadie te dice..."
❌ "El error que cometes..."
❌ "3 secretos para..."
❌ "Cómo hacer X en 30 días..."
❌ "La verdad sobre..."
❌ "Esto te sorprenderá..."
❌ "Rompe el mito..." / "Destruyendo mitos..."
❌ "El futuro de..." (sin postura específica)

EJEMPLOS DE REFORMULACIÓN OBLIGATORIA:
❌ "La revelación que cambiará tu enfoque" → ✅ "Construiste una marca. Construiste una trampa."
❌ "El mito de la independencia digital" → ✅ "Ser libre digitalmente cuesta más de lo que ganas"
❌ "Lo que nadie te dice sobre X" → ✅ "X funciona al revés de como te lo enseñaron"
❌ "3 secretos para..." → ✅ "La secuencia que el 95% hace en orden equivocado"
❌ "La verdad sobre..." → ✅ Postura directa sin introducción genérica

REGLA: El título debe poder estar solo sin necesitar contexto para generar reacción.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧬 MOTOR DE DIVERSIDAD OBLIGATORIA — FRAMES POR POSICIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cada idea debe usar un frame distinto según su posición en el lote:
Idea 1 → Frame CONFRONTATIVO (ataca una creencia directamente)
Idea 2 → Frame REVELACIÓN (expone algo oculto o ignorado)
Idea 3 → Frame CONTRAINTUITIVO (lo opuesto a lo esperado)
Idea 4 → Frame FILOSÓFICO (verdad profunda sobre la condición humana)
Idea 5 → Frame ESTRATÉGICO (ventaja táctica que pocos conocen)
Idea 6 → Frame HISTORIA IMPLÍCITA (sugiere una narrativa sin contarla)
Idea 7 → Frame COMPARATIVO (contrasta dos mundos o identidades)
Idea 8 → Frame SISTEMA ROTO (expone por qué el método convencional falla)
Idea 9 → Frame ADVERTENCIA (consecuencia ignorada que se aproxima)
Idea 10 → Frame OPORTUNIDAD INVISIBLE (lo que la mayoría no puede ver)

REGLA: No puede repetirse frame en el mismo lote.
Si el lote tiene menos de 10 ideas → elegir los frames más relevantes.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧨 SISTEMA DE POSTURA OBLIGATORIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cada idea DEBE contener los 4 elementos:
□ Creencia atacada → ¿qué creencia falsa destruye esta idea?
□ Enemigo implícito → ¿quién o qué tiene la culpa?
□ Nuevo marco mental → ¿cuál es la visión superior?
□ Identidad del experto integrada → ¿solo este experto puede decir esto?

Si la idea puede ser dicha por CUALQUIER creador promedio → RECHAZAR automáticamente.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧬 INYECCIÓN DEL PERFIL EXPERTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Antes de generar, extraer del perfil:
→ Método único del experto
→ Diferenciación declarada
→ Filosofía propia
→ Experiencia relevante
→ Postura ideológica

OBLIGATORIO: Mínimo 2 ideas deben nacer DESDE la identidad del experto,
no desde tendencia de mercado.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 INTEGRACIÓN DEL AVATAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cada idea debe activar al menos 2 de estos 5 elementos del avatar:
□ Dolor específico del avatar
□ Deseo profundo
□ Objeción clave que tiene en mente
□ Miedo silencioso
□ Aspiración de identidad

La idea debe sentirse diseñada para "esa persona exacta", no para el nicho en general.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧱 MATRIZ DE ÁNGULOS ESTRATÉGICOS — SIN REPETICIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El motor debe usar ángulos distintos por idea:
Psicológico | Económico | Identidad | Estatus | Riesgo | Futuro
Sistema roto | Cultural | Moral | Filosófico | Histórico | Poder
Comparativo | Técnico accesible | Invisible

REGLA: No puede repetirse ángulo en el mismo lote.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧨 SISTEMA DE RIESGO EMOCIONAL OBLIGATORIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cada idea debe activar al menos uno:
□ Pérdida (algo valioso que se está perdiendo)
□ Estatus (amenaza o aspiración de posición social)
□ Vergüenza (error que cometen sin saberlo)
□ Urgencia (ventana que se cierra)
□ Oportunidad ignorada (lo que otros ya aprovechan)
□ Identidad amenazada (quién eres vs quién podrías ser)
□ Conflicto invisible (tensión que existe pero nadie nombra)

Sin emoción activa → idea inválida → regenerar.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 MODO GURÚ ESTRATÉGICO — VALIDACIÓN FINAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Antes de entregar el resultado, preguntarse por cada idea:
□ ¿Eleva la percepción de autoridad del experto?
□ ¿Posiciona al experto como líder del sector?
□ ¿Rompe el consenso del nicho?
□ ¿Tiene potencial real de viralidad?
□ ¿Suena completamente diferente al mercado?

Si 2 o más respuestas son NO → reescribir esa idea antes de incluirla.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ MOTOR 1 — EXPANSIÓN TCA (Teoría Circular de Alcance)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NICHO DEL USUARIO: "${nichoUsuario}"
TEMA INGRESADO: "${temaEspecifico}"

MAPA DE NIVELES:
N1 = Micronicho técnico — solo expertos → PROHIBIDO (genera 300 vistas)
N2 = Temática principal — profesionales del sector → VÁLIDO ✓
N3 = Sector masivo — personas con el problema → VÁLIDO ✓
N4 = Mainstream irrelevante — audiencia basura → PROHIBIDO

REGLA OBLIGATORIA: Posicionar TODAS las ideas en intersección N2-N3.

SECTORES UNIVERSALES (usa el más relevante):
→ Dinero / Libertad Financiera / Inversión / Negocios
→ Salud / Energía / Cuerpo / Longevidad
→ Relaciones / Familia / Amor / Comunicación
→ Desarrollo Personal / Mentalidad / Identidad / Éxito
→ Trabajo / Carrera / Productividad / Independencia

PROCESO DE EXPANSIÓN OBLIGATORIO:
1. Detectar el nivel actual del tema (N1/N2/N3/N4)
2. Si está en N1 → subir al sector universal más relevante
3. Encontrar la tensión que conecta el micronicho con el sector masivo
4. Formular el tema expandido en lenguaje de sector (sin jerga técnica)

VALIDACIÓN: mass_appeal_score debe ser ≥ 70
Si una idea no llega a 70 → reformular antes de incluirla.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ MOTOR 2 — INTERSECCIÓN ESTRATÉGICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cada idea debe cruzar estos 3 elementos simultáneamente:

ELEMENTO A — DOLOR DEL AVATAR:
${contexto.dolor_principal ? `"${contexto.dolor_principal}"` : 'Miedo a quedarse atrás, fracasar o perder lo logrado'}

ELEMENTO B — TRANSFORMACIÓN DEL EXPERTO:
${contexto.expertProfile?.transformation_promise || contexto.posicionamiento || 'Lograr el resultado deseado por el camino correcto'}

ELEMENTO C — SECTOR MASIVO (TCA):
El sector universal que conecta el nicho con millones

EJEMPLO DE INTERSECCIÓN CORRECTA:
→ Avatar: miedo a fracaso financiero
→ Experto: método de inversión inmobiliaria
→ Sector: Dinero / Libertad Financiera
→ Idea generada: "No estás quebrado por falta de dinero. Estás quebrado por mala secuencia."

Si la idea no conecta los 3 elementos → se rechaza.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ MOTOR 3 — TENSIÓN MASIVA (mínimo 2 de 5)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cada idea debe activar al menos 2 de estos mecanismos:
✓ Rompe una creencia popular del sector
✓ Polariza ligeramente (no todos estarán de acuerdo)
✓ Desafía una decisión común que muchos están tomando
✓ Ataca un error invisible que el avatar comete sin saberlo
✓ Genera comparación directa (los que logran X vs los que no)

PROHIBIDO: Ideas informativas neutras.
Una idea informativa neutra = idea de 200 vistas = idea rechazada.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ MOTOR 4 — FILTRO ANTI-MICRONICHO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROHIBIDO en títulos y hooks:
❌ Términos técnicos del nicho (CTR, ROAS, lookalike, periodización, etc.)
❌ Nombres de métodos propietarios específicos
❌ Frameworks internos del experto
❌ Jerga que solo entiende el 5% del sector
❌ Siglas sin explicar

Test de validación: ¿Lo entendería alguien fuera del nicho?
Si NO → reescribir en lenguaje sectorial.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ MOTOR 5 — CALIFICACIÓN IMPLÍCITA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Aunque la idea es masiva, debe atraer audiencia RELEVANTE.
Debe existir una señal de afinidad que filtre hacia el prospecto ideal.

EJEMPLO MALO: "Cómo ser millonario" → atrae audiencia basura
EJEMPLO CORRECTO: "Por qué comprar tu primera casa puede arruinar tu libertad financiera"
→ Es masivo PERO filtra hacia personas interesadas en finanzas reales

La señal de afinidad debe conectar implícitamente con:
${contexto.avatar_ideal || 'el prospecto ideal del experto'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ MOTOR 6 — FORMATO GANADOR + VARIACIÓN ESTRUCTURAL OBLIGATORIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Distribuir las ${cantidad} ideas entre estos 7 formatos:
1. PREGUNTA CONFRONTATIVA
2. DECLARACIÓN DISRUPTIVA (postura radical sin clichés)
3. COMPARACIÓN DIRECTA
4. ERROR INVISIBLE (conflicto estructural sin estadística genérica)
5. ESTADÍSTICA CONTRAINTUITIVA (dato real sorprendente)
6. ESCENARIO HIPOTÉTICO
7. MITO VS REALIDAD

REGLA DE VARIACIÓN ESTRUCTURAL:
→ Si una idea usa PREGUNTA → la siguiente NO puede usar pregunta
→ Si usa ESTADÍSTICA → la siguiente no puede usar estadística
→ Si usa DECLARACIÓN ABSOLUTA → la siguiente usa contraste o metáfora
→ Diversidad estructural obligatoria en todo el lote

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ MOTOR 7 — SCORE DE ALCANCE IMPERIO (0-100)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

+25 pts: Interés universal (dinero/salud/estatus/relaciones/libertad)
+20 pts: Tensión activada (rompe creencia o ataca error invisible)
+20 pts: Sin requisito técnico (lo entiende cualquier persona)
+20 pts: Potencial de debate (genera opiniones divididas)
+15 pts: Señal de afinidad (filtra hacia prospecto relevante)

SCORING ADICIONAL DE DOMINACIÓN:
+10 pts extra: Originalidad — no puede ser dicha por creador promedio
+10 pts extra: Diferenciación — ángulo único no saturado en el nicho
-20 pts: Cliché detectado en título o gancho
-15 pts: Puede ser dicha por cualquier creador → penalización

UMBRALES OBLIGATORIOS:
→ mass_appeal_score ≥ 70 → si no: reformular
→ Originalidad > 75 → si no: regenerar
→ Diferenciación > 70 → si no: regenerar

POLARIZACIÓN OBLIGATORIA POR PLATAFORMA:
→ TikTok: nivel_polarizacion ≥ 60
→ Reels: nivel_polarizacion ≥ 40
→ YouTube: nivel_polarizacion ≥ 50
→ LinkedIn: nivel_polarizacion ≥ 45
→ Facebook: nivel_polarizacion ≥ 50

⚠️ nivel_polarizacion NO puede ser 0, 1, 2, 3 o 4 en ninguna idea.
Si el modelo calcula polarización menor al umbral → reformular con postura más definida.
Un nivel_polarizacion bajo = idea tibia = idea rechazada.

NO incluir ideas que no superen los 4 umbrales.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎭 LENTE CREATIVO ACTIVO: ${lensData.label}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Filtrar TODAS las ideas bajo este tono:
"${lensData.instruction}"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌍 ADN DE PLATAFORMA OBLIGATORIO: ${plataforma.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- RITMO: ${platRules.ritmo}
- LENGUAJE: ${platRules.lenguaje}
- REGLA DE ORO: ${platRules.regla_oro}
- FOCO DEL CTA: ${platRules.cta_focus}

⚠️ REGLA CRÍTICA DE PLATAFORMA — ADAPTACIÓN OBLIGATORIA:

Si plataforma = TikTok:
→ Ideas con shock inmediato, confrontación directa, tensión en primeras 2 palabras
→ Títulos máx 6 palabras, ataque frontal, sin contexto
→ Polarización ALTA obligatoria (nivel_polarizacion ≥ 60)

Si plataforma = Reels:
→ Ideas aspiracionales o de identidad tribal, estéticamente resonantes
→ Títulos elegantes pero disruptivos, compartibles
→ Polarización MEDIA (nivel_polarizacion 40-70)

Si plataforma = YouTube:
→ Ideas con gap informativo fuerte, promesa de conocimiento profundo
→ Títulos con curiosidad estructurada, conectan con miniatura
→ Polarización MEDIA-ALTA (nivel_polarizacion 50-75)

Si plataforma = LinkedIn:
→ Ideas de insight de negocio, reencuadre profesional, lección de experiencia
→ Títulos reflexivos con tesis fuerte, provocación intelectual
→ Polarización INTELECTUAL (nivel_polarizacion 45-65)

Si plataforma = Facebook:
→ Ideas conversacionales que generen DEBATE en comunidad
→ Títulos con postura clara pero accesible, invitan a opinar
→ Polarización CONVERSACIONAL (nivel_polarizacion 50-70)
→ PROHIBIDO: shock agresivo, jerga de internet, ritmo frenético
→ OBLIGATORIO: tono cercano, historia relatable o pregunta que divide opiniones
→ Ganchos deben empezar con situación cotidiana o afirmación debatible

⚠️ Si las ideas no respetan el ADN de ${plataforma} → RECHAZAR y regenerar.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 OBJETIVO: ${objetivo.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${objetivoStrategy}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏰ TIMING: ${timingContext.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${timingStrategy}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 PERFIL DEL SISTEMA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXPERTO:
- Nicho: ${contexto.nicho || nichoUsuario}
- Posicionamiento: ${contexto.expertProfile?.unique_positioning || contexto.posicionamiento || 'Experto práctico'}
- Transformación: ${contexto.expertProfile?.transformation_promise || 'Llevar al avatar del punto A al punto B'}
- Enemigo Común: ${contexto.expertProfile?.enemy || 'No definido'}
${contexto.expertProfile?.point_a ? `- Punto A (dolor): "${contexto.expertProfile.point_a}"` : ''}
${contexto.expertProfile?.point_b ? `- Punto B (destino): "${contexto.expertProfile.point_b}"` : ''}
${contexto.expertProfile?.mental_territory ? `- Territorio Mental: "${contexto.expertProfile.mental_territory}"` : ''}

AVATAR:
- Perfil: ${contexto.avatar_ideal || 'Audiencia general'}
- Dolor Principal: ${contexto.dolor_principal || 'No definido'}
- Deseo Principal: ${contexto.deseo_principal || 'No definido'}

${contexto.knowledge_base_content ? `BASE DE CONOCIMIENTO:
"${contexto.knowledge_base_content.substring(0, 800)}..."
⚠️ Usa ESTE conocimiento. No inventes contenido genérico.` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📤 OUTPUT JSON OBLIGATORIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Responde SOLO con este JSON válido. Sin markdown. Sin texto extra.

{
  "analisis_estrategico": {
    "objetivo_dominante": "${objetivo}",
    "lente_aplicado": "${lensData.label}",
    "sector_detectado": "el sector universal identificado",
    "nivel_tca_original": "N1 | N2 | N3",
    "expansion_realizada": "descripción de cómo se expandió el tema",
    "razonamiento": "por qué estas ideas para este objetivo y avatar",
    "advertencias": ["advertencia 1"],
    "oportunidades": ["oportunidad 1"]
  },
  "ideas": [
    {
      "id": 1,
      "titulo": "Título masivo N2-N3 sin jerga técnica",
      "concepto": "Descripción de la intersección estratégica detectada",
      "idea_expandida_tca": "El tema expandido listo para el Generador V600",
      "tca": {
        "nivel_tca": "N2 | N2.5 | N3",
        "sector_utilizado": "nombre del sector masivo",
        "interseccion_detectada": "avatar_dolor + experto_transformacion + sector",
        "mass_appeal_score": 0,
        "breakdown_score": {
          "interes_universal": 0,
          "tension_activada": 0,
          "sin_requisito_tecnico": 0,
          "potencial_debate": 0,
          "senal_afinidad": 0
        },
        "potencial_millonario": true,
        "nivel_polarizacion": 0,
        "razonamiento_estrategico": "por qué esta idea puede llegar a millones"
      },
      "formato_ganador": "PREGUNTA_CONFRONTATIVA | DECLARACION_DISRUPTIVA | COMPARACION_DIRECTA | ERROR_INVISIBLE | ESTADISTICA_CONTRAINTUITIVA | ESCENARIO_HIPOTETICO | MITO_VS_REALIDAD",
      "tensiones_activadas": ["tensión 1", "tensión 2"],
      "objetivo_principal": "${objetivo}",
      "contexto_temporal": "${timingContext}",
      "estructura_sugerida": "PAS | AIDA | Winner Rocket | Storytelling",
      "disparador_principal": "Miedo | Curiosidad | Ambición | Rabia | Orgullo",
      "emocion_objetivo": "emoción que debe sentir el espectador",
      "gancho_sugerido": "Primera línea exacta del video — sin presentación",
      "potencial_viral": 8.5,
      "razon_potencia": "por qué este gancho funciona en esta plataforma",
      "formato_visual": "descripción del formato visual",
      "angulo": "ángulo único de esta idea",
      "cta_sugerido": "CTA específico para este objetivo",
      "plataforma_ideal": "${plataforma}",
      "duracion_recomendada": "30-60s",
      "dificultad_produccion": "Baja | Media | Alta",
      "keywords": ["#tag1", "#tag2"],
      "mejor_momento": "cuándo publicar",
      "urgencia_publicacion": "baja | media | alta",
      "frame_usado": "CONFRONTATIVO | REVELACIÓN | CONTRAINTUITIVO | FILOSÓFICO | ESTRATÉGICO | HISTORIA_IMPLÍCITA | COMPARATIVO | SISTEMA_ROTO | ADVERTENCIA | OPORTUNIDAD_INVISIBLE",
      "angulo_estrategico": "Psicológico | Económico | Identidad | Estatus | Riesgo | Futuro | Sistema roto | Cultural | Moral | Filosófico | Histórico | Poder | Comparativo | Técnico accesible | Invisible",
      "postura_dominante": {
        "creencia_atacada": "creencia falsa que esta idea destruye",
        "enemigo_implicito": "quién o qué tiene la culpa",
        "nuevo_marco_mental": "la visión superior que propone el experto",
        "solo_este_experto_puede_decirlo": true
      },
      "riesgo_emocional_activado": "Pérdida | Estatus | Vergüenza | Urgencia | Oportunidad ignorada | Identidad amenazada | Conflicto invisible",
      "originalidad_score": 0,
      "diferenciacion_score": 0,
      "validacion_guru": {
        "eleva_autoridad": true,
        "posiciona_como_lider": true,
        "rompe_consenso": true,
        "potencial_viral_real": true,
        "suena_diferente_al_mercado": true
      }
    }
  ],
  "mejor_idea_recomendada": {
    "idea_id": 1,
    "razon": "por qué esta idea ahora",
    "por_que_ahora": "timing perfecto porque...",
    "plan_rapido": "1. Paso 1\\n2. Paso 2\\n3. Paso 3",
    "conexion_con_generador": "Lista para enviar directamente al Generador V600"
  },
  "recomendacion_top": {
    "idea_id": 1,
    "razon": "por qué esta idea ahora",
    "por_que_ahora": "timing perfecto porque...",
    "plan_rapido": "1. Paso 1\\n2. Paso 2\\n3. Paso 3"
  },
  "estrategia_embudo": "TOFU",
  "insights_estrategicos": {
    "tendencia_detectada": "tendencia cultural activa detectada",
    "brecha_mercado": "lo que nadie está haciendo en este nicho",
    "advertencia": "qué evitar absolutamente",
    "siguiente_paso_logico": "próximo contenido natural"
  }
}

REGLAS FINALES ANTES DE RESPONDER:
✓ Genera EXACTAMENTE ${cantidad} ideas
✓ Todas con mass_appeal_score ≥ 70
✓ Originalidad > 75 y Diferenciación > 70 en cada idea
✓ Ninguna con jerga técnica en el título
✓ Ninguna con clichés de la lista negra
✓ Cada una con formato_ganador diferente al anterior
✓ Cada una con frame diferente
✓ Cada una con ángulo estratégico diferente
✓ Mínimo 2 ideas nacidas desde identidad del experto
✓ Cada idea activa mínimo 1 riesgo emocional
✓ Validación Gurú: si 2+ respuestas negativas → reescribir
✓ idea_expandida_tca lista para el Generador V600
✓ JSON válido, sin markdown, sin texto extra
`;
};

// ── ejecutarIdeasRapidas ─────────────────────────────────────────
async function ejecutarIdeasRapidas(
  topic: string,
  quantity: number,
  platform: string,
  contexto: any,
  openai: any,
  settings: any = {} // Aquí vienen objective y timing desde el frontend
): Promise<{ data: any; tokens: number }> {
  
  // 1. Extraer variables (con defaults por seguridad)
  const objective = settings.objective || 'viralidad';
  const timing = settings.timing_context || 'evergreen';
  const isMultiplatform = settings.multiplatform === true;

  console.log(`[CEREBRO V2] 🎯 Generando Ideas | Modo: ${isMultiplatform ? 'MULTIPLATAFORMA' : platform} | Objetivo: ${objective} | Timing: ${timing}`);

  // 2. Generar el Prompt según el modo
  const prompt = isMultiplatform
    ? PROMPT_IDEAS_MULTIPLATFORMA(
        topic,
        quantity,
        objective,
        timing,
        contexto,
        settings
      )
    : PROMPT_IDEAS_ELITE_V2(
        topic,
        quantity,
        platform,
        objective,
        timing,
        contexto,
        settings
      );

  // 3. Llamar a OpenAI
  try {
    const isMultiplatformMode = settings?.multiplatform === true;
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        { 
          role: 'system', 
          content: isMultiplatformMode
            ? 'Eres el Sistema de Dominación Multiplataforma #1. Tu salida es SIEMPRE un JSON válido y COMPLETO. NUNCA truncues el JSON. NUNCA cortes a mitad de una propiedad. Si necesitas reducir contenido, acorta los textos pero SIEMPRE cierra correctamente todos los objetos y arrays del JSON.'
            : 'Eres el Consultor Estratégico de Contenido Digital #1. Tu salida es SIEMPRE en formato JSON válido.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: isMultiplatformMode ? 0.75 : 0.8,
      max_tokens: isMultiplatformMode ? 6000 : 4000
    });

     // 4. Parsear respuesta con limpieza robusta
    const rawContent = completion.choices[0].message.content || '{"ideas":[]}';
    
    let parsedData: any = { ideas: [] };
    try {
      // Intento 1: parseo directo
      parsedData = JSON.parse(rawContent);
    } catch (e1) {
      console.warn('[IDEAS IMPERIO] ⚠️ JSON directo falló, aplicando limpieza...');
      try {
        // Intento 2: limpiar y reintentar
        const cleaned = rawContent
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .replace(/,\s*}/g, '}')
          .replace(/,\s*]/g, ']')
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, ' ')
          .trim();
        parsedData = JSON.parse(cleaned);
        console.log('[IDEAS IMPERIO] ✅ JSON limpiado exitosamente');
      } catch (e2) {
        console.error('[IDEAS IMPERIO] ❌ JSON irrecuperable, extrayendo con regex...');
        // Intento 3: extraer el objeto JSON con regex
        const match = rawContent.match(/\{[\s\S]*\}/);
        if (match) {
          try {
            parsedData = JSON.parse(match[0]);
            console.log('[IDEAS IMPERIO] ✅ JSON extraído con regex');
          } catch (e3) {
            console.error('[IDEAS IMPERIO] ❌ Fallo total en parseo:', e3);
            parsedData = { ideas: [], error: 'Error procesando respuesta. Intenta de nuevo.' };
          }
        }
      }
    }

    // 5. Filtro de seguridad — eliminar ideas con score < 70
    if (Array.isArray(parsedData.ideas)) {
      const antes = parsedData.ideas.length;
      parsedData.ideas = parsedData.ideas.filter((idea: any) => {
        const score = idea.tca?.mass_appeal_score || idea.potencial_viral * 10 || 0;
        return score >= 70;
      });
      const eliminadas = antes - parsedData.ideas.length;
      if (eliminadas > 0) {
        console.warn(`[IDEAS IMPERIO] ⚠️ ${eliminadas} idea(s) eliminada(s) por score < 70`);
      }
      const modo = settings.multiplatform ? 'MULTIPLATAFORMA' : platform;
    console.log(`[IDEAS IMPERIO] ✅ ${parsedData.ideas.length} ideas aprobadas | Modo: ${modo}`);
    }

    return {
      data: parsedData,
      tokens: completion.usage?.total_tokens || 0
    };

  } catch (error) {
    console.error("[ERROR CRÍTICO] Fallo en ejecutarIdeasRapidas:", error);
    // Devolver estructura de error segura
    return {
      data: { 
        ideas: [], 
        error: "Hubo un error generando las ideas estratégicas. Intenta de nuevo." 
      },
      tokens: 0
    };
  }
}

// ==================================================================================
// 🌐 EJECUTAR UNA SOLA IDEA MULTIPLATAFORMA — Arquitectura anti-truncado
// ==================================================================================

// ── ejecutarUnaIdeaMultiplatforma ────────────────────────────────
async function ejecutarUnaIdeaMultiplatforma(
  topic: string,
  ideaIndex: number,
  totalIdeas: number,
  objective: string,
  timing: string,
  contexto: any,
  openai: any,
  settings: any = {}
): Promise<{ idea: any; tokens: number }> {

  const lensId   = settings.creative_lens || 'auto';
  const lensData = CREATIVE_LENSES[lensId] || CREATIVE_LENSES['auto'];
  const nicho    = settings.nicho || contexto.nicho || 'General';

  const frames = [
    'CONFRONTATIVO', 'REVELACIÓN', 'CONTRAINTUITIVO', 'FILOSÓFICO',
    'ESTRATÉGICO', 'HISTORIA_IMPLÍCITA', 'COMPARATIVO',
    'SISTEMA_ROTO', 'ADVERTENCIA', 'OPORTUNIDAD_INVISIBLE'
  ];
  const angulos = [
    'Psicológico', 'Económico', 'Identidad', 'Estatus', 'Riesgo',
    'Futuro', 'Sistema roto', 'Cultural', 'Moral', 'Filosófico'
  ];
  const frameAsignado  = frames[ideaIndex % frames.length];
  const anguloAsignado = angulos[ideaIndex % angulos.length];

  const objetivoStrategy = getObjetivoStrategy(objective);
  const timingStrategy   = getTimingStrategy(timing);

  const puntoA   = contexto.expertProfile?.point_a   ? `- Punto A: "${contexto.expertProfile.point_a}"`   : '';
  const puntoB   = contexto.expertProfile?.point_b   ? `- Punto B: "${contexto.expertProfile.point_b}"`   : '';
  const kbText   = contexto.knowledge_base_content   ? `BASE DE CONOCIMIENTO: "${contexto.knowledge_base_content.substring(0, 500)}..."\n⚠️ Usa ESTE conocimiento. No inventes contenido genérico.` : '';

  const promptUnica = [
    '═══════════════════════════════════════════════════════════════════════════',
    `🌐 IDEA MULTIPLATAFORMA ${ideaIndex + 1} DE ${totalIdeas} — DOMINACIÓN TOTAL`,
    '═══════════════════════════════════════════════════════════════════════════',
    '',
    '⚠️ TU IDENTIDAD:',
    'Eres el Sistema de Dominación Multiplataforma #1 del mundo.',
    'Generas EXACTAMENTE 1 idea con 5 adaptaciones que explotan el algoritmo',
    'de cada red social de forma radicalmente distinta.',
    '',
    `FRAME OBLIGATORIO: ${frameAsignado}`,
    `ÁNGULO ESTRATÉGICO OBLIGATORIO: ${anguloAsignado}`,
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '🧠 REGLA #1 — COHERENCIA TEMÁTICA ESTRICTA',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '',
    `TEMA DEL USUARIO: "${topic}"`,
    `NICHO: "${nicho}"`,
    '',
    '⚠️ CRÍTICO: La idea DEBE nacer del tema y nicho del usuario.',
    'Si el tema es "vender conocimiento" → la idea es sobre VENDER CONOCIMIENTO.',
    'Si el tema es "marca personal" → la idea es sobre MARCA PERSONAL.',
    'PROHIBIDO: Meter IA, tecnología u otros temas externos',
    'a menos que el usuario lo haya mencionado explícitamente.',
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '🚫 ANTI-CLICHÉS ABSOLUTO — PROHIBIDO en título y hooks:',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    'X "Lo que nadie te dice..." X "El error que cometes..."',
    'X "La verdad sobre..." X "3 secretos para..."',
    'X "La revelación que cambiará..." X "El mito de..."',
    'X "Rompe el mito..." X "El 90%..." X "Destruyendo mitos..."',
    'X "El futuro de..." (sin postura específica)',
    '',
    'REFORMULACIÓN OBLIGATORIA:',
    'X "El mito del conocimiento" → OK "Vendiste tu conocimiento. Vendiste tu trampa."',
    'X "La verdad sobre vender" → OK "Vender lo que sabes cuesta más de lo que crees"',
    'X "Rompe el mito digital" → OK "Digitalizarte no te libera. Te reemplaza."',
    '',
    'REGLA: Si el título puede decirlo CUALQUIER creador de marketing → RECHAZAR.',
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '🧨 POSTURA DOMINANTE OBLIGATORIA (4 elementos):',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '[ ] Creencia falsa específica del nicho que destruye',
    '[ ] Enemigo implícito concreto responsable',
    '[ ] Nuevo marco mental superior del experto',
    '[ ] Solo este experto puede decir esto',
    '',
    'Postura expresada DISTINTO por plataforma:',
    '→ TikTok: agresiva, sin filtro, ataque en 3 palabras',
    '→ Reels: aspiracional, elegante, identitaria',
    '→ YouTube: analítica, con evidencia implícita',
    '→ LinkedIn: autoridad, medida pero firme',
    '→ Facebook: conversacional, accesible, genera debate',
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '⚙️ MOTOR TCA — EXPANSIÓN MASIVA',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    'Posicionar en intersección N2-N3.',
    'N1 = micronicho técnico → PROHIBIDO',
    'N2 = temática principal del sector → VÁLIDO',
    'N3 = sector masivo universal → VÁLIDO',
    '',
    'SECTORES: Dinero/Negocios | Desarrollo Personal | Trabajo/Carrera | Salud | Relaciones',
    'INTERSECCIÓN: tema_usuario + dolor_avatar + sector_masivo',
    'mass_appeal_score MÍNIMO: 75',
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    `🎭 LENTE CREATIVO: ${lensData.label}`,
    `"${lensData.instruction}"`,
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '🌍 ADN ESTRICTO POR PLATAFORMA',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '',
    'TikTok:',
    '→ Hook: MÁXIMO 4 palabras — shock en 0.5s',
    '→ Ejemplos: "Vendiste tu talento." / "Estás trabajando gratis." / "Nadie te compra."',
    '→ PROHIBIDO: frases largas, contexto previo, tono amable',
    '→ nivel_polarizacion >= 65 OBLIGATORIO',
    '',
    'Reels:',
    '→ Hook: aspiracional tribal elegante — máx 8 palabras',
    '→ Ejemplos: "Las personas que cobran lo que valen hacen esto." / "Tu conocimiento merece más."',
    '→ PROHIBIDO: agresividad excesiva, shock sin elegancia',
    '→ nivel_polarizacion >= 50 OBLIGATORIO',
    '',
    'YouTube:',
    '→ Hook: gap informativo — curiosidad irresistible',
    '→ Ejemplos: "Hay una razón por la que los expertos con más conocimiento ganan menos."',
    '→ PROHIBIDO: spoilers, hooks vagos, repetir título',
    '→ nivel_polarizacion >= 55 OBLIGATORIO',
    '',
    'LinkedIn:',
    '→ Hook: tesis profesional provocadora',
    '→ Ejemplos: "Llevas 10 años acumulando experiencia. Y sigues cobrando como junior."',
    '→ PROHIBIDO: emotividad excesiva, slang',
    '→ nivel_polarizacion >= 50 OBLIGATORIO',
    '',
    'Facebook:',
    '→ Hook: pregunta que divide opiniones O situación cotidiana relatable',
    '→ Ejemplos: "¿Cuánto tiempo llevas pensando en cobrar por lo que sabes y sin hacerlo?"',
    '→ PROHIBIDO: shock agresivo, jerga de internet',
    '→ nivel_polarizacion >= 50 OBLIGATORIO',
    '',
    '⚠️ El hook de TikTok y Facebook NUNCA pueden ser similares.',
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '👤 PERFIL DEL SISTEMA',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '',
    'EXPERTO:',
    `- Posicionamiento: ${contexto.expertProfile?.unique_positioning || contexto.posicionamiento || 'Experto práctico'}`,
    `- Transformación: ${contexto.expertProfile?.transformation_promise || 'Del punto A al punto B'}`,
    `- Enemigo: ${contexto.expertProfile?.enemy || 'No definido'}`,
    puntoA,
    puntoB,
    '',
    'AVATAR:',
    `- Perfil: ${contexto.avatar_ideal || 'Audiencia general'}`,
    `- Dolor: ${contexto.dolor_principal || 'No definido'}`,
    `- Deseo: ${contexto.deseo_principal || 'No definido'}`,
    '',
    kbText,
    '',
    `OBJETIVO: ${objective}`,
    `TIMING: ${timing}`,
    objetivoStrategy,
    timingStrategy,
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '📤 OUTPUT JSON — ESTRUCTURA EXACTA. SIN MARKDOWN. SIN TRUNCAR.',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '',
    `{"id":${ideaIndex + 1},"titulo":"Título que SOLO este experto diría — sin clichés","concepto":"Por qué esta idea conecta el tema con las 5 plataformas","idea_expandida_tca":"Tema expandido listo para Generador V600","tca":{"nivel_tca":"N2","sector_utilizado":"sector masivo","interseccion_detectada":"dolor + transformacion + sector","mass_appeal_score":0,"potencial_millonario":true,"nivel_polarizacion":0,"razonamiento_estrategico":"por qué llega a millones"},"frame_usado":"${frameAsignado}","angulo_estrategico":"${anguloAsignado}","postura_dominante":{"creencia_atacada":"creencia falsa del nicho","enemigo_implicito":"quién concreto tiene la culpa","nuevo_marco_mental":"visión superior del experto","solo_este_experto_puede_decirlo":true},"riesgo_emocional_activado":"Pérdida","originalidad_score":0,"diferenciacion_score":0,"formato_ganador":"DECLARACION_DISRUPTIVA","estructura_sugerida":"PAS","disparador_principal":"Miedo","emocion_objetivo":"emoción principal","objetivo_principal":"${objective}","contexto_temporal":"${timing}","potencial_viral":0,"razon_potencia":"por qué es poderoso","validacion_guru":{"eleva_autoridad":true,"posiciona_como_lider":true,"rompe_consenso":true,"potencial_viral_real":true,"suena_diferente_al_mercado":true,"funciona_en_5_plataformas":true},"adaptaciones":{"TikTok":{"hook":"MAX 4 PALABRAS shock","gancho_completo":"primera línea TikTok agresiva","caption_sugerido":"caption TikTok con debate","miniatura_frase":"2-3 palabras overlay","emocion_objetivo":"emoción cruda","ctr_score":0,"nivel_polarizacion":0,"retencion_score":0,"mejor_horario":"7-9pm","duracion_ideal":"15-45s","formato_visual":"plano frontal cortes 2s","mecanismo_retencion":"primeros 3 segundos"},"Reels":{"hook":"hook aspiracional elegante","gancho_completo":"primera línea Reels","caption_sugerido":"caption Reels guardado","miniatura_frase":"frase elegante portada","emocion_objetivo":"aspiracional","ctr_score":0,"nivel_polarizacion":0,"retencion_score":0,"mejor_horario":"6-9pm","duracion_ideal":"30-60s","formato_visual":"alta calidad visual","mecanismo_retencion":"guardar y compartir"},"YouTube":{"hook":"gap informativo fuerte","gancho_completo":"primera línea YouTube","caption_sugerido":"descripción con keywords","miniatura_frase":"4-6 palabras alto CTR","emocion_objetivo":"curiosidad","ctr_score":0,"nivel_polarizacion":0,"retencion_score":0,"mejor_horario":"viernes 3-6pm","duracion_ideal":"60s o 8-15min","formato_visual":"cambios ángulo b-roll","mecanismo_retencion":"70 porciento completado"},"LinkedIn":{"hook":"tesis profesional provocadora","gancho_completo":"primera línea LinkedIn","caption_sugerido":"caption con repost CTA","miniatura_frase":"frase autoridad","emocion_objetivo":"ambición profesional","ctr_score":0,"nivel_polarizacion":0,"retencion_score":0,"mejor_horario":"martes-jueves 8-10am","duracion_ideal":"45-90s","formato_visual":"plano limpio subtítulos","mecanismo_retencion":"compartir red profesional"},"Facebook":{"hook":"pregunta relatable comunidad","gancho_completo":"primera línea Facebook conversacional","caption_sugerido":"caption pregunta 50 comentarios","miniatura_frase":"frase conversacional clara","emocion_objetivo":"identificación comunidad","ctr_score":0,"nivel_polarizacion":0,"retencion_score":0,"mejor_horario":"7-10pm domingo","duracion_ideal":"60s-3min","formato_visual":"subtítulos grandes pausado","mecanismo_retencion":"comentarios primeros 30min"}},"plan_produccion":{"video_base":"descripción exacta video base único","duracion_grabacion":"duración óptima","subtitulos_obligatorios":true,"elementos_clave":["elemento 1","elemento 2"],"orden_publicacion":["1. plataforma 1","2. plataforma 2","3. plataforma 3","4. plataforma 4","5. plataforma 5"],"razon_orden":"justificación estratégica del orden"}}`,
    '',
    'REGLAS FINALES:',
    'OK mass_appeal_score >= 75 | originalidad_score > 75 | diferenciacion_score > 70',
    'OK TikTok nivel_polarizacion >= 65 | Reels >= 50 | YouTube >= 55 | LinkedIn >= 50 | Facebook >= 50',
    'OK ctr_score >= 70 en todas las adaptaciones',
    'OK Cada hook RADICALMENTE distinto al de otras plataformas',
    'OK Sin clichés en ningún hook ni título',
    'OK JSON válido y COMPLETO — nunca truncar'
  ].join('\n');

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: 'Eres el Sistema Multiplataforma #1. Generas EXACTAMENTE 1 idea con adaptaciones para 5 plataformas. JSON siempre válido y completo. Nunca truncas.'
        },
        { role: 'user', content: promptUnica }
      ],
      temperature: 0.78,
      max_tokens: 3000
    });

    const raw = completion.choices[0].message.content || '{}';
    let idea: any = {};

    try {
      idea = JSON.parse(raw);
    } catch {
      const cleaned = raw
        .replace(/```json\n?/g, '').replace(/```\n?/g, '')
        .replace(/,\s*}/g, '}').replace(/,\s*]/g, ']')
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, ' ').trim();
      try {
        idea = JSON.parse(cleaned);
      } catch {
        const match = raw.match(/\{[\s\S]*\}/);
        if (match) {
          try { idea = JSON.parse(match[0]); } catch { idea = {}; }
        }
      }
    }

    console.log(`[MULTI] OK Idea ${ideaIndex + 1}/${totalIdeas} | Score: ${idea.tca?.mass_appeal_score || '?'}`);

    return {
      idea,
      tokens: completion.usage?.total_tokens || 0
    };

  } catch (error) {
    console.error(`[MULTI] ERROR en idea ${ideaIndex + 1}:`, error);
    return { idea: {}, tokens: 0 };
  }
}


export {
  PROMPT_IDEAS_MULTIPLATFORMA,
  PROMPT_IDEAS_ELITE_V2,
  ejecutarIdeasRapidas,
  ejecutarUnaIdeaMultiplatforma,
  getObjetivoStrategy,
  getTimingStrategy,
};