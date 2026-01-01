-- Table des coordonnées pour RedPill
-- Exécuter ce script dans l'éditeur SQL de Supabase

CREATE TABLE coordinates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  z INTEGER NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('biome', 'base', 'resource')),
  type VARCHAR(100) NOT NULL,
  description TEXT,
  added_by VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX idx_coordinates_category ON coordinates(category);
CREATE INDEX idx_coordinates_created_at ON coordinates(created_at DESC);

-- Activer RLS (Row Level Security)
ALTER TABLE coordinates ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre à tout le monde de lire
CREATE POLICY "Allow public read" ON coordinates
  FOR SELECT
  USING (true);

-- Politique pour permettre à tout le monde d'insérer
CREATE POLICY "Allow public insert" ON coordinates
  FOR INSERT
  WITH CHECK (true);

-- Politique pour permettre à tout le monde de supprimer
CREATE POLICY "Allow public delete" ON coordinates
  FOR DELETE
  USING (true);
