// ====================================================================================
// 💎 prompts/ingenieria-inversa.ts
// FUNCIÓN: Analiza un video Y genera un guion nuevo adaptado al nicho del experto
// MODO:    recreate
// PROMPTS:
//   PROMPT_INGENIERIA_INVERSA_PRO  →  FASE 1: extrae ADN (16 motores)
//   PROMPT_ADN_FORENSE             →  usado en FASE 1 de ejecutarIngenieriaInversaPro
//   PROMPT_GUION_ELITE             →  usado en FASE 2 de ejecutarIngenieriaInversaPro
//   buildPromptRefinamientoLoop    →  refinamiento si guion queda corto
// EJECUTOR: ejecutarIngenieriaInversaPro → handler llama: await ejecutarIngenieriaInversaPro(...)
// HELPERS:  prepararPaquete, calcularMetricas, calcularProgrec, extraerEquivalencia,
//           calcularIndiceFidelidad
// ====================================================================================

import { delay } from '../lib/security.ts';
import { ejecutarAutopsiaViral } from './autopsia-viral.ts';

// ── PROMPT_INGENIERIA_INVERSA_PRO (FASE 1 — extrae ADN) ──────────
const PROMPT_INGENIERIA_INVERSA_PRO = (
  transcripcion: string,
  nichoOrigen: string,
  nichoUsuario: string,
  objetivoUsuario: string,
  expertProfile?: any
) => `
Eres TITAN OMEGA OLIMPO — el laboratorio de ADN viral más avanzado del mundo.
Tu función no es resumir. No es describir. No es copiar.
Tu función es DISECCIONAR con precisión quirúrgica el ADN narrativo, estructural y estratégico de este contenido, detectar su nivel TCA real, y traducirlo en inteligencia 100% replicable.

=============================================================
TRANSCRIPCIÓN A ANALIZAR:
Nicho de origen: ${nichoOrigen}
Nicho del usuario: ${nichoUsuario}
Objetivo del usuario: ${objetivoUsuario}

TRANSCRIPCIÓN:
${transcripcion}
=============================================================

${expertProfile ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛡️ PERFIL DEL EXPERTO (FILTRO OLIMPO OBLIGATORIO)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Al extraer el ADN viral y generar la adaptación, DEBES respetar estas restricciones:

- Nivel de Autoridad: ${expertProfile.authority_level || 'practicante'}
- Objetivo de Contenido: ${expertProfile.main_objective || 'autoridad'}
- Confrontación Máxima: ${expertProfile.confrontation_level || 3}/5
- Polémica Máxima: ${expertProfile.max_controversy || 3}/5
${expertProfile.mechanism_name ? `- Mecanismo Propietario: "${expertProfile.mechanism_name}" → intégralo en la adaptación` : ''}
${expertProfile.point_a ? `- Punto A del Avatar: "${expertProfile.point_a}"` : ''}
${expertProfile.point_b ? `- Punto B (destino): "${expertProfile.point_b}"` : ''}
${expertProfile.mental_territory ? `- Territorio Mental™: "${expertProfile.mental_territory}" → refuérzalo` : ''}
${expertProfile.enemy ? `- Enemigo Común: "${expertProfile.enemy}"` : ''}
${expertProfile.narrative_rhythm ? `- Ritmo Narrativo Configurado: ${expertProfile.narrative_rhythm}` : ''}
${expertProfile.market_sophistication ? `- Sofisticación del Mercado: ${expertProfile.market_sophistication}` : ''}

⚠️ REGLA CRÍTICA: La adaptación NUNCA puede contradecir el posicionamiento del experto.
Si el video original usa tácticas que violan sus límites, ADAPTA esa táctica a una versión compatible con su identidad.
` : ''}

EJECUTA LOS 16 MOTORES EN SECUENCIA. SIN EXCEPCIONES. SIN SIMPLIFICACIONES.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔴 MOTOR 1 — DESCOMPOSICIÓN ESTRUCTURAL → clave JSON: "adn_estructura"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Identifica y mapea CADA bloque narrativo con:
- tipo: EXACTAMENTE uno de [hook, setup, escalada, giro, climax, resolucion, cierre_estrategico]
- inicio y fin en segundos (estimados por posición en transcripción)
- duración en segundos
- descripción de qué sucede
- función narrativa (por qué está ahí)
- intensidad 0-100

LUEGO determina:
- tipo_apertura: cómo abre (pregunta, afirmación polémica, dato sorpresa, promesa, historia, problema)
- tipo_cierre: cómo cierra (CTA directo, loop abierto, revelación, resolución, pregunta)
- proporción del hook como % del total
- velocidad de escalada: lenta / media / rapida / explosiva
- patrón narrativo detectado (nombre del patrón ej: "Problema-Agitación-Solución", "Historia-Giro-Revelación")
- complejidad estructural 0-100

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🟠 MOTOR 2 — CURVA EMOCIONAL → clave JSON: "curva_emocional"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mapea el recorrido emocional completo:
- emocion_dominante, emocion_secundaria, emocion_final
- picos_emocionales: array de { segundo, emocion, intensidad 0-100, detonante }
- intensidad_promedio: 0-100
- variabilidad_emocional: 0-100
- arco_emocional: descripción en 1 frase del recorrido completo
- segmentos: emoción e intensidad por cada bloque

NO aceptes emociones genéricas. Sé específico: "curiosidad ansiosa", "indignación justificada", "alivio sorpresivo".

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🟡 MOTOR 3 — MICRO-LOOPS Y TENSIÓN → clave JSON: "micro_loops"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Detecta CADA loop de tensión con:
- tipo: [promesa_abierta, cliffhanger, pregunta_pendiente, anticipacion, gancho_diferido]
- descripción, segundo de apertura, segundo de cierre (null si nunca se cierra), intensidad 0-100

LUEGO calcula:
- total de loops, intervalo promedio entre loops, densidad_anticipacion 0-100, loops_sin_resolver, estrategia_tension

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🟤 MOTOR 4 — POLARIZACIÓN → clave JSON: "polarizacion"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Extrae: nivel_confrontacion 0-100, ruptura_creencia_detectada, enemigo_implicito, nivel_friccion_narrativa 0-100, mecanismo_polarizacion, afirmaciones_divisivas, posicionamiento_vs.
Si no hay polarización significativa, score 0-20 con análisis honesto.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🟢 MOTOR 5 — IDENTIDAD VERBAL → clave JSON: "identidad_verbal"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Analiza: longitud_promedio_frases, ritmo_sintactico [staccato/fluido/mixto/explosivo], proporcion_frases_cortas_pct, proporcion_frases_largas_pct, uso_metaforas 0-100, uso_imperativos 0-100, sofisticacion_lexica 0-100, nivel_agresividad_verbal 0-100, firma_linguistica, palabras_poder_detectadas.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔵 MOTOR 6 — STATUS Y POSICIONAMIENTO → clave JSON: "status_y_posicionamiento"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Detecta: tipo_autoridad [mentor/rebelde/experto_tecnico/disruptor/insider/testigo/transformado], experiencia_proyectada [implicita/explicita/mixta], rol_narrativo, nivel_confianza_percibida 0-100, distancia_con_audiencia [cercana/media/distante], prueba_social_detectada bool, mecanismos_autoridad lista.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚪ MOTOR 7 — DENSIDAD DE VALOR → clave JSON: "densidad_valor"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mide: valor_por_minuto 0-100, porcentaje_contenido_abierto, porcentaje_contenido_cerrado, profundidad_insight 0-100, micro_aprendizajes lista, ratio_promesa_entrega, tipo_valor_dominante [educativo/inspiracional/entretenimiento/provocacion/solucion].

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🟣 MOTOR 8 — MANIPULACIÓN DE ATENCIÓN → clave JSON: "manipulacion_atencion"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Identifica: cambios_ritmo array {segundo, tipo, descripcion}, interrupciones_patron count, reencuadres_mentales lista, golpes_narrativos array {segundo, descripcion, impacto 0-100}, reactivaciones_atencion count, tecnicas_detalladas lista, frecuencia_estimulacion 0-100.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔶 MOTOR 9 — ACTIVADORES DE GUARDADO → clave JSON: "activadores_guardado"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Detecta CADA elemento que hace al usuario guardar:
- tipo: [frase_memorable, reencuadre, dato_contraintuitivo, formula_repetible, revelacion]
- contenido (parafrasea, NO copies), segundo_aproximado, potencia_guardado 0-100
Mínimo 3 activadores.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🟦 MOTOR 10 — ADAPTABILIDAD AL NICHO → clave JSON: "adaptabilidad_nicho"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Traduce el ADN al nicho del usuario (${nichoUsuario}):
- contexto_usuario, sofisticacion_audiencia_target [basica/intermedia/avanzada/experta]
- nivel_conciencia_mercado 0-100, intensidad_psicologica_tolerable 0-100
- ajustes_necesarios lista, riesgos_adaptacion lista

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚫ MOTOR 11 — ANTI-SATURACIÓN → clave JSON: "elementos_cliche_detectados"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Detecta: tipo [frase_cliche/hook_generico/formula_repetida/plantilla_obvia], contenido, nivel_saturacion 0-100, alternativa_sugerida.
Si originalidad es alta, lista pocos o ninguno y explica por qué.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔷 MOTOR 12 — RITMO NARRATIVO → clave JSON: "ritmo_narrativo"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mide: velocidad_progresion [lenta/media/rapida/variable], intervalo_promedio_entre_estimulos_seg, variacion_intensidad 0-100, fluidez_estructural 0-100, momentos_pausa count, aceleraciones array {segundo, causa}.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏆 MOTOR 13 — SCORE VIRAL ESTRUCTURAL → clave JSON: "score_viral_estructural"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Calcula con base en los 12 motores anteriores:
{
  "retencion_estructural": 0-100,
  "intensidad_emocional": 0-100,
  "polarizacion": 0-100,
  "manipulacion_atencion": 0-100,
  "densidad_valor": 0-100,
  "viralidad_estructural_global": 0-100,
  "breakdown_motores": {
    "motor_1_estructura": 0-100,
    "motor_2_emocional": 0-100,
    "motor_3_tension": 0-100,
    "motor_4_polarizacion": 0-100,
    "motor_5_identidad": 0-100,
    "motor_6_status": 0-100,
    "motor_7_valor": 0-100,
    "motor_8_atencion": 0-100,
    "motor_9_guardado": 0-100,
    "motor_11_originalidad": 0-100,
    "motor_12_ritmo": 0-100
  }
}
Pesos: retencion(25%) + emocional(20%) + atencion(20%) + valor(15%) + polarizacion(10%) + resto(10%)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧬 MOTOR 14A — ADN PROFUNDO → clave JSON: "adn_profundo"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AXIOMA CENTRAL: No adaptes el tema. Replica el mecanismo emocional.
El contexto cambia. La arquitectura emocional es idéntica.

A. GÉNERO NARRATIVO REAL (OBLIGATORIO — NO CAMBIAR EN ADAPTACIÓN):
Identifica el género exacto del video original:
→ Confesional crudo (historia personal vulnerable, exposición real)
→ Drama moral (decisión difícil con consecuencias éticas)
→ Historia de fracaso (error real + aprendizaje costoso)
→ Opinión confrontativa (postura que divide sin pedir perdón)
→ Revelación incómoda (verdad que el mercado prefiere ignorar)
→ Caso polémico (situación real con juicio implícito)
→ Historia de poder (decisión difícil desde posición de autoridad)
→ Denuncia sistémica (exposición de problema estructural)
→ Autoridad estratégica (lección desde experiencia superior)

⛔ CRÍTICO V1000: La adaptación DEBE mantener el MISMO género narrativo.
PROHIBIDO: convertir Drama moral en Discurso motivacional.
PROHIBIDO: convertir Confesional en Consejo amigable.
PROHIBIDO: convertir Denuncia en Lista de tips.
El género es el ADN. No se suaviza. No se reinterpreta.

B. TIPO DE CONFLICTO (CLASIFICAR Y REPLICAR):
Clasifica exactamente qué tipo de conflicto usa el video original:
→ Conflicto interpersonal (entre personas concretas)
→ Conflicto moral (dilema ético sin respuesta fácil)
→ Conflicto reputacional (imagen vs verdad)
→ Conflicto económico (dinero, pérdida, ganancia real)
→ Conflicto de poder (quién decide, quién obedece)
→ Conflicto ético (principios vs conveniencia)

La adaptación DEBE replicar el MISMO tipo de conflicto en el nicho del usuario.
Si el original tiene conflicto moral → la adaptación tiene conflicto moral.
No sustituir conflicto concreto por concepto abstracto.

C. NIVEL DE RIESGO NARRATIVO (MEDIR Y MANTENER):
Evalúa el riesgo del video original en estas 4 dimensiones:
→ ¿Toca un tema incómodo o tabú del nicho? (Sí/No + nivel 0-100)
→ ¿Hay riesgo reputacional para el creador? (Sí/No + nivel 0-100)
→ ¿Hay exposición personal real? (Sí/No + nivel 0-100)
→ ¿Hay postura impopular que puede generar rechazo? (Sí/No + nivel 0-100)

riesgo_total: promedio de los 4 (0-100)
clasificacion_riesgo: "Bajo (0-30)" | "Medio (31-60)" | "Alto (61-80)" | "Extremo (81-100)"

⛔ REGLA ABSOLUTA: Si el original tiene riesgo ALTO o EXTREMO →
la adaptación NO PUEDE ser riesgo BAJO o MEDIO.
Un guion seguro que adapta un video de alto riesgo = FALLA CRÍTICA.

