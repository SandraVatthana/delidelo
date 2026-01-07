-- =============================================
-- SYSTÈME DE SUIVI DES INTERACTIONS AMICALES
-- "L'amitié, ça s'entretient" - À la déli délo
-- =============================================

-- =============================================
-- TABLE: friendships
-- Relations d'amitié entre utilisateurs
-- =============================================
CREATE TABLE IF NOT EXISTS friendships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    friend_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('pending', 'active', 'blocked')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, friend_id)
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_friendships_user ON friendships(user_id);
CREATE INDEX IF NOT EXISTS idx_friendships_friend ON friendships(friend_id);
CREATE INDEX IF NOT EXISTS idx_friendships_active ON friendships(user_id) WHERE status = 'active';

-- =============================================
-- TABLE: friend_interactions
-- Historique des interactions entre amis
-- =============================================
CREATE TYPE interaction_type AS ENUM (
    'game_invite',      -- Invitation à jouer
    'game_played',      -- Partie jouée ensemble
    'message',          -- Message envoyé
    'gift_bonbon',      -- Bonbon envoyé
    'gift_postcard',    -- Carte postale envoyée
    'gift_gif',         -- GIF envoyé
    'poke'              -- Petit coucou
);

CREATE TABLE IF NOT EXISTS friend_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    friend_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    interaction_type interaction_type NOT NULL,
    game_slug VARCHAR(100),                    -- Si lié à un jeu
    metadata JSONB DEFAULT '{}',               -- Données additionnelles (message, gif_url, etc.)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_interactions_user ON friend_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_interactions_friend ON friend_interactions(friend_id);
CREATE INDEX IF NOT EXISTS idx_interactions_pair ON friend_interactions(user_id, friend_id);
CREATE INDEX IF NOT EXISTS idx_interactions_created ON friend_interactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_interactions_type ON friend_interactions(interaction_type);

-- =============================================
-- TABLE: friendship_stats
-- Vue dénormalisée pour les stats (performances)
-- =============================================
CREATE TABLE IF NOT EXISTS friendship_stats (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    friend_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    total_interactions INT DEFAULT 0,
    total_games_played INT DEFAULT 0,
    total_gifts_sent INT DEFAULT 0,
    last_interaction_at TIMESTAMP WITH TIME ZONE,
    last_game_slug VARCHAR(100),
    streak_days INT DEFAULT 0,              -- Jours consécutifs d'interaction
    PRIMARY KEY (user_id, friend_id)
);

CREATE INDEX IF NOT EXISTS idx_friendship_stats_last ON friendship_stats(user_id, last_interaction_at);

