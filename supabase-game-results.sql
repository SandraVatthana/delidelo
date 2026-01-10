-- Table pour stocker les résultats des jeux
-- À exécuter dans l'éditeur SQL de Supabase Dashboard

CREATE TABLE IF NOT EXISTS game_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL,
  pseudo TEXT NOT NULL,
  budget JSONB,
  profile_type TEXT,
  proposals JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Index unique pour éviter les doublons (un résultat par user par jeu)
  UNIQUE(user_id, game_id)
);

-- Index pour les recherches fréquentes
CREATE INDEX IF NOT EXISTS idx_game_results_game_id ON game_results(game_id);
CREATE INDEX IF NOT EXISTS idx_game_results_user_id ON game_results(user_id);
CREATE INDEX IF NOT EXISTS idx_game_results_created_at ON game_results(created_at DESC);

-- Activer Row Level Security
ALTER TABLE game_results ENABLE ROW LEVEL SECURITY;

-- Politique: Les utilisateurs peuvent voir tous les résultats (pour les comparaisons)
CREATE POLICY "Anyone can view game results" ON game_results
  FOR SELECT USING (true);

-- Politique: Les utilisateurs connectés peuvent créer leurs propres résultats
CREATE POLICY "Authenticated users can insert own results" ON game_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politique: Les utilisateurs peuvent mettre à jour leurs propres résultats
CREATE POLICY "Users can update own results" ON game_results
  FOR UPDATE USING (auth.uid() = user_id);

-- Politique: Les utilisateurs peuvent supprimer leurs propres résultats
CREATE POLICY "Users can delete own results" ON game_results
  FOR DELETE USING (auth.uid() = user_id);