D. INTENSIDAD EMOCIONAL REAL:
Mide la intensidad emocional REAL del video original:
→ Baja (contenido informativo sin carga emocional fuerte)
→ Media (hay emoción pero no domina)
→ Alta (la emoción ES el vehículo del mensaje)
→ Extrema (el video opera principalmente desde la emoción cruda)

La adaptación debe igualar o superar esta intensidad.
Si la adaptación tiene menor intensidad → REGENERAR OBLIGATORIAMENTE.

E. EMOCIÓN NÚCLEO DETECTADA:
Identifica la emoción que impulsa TODO el video (una sola, dominante):
→ Culpa | Rabia | Indignación | Vulnerabilidad
→ Liderazgo | Redención | Superioridad
→ Advertencia | Orgullo | Vergüenza ajena | Miedo legítimo

F. TIPO DE TENSIÓN:
→ Moral (dilema ético sin respuesta fácil)
→ Profesional (decisión de negocio con consecuencias reales)
→ Social (conflicto entre personas o grupos)
→ Económica (dinero, pérdida, ganancia)
→ Autoridad (quién tiene el poder de decidir)
→ Identidad (quién soy vs quién debería ser)

G. FRAME DOMINANTE:
- creencia_que_ataca: qué creencia falsa destruye el video
- nuevo_marco: qué visión alternativa superior propone
- frase_nucleo: la frase que condensa todo el frame

H. POLARIZACIÓN IMPLÍCITA (SISTEMA DE DOS BANDOS):
- bando_A: quiénes están completamente de acuerdo
- bando_B: quiénes se ofenden o discrepan activamente
- tension_irresuelta: qué pregunta moral queda abierta al final
- nivel_polarizacion_real: 0-100

La adaptación debe replicar esta estructura de dos bandos en el nicho del usuario.
No eliminar la fricción. Amplificarla con equivalencia estructural.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏆 MOTOR 14B — IDEA NUCLEAR GANADORA → clave JSON: "idea_nuclear_ganadora"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Declara la idea nuclear que hace viral al contenido:
- que_hace_viral: qué mecanismo específico genera millones de vistas
- creencia_rota: qué creencia popular destruye
- postura_impuesta: qué postura instala en quien lo ve
- por_que_genera_conversacion: el conflicto social que activa
- tension_no_resuelta: qué pregunta deja abierta que obliga a comentar

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔺 MOTOR 14C — SISTEMA DE SUPERIORIDAD → clave JSON: "sistema_superioridad"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Declara cómo el guion adaptado SUPERA al original en:
- mayor_claridad: cómo el mensaje es más directo y entendible
- mayor_intensidad: cómo la emoción es más concentrada
- mayor_polarizacion: cómo el conflicto es más definido
- mejor_estructura_emocional: cómo la curva emocional es más precisa
- mejor_cierre: cómo el cierre genera más acción o debate
- ventaja_de_nicho: qué tiene el experto del usuario que el creador original no tiene

🎬 MOTOR 14D — GUION ADAPTADO ESPEJO V900 — MÁXIMA POTENCIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ ESTE ES EL OUTPUT MÁS IMPORTANTE DE TODO EL SISTEMA.
El guion es la razón por la que el usuario pagó. Todo lo demás es soporte.

═══════════════════════════════════════════
LONGITUD OBLIGATORIA — SIN EXCEPCIÓN
═══════════════════════════════════════════
El video original tuvo una duración específica. El guion debe reflejar esa duración.
Hablar en cámara = aproximadamente 2.5 palabras por segundo.

🎯 REEL / SHORT (hasta 90s) → MÍNIMO 180 palabras. IDEAL 200-250 palabras.
📹 VIDEO LARGO (90s - 10min) → MÍNIMO 350 palabras. IDEAL 400-600 palabras.
🎓 MASTERCLASS (más de 10min) → MÍNIMO 700 palabras. IDEAL 900-1400 palabras.

⛔ UN GUION CON MENOS PALABRAS QUE EL MÍNIMO = FALLA CRÍTICA.
Si el guion que generaste no alcanza el mínimo → AMPLÍA con más profundidad emocional,
más desarrollo del conflicto, más ejemplos del nicho, más tensión narrativa.
NUNCA entregues un guion corto. NUNCA.

═══════════════════════════════════════════
ESTRUCTURA OBLIGATORIA DEL GUION
═══════════════════════════════════════════
El guion DEBE tener esta arquitectura extraída del video original (Motor 1):

1. HOOK (primeros 3-5 segundos del guion)
   → La frase de mayor impacto emocional del video original — adaptada al nicho del usuario
   → Debe causar el mismo efecto psicológico que el hook original
   → Debe ser la primera línea del guion — sin introducción, sin contexto previo

2. SETUP / CONFLICTO (siguiente 15-25% del guion)
   → Establece el conflicto o tensión del video adaptado al contexto del usuario
   → Introduce el problema, el enemigo, o la contradicción que el guion va a resolver
   → Debe crear urgencia o curiosidad inmediata

3. ESCALADA EMOCIONAL (40-60% del guion)
   → Cada párrafo eleva la intensidad emocional — nunca desciende en esta sección
   → Aquí van los micro-loops detectados en Motor 3: cada uno en su posición equivalente
   → Incluye ejemplos, datos o anécdotas del nicho del usuario: ${nichoUsuario}
   → El espectador debe sentirse identificado, cuestionado y emocionalmente comprometido

4. CLÍMAX / GIRO (momento de mayor intensidad)
   → El momento de mayor impacto del video original — replicado con el mismo peso emocional
   → Puede ser una revelación, una confesión, una acusación, una estadística que cambia todo
   → Debe sentirse como un punto de no retorno en el guion

5. RESOLUCIÓN / CIERRE ESTRATÉGICO (último 15-20% del guion)
   → Cierre que deja al espectador con una acción clara, una pregunta abierta, o una postura instalada
   → Activa guardado, comentario o seguimiento según el activador detectado en Motor 9
   → El último párrafo debe ser la frase más memorable y potente del guion

═══════════════════════════════════════════
SISTEMA DE EQUIVALENCIA ESTRUCTURAL V1000
═══════════════════════════════════════════

AXIOMA: Lo que funcionó en X (por conflicto + tensión + frame)
funciona en Y (con conflicto equivalente + tensión equivalente + frame equivalente).
No por copiar tema. Sino por replicar mecanismo.

MAPA DE EQUIVALENCIA OBLIGATORIO:
Si en el original ocurre:
→ Acción polémica + Consecuencia pública + Decisión dolorosa + Postura firme + Frame fuerte
En la adaptación DEBE existir:
→ Acción polémica EQUIVALENTE en ${nichoUsuario} + Consecuencia pública EQUIVALENTE + Decisión difícil EQUIVALENTE + Postura firme EQUIVALENTE + Frame fuerte EQUIVALENTE

PROHIBICIÓN ABSOLUTA DE ABSTRACCIÓN:
❌ Si el original tiene historia concreta → la adaptación tiene historia concreta (NO concepto)
❌ Si el original tiene escena real → la adaptación tiene escena real (NO descripción genérica)
❌ Si el original tiene consecuencia → la adaptación tiene consecuencia (NO moraleja)
❌ Si no hay escena concreta en el guion → REGENERAR

ESCALADA EMOCIONAL OBLIGATORIA — CURVA V1000:
El guion DEBE seguir esta arquitectura de intensidad creciente:
1. HOOK CON TENSIÓN INMEDIATA → intensidad de entrada ≥ 65/100
2. REVELACIÓN INICIAL → introduce el conflicto real, sin suavizar
3. ESCALADA PROGRESIVA → cada párrafo eleva la intensidad, nunca desciende
4. PUNTO CRÍTICO → el momento de mayor impacto (si no existe → REGENERAR)
5. DECISIÓN CLARA → el creador o el protagonista toma una postura firme
6. CONSECUENCIA → hay un resultado real o implicado (no abstracto)
7. FRAME FINAL CONTUNDENTE → la última frase instala una postura, no da consejo

⛔ Si no hay PUNTO CRÍTICO identificable → guion inválido, regenerar.
⛔ Si no hay DECISIÓN CLARA → guion inválido, regenerar.
⛔ Si el cierre es aspiracional genérico → guion inválido, regenerar.

NICHO DEL USUARIO: ${nichoUsuario}
OBJETIVO DEL USUARIO: ${objetivoUsuario}

REGLAS DE FIDELIDAD ESTRUCTURAL:
✓ Mismo género narrativo detectado en Motor 14A — SIN EXCEPCIONES
✓ Mismo tipo de conflicto detectado en Motor 14B — NO suavizar
✓ Nivel de riesgo igual o superior al detectado en Motor 14C
✓ Intensidad emocional igual o superior al detectado en Motor 14C
✓ Misma emoción núcleo — desde la primera línea
✓ Mismo frame dominante — reescrito en el nicho del usuario
✓ Misma arquitectura de micro-loops — cada loop en posición equivalente
✓ Mismo patrón de escalada emocional — detectado en Motor 1
✓ Nivel TCA igual o superior al detectado en Motor 16

VALIDACIÓN ANTI-SUAVIZAMIENTO (EJECUTAR ANTES DE ENTREGAR):
□ ¿El guion se volvió genérico? → Si sí: REGENERAR
□ ¿Perdió el conflicto original? → Si sí: REGENERAR
□ ¿Perdió intensidad emocional? → Si sí: REGENERAR
□ ¿Perdió el riesgo narrativo? → Si sí: REGENERAR
□ ¿Suena "seguro" o "amigable"? → Si sí: REGENERAR
□ ¿Es menos polémico que el original? → Si sí: REGENERAR
□ ¿La adaptación es conceptual en lugar de concreta? → Si sí: REGENERAR

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔗 MOTOR 15 — BLUEPRINT PARA CONEXIÓN DIRECTA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Genera el blueprint_replicable para el Generador de Guiones y Juez Viral:
- nombre_patron, formula_base, pasos_estructurales lista
- equivalencias_estructurales: { hook_type, escalation_pattern, giro_type, closure_type }
- equivalencias_psicologicas: { emocion_entrada, emocion_escalada, emocion_salida, tension_type, activation_mechanism }
- equivalencias_verbales: { ritmo, agresividad, sofisticacion }
- instrucciones_para_generador: cómo usar este blueprint
- instrucciones_para_juez_viral: qué criterios usar al auditar

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 MOTOR 16 — ANÁLISIS TCA + MAPA DE EXPANSIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PARTE A — NIVEL TCA DEL VIDEO ANALIZADO
Detecta en qué nivel TCA opera este video:
- N0: Micronicho técnico (ej: "Estrategias de link building para SaaS B2B")
- N1: Nicho general (ej: "Cómo ganar dinero con marketing digital")
- N2: Temática amplia (ej: "Cómo ganar dinero online")
- N3: Sector masivo (Dinero / Salud / Relaciones / Desarrollo Personal)
- N4: Mainstream absoluto — sin filtro de audiencia, no convertible

Evalúa y devuelve:
- nivel_tca_detectado: "N0" | "N1" | "N2" | "N3" | "N4"
- sector_detectado: sector dominante (ej: "Dinero", "Salud", "Relaciones")
- tipo_alcance: descripción del tipo de alcance
- mass_appeal_score: 0-100 (qué tan masivo es el contenido)
- equilibrio_masividad_calificacion: true si está en el punto ideal
- diagnostico_tca: diagnóstico en 1 frase
- capa_visible: qué tema ve el espectador a simple vista
- capa_estrategica: qué audiencia REAL está filtrando
- filtro_audiencia_implicito: descripción del filtro natural
- tipo_trafico_que_atrae: qué tipo de persona llega
- nivel_conversion_probable: "bajo" | "medio" | "alto" | "muy_alto"
- esta_muy_tecnico: true si está por debajo de N1
- esta_muy_mainstream: true si está en N4

PARTE B — MAPA DE EXPANSIÓN TCA PARA EL USUARIO
- nivel_tca_recomendado: nivel TCA ideal para el usuario
- sector_recomendado: sector masivo al que anclar
- nuevo_hook_sectorial: hook reescrito para el nicho del usuario
- nueva_capa_visible: qué verá el espectador del usuario
- capa_estrategica_conservada: la capa que filtra y convierte
- estructura_espejo: true si se puede replicar la misma arquitectura
- version_tecnica: guion en N0-N1 (autoridad pura)
- version_equilibrio_ideal: guion en N2-N3 (equilibrio masividad + conversión)
- version_sector_masivo: guion en N3 (máximo alcance)
- advertencia_micronicho: advertencia o null

PARTE C — VALIDACIÓN INTERNA OLIMPO
□ ¿Se detectó arquitectura completa? (Motor 1)
□ ¿Se detectaron loops reales? (Motor 3)
□ ¿Se identificó el nivel TCA? (Motor 16A)
□ ¿Se detectó el equilibrio ideal? (Motor 16A)
□ ¿Se extrajo el filtro implícito? (Motor 16A)
□ ¿Se adaptó sin bajar a micronicho técnico? (Motor 16B)
□ ¿Se mantuvo el ADN estructural en el guion? (Motor 14D)
□ ¿El guion respeta el género narrativo original? (Motor 14A)
□ ¿La emoción núcleo está presente en el guion? (Motor 14A)
□ ¿El teleprompter está libre de etiquetas técnicas? (Motor 14D)

