-- Actualización de tablas para corrección de errores
ALTER TABLE viral_generations ADD COLUMN IF NOT EXISTS generated_content JSONB;
ALTER TABLE viral_generations ADD COLUMN IF NOT EXISTS analysis_data JSONB;

-- Forzar actualización de caché
NOTIFY pgrst, 'reload config';