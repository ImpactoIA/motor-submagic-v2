/**
 * Sistema de Logging Estructurado para TITAN APP VIRAL
 * 
 * Propósito:
 * - Registrar eventos, errores y métricas de forma estructurada
 * - Proporcionar contexto para diagnóstico y monitoreo
 * - Mantener consistencia en todo el backend
 * 
 * Uso:
 * import { logger, createError } from './lib/logger';
 * 
 * logger.info('Proceso iniciado', { userId, url });
 * logger.error('Error en scraping', error, { url, provider });
 * throw createError('VALIDATION_FAILED', 'URL inválida', 400);
 */

// Context import removed - not needed for standard Deno/Supabase environment

export interface LogContext {
  userId?: string;
  url?: string;
  provider?: string;
  handler?: string;
  mode?: string;
  requestId?: string;
  duration?: number;
  [key: string]: any;
}

export interface AppError extends Error {
  code: string;
  statusCode: number;
  details?: any;
  context?: LogContext;
}

export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: any,
    public context?: LogContext
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Logger Estructurado
 * Formato JSON para integración con sistemas de monitoreo
 */
export const logger = {
  /**
   * Log de información general
   */
  info: (message: string, context: LogContext = {}) => {
    const logEntry = {
      level: 'INFO',
      message,
      timestamp: new Date().toISOString(),
      ...context
    };
    console.log(JSON.stringify(logEntry));
  },

  /**
   * Log de advertencias
   */
  warn: (message: string, context: LogContext = {}) => {
    const logEntry = {
      level: 'WARN',
      message,
      timestamp: new Date().toISOString(),
      ...context
    };
    console.warn(JSON.stringify(logEntry));
  },

  /**
   * Log de errores con stack trace
   */
  error: (message: string, error?: Error | string, context: LogContext = {}) => {
    const logEntry = {
      level: 'ERROR',
      message,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : error,
      ...context
    };
    console.error(JSON.stringify(logEntry));
  },

  /**
   * Log de métricas de rendimiento
   */
  metric: (metric: string, value: number, context: LogContext = {}) => {
    const logEntry = {
      level: 'METRIC',
      metric,
      value,
      timestamp: new Date().toISOString(),
      ...context
    };
    console.log(JSON.stringify(logEntry));
  },

  /**
   * Log de eventos de negocio críticos
   */
  business: (event: string, data: any, context: LogContext = {}) => {
    const logEntry = {
      level: 'BUSINESS',
      event,
      data,
      timestamp: new Date().toISOString(),
      ...context
    };
    console.log(JSON.stringify(logEntry));
  }
};

/**
 * Crea errores estandarizados para el frontend
 */
export function createError(
  code: string, 
  message: string, 
  statusCode: number = 500, 
  details?: any,
  context?: LogContext
): AppError {
  return new AppError(code, message, statusCode, details, context);
}

/**
 * Formato de respuesta de error estandarizado
 */
export function formatErrorResponse(error: AppError): Response {
  const response = {
    success: false,
    error: {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
      ...(error.details && { details: error.details })
    }
  };

  return new Response(JSON.stringify(response), {
    status: error.statusCode,
    headers: { 'Content-Type': 'application/json' }
  });
}

/**
 * Middleware de manejo de errores global
 * Debe usarse en el handler principal (index.ts)
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<Response>>(
  handler: T
): T {
  return (async (...args: any[]): Promise<Response> => {
    try {
      return await handler(...args);
    } catch (error) {
      const requestId = crypto.randomUUID();
      
      // Determinar si es un AppError o error genérico
      if (error instanceof AppError) {
        logger.error('AppError capturado', error, { 
          requestId, 
          ...error.context 
        });
        return formatErrorResponse(error);
      }

      // Error genérico
      const appError = createError(
        'INTERNAL_SERVER_ERROR', 
        'Error interno del servidor', 
        500,
        { originalError: error instanceof Error ? error.message : String(error) }
      );
      
      logger.error('Error no manejado', error, { requestId });
      return formatErrorResponse(appError);
    }
  }) as T;
}

/**
 * Medidor de tiempo para operaciones
 */