Devuelve validacion_olimpo con cada check (bool) y score_validacion (0-10).
Si score_validacion < 7 → REANALIZA antes de devolver.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 MOTOR 17 — POSICIONAMIENTO Y PRÓXIMOS PASOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A. POSICIONAMIENTO COMO:
Declara cómo este contenido posiciona al usuario exactamente como:
→ Mentor firme (enseña desde experiencia con autoridad directa)
→ Líder estratégico (toma decisiones difíciles con criterio)
→ Autoridad ética (tiene principios que defiende públicamente)
→ Visionario (ve lo que otros no pueden ver aún)
→ Analista frío (descompone la realidad sin emoción)
→ Testigo honesto (vivió algo y lo cuenta sin filtro)

B. PRÓXIMOS 3 CONTENIDOS COHERENTES:
Genera 3 ideas de contenido que son la continuación natural de este video.
Cada una con:
- titulo: el título exacto del próximo video
- por_que_ahora: por qué es la continuación lógica
- genero: género narrativo sugerido
- tension: tipo de tensión que activa

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎬 MOTOR 18 — PLAN AUDIOVISUAL ÉLITE + MINIATURA DOMINANTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A. PLAN AUDIOVISUAL PROFESIONAL:
Genera el plan de producción completo para el guion adaptado.
Este plan es INDEPENDIENTE del guion — es la capa visual y sonora.

Secuencia temporal obligatoria (mínimo 5 momentos):
- 0-3s: Hook visual — qué ve el espectador exactamente
- 3-7s: Setup visual — cómo se construye el contexto
- 7-15s: Escalada visual — desarrollo del conflicto o tensión
- PUNTO DE CLÍMAX: el momento visual de mayor impacto
- CIERRE: qué ve el espectador cuando termina

Para cada momento incluir:
- tiempo: el rango en segundos o nombre del momento
- descripcion_visual: qué se ve exactamente en pantalla (plano, composición, movimiento)
- tipo_plano: Primer plano / Plano medio / Detalle / B-roll
- movimiento_camara: Zoom in / Estático / Handheld / Travelling
- texto_en_pantalla: texto visual de impacto (SOLO aquí, NUNCA en teleprompter)
- emocion_objetivo: emoción específica que debe generar este momento
- efecto_retencion: técnica que retiene la atención en ese segundo exacto

B-Rolls estratégicos (mínimo 2):
- momento: cuándo se inserta
- que_mostrar: qué imagen o video específico
- por_que_refuerza: conexión directa con el mensaje narrativo
- emocion_generada: emoción que activa en el espectador

Ritmo de cortes:
- patron_general: LENTO (8-12s) / MEDIO (4-7s) / ACELERADO (1-3s) / VARIABLE
- descripcion: por qué ese ritmo sirve a este formato específico
- aceleraciones: en qué momentos y por qué
- desaceleraciones: en qué momentos se ralentiza para dar peso

Música:
- tipo: estilo musical específico (trap emocional / piano tenso / electrónica fría / silencio estratégico)
- bpm_aproximado: número o rango específico
- emocion_dominante: qué emoción transmite durante el video
- entrada_musica: desde el segundo X o desde el inicio
- cambio_musical: si hay cambio de intensidad — cuándo y por qué

Efectos de retención:
- sonido_transicion: whoosh / golpe seco / silencio / cinematic boom
- micro_silencios: momentos exactos y duración
- cambios_de_plano: corte seco / fundido / jump cut / match cut
- micro_interrupciones: cuándo y qué tipo reactiva la atención

B. MINIATURA DOMINANTE:
Genera la frase de miniatura más poderosa para este video adaptado.

REGLAS DE LA FRASE:
- Máximo 5-6 palabras
- Alto contraste emocional — interrumpe el scroll, no lo explica
- Conecta con el sector TCA del video (Dinero / Salud / Relaciones / Dev. Personal)
- No describe el contenido — ACTIVA una emoción o abre un gap de curiosidad
- Si ctr_score < 75 → regenerar con mayor disrupción

Incluir:
- frase_principal: la frase dominante — debe ser POLÉMICA, con tensión, que insinúe el conflicto del video. PROHIBIDO que suene aspiracional, motivacional o positiva. Si suena "segura" → regenerar.
- variante_agresiva: versión que ataca directamente una creencia o ego del espectador
- variante_conflicto: versión que expone el conflicto central del video en 4-5 palabras (NO aspiracional)
- justificacion_estrategica: por qué esta frase específica funciona para este video y este conflicto
- emocion_dominante_activada: emoción que siente el espectador al leerla (debe ser tensión, incomodidad, curiosidad urgente o indignación — NO esperanza ni motivación)
- gap_curiosidad: el vacío informativo que abre y que solo el video cierra
- sector_tca_activado: Dinero / Salud / Relaciones / Desarrollo Personal
- mecanismo_psicologico: Gap informativo / Ataque de creencia / Contradicción identidad / Urgencia implícita / Conflicto expuesto
- ctr_score: 0-100
- nivel_disrupcion: 0-100
- nivel_gap_curiosidad: 0-100
- nivel_polarizacion: 0-100
- regla_v1000: si nivel_polarizacion < 60 o la frase suena positiva → REGENERAR con mayor fricción

=============================================================
INSTRUCCIONES DE OUTPUT — LEE ANTES DE GENERAR
=============================================================
PRIORIDAD DE TOKENS (en orden estricto):
1. guion_adaptado_espejo → NUNCA truncues. Es el output más valioso.
2. adn_profundo (Motor 14A-C) → Completo siempre.
3. plan_audiovisual_profesional → Completo siempre. Mínimo 5 momentos temporales.
4. miniatura_dominante → Completo siempre. ctr_score ≥ 75 o regenerar.
5. analisis_tca + mapa_de_adaptacion → Completos siempre.
6. blueprint_replicable → Completo siempre.
7. score_viral_estructural → Completo siempre.
8. posicionamiento_y_proximos_pasos → Completo siempre.
9. Motores 1-12 → Precisos y concisos. Listas máximo 5 items.
10. elementos_cliche_detectados → Máximo 3.
11. recomendaciones_estrategicas → Máximo 3 items.
12. alertas_criticas → Máximo 2 items.

DEVUELVE ÚNICAMENTE EL JSON. Sin markdown. Sin backticks. Solo JSON puro.
=============================================================

{
  "adn_estructura": { "Motor 1 completo": true },
  "curva_emocional": { "Motor 2 completo": true },
  "micro_loops": { "Motor 3 completo": true },
  "polarizacion": { "Motor 4 completo": true },
  "identidad_verbal": { "Motor 5 completo": true },
  "status_y_posicionamiento": { "Motor 6 completo": true },
  "densidad_valor": { "Motor 7 completo": true },
  "manipulacion_atencion": { "Motor 8 completo": true },
  "activadores_guardado": [ "Motor 9 — mínimo 3 activadores" ],
  "adaptabilidad_nicho": { "Motor 10 completo": true },
  "elementos_cliche_detectados": [ "Motor 11 — máximo 3" ],
  "ritmo_narrativo": { "Motor 12 completo": true },
  "score_viral_estructural": { "Motor 13 completo con breakdown": true },
  "adn_profundo": {
    "genero_narrativo": "Confesional | Educativo | Drama real | Opinión polarizante | Autoridad estratégica | Historia de fracaso | Historia de poder | Denuncia | Revelación",
    "emocion_nucleo": "Culpa | Rabia | Indignación | Vulnerabilidad | Liderazgo | Redención | Superioridad | Advertencia",
    "tipo_tension": "Moral | Profesional | Social | Económica | Autoridad | Identidad",
    "frame_dominante": {
      "creencia_que_ataca": "la creencia falsa que destruye el video",
      "nuevo_marco": "la visión alternativa superior",
      "frase_nucleo": "la frase que condensa el frame completo"
    },
    "polarizacion_implicita": {
      "bando_A": "quiénes están de acuerdo",
      "bando_B": "quiénes se ofenden o discrepan",
      "tension_irresuelta": "pregunta moral que queda abierta"
    }
  },
  "idea_nuclear_ganadora": {
    "que_hace_viral": "mecanismo específico que genera millones de vistas",
    "creencia_rota": "creencia popular que destruye",
    "postura_impuesta": "postura que instala en quien lo ve",
    "por_que_genera_conversacion": "el conflicto social que activa",
    "tension_no_resuelta": "pregunta que obliga a comentar"
  },
  "sistema_superioridad": {
    "mayor_claridad": "cómo el mensaje adaptado es más directo y entendible que el original",
    "mayor_intensidad": "cómo la emoción está más concentrada y sostenida que en el original",
    "mayor_polarizacion": "cómo el conflicto está más definido y amplificado en el nicho del usuario",
    "mejor_estructura_emocional": "cómo la curva emocional es más precisa — con punto crítico más claro",
    "mejor_cierre": "cómo el cierre genera más debate, guardado o seguimiento que el original",
    "ventaja_de_nicho": "qué tiene el experto del usuario que el creador original NO tiene",
    "conflicto_amplificado": "cómo el conflicto equivalente en el nicho del usuario es más relevante para su audiencia específica",
    "riesgo_equivalente_confirmado": true,
    "genero_mantenido_confirmado": true,
    "no_fue_suavizado": true
  },
  "guion_adaptado_espejo": "TEXTO FLUIDO Y NATURAL. EXCLUSIVAMENTE LO QUE EL CREADOR DICE EN VOZ ALTA. CERO ETIQUETAS. CERO INDICACIONES TÉCNICAS. Misma arquitectura emocional del original. Adaptado al nicho del usuario. Listo para grabar.",
  "guion_adaptado_al_nicho": "mismo valor que guion_adaptado_espejo — campo de compatibilidad",
  "blueprint_replicable": { "Motor 15 completo": true },
  "analisis_tca": { "Motor 16A completo": true },
  "mapa_de_adaptacion": { "Motor 16B completo": true },
  "validacion_olimpo": {
    "arquitectura_completa": true,
    "loops_detectados": true,
    "tca_identificado": true,
    "equilibrio_ideal_detectado": true,
    "filtro_implicito_extraido": true,
    "adaptacion_sin_micronicho": true,
    "adn_estructural_mantenido": true,
    "genero_narrativo_respetado": true,
    "emocion_nucleo_presente": true,
    "teleprompter_sin_etiquetas": true,
    "conflicto_original_preservado": true,
    "riesgo_narrativo_mantenido": true,
    "intensidad_equivalente_o_superior": true,
    "guion_concreto_no_abstracto": true,
    "punto_critico_presente": true,
    "decision_clara_presente": true,
    "score_validacion": 0
  },
  "equivalencia_estructural_v1000": {
    "genero_narrativo_original": "género detectado",
    "genero_narrativo_adaptado": "debe ser idéntico al original",
    "tipo_conflicto_original": "Moral | Interpersonal | Reputacional | Económico | Poder | Ético",
    "tipo_conflicto_adaptado": "equivalente en el nicho del usuario",
    "riesgo_narrativo_original": 0,
    "riesgo_narrativo_adaptado": 0,
    "intensidad_emocional_original": "Baja | Media | Alta | Extrema",
    "intensidad_emocional_adaptada": "igual o superior",
    "bando_A_original": "descripción",
    "bando_A_adaptado": "equivalente en nicho",
    "bando_B_original": "descripción",
    "bando_B_adaptado": "equivalente en nicho",
    "punto_critico_detectado": true,
    "decision_clara_detectada": true,
    "abstraccion_detectada": false,
    "fidelidad_mecanismo_score": 0,
    "alerta_suavizamiento": "null o descripción del problema si existe"
  },
  "posicionamiento_y_proximos_pasos": {
    "posiciona_como": "Mentor firme | Líder estratégico | Autoridad ética | Visionario | Analista frío | Testigo honesto",
    "razon_posicionamiento": "por qué este contenido genera exactamente ese posicionamiento",
    "proximos_contenidos": [
      {
        "titulo": "título exacto del próximo video",
        "por_que_ahora": "por qué es la continuación lógica",
        "genero": "género narrativo",
        "tension": "tipo de tensión que activa"
      },
      {
        "titulo": "título exacto del próximo video 2",
        "por_que_ahora": "continuación lógica 2",
        "genero": "género narrativo 2",
        "tension": "tipo de tensión 2"
      },
      {
        "titulo": "título exacto del próximo video 3",
        "por_que_ahora": "continuación lógica 3",
        "genero": "género narrativo 3",
        "tension": "tipo de tensión 3"
      }
    ]
  },
  "plan_audiovisual_profesional": {
    "secuencia_temporal": [
      {
        "tiempo": "0-3s",
        "descripcion_visual": "Qué ve exactamente el espectador — plano, composición, movimiento",
        "tipo_plano": "Primer plano extremo / Plano medio / Detalle / B-roll",
        "movimiento_camara": "Zoom in agresivo / Estático / Handheld / Travelling",
        "texto_en_pantalla": "Texto visual de impacto (SOLO aquí, NUNCA en teleprompter)",
        "emocion_objetivo": "Emoción específica que genera este momento",
        "efecto_retencion": "Técnica de retención en este segundo exacto"
      },
      {
        "tiempo": "3-7s",
        "descripcion_visual": "Setup visual",
        "tipo_plano": "Tipo de plano",
        "movimiento_camara": "Movimiento",
        "texto_en_pantalla": "Texto o vacío",
        "emocion_objetivo": "Emoción",
        "efecto_retencion": "Técnica"
      },
      {
        "tiempo": "7-15s",
        "descripcion_visual": "Escalada visual del conflicto",
        "tipo_plano": "Tipo de plano",
        "movimiento_camara": "Movimiento",
        "texto_en_pantalla": "Texto de apoyo",
        "emocion_objetivo": "Emoción en escalada",
        "efecto_retencion": "Loop visual o pregunta en pantalla"
      },
      {
        "tiempo": "CLÍMAX",
        "descripcion_visual": "Momento visual de mayor impacto del video",
        "tipo_plano": "Plano del clímax",
        "movimiento_camara": "Movimiento en el clímax",
        "texto_en_pantalla": "Texto de mayor impacto visual",
        "emocion_objetivo": "Emoción máxima — pico de la curva",
        "efecto_retencion": "Golpe sonoro / Silencio súbito / Cambio de ritmo visual"
      },
      {
        "tiempo": "CIERRE",
        "descripcion_visual": "Qué ve el espectador al terminar",
        "tipo_plano": "Plano del cierre",
        "movimiento_camara": "Movimiento final",
        "texto_en_pantalla": "Frase clave del insight en pantalla",
        "emocion_objetivo": "Claridad / Sorpresa / Poder / Alivio",
        "efecto_retencion": "Pausa visual que permite que el insight aterrice"
      }
    ],
    "b_rolls_estrategicos": [
      {
        "momento": "Segundo o bloque donde se inserta",
        "que_mostrar": "Descripción específica del b-roll",
        "por_que_refuerza": "Conexión directa con el mensaje narrativo",
        "emocion_generada": "Emoción específica que activa"
      },
      {
        "momento": "Segundo bloque",
        "que_mostrar": "B-roll 2",
        "por_que_refuerza": "Razón estratégica",
        "emocion_generada": "Emoción activada"
      }
    ],
    "ritmo_de_cortes": {
      "patron_general": "LENTO / MEDIO / ACELERADO / VARIABLE",
      "descripcion": "Por qué ese ritmo sirve a este formato específico",
      "aceleraciones": "En qué momentos y por qué se aceleran",
      "desaceleraciones": "En qué momentos se ralentizan para dar peso"
    },
    "musica": {
      "tipo": "Estilo musical específico — trap emocional / piano tenso / electrónica fría / silencio estratégico",
      "bpm_aproximado": "Número o rango específico de BPM",
      "emocion_dominante": "Emoción que transmite la música durante el video",
      "entrada_musica": "Desde el segundo X o desde el inicio",
      "cambio_musical": "Cambio de intensidad — cuándo y por qué"
    },
    "efectos_de_retencion": {
      "sonido_transicion": "whoosh / golpe seco / silencio / cinematic boom",
      "micro_silencios": "Momentos exactos y duración",
      "cambios_de_plano": "corte seco / fundido / jump cut / match cut",
      "micro_interrupciones": "Cuándo y qué tipo reactiva la atención"
    }
  },
  "miniatura_dominante": {
    "frase_principal": "FRASE PRINCIPAL. Máx 5-6 palabras. Interrumpe el scroll — no lo explica.",
    "variante_agresiva": "Versión que ataca una creencia o ego del espectador",
    "variante_aspiracional": "Versión que activa deseo de identidad o pertenencia a élite",
    "justificacion_estrategica": "Por qué esta frase específica funciona para este video adaptado",
    "emocion_dominante_activada": "Emoción que siente el espectador al leerla antes de ver el video",
    "gap_curiosidad": "El vacío informativo exacto que abre y que solo el video puede cerrar",
    "sector_tca_activado": "Dinero / Salud / Relaciones / Desarrollo Personal",
    "mecanismo_psicologico": "Gap informativo / Ataque de creencia / Contradicción identidad / Urgencia implícita",
    "ctr_score": 0,
    "nivel_disrupcion": 0,
    "nivel_gap_curiosidad": 0,
    "nivel_polarizacion": 0
  },
  "recomendaciones_estrategicas": ["recomendación 1", "recomendación 2", "recomendación 3"],
  "alertas_criticas": ["alerta 1", "alerta 2"]
}
`;

// ─── PROMPT PARA ITERACIÓN DE LOOP ──────────────────────────


// ── buildPromptRefinamientoLoop (refinamiento si guion corto) ────
const buildPromptRefinamientoLoop = (
  outputAnterior: string,
  scoreActual: number,
  umbralMinimo: number,
  iteracion: number,
  nichoUsuario: string
): string => `
Eres el motor de refinamiento del sistema Ingeniería Inversa PRO.

