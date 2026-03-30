// ==================================================================================
// 🛡️ TITAN ENGINE — SEGURIDAD
// Sanitización de inputs y rate limiting por usuario
// ==================================================================================

import { SECURITY_CONFIG } from './constants.ts';

// ─── Rate Limit Store (en memoria) ──────────────────────────
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Sanitiza el contenido del usuario eliminando patrones peligrosos
 * (prompt injection, jailbreaks, etc.)
 */
export function sanitizeUserContent(content: string): string {
  if (!content) return "";
  let sanitized = content;

  SECURITY_CONFIG.DANGEROUS_PATTERNS.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '[CONTENIDO FILTRADO POR SEGURIDAD]');
  });

  if (sanitized.length > SECURITY_CONFIG.MAX_CONTENT_LENGTH) {
    console.log(`[SECURITY] ⚠️ Contenido truncado: ${sanitized.length} -> ${SECURITY_CONFIG.MAX_CONTENT_LENGTH}`);
    sanitized = sanitized.substring(0, SECURITY_CONFIG.MAX_CONTENT_LENGTH);
  }

  sanitized = sanitized
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');

  return sanitized;
}

/**
 * Verifica si el usuario ha excedido el límite de solicitudes por minuto.
 * Retorna true si la solicitud puede continuar, false si debe bloquearse.
 */
export function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const limit = rateLimitStore.get(userId);

  if (!limit || now > limit.resetTime) {
    rateLimitStore.set(userId, { count: 1, resetTime: now + 60000 });
    return true;
  }

  if (limit.count >= SECURITY_CONFIG.MAX_REQUESTS_PER_MINUTE) {
    console.log(`[RATE_LIMIT] ⚠️ Usuario ${userId} excedió límite`);
    return false;
  }

  limit.count++;
  return true;
}

/**
 * Utilidad de delay asíncrono
 */
export async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Ejecuta una promesa con timeout. Si supera el tiempo, retorna el fallback.
 */
export function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  const timeout = new Promise<T>(resolve => setTimeout(() => resolve(fallback), ms));
  return Promise.race([promise, timeout]);
}