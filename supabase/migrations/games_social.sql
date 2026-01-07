-- =============================================
-- JEUX COMME LIEUX DE RENCONTRE - Tables Aladelidelo
-- Système social autour des jeux
-- =============================================

-- Table des jeux (référence centrale)
CREATE TABLE IF NOT EXISTS games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(10),
    image_url VARCHAR(500),
    category VARCHAR(50) CHECK (category IN ('nostalgie', 'culture', 'fun', 'defi')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertion des jeux existants
INSERT INTO games (slug, name, description, icon, category) VALUES
    ('manege', 'Le Manège Enchanté', 'Fais tourner le manège et découvre ton match idéal', '🎠', 'nostalgie'),
    ('jeu-oie', 'Le Jeu de l''Oie', 'Avance sur le plateau et réponds aux questions', '🎲', 'nostalgie'),
    ('la-tarte', 'La Tarte à la Crème', 'Choisis ou esquive les questions piège', '🥧', 'fun'),
    ('refais-la-france', 'Refais la France', 'Reconnais les régions et leurs spécialités', '🗺️', 'culture'),
    ('goonies', 'Les Goonies', 'Pars à l''aventure comme dans le film culte', '🎬', 'nostalgie'),
    ('dirty-dancing', 'Dirty Dancing', 'Personne ne met bébé dans un coin', '💃', 'nostalgie'),
    ('temple-maudit', 'Le Temple Maudit', 'Explore le temple et trouve le trésor', '🏛️', 'defi'),
    ('action-verite', 'Action ou Vérité', 'Le classique revisité pour mieux se connaître', '🎯', 'fun'),
    ('poesie', 'La Poésie', 'Termine les vers célèbres ensemble', '📜', 'culture'),
    ('la-lettre', 'La Lettre', 'Écris une lettre à ton crush du futur', '💌', 'fun')
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- TABLE: game_sessions
-- Sessions de jeu des utilisateurs
-- =============================================
CREATE TABLE IF NOT EXISTS game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    score INT DEFAULT 0,
    completion_time INT, -- en secondes
    answers JSONB, -- réponses aux questions du jeu
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    is_online BOOLEAN DEFAULT FALSE -- actuellement en train de jouer
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_game_sessions_user ON game_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_game ON game_sessions(game_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_online ON game_sessions(game_id, is_online) WHERE is_online = TRUE;
CREATE INDEX IF NOT EXISTS idx_game_sessions_completed ON game_sessions(game_id, completed_at DESC);

-- =============================================
-- TABLE: game_players
-- Vue dénormalisée pour les perfs (stats par joueur/jeu)
-- =============================================
CREATE TABLE IF NOT EXISTS game_players (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    best_score INT DEFAULT 0,
    best_rank INT,
    times_played INT DEFAULT 1,
    last_played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, game_id)
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_game_players_game ON game_players(game_id);
CREATE INDEX IF NOT EXISTS idx_game_players_last ON game_players(game_id, last_played_at DESC);
CREATE INDEX IF NOT EXISTS idx_game_players_score ON game_players(game_id, best_score DESC);

-- =============================================
-- TABLE: game_alerts
-- Alertes/notifications par jeu configurées par l'utilisateur
-- =============================================
CREATE TYPE alert_frequency AS ENUM ('instant', 'daily', 'weekly');

CREATE TABLE IF NOT EXISTS game_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    alert_on_playing BOOLEAN DEFAULT TRUE,
    alert_on_completion BOOLEAN DEFAULT TRUE,
    alert_on_new_player BOOLEAN DEFAULT FALSE,
    only_singles BOOLEAN DEFAULT TRUE,
    min_compatibility INT DEFAULT 70 CHECK (min_compatibility >= 0 AND min_compatibility <= 100),
    only_ai_recommended BOOLEAN DEFAULT FALSE,
    max_distance INT, -- en km, NULL = pas de limite
    frequency alert_frequency DEFAULT 'daily',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, game_id)
);

-- =============================================
-- TABLE: game_challenges
-- Défis asynchrones entre joueurs
-- =============================================
CREATE TYPE challenge_status AS ENUM ('pending', 'accepted', 'completed', 'refused', 'expired');

CREATE TABLE IF NOT EXISTS game_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenger_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    challenged_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    challenger_session_id UUID REFERENCES game_sessions(id),
    challenged_session_id UUID REFERENCES game_sessions(id),
    message TEXT,
    status challenge_status DEFAULT 'pending',
    winner_id UUID REFERENCES auth.users(id),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_challenges_challenger ON game_challenges(challenger_id);
CREATE INDEX IF NOT EXISTS idx_challenges_challenged ON game_challenges(challenged_id);
CREATE INDEX IF NOT EXISTS idx_challenges_game ON game_challenges(game_id);
CREATE INDEX IF NOT EXISTS idx_challenges_status ON game_challenges(status) WHERE status = 'pending';