El análisis anterior obtuvo un score viral estructural de ${scoreActual}/100.
El umbral mínimo requerido es ${umbralMinimo}/100.
Esta es la iteración #${iteracion}.

ANÁLISIS ANTERIOR:
${outputAnterior}

DIAGNOSTICA por qué el score no alcanzó el umbral y EJECUTA las siguientes acciones:

1. REAFINA el guion_adaptado_al_nicho para ${nichoUsuario}:
   - Intensifica los micro-loops más débiles
   - Potencia los picos emocionales de menor intensidad
   - Elimina elementos cliché detectados
   - Agrega activadores de guardado donde falten

2. REEQUILIBRA la tensión narrativa:
   - Asegura que haya un loop abierto cada 15-20 segundos máximo
   - El hook debe generar curiosidad antes del segundo 5

3. RECALCULA el score_viral_estructural honestamente.

4. ACTUALIZA recomendaciones_estrategicas y alertas_criticas.

5. CONSERVA OBLIGATORIAMENTE en el JSON de salida:
   - analisis_tca: mantén el objeto exactamente como estaba (no recalcules)
   - mapa_de_adaptacion: mantén el objeto exactamente como estaba
   - validacion_olimpo: recalcula si mejoraste, o mantén el anterior
   - blueprint_replicable: mantén el objeto exactamente como estaba
   - adn_profundo: mantén el objeto exactamente como estaba
   - idea_nuclear_ganadora: mantén el objeto exactamente como estaba
   - sistema_superioridad: mantén el objeto exactamente como estaba
   - posicionamiento_y_proximos_pasos: mantén el objeto exactamente como estaba
   - plan_audiovisual_profesional: mantén el objeto exactamente como estaba
   - miniatura_dominante: mantén el objeto exactamente como estaba

6. REESCRIBE COMPLETAMENTE el guion_adaptado_espejo si tiene menos de ${minWords} palabras.
   El guion DEBE tener mínimo ${minWords} palabras para ${contentTypeCtx}.
   El nicho del usuario es: ${nichoUsuario} — CADA elemento del guion debe estar en ese nicho.
   NUNCA entregues el mismo guion corto que ya fue rechazado.
   AMPLÍA con más profundidad emocional, más conflicto, más ejemplos del nicho.

DEVUELVE únicamente el JSON completo actualizado con los 21 motores. Sin texto adicional.
`;

const PROMPT_REFINAMIENTO_LOOP = buildPromptRefinamientoLoop;


// ── PROMPT_ADN_FORENSE (usado en FASE 1) ─────────────────────────
const PROMPT_ADN_FORENSE = (
  transcripcion: string,
  nichoOrigen: string,
  nichoUsuario: string,
  objetivoUsuario: string,
  expertProfile?: any,
  contexto?: any
) => `
Eres TITAN OMEGA OLIMPO - laboratorio forense de ADN viral.
ESTA FASE: SOLO analizas. NO generas guion. NO escribes adaptaciones.
Tu trabajo es extraer el ADN con precision quirurgica.

=============================================================
TRANSCRIPCION A ANALIZAR:
Nicho de origen: ${nichoOrigen}
Nicho del usuario (destino): ${nichoUsuario}
Objetivo del usuario: ${objetivoUsuario}

IDIOMA ORIGEN DEL VIDEO: ${contexto?.detectedSourceLanguage || 'auto-detectado'}
IDIOMA DE SALIDA DEL GUION: ${contexto?.outputLanguageFull || 'espanol - escribe como hispanohablante nativo'}
REGLA: Si el video es en ingles y el guion va en espanol - NO traduzcas, RECREA.
El guion debe sonar como si un nativo de ese idioma lo hubiera pensado asi desde el principio.

${expertProfile ? `PERFIL DEL EXPERTO:
- Nivel autoridad: ${expertProfile.authority_level || 'N/A'}
- Objetivo: ${expertProfile.main_objective || 'N/A'}
- Mecanismo: ${expertProfile.mechanism_name || 'N/A'}
- Enemigo narrativo: ${expertProfile.enemy || 'N/A'}
` : ''}

TRANSCRIPCION:
${transcripcion}
=============================================================

TAREA: Analiza el video anterior y devuelve UN SOLO objeto JSON con TODOS estos motores.

MOTOR 1 - adn_estructura: {
  patron_narrativo_detectado: string,
  descomposicion_estructural: [{ segundo_inicio: number, segundo_fin: number, bloque: string, funcion_narrativa: string, tension_generada: string }],
  tipo_apertura: string,
  tipo_cierre: string,
  velocidad_narrativa: string,
  ratio_hook_cuerpo_cta: string
}

MOTOR 2 - curva_emocional: {
  emocion_dominante: string,
  secuencia_emocional: [{ momento: string, emocion: string, intensidad: number }],
  punto_maximo_tension: string,
  resolucion_emocional: string,
  variabilidad_emocional: number,
  arco_emocional: string
}

MOTOR 3 - micro_loops: {
  loops_detectados: [{ tipo: string, activador: string, resolucion: string, segundo_activacion: number }],
  patron_principal: string,
  frecuencia_loops: number,
  loop_no_cerrado: string
}

MOTOR 4 - polarizacion: {
  nivel_polarizacion: number,
  ruptura_creencia_detectada: string,
  postura_impuesta: string,
  posicionamiento_vs: string,
  mecanismo_division: string
}

MOTOR 5 - identidad_verbal: {
  tono_dominante: string,
  marcadores_linguisticos: string[],
  nivel_vocabulario: string,
  patrones_fraseo: string[],
  firma_linguistica: string
}

MOTOR 6 - status_y_posicionamiento: {
  nivel_autoridad_proyectado: number,
  mecanismo_autoridad: string,
  posicionamiento_experto: string,
  prueba_social_usada: string,
  distancia_audiencia: string
}

MOTOR 7 - densidad_valor: {
  ratio_valor_entretenimiento: number,
  porcentaje_contenido_abierto: number,
  nivel_especificidad: number,
  promesas_implicitas: string[],
  ratio_promesa_entrega: number
}

MOTOR 8 - manipulacion_atencion: {
  tecnicas_detectadas: string[],
  patron_principal: string,
  momento_critico_atencion: string,
  frecuencia_estimulacion: number
}

MOTOR 9 - activadores_guardado: {
  elementos_guardado: string[],
  tipo_valor_percibido: string,
  urgencia_guardar: number,
  razon_compartir: string
}

MOTOR 10 - adaptabilidad_nicho: {
  nichos_compatibles: string[],
  elementos_universales: string[],
  elementos_especificos_nicho: string[],
  facilidad_adaptacion: number
}

MOTOR 11 - elementos_cliche_detectados: {
  cliches: [{ elemento: string, frecuencia: string, impacto_negativo: string, alternativa: string }],
  nivel_saturacion: number,
  originalidad_score: number
}

MOTOR 12 - ritmo_narrativo: {
  velocidad_general: string,
  cambios_ritmo: [{ segundo: number, cambio: string, efecto: string }],
  patron_respiracion: string,
  densidad_informacion: string
}

MOTOR 13 - score_viral_estructural: {
  viralidad_estructural_global: number,
  retencion_estructural: number,
  intensidad_emocional: number,
  polarizacion: number,
  manipulacion_atencion: number,
  densidad_valor: number,
  recomendacion_express: string
}

MOTOR 14A - adn_profundo: {
  genero_narrativo: string,
  emocion_nucleo: string,
  tipo_tension: string,
  frame_dominante: { creencia_que_ataca: string, nuevo_marco: string, frase_nucleo: string },
  polarizacion_implicita: { bando_A: string, bando_B: string, tension_irresuelta: string }
}

MOTOR 14B - idea_nuclear_ganadora: {
  que_hace_viral: string,
  creencia_rota: string,
  postura_impuesta: string,
  por_que_genera_conversacion: string,
  tension_no_resuelta: string
}

MOTOR 14C - sistema_superioridad: {
  mecanismo_unico: string,
  por_que_nadie_mas_lo_dice: string,
  nivel_amenaza_al_status_quo: number,
  frase_bandera: string
}

MOTOR 14D - intensidad_conflictual: {
  nivel_riesgo_original: string,
  nivel_incomodidad: number,
  escena_concreta_principal: string,
  decision_impopular: string,
  consecuencia_real: string,
  por_que_incomoda: string,
  elemento_peligroso: string,
  equivalente_en_nicho: object
}

MOTOR 15 - blueprint_replicable: {
  formula_narrativa: string,
  ingredientes_esenciales: string[],
  estructura_replicable: string,
  adaptacion_universal: string
}

MOTOR 16 - analisis_tca: {
  circulo_1_tema_universal: string,
  circulo_2_problema_global: string,
  circulo_3_conexion_sector: string,
  circulo_4_solucion_experta: string,
  mass_appeal_score: number,
  nivel_tca_detectado: string,
  equilibrio_masividad_calificacion: boolean
}

MOTOR 17 - posicionamiento_y_proximos_pasos: {
  posiciona_como: string,
  audiencia_ideal: string,
  proximos_pasos_recomendados: string[],
  oportunidad_detectada: string
}