export function measureTime<T>(operation: string, fn: () => Promise<T>): Promise<T> {
  const start = performance.now();
  
  return fn().then(result => {
    const duration = performance.now() - start;
    logger.metric(`${operation}_duration`, duration);
    return result;
  }).catch(error => {
    const duration = performance.now() - start;
    logger.metric(`${operation}_duration`, duration);
    logger.error(`${operation} falló`, error);
    throw error;
  });
}

/**
 * Validador de URLs seguras
 */
export function validateUrl(url: string): void {
  try {
    const parsed = new URL(url);
    
    // Protocolos permitidos
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw createError('INVALID_PROTOCOL', `Protocolo no permitido: ${parsed.protocol}`, 400);
    }
    
    // Dominios bloqueados (puedes extender esta lista)
    const blockedDomains = ['localhost', '127.0.0.1', '0.0.0.0'];
    if (blockedDomains.includes(parsed.hostname)) {
      throw createError('BLOCKED_DOMAIN', `Dominio bloqueado: ${parsed.hostname}`, 400);
    }
    
    // Longitud máxima
    if (url.length > 2000) {
      throw createError('URL_TOO_LONG', 'URL demasiado larga', 400);
    }
    
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw createError('INVALID_URL', 'URL inválida', 400, { url });
  }
}

/**
 * Sanitizador de contexto para logging
 * Evita registrar datos sensibles
 */
export function sanitizeContext(context: LogContext): LogContext {
  const sanitized = { ...context };
  
  // No registrar estos campos sensibles
  delete sanitized.apiKey;
  delete sanitized.token;
  delete sanitized.password;
  delete sanitized.secret;
  
  return sanitized;
}

/**
 * Logger para scraping con métricas específicas
 */
export const scrapingLogger = {
  start: (provider: string, url: string, context: LogContext = {}) => {
    logger.info(`[${provider}] Inicio scraping`, { 
      provider, 
      url: url.substring(0, 100), 
      ...context 
    });
  },
  
  success: (provider: string, url: string, duration: number, context: LogContext = {}) => {
    logger.info(`[${provider}] Scraping exitoso`, { 
      provider, 
      url: url.substring(0, 100), 
      duration,
      ...context 
    });
    logger.metric('scraping_success', 1, { provider });
  },
  
  error: (provider: string, url: string, error: Error | string, context: LogContext = {}) => {
    logger.error(`[${provider}] Scraping fallido`, error, { 
      provider, 
      url: url.substring(0, 100), 
      ...context 
    });
    logger.metric('scraping_error', 1, { provider });
  }
};

/**
 * Logger para operaciones de IA
 */
export const aiLogger = {
  request: (model: string, promptLength: number, context: LogContext = {}) => {
    logger.info(`[IA] Solicitud a ${model}`, { 
      model, 
      promptLength,
      ...context 
    });
  },
  
  response: (model: string, tokens: number, duration: number, context: LogContext = {}) => {
    logger.info(`[IA] Respuesta de ${model}`, { 
      model, 
      tokens,
      duration,
      ...context 
    });
    logger.metric('ai_tokens', tokens, { model });
    logger.metric('ai_duration', duration, { model });
  },
  
  error: (model: string, error: Error | string, context: LogContext = {}) => {
    logger.error(`[IA] Error en ${model}`, error, { 
      model, 
      ...context 
    });
    logger.metric('ai_error', 1, { model });
  }
};

/**
 * Logger para operaciones de base de datos
 */
export const dbLogger = {
  query: (table: string, operation: string, context: LogContext = {}) => {
    logger.info(`[DB] ${operation} en ${table}`, { table, operation, ...context });
  },
  
  error: (table: string, operation: string, error: Error | string, context: LogContext = {}) => {
    logger.error(`[DB] Error en ${operation} ${table}`, error, { table, operation, ...context });
    logger.metric('db_error', 1, { table, operation });
  }
};