-- =============================================
-- TRIGGERS: Mise à jour automatique de game_players
-- =============================================
CREATE OR REPLACE FUNCTION update_game_players()
RETURNS TRIGGER AS $$
BEGIN
    -- Quand une session est complétée
    IF NEW.completed_at IS NOT NULL AND OLD.completed_at IS NULL THEN
        INSERT INTO game_players (user_id, game_id, best_score, times_played, last_played_at)
        VALUES (NEW.user_id, NEW.game_id, NEW.score, 1, NEW.completed_at)
        ON CONFLICT (user_id, game_id)
        DO UPDATE SET
            best_score = GREATEST(game_players.best_score, EXCLUDED.best_score),
            times_played = game_players.times_played + 1,
            last_played_at = EXCLUDED.last_played_at;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_session_complete ON game_sessions;
CREATE TRIGGER trigger_session_complete
    AFTER UPDATE ON game_sessions
    FOR EACH ROW EXECUTE FUNCTION update_game_players();

-- =============================================
-- TRIGGERS: Expiration automatique des défis
-- =============================================
CREATE OR REPLACE FUNCTION expire_challenges()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE game_challenges
    SET status = 'expired'
    WHERE status = 'pending' AND expires_at < NOW();
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- TRIGGERS: Détermination du gagnant
-- =============================================
CREATE OR REPLACE FUNCTION determine_challenge_winner()
RETURNS TRIGGER AS $$
DECLARE
    challenger_score INT;
    challenged_score INT;
BEGIN
    -- Quand la session du challenged est ajoutée
    IF NEW.challenged_session_id IS NOT NULL AND OLD.challenged_session_id IS NULL THEN
        -- Récupérer les scores
        SELECT score INTO challenger_score FROM game_sessions WHERE id = NEW.challenger_session_id;
        SELECT score INTO challenged_score FROM game_sessions WHERE id = NEW.challenged_session_id;

        -- Déterminer le gagnant
        IF challenger_score > challenged_score THEN
            NEW.winner_id := NEW.challenger_id;
        ELSIF challenged_score > challenger_score THEN
            NEW.winner_id := NEW.challenged_id;
        ELSE
            NEW.winner_id := NULL; -- Égalité
        END IF;

        NEW.status := 'completed';
        NEW.completed_at := NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_challenge_winner ON game_challenges;
CREATE TRIGGER trigger_challenge_winner
    BEFORE UPDATE ON game_challenges
    FOR EACH ROW EXECUTE FUNCTION determine_challenge_winner();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_challenges ENABLE ROW LEVEL SECURITY;

-- Games: Tout le monde peut voir les jeux actifs
CREATE POLICY "Anyone can view active games" ON games
    FOR SELECT USING (is_active = TRUE);

-- Game Sessions: On peut voir ses propres sessions + sessions publiques pour stats
CREATE POLICY "Users can view game sessions" ON game_sessions
    FOR SELECT USING (TRUE);

CREATE POLICY "Users can create their own sessions" ON game_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" ON game_sessions
    FOR UPDATE USING (auth.uid() = user_id);

-- Game Players: Visible par tous (stats publiques)
CREATE POLICY "Anyone can view game players" ON game_players
    FOR SELECT USING (TRUE);

CREATE POLICY "System can insert game players" ON game_players
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can update game players" ON game_players
    FOR UPDATE USING (auth.uid() = user_id);

-- Game Alerts: Privées à chaque utilisateur
CREATE POLICY "Users can view their own alerts" ON game_alerts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own alerts" ON game_alerts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own alerts" ON game_alerts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own alerts" ON game_alerts
    FOR DELETE USING (auth.uid() = user_id);

-- Game Challenges: Visible par challenger et challenged
CREATE POLICY "Users can view their challenges" ON game_challenges
    FOR SELECT USING (auth.uid() = challenger_id OR auth.uid() = challenged_id);

CREATE POLICY "Users can create challenges" ON game_challenges
    FOR INSERT WITH CHECK (auth.uid() = challenger_id);

CREATE POLICY "Challenged users can update challenges" ON game_challenges
    FOR UPDATE USING (auth.uid() = challenged_id OR auth.uid() = challenger_id);

-- =============================================
-- VIEWS: Vues utiles pour le frontend
-- =============================================

-- Vue des joueurs en ligne par jeu
CREATE OR REPLACE VIEW online_players AS
SELECT
    gs.game_id,
    gs.user_id,
    gs.started_at,
    gp.best_score,
    gp.times_played
FROM game_sessions gs
JOIN game_players gp ON gs.user_id = gp.user_id AND gs.game_id = gp.game_id
WHERE gs.is_online = TRUE;

-- Vue des stats par jeu
CREATE OR REPLACE VIEW game_stats AS
SELECT
    g.id as game_id,
    g.slug,
    g.name,
    COUNT(DISTINCT gp.user_id) as total_players,
    COUNT(DISTINCT CASE WHEN gs.is_online THEN gs.user_id END) as online_players,
    MAX(gp.last_played_at) as last_activity
FROM games g
LEFT JOIN game_players gp ON g.id = gp.game_id
LEFT JOIN game_sessions gs ON g.id = gs.game_id AND gs.is_online = TRUE
WHERE g.is_active = TRUE
GROUP BY g.id, g.slug, g.name;