DEVUELVE UNICAMENTE JSON VALIDO. Sin markdown. Sin texto extra. Sin backticks.
`;



// ── PROMPT_GUION_ELITE (usado en FASE 2) ─────────────────────────
const PROMPT_GUION_ELITE = (
  adnForense: any,
  nichoUsuario: string,
  objetivoUsuario: string,
  contentType: string,
  platform: string,
  expertProfile?: any
): string => {
  const minWords = contentType === 'masterclass' ? 700 : contentType === 'long' ? 400 : 250;
  const idealWords = contentType === 'masterclass' ? 1200 : contentType === 'long' ? 650 : 380;
  const duracion = contentType === 'masterclass' ? 'mas de 10 minutos' : contentType === 'long' ? '3 a 10 minutos' : '30 a 90 segundos';

  const genero = adnForense.adn_profundo?.genero_narrativo || 'Autoridad estrategica';
  const emocion = adnForense.adn_profundo?.emocion_nucleo || 'Indignacion';
  const tension = adnForense.adn_profundo?.tipo_tension || 'Profesional';
  const frameNucleo = adnForense.adn_profundo?.frame_dominante?.frase_nucleo || '';
  const creenciaAtaca = adnForense.adn_profundo?.frame_dominante?.creencia_que_ataca || '';
  const nuevoMarco = adnForense.adn_profundo?.frame_dominante?.nuevo_marco || '';
  const ideanuclear = adnForense.idea_nuclear_ganadora?.que_hace_viral || '';
  const postura = adnForense.idea_nuclear_ganadora?.postura_impuesta || '';
  const creenciaRota = adnForense.idea_nuclear_ganadora?.creencia_rota || '';
  const tensionNoResuelta = adnForense.idea_nuclear_ganadora?.tension_no_resuelta || '';
  const patron = adnForense.adn_estructura?.patron_narrativo_detectado || '';
  const tipoApertura = adnForense.adn_estructura?.tipo_apertura || '';
  const tipoCierre = adnForense.adn_estructura?.tipo_cierre || '';
  const loopPrincipal = adnForense.micro_loops?.patron_principal || '';
  const loopNoCerrado = adnForense.micro_loops?.loop_no_cerrado || '';
  const sistemaSupLema = adnForense.sistema_superioridad?.frase_bandera || '';
  const sistemaSupMec = adnForense.sistema_superioridad?.mecanismo_unico || '';
  const nivelIncomodidad = adnForense.intensidad_conflictual?.nivel_incomodidad || 70;
  const escenaConcreta = adnForense.intensidad_conflictual?.escena_concreta_principal || '';
  const decisionImpopular = adnForense.intensidad_conflictual?.decision_impopular || '';
  const elementoPeligroso = adnForense.intensidad_conflictual?.elemento_peligroso || '';
  const equivalenteNicho = adnForense.intensidad_conflictual?.equivalente_en_nicho || {};
  const tcaC1 = adnForense.analisis_tca?.circulo_1_tema_universal || '';
  const tcaC2 = adnForense.analisis_tca?.circulo_2_problema_global || '';
  const tcaC3 = adnForense.analisis_tca?.circulo_3_conexion_sector || '';
  const tcaC4 = adnForense.analisis_tca?.circulo_4_solucion_experta || '';
  const scoreViral = adnForense.score_viral_estructural?.viralidad_estructural_global || 0;

  const expertSection = expertProfile ? `
PERFIL EXPERTO ACTIVO:
- Mecanismo: ${expertProfile.mechanism_name || 'N/A'}
- Enemigo: ${expertProfile.enemy || 'N/A'}
- Territorio mental: ${expertProfile.mental_territory || 'N/A'}
- Punto A (dolor): ${expertProfile.point_a || 'N/A'}
- Punto B (destino): ${expertProfile.point_b || 'N/A'}
` : '';

  return `Eres un escritor de guiones virales de elite.
Tu UNICA tarea: generar el guion adaptado al nicho del usuario replicando el ADN viral del video analizado.

=============================================================
ADN FORENSE EXTRAIDO (Score: ${scoreViral}/100):
- Genero narrativo: ${genero}
- Emocion nucleo: ${emocion}
- Tipo tension: ${tension}
- Frame dominante: ${frameNucleo}
- Creencia que ataca: ${creenciaAtaca}
- Nuevo marco: ${nuevoMarco}
- Idea nuclear: ${ideanuclear}
- Postura impuesta: ${postura}
- Creencia rota: ${creenciaRota}
- Tension no resuelta: ${tensionNoResuelta}
- Patron narrativo: ${patron}
- Tipo apertura: ${tipoApertura}
- Tipo cierre: ${tipoCierre}
- Loop principal: ${loopPrincipal}
- Loop no cerrado: ${loopNoCerrado}
- Frase bandera: ${sistemaSupLema}
- Mecanismo unico: ${sistemaSupMec}
- Nivel incomodidad original: ${nivelIncomodidad}/100
- Escena concreta: ${escenaConcreta}
- Decision impopular: ${decisionImpopular}
- Elemento peligroso: ${elementoPeligroso}
- Equivalente en nicho: ${JSON.stringify(equivalenteNicho)}

MOTOR TCA:
- Circulo 1 (Tema universal): ${tcaC1}
- Circulo 2 (Problema global): ${tcaC2}
- Circulo 3 (Conexion sector): ${tcaC3}
- Circulo 4 (Solucion experta): ${tcaC4}
${expertSection}
=============================================================
NICHO DEL USUARIO: ${nichoUsuario}
OBJETIVO: ${objetivoUsuario}
PLATAFORMA: ${platform}
TIPO DE CONTENIDO: ${contentType} (${duracion})
MINIMO DE PALABRAS: ${minWords} | IDEAL: ${idealWords}

IDIOMA DE SALIDA: ${adnForense._outputLanguageFull || 'espanol - escribe como hispanohablante nativo'}
REGLA DE IDIOMA: Si el ADN viene de ingles pero el guion va en espanol - NO traduzcas, RECREA desde cero en ese idioma.

=============================================================
REGLA ANTI-SUAVIZACION:
El video original tenia nivel de incomodidad ${nivelIncomodidad}/100.
DEBES replicar esa misma intensidad, riesgo y tipo de conflicto, adaptado al nicho.
PROHIBIDO hacer un guion motivacional o comercial aburrido si el original era crudo o polemico.

REGLA DE FORMATO (HABLANDO A CAMARA):
Este es un video de un creador hablandole a su audiencia.
PROHIBIDO crear guiones teatrales, personajes o dialogos.
El campo "guion_adaptado_espejo" DEBE ser un SOLO STRING de texto plano. NADA de sub-objetos.

ESTRUCTURA TCA OBLIGATORIA:
[CAPA 1 MASIVO 0-3s] Hook universal que engancha a cualquiera
[CAPA 2 FILTRADO 3-15s] Conecta con el problema del nicho
[CAPA 3 HISTORIA 15-35s] Desarrollo narrativo con el ADN detectado
[CAPA 4 AUTORIDAD 35-50s] Posicionamiento experto
[CAPA 5 CTA 50-60s] Llamada a la accion

