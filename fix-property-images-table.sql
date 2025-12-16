-- ===================================
-- VERIFICAR Y CORREGIR TABLA PROPERTY_IMAGES
-- ===================================

-- 1. Verificar si la tabla property_images existe
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'property_images' 
ORDER BY ordinal_position;

-- 2. Crear la tabla property_images si no existe
CREATE TABLE IF NOT EXISTS property_images (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
    url text NOT NULL,
    "order" integer DEFAULT 0,
    is_cover boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 3. Agregar columna order si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'property_images' AND column_name = 'order') THEN
        ALTER TABLE property_images ADD COLUMN "order" integer DEFAULT 0;
        RAISE NOTICE 'Columna "order" agregada a la tabla property_images';
    ELSE
        RAISE NOTICE 'La columna "order" ya existe en la tabla property_images';
    END IF;
END $$;

-- 4. Agregar columna is_cover si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'property_images' AND column_name = 'is_cover') THEN
        ALTER TABLE property_images ADD COLUMN is_cover boolean DEFAULT false;
        RAISE NOTICE 'Columna "is_cover" agregada a la tabla property_images';
    ELSE
        RAISE NOTICE 'La columna "is_cover" ya existe en la tabla property_images';
    END IF;
END $$;

-- 5. Crear índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_property_images_order ON property_images(property_id, "order");
CREATE INDEX IF NOT EXISTS idx_property_images_is_cover ON property_images(property_id, is_cover);

-- 6. Verificar estructura final
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'property_images' 
ORDER BY ordinal_position;

-- 7. Configurar RLS (Row Level Security)
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura pública
CREATE POLICY IF NOT EXISTS "Allow public read access on property_images" 
ON property_images 
FOR SELECT 
USING (true);

-- Política para permitir escritura autenticada
CREATE POLICY IF NOT EXISTS "Allow authenticated users to manage property_images" 
ON property_images 
FOR ALL 
USING (auth.role() = 'authenticated');