-- =============================================
-- FUNCTION: get_inactive_friends
-- Récupère les amis avec lesquels on n'a pas interagi depuis X jours
-- =============================================
CREATE OR REPLACE FUNCTION get_inactive_friends(
    p_user_id UUID,
    p_days_threshold INT DEFAULT 21
)
RETURNS TABLE (
    friend_id UUID,
    friend_name TEXT,
    friend_avatar TEXT,
    last_interaction_at TIMESTAMPTZ,
    days_since_interaction INT,
    last_game_slug TEXT,
    total_games_played INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        fs.friend_id,
        COALESCE(p.pseudo, 'Ami') as friend_name,
        COALESCE(p.avatar, '👤') as friend_avatar,
        fs.last_interaction_at,
        EXTRACT(DAY FROM NOW() - fs.last_interaction_at)::INT as days_since_interaction,
        fs.last_game_slug,
        fs.total_games_played
    FROM friendship_stats fs
    LEFT JOIN profiles p ON p.id = fs.friend_id
    WHERE fs.user_id = p_user_id
      AND fs.last_interaction_at < NOW() - (p_days_threshold || ' days')::INTERVAL
    ORDER BY fs.last_interaction_at ASC
    LIMIT 5;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- FUNCTION: get_friendship_health
-- Retourne un "score de santé" de l'amitié
-- =============================================
CREATE OR REPLACE FUNCTION get_friendship_health(
    p_user_id UUID,
    p_friend_id UUID
)
RETURNS TABLE (
    health_score INT,           -- 0-100
    health_status TEXT,         -- 'excellent', 'good', 'needs_attention', 'critical'
    days_since_last INT,
    suggestion TEXT
) AS $$
DECLARE
    v_days INT;
    v_score INT;
    v_status TEXT;
    v_suggestion TEXT;
BEGIN
    -- Calculer les jours depuis dernière interaction
    SELECT EXTRACT(DAY FROM NOW() - last_interaction_at)::INT INTO v_days
    FROM friendship_stats
    WHERE user_id = p_user_id AND friend_id = p_friend_id;

    IF v_days IS NULL THEN
        v_days := 999;
    END IF;

    -- Calculer le score
    v_score := GREATEST(0, 100 - (v_days * 3));

    -- Déterminer le statut et la suggestion
    IF v_days <= 7 THEN
        v_status := 'excellent';
        v_suggestion := 'Continue comme ça !';
    ELSIF v_days <= 14 THEN
        v_status := 'good';
        v_suggestion := 'Un petit jeu ensemble ?';
    ELSIF v_days <= 30 THEN
        v_status := 'needs_attention';
        v_suggestion := 'Envoie-lui un petit coucou !';
    ELSE
        v_status := 'critical';
        v_suggestion := 'Ça fait longtemps... Une carte postale ?';
    END IF;

    RETURN QUERY SELECT v_score, v_status, v_days, v_suggestion;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- FUNCTION: record_interaction
-- Enregistre une interaction et met à jour les stats
-- =============================================
CREATE OR REPLACE FUNCTION record_interaction(
    p_user_id UUID,
    p_friend_id UUID,
    p_type interaction_type,
    p_game_slug VARCHAR(100) DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    v_interaction_id UUID;
BEGIN
    -- Insérer l'interaction
    INSERT INTO friend_interactions (user_id, friend_id, interaction_type, game_slug, metadata)
    VALUES (p_user_id, p_friend_id, p_type, p_game_slug, p_metadata)
    RETURNING id INTO v_interaction_id;

    -- Mettre à jour les stats (pour les deux sens de la relation)
    INSERT INTO friendship_stats (user_id, friend_id, total_interactions, total_games_played, total_gifts_sent, last_interaction_at, last_game_slug)
    VALUES (
        p_user_id,
        p_friend_id,
        1,
        CASE WHEN p_type IN ('game_invite', 'game_played') THEN 1 ELSE 0 END,
        CASE WHEN p_type IN ('gift_bonbon', 'gift_postcard', 'gift_gif') THEN 1 ELSE 0 END,
        NOW(),
        p_game_slug
    )
    ON CONFLICT (user_id, friend_id)
    DO UPDATE SET
        total_interactions = friendship_stats.total_interactions + 1,
        total_games_played = friendship_stats.total_games_played +
            CASE WHEN p_type IN ('game_invite', 'game_played') THEN 1 ELSE 0 END,
        total_gifts_sent = friendship_stats.total_gifts_sent +
            CASE WHEN p_type IN ('gift_bonbon', 'gift_postcard', 'gift_gif') THEN 1 ELSE 0 END,
        last_interaction_at = NOW(),
        last_game_slug = COALESCE(p_game_slug, friendship_stats.last_game_slug);

    -- Mettre à jour aussi dans l'autre sens (l'ami voit aussi l'interaction)
    INSERT INTO friendship_stats (user_id, friend_id, total_interactions, last_interaction_at, last_game_slug)
    VALUES (p_friend_id, p_user_id, 1, NOW(), p_game_slug)
    ON CONFLICT (user_id, friend_id)
    DO UPDATE SET
        total_interactions = friendship_stats.total_interactions + 1,
        last_interaction_at = NOW(),
        last_game_slug = COALESCE(p_game_slug, friendship_stats.last_game_slug);

    RETURN v_interaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- FUNCTION: format_time_ago
-- Formate un délai en texte lisible
-- =============================================
CREATE OR REPLACE FUNCTION format_time_ago(p_timestamp TIMESTAMPTZ)
RETURNS TEXT AS $$
DECLARE
    v_days INT;
    v_weeks INT;
    v_months INT;
BEGIN
    v_days := EXTRACT(DAY FROM NOW() - p_timestamp)::INT;

    IF v_days < 7 THEN
        RETURN v_days || ' jour' || CASE WHEN v_days > 1 THEN 's' ELSE '' END;
    ELSIF v_days < 30 THEN
        v_weeks := v_days / 7;
        RETURN v_weeks || ' semaine' || CASE WHEN v_weeks > 1 THEN 's' ELSE '' END;
    ELSE
        v_months := v_days / 30;
        RETURN v_months || ' mois';
    END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =============================================
-- VIEW: inactive_friends_view
-- Vue pour faciliter les requêtes frontend
-- =============================================
CREATE OR REPLACE VIEW inactive_friends_view AS
SELECT
    fs.user_id,
    fs.friend_id,
    p.pseudo as friend_name,
    p.avatar as friend_avatar,
    fs.last_interaction_at,
    format_time_ago(fs.last_interaction_at) as time_ago,
    fs.last_game_slug,
    g.name as last_game_name,
    EXTRACT(DAY FROM NOW() - fs.last_interaction_at)::INT as days_inactive
FROM friendship_stats fs
LEFT JOIN profiles p ON p.id = fs.friend_id
LEFT JOIN games g ON g.slug = fs.last_game_slug
WHERE fs.last_interaction_at < NOW() - INTERVAL '14 days';

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE friend_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendship_stats ENABLE ROW LEVEL SECURITY;

-- Friendships: On peut voir ses propres amitiés
CREATE POLICY "Users can view their friendships" ON friendships
    FOR SELECT USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can create friendships" ON friendships
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their friendships" ON friendships
    FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Interactions: On peut voir les interactions où on est impliqué
CREATE POLICY "Users can view their interactions" ON friend_interactions
    FOR SELECT USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can create interactions" ON friend_interactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Stats: On peut voir ses propres stats d'amitié
CREATE POLICY "Users can view their friendship stats" ON friendship_stats
    FOR SELECT USING (auth.uid() = user_id);

-- =============================================
-- DONNÉES DE TEST (à supprimer en prod)
-- =============================================
-- Ces données seront insérées automatiquement quand des utilisateurs
-- interagissent via l'application.