=============================================================
DEVUELVE ESTE JSON EXACTO (sin markdown, sin backticks):
{
  "guion_adaptado_espejo": "TEXTO COMPLETO DEL GUION EN UN SOLO STRING",
  "guion_adaptado_al_nicho": "MISMO TEXTO DEL GUION",
  "hooks_alternativos": {
    "curiosidad": "hook de curiosidad aqui",
    "polemica": "hook polemico aqui",
    "autoridad": "hook de autoridad aqui",
    "descubrimiento": "hook de descubrimiento aqui",
    "advertencia": "hook de advertencia aqui"
  },
  "plan_audiovisual_profesional": {
    "secuencia_temporal": [
      { "segundo_inicio": 0, "segundo_fin": 3, "accion": "", "texto_pantalla": "", "broll": "", "musica": "" }
    ],
    "ritmo_cortes": "",
    "estilo_visual": ""
  },
  "miniatura_dominante": {
    "concepto": "",
    "texto_principal": "",
    "elemento_visual": "",
    "emocion_objetivo": ""
  },
  "mapa_de_adaptacion": {
    "elemento_original": "",
    "adaptacion_al_nicho": "",
    "por_que_funciona": ""
  },
  "validacion_olimpo": {
    "replica_adn": true,
    "mantiene_intensidad": true,
    "tca_completo": true,
    "guion_no_generico": true,
    "guion_concreto_no_abstracto": true,
    "punto_critico_presente": true,
    "decision_clara_presente": true,
    "score_validacion": 0
  }
}`;
};



// ── helpers de cálculo ───────────────────────────────────────────
function prepararPaqueteParaJuezViral(outputMotores: any): any {
  try {
    const indice = outputMotores.indice_fidelidad || {};
    const psicologia = outputMotores.equivalencia_psicologica_calculada || {};
    const progresion = outputMotores.progresion_emocional_calculada || {};
    const loopsMetricas = outputMotores.metricas_micro_loops || {};
    const blueprint = outputMotores.blueprint_replicable || {};
    const scoreViral = outputMotores.score_viral_estructural || {};

    // Criterios que el Juez debe validar
    const criteriosValidacion = [
      {
        criterio: "Fidelidad Arquitectónica",
        valor_esperado: indice.indice_fidelidad || 0,
        umbral_minimo: 70,
        cumple: (indice.indice_fidelidad || 0) >= 70,
        diagnostico: indice.diagnostico || "Sin datos"
      },
      {
        criterio: "Progresión Emocional",
        valor_esperado: progresion.variacion_total || 0,
        umbral_minimo: 30,
        cumple: (progresion.variacion_total || 0) >= 30,
        diagnostico: progresion.diagnostico_curva || "Sin datos"
      },
      {
        criterio: "Micro-Loops",
        valor_esperado: loopsMetricas.total_loops || 0,
        umbral_minimo: 2,
        cumple: (loopsMetricas.total_loops || 0) >= 2,
        diagnostico: loopsMetricas.diagnostico_loops || "Sin datos"
      },
      {
        criterio: "Impacto Psicológico",
        valor_esperado: psicologia.score_impacto || 0,
        umbral_minimo: 50,
        cumple: (psicologia.score_impacto || 0) >= 50,
        diagnostico: psicologia.impacto_psicologico || "Sin datos"
      },
      {
        criterio: "Score Viral Estructural",
        valor_esperado: scoreViral.viralidad_estructural_global || 0,
        umbral_minimo: 70,
        cumple: (scoreViral.viralidad_estructural_global || 0) >= 70,
        diagnostico: scoreViral.viralidad_estructural_global >= 70
          ? "Score suficiente"
          : "Score por debajo del umbral"
      }
    ];

    // Calcular cuántos criterios se cumplen
    const criteriosCumplidos = criteriosValidacion.filter(c => c.cumple).length;
    const totalCriterios = criteriosValidacion.length;

    // Score de preparación para el Juez
    const scorePreparacion = Math.round((criteriosCumplidos / totalCriterios) * 100);

    // Instrucciones específicas para el Juez Viral
    const instruccionesJuez = blueprint.instrucciones_para_juez_viral ||
      `Audita este contenido verificando:
      1. Fidelidad al patrón: ${blueprint.nombre_patron || "detectado"}
      2. Fórmula base: ${blueprint.formula_base || "no disponible"}
      3. Equivalencia emocional: entrada=${psicologia.emocion_dominante}, salida=${psicologia.emocion_final}
      4. Tipo de tensión replicada: ${psicologia.tipo_tension}
      5. Loops mínimos requeridos: ${loopsMetricas.total_loops}`;

    // Alertas para el Juez
    const alertas: string[] = [];
    if (!progresion.escalada_detectada) {
      alertas.push("ALERTA: Sin escalada emocional detectada — verificar progresión");
    }
    if (loopsMetricas.loops_sin_resolver > 2) {
      alertas.push(`ALERTA: ${loopsMetricas.loops_sin_resolver} loops sin resolver — puede generar frustración`);
    }
    if (progresion.riesgo_monotonia === "Alto") {
      alertas.push("ALERTA: Riesgo alto de monotonía — curva emocional plana");
    }
    if ((indice.indice_fidelidad || 0) < 60) {
      alertas.push("ALERTA: Fidelidad arquitectónica baja — revisar orden de bloques");
    }

    return {
      listo_para_juez: scorePreparacion >= 60,
      score_preparacion: scorePreparacion,
      criterios_cumplidos: criteriosCumplidos,
      total_criterios: totalCriterios,
      criterios_validacion: criteriosValidacion,
      instrucciones_juez: instruccionesJuez,
      alertas_criticas: alertas,
      resumen_adn: {
        patron_detectado: blueprint.nombre_patron || "No detectado",
        formula_base: blueprint.formula_base || "No disponible",
        tipo_promesa: psicologia.tipo_promesa || "No detectada",
        tipo_tension: psicologia.tipo_tension || "No detectada",
        emocion_entrada: psicologia.emocion_dominante || "No detectada",
        emocion_salida: psicologia.emocion_final || "No detectada",
        sesgo_cognitivo: psicologia.sesgo_cognitivo_principal || "No detectado",
        loops_activos: loopsMetricas.total_loops || 0,
        indice_fidelidad: indice.indice_fidelidad || 0,
        score_viral: scoreViral.viralidad_estructural_global || 0
      }
    };

  } catch (e) {
    return {
      listo_para_juez: false,
      score_preparacion: 0,
      criterios_cumplidos: 0,
      total_criterios: 5,
      criterios_validacion: [],
      instrucciones_juez: "Error preparando paquete para Juez Viral",
      alertas_criticas: ["Error crítico en preparación"],
      resumen_adn: {}
    };
  }
}


function calcularMetricasMicroLoops(outputMotores: any): any {
  try {
    const loops = outputMotores.micro_loops;
    const estructura = outputMotores.adn_estructura;

    if (!loops || !loops.loops || loops.loops.length === 0) {
      return {
        total_loops: 0,
        loops_resueltos: 0,
        loops_sin_resolver: 0,
        frecuencia_promedio_segundos: 0,
        distribucion: [],
        efectividad_potencial: 0,
        densidad_anticipacion: 0,
        tipos_detectados: [],
        diagnostico_loops: "Sin micro-loops detectados — riesgo alto de abandono",
        recomendacion: "Agregar al menos 2 micro-loops entre el segundo 10 y 40"
      };
    }

    const todosLoops = loops.loops;

    // Contar resueltos vs sin resolver
    const loopsSinResolver = todosLoops.filter(
      (l: any) => l.segundo_cierre === null || l.segundo_cierre === undefined
    ).length;
    const loopsResueltos = todosLoops.length - loopsSinResolver;

    // Calcular frecuencia promedio
    const aperturas = todosLoops
      .map((l: any) => l.segundo_apertura)
      .filter((s: any) => typeof s === "number")
      .sort((a: number, b: number) => a - b);

    let frecuenciaPromedio = 0;
    if (aperturas.length >= 2) {
      const intervalos = aperturas.slice(1).map(
        (s: number, idx: number) => s - aperturas[idx]
      );
      frecuenciaPromedio = Math.round(
        intervalos.reduce((a: number, b: number) => a + b, 0) / intervalos.length
      );
    }

    // Distribución por tipo
    const tiposConteo: Record<string, number> = {};
    todosLoops.forEach((l: any) => {
      const tipo = l.tipo || "desconocido";
      tiposConteo[tipo] = (tiposConteo[tipo] || 0) + 1;
    });
    const distribucion = Object.entries(tiposConteo).map(([tipo, cantidad]) => ({
      tipo,
      cantidad,
      porcentaje: Math.round((cantidad / todosLoops.length) * 100)
    }));

    // Tipos únicos detectados
    const tiposDetectados = Object.keys(tiposConteo);

    // Calcular efectividad potencial
    const intensidades = todosLoops.map((l: any) => l.intensidad || 0);
    const intensidadPromedio = intensidades.length > 0
      ? intensidades.reduce((a: number, b: number) => a + b, 0) / intensidades.length
      : 0;

    const penalizacionSinResolver = loopsSinResolver > 2 ? 15 : 0;
    const bonusFrecuencia = frecuenciaPromedio > 0 && frecuenciaPromedio <= 20 ? 20 : 0;

    const efectividadPotencial = Math.min(100, Math.round(
      (intensidadPromedio * 0.5) +
      (loopsResueltos / Math.max(todosLoops.length, 1) * 30) +
      bonusFrecuencia -
      penalizacionSinResolver
    ));

    // Diagnóstico
    let diagnostico = "";
    let recomendacion = "";

    if (todosLoops.length >= 3 && efectividadPotencial >= 70) {
      diagnostico = "Sistema de loops sólido — alta retención esperada";
      recomendacion = "Mantener la frecuencia actual en la adaptación";
    } else if (todosLoops.length >= 2 && efectividadPotencial >= 50) {
      diagnostico = "Loops presentes pero con margen de mejora";
      recomendacion = "Agregar un loop adicional entre el segundo 25 y 35";
    } else {
      diagnostico = "Loops insuficientes — riesgo medio de abandono";
      recomendacion = "Reestructurar con al menos 3 loops distribuidos cada 15 segundos";
    }

    return {
      total_loops: todosLoops.length,
      loops_resueltos: loopsResueltos,
      loops_sin_resolver: loopsSinResolver,
      frecuencia_promedio_segundos: frecuenciaPromedio,
      distribucion,
      tipos_detectados: tiposDetectados,
      efectividad_potencial: efectividadPotencial,
      densidad_anticipacion: loops.densidad_anticipacion || 0,
      estrategia_tension: loops.estrategia_tension || "No detectada",
      diagnostico_loops: diagnostico,
      recomendacion
    };

  } catch (e) {
    return {
      total_loops: 0,
      loops_resueltos: 0,
      loops_sin_resolver: 0,
      frecuencia_promedio_segundos: 0,
      distribucion: [],
      tipos_detectados: [],
      efectividad_potencial: 0,
      densidad_anticipacion: 0,
      diagnostico_loops: "Error calculando micro-loops",
      recomendacion: "Revisar manualmente"
    };
  }
}


function calcularProgrecionEmocional(outputMotores: any): any {
  try {
    const curva = outputMotores.curva_emocional;
    const estructura = outputMotores.adn_estructura;

    if (!curva) {
      return {
        mapa_bloques: [],
        escalada_detectada: false,
        riesgo_monotonia: "Alto",
        pico_maximo: 0,
        pico_minimo: 0,
        variacion_total: 0,
        momento_pico_principal: "No detectado",
        diagnostico_curva: "Sin datos de curva emocional"
      };
    }

    // Construir mapa por bloque
    const segmentos = curva.segmentos || [];
    const mapaBloques = segmentos.map((seg: any, idx: number) => {
      const intensidadAnterior = idx > 0 ? segmentos[idx - 1].intensidad : 0;
      const dinamica = seg.intensidad > intensidadAnterior
        ? "Subida"
        : seg.intensidad < intensidadAnterior
        ? "Bajada"
        : "Sostenida";

      return {
        bloque: seg.bloque,
        emocion: seg.emocion,
        intensidad: seg.intensidad || 0,
        dinamica,
        es_pico: false // se actualiza abajo
      };
    });

    // Detectar picos reales
    mapaBloques.forEach((bloque: any, idx: number) => {
      const anterior = idx > 0 ? mapaBloques[idx - 1].intensidad : 0;
      const siguiente = idx < mapaBloques.length - 1
        ? mapaBloques[idx + 1].intensidad
        : 0;
      if (bloque.intensidad > anterior && bloque.intensidad >= siguiente) {
        bloque.es_pico = true;
      }
    });

    // Calcular métricas
    const intensidades = mapaBloques.map((b: any) => b.intensidad);
    const picoMaximo = intensidades.length > 0 ? Math.max(...intensidades) : 0;
    const picoMinimo = intensidades.length > 0 ? Math.min(...intensidades) : 0;
    const variacionTotal = picoMaximo - picoMinimo;

    // Detectar escalada
    let escaladaDetectada = false;
    if (intensidades.length >= 3) {
      const primera_mitad = intensidades.slice(0, Math.floor(intensidades.length / 2));
      const segunda_mitad = intensidades.slice(Math.floor(intensidades.length / 2));
      const promedioPrimera = primera_mitad.reduce((a: number, b: number) => a + b, 0) / primera_mitad.length;
      const promedioSegunda = segunda_mitad.reduce((a: number, b: number) => a + b, 0) / segunda_mitad.length;
      escaladaDetectada = promedioSegunda > promedioPrimera;
    }

    // Riesgo de monotonía
    let riesgoMonotonia = "Bajo";
    if (variacionTotal < 20) riesgoMonotonia = "Alto";
    else if (variacionTotal < 40) riesgoMonotonia = "Medio";

    // Momento del pico principal
    const indicePico = intensidades.indexOf(picoMaximo);
    const momentoPico = mapaBloques[indicePico]?.bloque || "No detectado";

    // Picos adicionales del array original
    const picosOriginales = curva.picos_emocionales || [];

    return {
      mapa_bloques: mapaBloques,
      picos_emocionales: picosOriginales,
      escalada_detectada: escaladaDetectada,
      riesgo_monotonia: riesgoMonotonia,
      pico_maximo: picoMaximo,
      pico_minimo: picoMinimo,
      variacion_total: variacionTotal,
      momento_pico_principal: momentoPico,
      emocion_dominante: curva.emocion_dominante || "No detectada",
      emocion_final: curva.emocion_final || "No detectada",
      arco_emocional: curva.arco_emocional || "No detectado",
      diagnostico_curva: escaladaDetectada
        ? variacionTotal >= 40
          ? "Curva dinámica con escalada fuerte — alta retención esperada"
          : "Curva con escalada moderada — retención aceptable"
        : riesgoMonotonia === "Alto"
        ? "Curva plana — riesgo alto de abandono"
        : "Curva sin escalada clara — revisar progresión"
    };

  } catch (e) {
    return {
      mapa_bloques: [],
      escalada_detectada: false,
      riesgo_monotonia: "Alto",
      pico_maximo: 0,
      pico_minimo: 0,
      variacion_total: 0,
      momento_pico_principal: "Error",
      diagnostico_curva: "Error calculando progresión emocional"
    };
  }
}


function extraerEquivalenciaPsicologica(outputMotores: any): any {
  try {
    const polarizacion = outputMotores.polarizacion;
    const curva = outputMotores.curva_emocional;
    const densidad = outputMotores.densidad_valor;
    const status = outputMotores.status_y_posicionamiento;
    const activadores = outputMotores.activadores_guardado || [];

    // Detectar tipo de promesa
    const tipoValor = densidad?.tipo_valor_dominante || "educativo";
    const mapaPromesas: Record<string, string> = {
      "educativo": "Transformación de habilidad",
      "inspiracional": "Transformación de mentalidad",
      "entretenimiento": "Experiencia emocional",
      "provocacion": "Ruptura de creencia",
      "solucion": "Eliminación de dolor"
    };
    const tipoPromesa = mapaPromesas[tipoValor] || "Transformación general";

    // Detectar tipo de transformación
    const emocionFinal = curva?.emocion_final || "";
    let tipoTransformacion = "Mental";
    if (emocionFinal.toLowerCase().includes("esperanza") ||
        emocionFinal.toLowerCase().includes("motivacion")) {
      tipoTransformacion = "Emocional";
    } else if (emocionFinal.toLowerCase().includes("alivio") ||
               emocionFinal.toLowerCase().includes("claridad")) {
      tipoTransformacion = "Cognitiva";
    } else if (emocionFinal.toLowerCase().includes("ambicion") ||
               emocionFinal.toLowerCase().includes("deseo")) {
      tipoTransformacion = "Aspiracional";
    }

    // Detectar tipo de tensión
    const nivelConfrontacion = polarizacion?.nivel_confrontacion || 0;
    let tipoTension = "Tensión suave";
    if (nivelConfrontacion >= 70) tipoTension = "Confrontación directa";
    else if (nivelConfrontacion >= 40) tipoTension = "Fricción narrativa";
    else tipoTension = "Curiosidad progresiva";

    // Detectar tipo de activación
    const emocionDominante = curva?.emocion_dominante || "";
    let tipoActivacion = "Deseo";
    if (emocionDominante.toLowerCase().includes("miedo") ||
        emocionDominante.toLowerCase().includes("urgencia")) {
      tipoActivacion = "Urgencia / Aversión a la pérdida";
    } else if (emocionDominante.toLowerCase().includes("curiosidad")) {
      tipoActivacion = "Curiosidad / FOMO";
    } else if (emocionDominante.toLowerCase().includes("indignacion") ||
               emocionDominante.toLowerCase().includes("ira")) {
      tipoActivacion = "Indignación / Tribalismo";
    }

    // Detectar recompensa narrativa
    const tiposActivadores = activadores.map((a: any) => a.tipo);
    let recompensaNarrativa = "Insight accionable";
    if (tiposActivadores.includes("revelacion")) {
      recompensaNarrativa = "Revelación sorpresiva";
    } else if (tiposActivadores.includes("reencuadre")) {
      recompensaNarrativa = "Reencuadre mental";
    } else if (tiposActivadores.includes("formula_repetible")) {
      recompensaNarrativa = "Sistema replicable";
    }

    // Sesgo cognitivo principal
    const autoridad = status?.tipo_autoridad || "";
    let sesgoCognitivo = "Prueba social";
    if (nivelConfrontacion >= 60) sesgoCognitivo = "Pensamiento de grupo / Tribalismo";
    else if (autoridad === "experto_tecnico") sesgoCognitivo = "Autoridad";
    else if (tipoActivacion.includes("Urgencia")) sesgoCognitivo = "Aversión a la pérdida";
    else if (tipoActivacion.includes("Curiosidad")) sesgoCognitivo = "Curiosidad / Zeigarnik";

    // Score de impacto
    const intensidadPromedio = curva?.intensidad_promedio || 0;
    const variabilidad = curva?.variabilidad_emocional || 0;
    const scoreImpacto = Math.round(
      (intensidadPromedio * 0.4) +
      (variabilidad * 0.3) +
      (nivelConfrontacion * 0.3)
    );

    return {
      tipo_promesa: tipoPromesa,
      tipo_transformacion: tipoTransformacion,
      emocion_dominante: emocionDominante,
      emocion_final: emocionFinal,
      tipo_tension: tipoTension,
      tipo_activacion: tipoActivacion,
      recompensa_narrativa: recompensaNarrativa,
      sesgo_cognitivo_principal: sesgoCognitivo,
      impacto_psicologico: scoreImpacto >= 70 ? "Fuerte" : scoreImpacto >= 40 ? "Medio" : "Neutro",
      score_impacto: Math.min(100, scoreImpacto),
      nivel_activacion_emocional: Math.min(100, intensidadPromedio)
    };

  } catch (e) {
    return {
      tipo_promesa: "No detectado",
      tipo_transformacion: "No detectado",
      emocion_dominante: "No detectada",
      emocion_final: "No detectada",
      tipo_tension: "No detectada",
      tipo_activacion: "No detectado",
      recompensa_narrativa: "No detectada",
      sesgo_cognitivo_principal: "No detectado",
      impacto_psicologico: "Neutro",
      score_impacto: 0,
      nivel_activacion_emocional: 0
    };
  }
}


function calcularIndiceFidelidad(outputMotores: any): any {
  try {
    const estructura = outputMotores.adn_estructura;
    const curva = outputMotores.curva_emocional;
    const loops = outputMotores.micro_loops;

    if (!estructura) {
      return {
        bloques_detectados: 0,
        bloques_replicados: 0,
        secuencia_respetada: false,
        intensidad_equivalente: 0,
        curva_conservada: 0,
        indice_fidelidad: 0,
        diagnostico: "No se pudo analizar la estructura"
      };
    }

    // Contar bloques detectados
    const bloquesDetectados = estructura.bloques?.length || 0;

    // Verificar secuencia correcta
    const ordenEsperado = ["hook", "setup", "escalada", "giro", "climax", "resolucion", "cierre_estrategico"];
    const tiposDetectados = estructura.bloques?.map((b: any) => b.tipo) || [];
    let bloquesEnOrden = 0;
    tiposDetectados.forEach((tipo: string, idx: number) => {
      const posicionEsperada = ordenEsperado.indexOf(tipo);
      const posicionAnterior = idx > 0 ? ordenEsperado.indexOf(tiposDetectados[idx - 1]) : -1;
      if (posicionEsperada > posicionAnterior) bloquesEnOrden++;
    });

    const secuenciaRespetada = bloquesEnOrden >= Math.floor(bloquesDetectados * 0.7);

    // Calcular intensidad equivalente
    const intensidades = estructura.bloques?.map((b: any) => b.intensidad || 0) || [];
    const intensidadPromedio = intensidades.length > 0
      ? intensidades.reduce((a: number, b: number) => a + b, 0) / intensidades.length
      : 0;

    // Calcular curva conservada
    const picosCurva = curva?.picos_emocionales?.length || 0;
    const variabilidad = curva?.variabilidad_emocional || 0;
    const curvaConservada = Math.min(100, (picosCurva * 15) + (variabilidad * 0.5));

    // Score de loops
    const totalLoops = loops?.total_loops || 0;
    const scoreLoops = Math.min(100, totalLoops * 20);

    // Índice final ponderado
    const indiceFidelidad = Math.round(
      (secuenciaRespetada ? 30 : 0) +
      (Math.min(bloquesDetectados, 7) / 7 * 25) +
      (intensidadPromedio * 0.20) +
      (curvaConservada * 0.15) +
      (scoreLoops * 0.10)
    );

    return {
      bloques_detectados: bloquesDetectados,
      bloques_replicados: bloquesEnOrden,
      secuencia_respetada: secuenciaRespetada,
      intensidad_equivalente: Math.round(intensidadPromedio),
      curva_conservada: Math.round(curvaConservada),
      loops_detectados: totalLoops,
      indice_fidelidad: Math.min(100, indiceFidelidad),
      diagnostico: indiceFidelidad >= 80
        ? "Fidelidad alta — estructura bien replicada"
        : indiceFidelidad >= 60
        ? "Fidelidad media — revisar secuencia de bloques"
        : "Fidelidad baja — la adaptación alteró la arquitectura original"
    };

  } catch (e) {
    return {
      bloques_detectados: 0,
      bloques_replicados: 0,
      secuencia_respetada: false,
      intensidad_equivalente: 0,
      curva_conservada: 0,
      indice_fidelidad: 0,
      diagnostico: "Error calculando fidelidad"
    };
  }
}



// ── ejecutarIngenieriaInversaPro ─────────────────────────────────
async function ejecutarIngenieriaInversaPro(
  content: string,
  contexto: any,
  openai: any,
  nichoOrigen: string = "General"
): Promise<{ data: any; tokens: number }> {

  const videoDuracion  = contexto._videoDurationSecs || 0;
  const esReel         = videoDuracion > 0 && videoDuracion <= 90;
  const esMasterclass  = videoDuracion > 600;
  const contentType    = contexto.contentType || (esReel ? 'reel' : esMasterclass ? 'masterclass' : 'long');
  const nichoUsuario   = contexto.nicho || "General";
  const objetivoUsuario = contexto.deseo_principal || "Dominancia y Viralidad";
  const platform       = contexto.targetPlatform || contexto.platform || 'TikTok';
  const minWords       = contentType === 'masterclass' ? 800 : contentType === 'long' ? 450 : 250;

  let tokensTotal = 0;
  let outputActual: any = null;

  console.log(`MOTOR_PRO_V2 Tipo: ${contentType.toUpperCase()} | Nicho: ${nichoUsuario.substring(0, 60)}`);
  console.log(`MOTOR_PRO_V2 Guion minimo: ${minWords} palabras`);

  try {
    console.log(`MOTOR_PRO_V2 FASE 1: Extrayendo ADN forense...`);

    const expertProfileFase1 = contexto.expertProfile ? {
      authority_level: contexto.expertProfile.authority_level,
      main_objective: contexto.expertProfile.main_objective,
      confrontation_level: contexto.expertProfile.confrontation_level,
      max_controversy: contexto.expertProfile.max_controversy,
      mechanism_name: contexto.expertProfile.mechanism_name,
      enemy: contexto.expertProfile.enemy,
      mental_territory: contexto.expertProfile.mental_territory,
      point_a: contexto.expertProfile.point_a,
      point_b: contexto.expertProfile.point_b,
    } : undefined;

    const contentNormalizado = content
      .replace(/[\u{1F300}-\u{1FFFF}]/gu, '')
      .replace(/#\w+/g, '')
      .replace(/(.{20,}?)\1+/g, '$1')
      .replace(/\s{3,}/g, '\n\n')
      .trim();
    const contentTruncado = contentNormalizado.length > 3000 ? contentNormalizado.slice(0, 3000) + "\n\n... [TEXTO TRUNCADO POR LÍMITE ESTRATÉGICO]" : contentNormalizado;

    const promptFase1 = PROMPT_ADN_FORENSE(
      contentTruncado,
      nichoOrigen,
      nichoUsuario,
      objetivoUsuario,
      expertProfileFase1,
      { detectedSourceLanguage: contexto.detectedSourceLanguage, outputLanguageFull: contexto.outputLanguageFull }
    );

    const TOKENS_FASE1 = esMasterclass ? 7000 : contentType === 'long' ? 6000 : 5000;

    const promptFase1Truncado = promptFase1
      .replace(/\n{3,}/g, '\n')
      .replace(/[ \t]{2,}/g, ' ')
      .slice(0, 10000);

    const completionFase1 = await openai.chat.completions.create({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'Eres TITAN OMEGA OLIMPO. Sistema forense de ADN viral. Esta fase: SOLO analizas. NO generas guion. Devuelve JSON valido con todos los motores.' },
        { role: 'user', content: promptFase1Truncado }
      ],
      temperature: 0.15,
      max_tokens: TOKENS_FASE1,
      signal: AbortSignal.timeout(40000)
    });

    let adnForense: any = {};
    let rawFase1Content = completionFase1.choices[0].message.content || '{}';

    if (!rawFase1Content || rawFase1Content.trim() === '{}' || rawFase1Content.trim().length < 50) {
      console.warn('MOTOR_PRO_V2 GPT devolvio vacio en FASE 1 - reintentando en 3s...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      const retryFase1 = await openai.chat.completions.create({
        model: 'gpt-4o',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: 'Analizador de videos virales. Analiza el transcript y devuelve JSON con todos los motores.' },
          { role: 'user', content: promptFase1Truncado.slice(0, 10000) }
        ],
        temperature: 0.1,
        max_tokens: TOKENS_FASE1
      });
      rawFase1Content = retryFase1.choices[0].message.content || '{}';
      console.log('MOTOR_PRO_V2 Retry FASE 1 completado. Tamano:', rawFase1Content.length);
    }

    console.log('--- RAW OUTPUT DESDE OPENAI (FASE 1) ---');
    console.log(rawFase1Content.substring(0, 1000) + '...[truncado]');
    console.log('-------------------------------');

    try {
      adnForense = JSON.parse(rawFase1Content);
    } catch (jsonErr) {
      console.warn('MOTOR_PRO_V2 JSON FASE 1 fallo el parseo inicial. Intentando reparar...');
      let raw = rawFase1Content;
      const openBraces = (raw.match(/\{/g) || []).length;
      const closeBraces = (raw.match(/\}/g) || []).length;
      const missing = openBraces - closeBraces;
      if (missing > 0) raw = raw + '}'.repeat(missing);
      try {
        adnForense = JSON.parse(raw);
        console.log('MOTOR_PRO_V2 JSON FASE 1 reparado exitosamente.');
      } catch (secondErr: any) {
        console.error('MOTOR_PRO_V2 Fallo total al reparar JSON FASE 1:', secondErr.message);
        adnForense = {};
      }
    }

    const MOTOR_KEY_MAP: Record<string, string> = {
      MOTOR_1: 'adn_estructura', MOTOR_2: 'curva_emocional', MOTOR_3: 'micro_loops',
      MOTOR_4: 'polarizacion', MOTOR_5: 'identidad_verbal', MOTOR_6: 'status_y_posicionamiento',
      MOTOR_7: 'densidad_valor', MOTOR_8: 'manipulacion_atencion', MOTOR_9: 'activadores_guardado',
      MOTOR_10: 'adaptabilidad_nicho', MOTOR_11: 'elementos_cliche_detectados', MOTOR_12: 'ritmo_narrativo',
      MOTOR_13: 'score_viral_estructural', MOTOR_14A: 'adn_profundo', MOTOR_14B: 'idea_nuclear_ganadora',
      MOTOR_14C: 'sistema_superioridad', MOTOR_14D: 'intensidad_conflictual', MOTOR_15: 'blueprint_replicable',
      MOTOR_16: 'analisis_tca', MOTOR_17: 'posicionamiento_y_proximos_pasos',
    };

    if (adnForense.motores_forenses && typeof adnForense.motores_forenses === 'object') {
      console.warn('MOTOR_PRO_V2 GPT uso wrapper "motores_forenses" - aplanando...');
      const wrapped = adnForense.motores_forenses;
      adnForense = { ...adnForense, ...wrapped };
      delete adnForense.motores_forenses;
    }

    const hasMotorKeys = Object.keys(adnForense).some(k => /^MOTOR_\d|^motor_\d/i.test(k));
    if (hasMotorKeys) {
      console.warn('MOTOR_PRO_V2 GPT devolvio claves MOTOR_N - normalizando automaticamente...');
      for (const [motorKey, realKey] of Object.entries(MOTOR_KEY_MAP)) {
        if (adnForense[motorKey] !== undefined) {
          adnForense[realKey] = adnForense[motorKey];
          delete adnForense[motorKey];
        }
        const lowerKey = motorKey.toLowerCase();
        if (adnForense[lowerKey] !== undefined) {
          adnForense[realKey] = adnForense[lowerKey];
          delete adnForense[lowerKey];
        }
      }
    }

    for (const key of Object.keys(adnForense)) {
      if (/^motor_\d/i.test(key) && typeof adnForense[key] === 'object') {
        const subObj = adnForense[key];
        if (subObj.descomposicion_estructural || subObj.bloques || subObj.patron_narrativo_detectado) {
          adnForense.adn_estructura = subObj;
          delete adnForense[key];
        }
      }
    }

    const motorosMinimos = ['adn_estructura', 'adn_profundo', 'idea_nuclear_ganadora'];
    const tieneMinimoViable = motorosMinimos.some(m => adnForense[m]);
    if (Object.keys(adnForense).length === 0 || !tieneMinimoViable) {
      console.error('MOTOR_PRO_V2 FASE 1 sin motores minimos. Claves recibidas:', Object.keys(adnForense).join(', '));
      throw new Error("El video es demasiado complejo y el motor fallo al extraer el ADN. Por favor, intenta de nuevo.");
    }

    if (!adnForense.score_viral_estructural) {
      console.warn('MOTOR_PRO_V2 score_viral_estructural ausente - construyendo minimo de emergencia');
      adnForense.score_viral_estructural = {
        viralidad_estructural_global: 65,
        retencion_estructural: 65,
        intensidad_emocional: 65,
        polarizacion: 60,
        manipulacion_atencion: 60,
        densidad_valor: 60,
        recomendacion_express: 'Analisis parcial - score estimado'
      };
    }

    tokensTotal += completionFase1.usage?.total_tokens || 0;
    adnForense._outputLanguage = contexto.outputLanguage || 'es';
    adnForense._outputLanguageFull = contexto.outputLanguageFull || 'espanol - escribe como hispanohablante nativo';

    if (!adnForense.adn_profundo || !adnForense.adn_profundo.genero_narrativo) {
      console.warn('MOTOR_PRO_V2 adn_profundo ausente - construyendo desde adn_estructura');
      adnForense.adn_profundo = {
        genero_narrativo: adnForense.adn_estructura?.patron_narrativo_detectado ? 'Autoridad estrategica' : 'Confesional',
        emocion_nucleo: adnForense.curva_emocional?.emocion_dominante || 'Indignacion',
        tipo_tension: 'Profesional',
        frame_dominante: { creencia_que_ataca: '', nuevo_marco: '', frase_nucleo: '' },
        polarizacion_implicita: { bando_A: '', bando_B: '', tension_irresuelta: '' }
      };
    }
    if (!adnForense.idea_nuclear_ganadora) {
      adnForense.idea_nuclear_ganadora = {
        que_hace_viral: 'Decision impopular que divide opiniones en el nicho',
        creencia_rota: '', postura_impuesta: '', por_que_genera_conversacion: '', tension_no_resuelta: ''
      };
    }
    if (!adnForense.intensidad_conflictual) {
      adnForense.intensidad_conflictual = {
        nivel_riesgo_original: 'alto', nivel_incomodidad: 70,
        escena_concreta_principal: '', decision_impopular: '', consecuencia_real: '',
        por_que_incomoda: '', elemento_peligroso: '', equivalente_en_nicho: {}
      };
    }

    const scoreAdn = adnForense.score_viral_estructural?.viralidad_estructural_global || 0;
    console.log(`MOTOR_PRO_V2 FASE 1 completa. Score ADN: ${scoreAdn}/100`);
    // Delay anti-TPM reducido para evitar Timeout
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`MOTOR_PRO_V2 Genero: ${adnForense.adn_profundo?.genero_narrativo} | Emocion: ${adnForense.adn_profundo?.emocion_nucleo}`);
    console.log(`MOTOR_PRO_V2 FASE 2: Generando guion elite...`);

    const expertProfileFase2 = contexto.expertProfile ? {
      mechanism_name: contexto.expertProfile.mechanism_name,
      enemy: contexto.expertProfile.enemy,
      mental_territory: contexto.expertProfile.mental_territory,
      point_a: contexto.expertProfile.point_a,
      point_b: contexto.expertProfile.point_b,
    } : undefined;

    const promptFase2 = PROMPT_GUION_ELITE(
      adnForense,
      nichoUsuario,
      objetivoUsuario,
      contentType,
      platform,
      expertProfileFase2
    );

    const TOKENS_FASE2 = esMasterclass ? 7500 : contentType === 'long' ? 6500 : 5500;

    console.log('MOTOR_PRO_V2 Limpiando ventana TPM...');
    await new Promise(resolve => setTimeout(resolve, 100));

    const promptFase2Final = promptFase2
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]{2,}/g, ' ')
      .slice(0, 12000);

    const completionFase2 = await openai.chat.completions.create({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: `Eres un escritor de guiones virales. Tu UNICA tarea es escribir el guion hablado. DEVUELVE SOLO JSON VALIDO.` },
        { role: 'user', content: promptFase2Final }
      ],
      temperature: 0.75,
      max_tokens: 4000,
      signal: AbortSignal.timeout(40000)
    });

    const outputGuion = JSON.parse(completionFase2.choices[0].message.content || '{}');
    tokensTotal += completionFase2.usage?.total_tokens || 0;

    const guionTexto = outputGuion.guion_adaptado_espejo || outputGuion.guion_adaptado_al_nicho || outputGuion.guion || '';
    const palabrasFase2 = guionTexto.trim().split(/\s+/).filter(Boolean).length;
    console.log(`MOTOR_PRO_V2 Palabras guion fase 2: ${palabrasFase2} (minimo: ${minWords}) | Claves FASE2: ${Object.keys(outputGuion).join(', ')}`);

    if (!outputGuion.guion_adaptado_espejo && guionTexto) {
      outputGuion.guion_adaptado_espejo = guionTexto;
      outputGuion.guion_adaptado_al_nicho = guionTexto;
    }

    let guionFinalData = outputGuion;

    if (palabrasFase2 < minWords) {
      console.warn(`MOTOR_PRO_V2 Guion corto (${palabrasFase2}/${minWords}). Refinando...`);

      const promptRef = `Escritor de guiones virales. El guion tiene solo ${palabrasFase2} palabras. Necesitas MINIMO ${minWords} palabras.
ADN: Genero: ${adnForense.adn_profundo?.genero_narrativo} | Emocion: ${adnForense.adn_profundo?.emocion_nucleo}
GUION ACTUAL: ${guionTexto}
NICHO: ${nichoUsuario}

REGLA ANTI-SUAVIZACION:
El guion actual es demasiado generico o suave. El video original tenia nivel de riesgo: ${adnForense.intensidad_conflictual?.nivel_riesgo_original || 'alto'}.
El conflicto central del video original era: "${adnForense.intensidad_conflictual?.escena_concreta_principal || adnForense.intensidad_conflictual?.decision_impopular || ''}"
DEBES replicar esa MISMA intensidad, riesgo y tipo de conflicto, pero adaptado a tu nicho.
PROHIBIDO hacer un guion motivacional o un comercial aburrido si el original era crudo o polemico. MANTEN EL ADN INTACTO.

REESCRIBE completo con MINIMO ${minWords} palabras en el teleprompter_script.
REGLA TCA CRITICA: El teleprompter_script debe respetar la duracion seleccionada.
Ejecuta el embudo TCA completo: [CAPA 1 MASIVO 0-3s] -> [CAPA 2 FILTRADO 3-15s] -> [CAPA 3 HISTORIA 15-35s] -> [CAPA 4 AUTORIDAD 35-50s] -> [CAPA 5 CTA]
Manten plan_audiovisual_profesional, miniatura_dominante, validacion_olimpo.

IDIOMA OBLIGATORIO DEL GUION:
Escribe "guion_adaptado_espejo" UNICAMENTE en: ${adnForense._outputLanguageFull || 'espanol - escribe como hispanohablante nativo'}

REGLA DE FORMATO (HABLANDO A CAMARA):
Este es un video de un creador hablandole a su audiencia. PROHIBIDO crear guiones teatrales, personajes o dialogos.
El campo "guion_adaptado_espejo" DEBE ser un SOLO STRING de texto plano. NADA de sub-objetos.

FORMATO DE SALIDA JSON OBLIGATORIO:
{
  "guion_adaptado_espejo": "AQUI VA EL TEXTO COMPLETO DEL GUION HABLADO EN UN SOLO STRING.",
  "guion_adaptado_al_nicho": "AQUI VA EL TEXTO COMPLETO DEL GUION HABLADO EN UN SOLO STRING."
}

REGLAS:
- Si el ADN viene de ingles y el guion va en espanol: NO traduzcas - RECREA.
- Solo el contenido del guion va en el idioma seleccionado.

DEVUELVE UNICAMENTE JSON valido. Sin markdown. Sin backticks.
`;

      const completionRef = await openai.chat.completions.create({
        model: 'gpt-4o',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: `Escritor de guiones virales. Devuelve JSON con SOLO dos claves: "guion_adaptado_espejo" y "guion_adaptado_al_nicho". Sin markdown.` },
          { role: 'user', content: promptRef }
        ],
        temperature: 0.8,
        max_tokens: TOKENS_FASE2
      });

      const outputRef = JSON.parse(completionRef.choices[0].message.content || '{}');
      tokensTotal += completionRef.usage?.total_tokens || 0;
      const guionRefRaw = outputRef.guion_adaptado_espejo || outputRef.guion_adaptado_al_nicho || outputRef.guion || '';
      const guionRefStr = typeof guionRefRaw === 'string' ? guionRefRaw : JSON.stringify(guionRefRaw);
      const palabrasRef = guionRefStr.trim().split(/\s+/).filter(Boolean).length;
      console.log(`MOTOR_PRO_V2 Post-refinamiento: ${palabrasRef} palabras | Claves: ${Object.keys(outputRef).join(', ')}`);
      if (palabrasRef > palabrasFase2) {
        if (!outputRef.guion_adaptado_espejo && guionRefStr) {
          outputRef.guion_adaptado_espejo = guionRefStr;
          outputRef.guion_adaptado_al_nicho = guionRefStr;
        }
        guionFinalData = outputRef;
      }
    }

    outputActual = {
      ...adnForense,
      guion_adaptado_espejo:        (() => { const g = guionFinalData.guion_adaptado_espejo || guionFinalData.guion_adaptado_al_nicho || guionFinalData.guion || ''; return typeof g === 'string' ? g : JSON.stringify(g); })(),
      guion_adaptado_al_nicho:      (() => { const g = guionFinalData.guion_adaptado_espejo || guionFinalData.guion_adaptado_al_nicho || guionFinalData.guion || ''; return typeof g === 'string' ? g : JSON.stringify(g); })(),
      guion_tecnico_completo:       (() => { const g = guionFinalData.guion_adaptado_espejo || guionFinalData.guion_adaptado_al_nicho || guionFinalData.guion || ''; return typeof g === 'string' ? g : JSON.stringify(g); })(),
      hooks_alternativos:           guionFinalData.hooks_alternativos || null,
      plan_audiovisual_profesional: guionFinalData.plan_audiovisual_profesional || null,
      miniatura_dominante:          guionFinalData.miniatura_dominante || null,
      validacion_olimpo:            guionFinalData.validacion_olimpo || adnForense.validacion_olimpo || null,
      sistema_superioridad:         adnForense.sistema_superioridad || guionFinalData.sistema_superioridad || null,
    };

    const scoreActual = adnForense.score_viral_estructural?.viralidad_estructural_global || 0;
    const guionFinalStr = typeof outputActual.guion_adaptado_espejo === 'string' ? outputActual.guion_adaptado_espejo : '';
    const palabrasFinales = guionFinalStr.trim().split(/\s+/).filter(Boolean).length;

    const MOTORES_OBLIGATORIOS = [
      "adn_estructura", "curva_emocional", "micro_loops", "polarizacion",
      "identidad_verbal", "status_y_posicionamiento", "densidad_valor",
      "manipulacion_atencion", "activadores_guardado", "adaptabilidad_nicho",
      "elementos_cliche_detectados", "ritmo_narrativo", "score_viral_estructural",
      "adn_profundo", "idea_nuclear_ganadora", "sistema_superioridad",
      "intensidad_conflictual",
      "guion_adaptado_espejo", "blueprint_replicable", "analisis_tca",
      "mapa_de_adaptacion", "posicionamiento_y_proximos_pasos"
    ];

    const motoresFaltantes = MOTORES_OBLIGATORIOS.filter(
      m => !outputActual[m] || (Array.isArray(outputActual[m]) && outputActual[m].length === 0)
    );

    if (motoresFaltantes.length > 0) {
      console.warn(`MOTOR_PRO_V2 Motores incompletos: ${motoresFaltantes.join(", ")}`);
    }

    outputActual._motores_faltantes  = motoresFaltantes;
    outputActual._motores_completos  = MOTORES_OBLIGATORIOS.length - motoresFaltantes.length;
    outputActual._completitud_pct    = Math.round((outputActual._motores_completos / MOTORES_OBLIGATORIOS.length) * 100);

    outputActual.plan_visual          = outputActual.plan_audiovisual_profesional?.secuencia_temporal || null;
    outputActual.plan_visual_director = outputActual.plan_audiovisual_profesional?.secuencia_temporal || null;
    outputActual._tca_score           = outputActual.analisis_tca?.mass_appeal_score || 0;
    outputActual._nivel_tca           = outputActual.analisis_tca?.nivel_tca_detectado || 'N/A';
    outputActual._equilibrio_tca      = outputActual.analisis_tca?.equilibrio_masividad_calificacion || false;
    outputActual._validacion_olimpo   = outputActual.validacion_olimpo || null;
    outputActual.indice_fidelidad               = calcularIndiceFidelidad(outputActual);
    outputActual.equivalencia_psicologica_calculada = extraerEquivalenciaPsicologica(outputActual);
    outputActual.progresion_emocional_calculada = calcularProgrecionEmocional(outputActual);
    outputActual.metricas_micro_loops           = calcularMetricasMicroLoops(outputActual);
    outputActual.paquete_juez_viral             = prepararPaqueteParaJuezViral(outputActual);
    outputActual.listo_para_auditoria           = outputActual.paquete_juez_viral?.listo_para_juez || false;

    outputActual.loop_info = {
      arquitectura: 'V2_DOS_FASES',
      score_adn: scoreAdn,
      score_final: scoreActual,
      palabras_guion: palabrasFinales,
      tokens_fase1: completionFase1.usage?.total_tokens || 0,
      tokens_fase2: completionFase2.usage?.total_tokens || 0,
      tokens_totales: tokensTotal
    };

    outputActual.analisis_estrategico = {
      sesgo_cognitivo_detectado: outputActual.adn_profundo?.frame_dominante?.frase_nucleo
        || outputActual.polarizacion?.ruptura_creencia_detectada || "Analisis Profundo",
      estrategia_adaptacion: outputActual.idea_nuclear_ganadora?.que_hace_viral
        || outputActual.adn_estructura?.patron_narrativo_detectado || "Estructura Viral Hibrida",
      genero_narrativo:  outputActual.adn_profundo?.genero_narrativo || null,
      emocion_nucleo:    outputActual.adn_profundo?.emocion_nucleo || null,
      tipo_tension:      outputActual.adn_profundo?.tipo_tension || null,
      posiciona_como:    outputActual.posicionamiento_y_proximos_pasos?.posiciona_como || null,
      nivel_fidelidad:   `${scoreActual}%`
    };

    console.log(`MOTOR_PRO_V2 PROCESO COMPLETO`);
    console.log(`MOTOR_PRO_V2 Score ADN: ${scoreActual}/100 | Palabras guion: ${palabrasFinales} | Tokens: ${tokensTotal}`);

    return { data: outputActual, tokens: tokensTotal };

  } catch (error: any) {
    console.error("MOTOR_PRO_V2 Error Critico:", error);
    if (outputActual && outputActual.adn_estructura) {
      console.warn("MOTOR_PRO_V2 Recuperando resultado parcial.");
      return { data: outputActual, tokens: tokensTotal };
    }
    throw new Error("Fallo critico en Ingenieria Inversa Pro: " + error.message);
  }
}




export {
  PROMPT_INGENIERIA_INVERSA_PRO,
  buildPromptRefinamientoLoop,
  PROMPT_REFINAMIENTO_LOOP,
  PROMPT_ADN_FORENSE,
  PROMPT_GUION_ELITE,
  prepararPaqueteParaJuezViral,
  calcularMetricasMicroLoops,
  calcularProgrecionEmocional,
  extraerEquivalenciaPsicologica,
  calcularIndiceFidelidad,
  ejecutarIngenieriaInversaPro,
};