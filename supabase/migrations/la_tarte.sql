-- =============================================
-- JEU DE LA TARTE - Tables pour le mur des tartes
-- "Catharsis collective, zero haine, 100% creme patissiere"
-- =============================================

-- =============================================
-- TABLE: tartes
-- Les tartes lancees par les utilisateurs
-- =============================================
CREATE TABLE IF NOT EXISTS tartes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    target_type VARCHAR(50) NOT NULL CHECK (target_type IN ('ex', 'boss', 'ami', 'famille', 'institution', 'politique', 'inconnu', 'autre')),
    target_nickname VARCHAR(100) NOT NULL, -- "Mon ex le 🧦"
    crime_description TEXT NOT NULL CHECK (char_length(crime_description) <= 280),
    tarte_type VARCHAR(20) NOT NULL CHECK (tarte_type IN ('cream', 'lemon', 'chocolate', 'apple', 'cake', 'mud')),
    is_public BOOLEAN DEFAULT TRUE,
    reactions_bienmerite INT DEFAULT 0,
    reactions_solidaire INT DEFAULT 0,
    reactions_mdr INT DEFAULT 0,
    reactions_pareil INT DEFAULT 0,
    is_tarte_du_jour BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_tartes_user ON tartes(user_id);
CREATE INDEX IF NOT EXISTS idx_tartes_public ON tartes(is_public, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tartes_du_jour ON tartes(is_tarte_du_jour) WHERE is_tarte_du_jour = TRUE;
CREATE INDEX IF NOT EXISTS idx_tartes_reactions ON tartes((reactions_bienmerite + reactions_solidaire + reactions_mdr + reactions_pareil) DESC);

-- =============================================
-- TABLE: tarte_reactions
-- Reactions des utilisateurs sur les tartes
-- =============================================
CREATE TABLE IF NOT EXISTS tarte_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tarte_id UUID REFERENCES tartes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    reaction_type VARCHAR(20) NOT NULL CHECK (reaction_type IN ('bienmerite', 'solidaire', 'mdr', 'pareil')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tarte_id, user_id, reaction_type)
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_tarte_reactions_tarte ON tarte_reactions(tarte_id);
CREATE INDEX IF NOT EXISTS idx_tarte_reactions_user ON tarte_reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_tarte_reactions_pareil ON tarte_reactions(tarte_id, reaction_type) WHERE reaction_type = 'pareil';

-- =============================================
-- TABLE: tarte_comments
-- Commentaires sur les tartes
-- =============================================
CREATE TABLE IF NOT EXISTS tarte_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tarte_id UUID REFERENCES tartes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL CHECK (char_length(content) <= 500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_tarte_comments_tarte ON tarte_comments(tarte_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tarte_comments_user ON tarte_comments(user_id);

-- =============================================
-- TABLE: tarte_reports
-- Signalements des tartes
-- =============================================
CREATE TABLE IF NOT EXISTS tarte_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tarte_id UUID REFERENCES tartes(id) ON DELETE CASCADE,
    reporter_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    reason VARCHAR(50) NOT NULL CHECK (reason IN ('real_name', 'threat', 'harassment', 'hate', 'other')),
    details TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'removed', 'dismissed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_tarte_reports_status ON tarte_reports(status) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_tarte_reports_tarte ON tarte_reports(tarte_id);

-- =============================================
-- TABLE: blocked_words
-- Mots bloques et leurs remplacements BD
-- =============================================
CREATE TABLE IF NOT EXISTS blocked_words (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    word VARCHAR(100) NOT NULL UNIQUE,
    replacement VARCHAR(100), -- suggestion de remplacement BD, NULL si blocage total
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('replace', 'block'))
);

-- Insertion des mots bloques avec remplacements BD
INSERT INTO blocked_words (word, replacement, severity) VALUES
    ('connard', 'Sac a crottes', 'replace'),
    ('salaud', 'Raclure de bidet', 'replace'),
    ('enfoire', 'Abruti des alpages', 'replace'),
    ('enfoiré', 'Abruti des alpages', 'replace'),
    ('putain', 'Crotte de mammouth', 'replace'),
    ('merde', 'Bouse de yack', 'replace'),
    ('con', 'Patate cosmique', 'replace'),
    ('conne', 'Patate cosmique', 'replace'),
    ('salope', 'Raclure de bidet', 'replace'),
    ('bâtard', 'Debris du bulbe', 'replace'),
    ('batard', 'Debris du bulbe', 'replace'),
    ('fdp', 'Triple buse', 'replace'),
    ('ntm', '@#$%&!', 'replace'),
    ('tg', '@#$%&!', 'replace'),
    ('pd', '@#$%&!', 'replace'),
    ('pute', 'Raclure de bidet', 'replace'),
    ('encule', '@#$%&!', 'replace'),
    ('enculé', '@#$%&!', 'replace'),
    ('nique', '@#$%&!', 'replace')
ON CONFLICT (word) DO NOTHING;

-- =============================================
-- TABLE: tarte_badges
-- Badges gagnes par les utilisateurs
-- =============================================
CREATE TABLE IF NOT EXISTS tarte_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_type VARCHAR(50) NOT NULL,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, badge_type)
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_tarte_badges_user ON tarte_badges(user_id);

-- =============================================
-- TRIGGERS: Mise a jour des compteurs de reactions
-- =============================================
CREATE OR REPLACE FUNCTION update_tarte_reaction_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        CASE NEW.reaction_type
            WHEN 'bienmerite' THEN
                UPDATE tartes SET reactions_bienmerite = reactions_bienmerite + 1 WHERE id = NEW.tarte_id;
            WHEN 'solidaire' THEN
                UPDATE tartes SET reactions_solidaire = reactions_solidaire + 1 WHERE id = NEW.tarte_id;
            WHEN 'mdr' THEN
                UPDATE tartes SET reactions_mdr = reactions_mdr + 1 WHERE id = NEW.tarte_id;
            WHEN 'pareil' THEN
                UPDATE tartes SET reactions_pareil = reactions_pareil + 1 WHERE id = NEW.tarte_id;
        END CASE;
    ELSIF TG_OP = 'DELETE' THEN
        CASE OLD.reaction_type
            WHEN 'bienmerite' THEN
                UPDATE tartes SET reactions_bienmerite = GREATEST(0, reactions_bienmerite - 1) WHERE id = OLD.tarte_id;
            WHEN 'solidaire' THEN
                UPDATE tartes SET reactions_solidaire = GREATEST(0, reactions_solidaire - 1) WHERE id = OLD.tarte_id;
            WHEN 'mdr' THEN
                UPDATE tartes SET reactions_mdr = GREATEST(0, reactions_mdr - 1) WHERE id = OLD.tarte_id;
            WHEN 'pareil' THEN
                UPDATE tartes SET reactions_pareil = GREATEST(0, reactions_pareil - 1) WHERE id = OLD.tarte_id;
        END CASE;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_tarte_reaction_count ON tarte_reactions;
CREATE TRIGGER trigger_tarte_reaction_count
    AFTER INSERT OR DELETE ON tarte_reactions
    FOR EACH ROW EXECUTE FUNCTION update_tarte_reaction_counts();

-- =============================================
-- FUNCTION: Determiner la Tarte du Jour
-- A executer via un cron job quotidien
-- =============================================
CREATE OR REPLACE FUNCTION select_tarte_du_jour()
RETURNS void AS $$
BEGIN
    -- Reset previous tarte du jour
    UPDATE tartes SET is_tarte_du_jour = FALSE WHERE is_tarte_du_jour = TRUE;

    -- Select new tarte du jour (highest total reactions from yesterday)
    UPDATE tartes SET is_tarte_du_jour = TRUE
    WHERE id = (
        SELECT id FROM tartes
        WHERE is_public = TRUE
          AND created_at >= NOW() - INTERVAL '24 hours'
          AND created_at < NOW()
        ORDER BY (reactions_bienmerite + reactions_solidaire + reactions_mdr + reactions_pareil) DESC
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
ALTER TABLE tartes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tarte_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tarte_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tarte_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE tarte_badges ENABLE ROW LEVEL SECURITY;

-- Tartes: Public tartes are visible to all, private only to owner
CREATE POLICY "Users can view public tartes" ON tartes
    FOR SELECT USING (is_public = TRUE OR auth.uid() = user_id);

CREATE POLICY "Users can create their own tartes" ON tartes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tartes" ON tartes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tartes" ON tartes
    FOR DELETE USING (auth.uid() = user_id);

-- Tarte Reactions: All reactions are visible, users can add their own
CREATE POLICY "Anyone can view reactions" ON tarte_reactions
    FOR SELECT USING (TRUE);

CREATE POLICY "Users can add reactions" ON tarte_reactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their reactions" ON tarte_reactions
    FOR DELETE USING (auth.uid() = user_id);

-- Tarte Comments: All comments are visible, users can add/edit/delete their own
CREATE POLICY "Anyone can view comments" ON tarte_comments
    FOR SELECT USING (TRUE);

CREATE POLICY "Users can add comments" ON tarte_comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their comments" ON tarte_comments
    FOR DELETE USING (auth.uid() = user_id);

-- Tarte Reports: Only reporters can see their own reports
CREATE POLICY "Users can view their reports" ON tarte_reports
    FOR SELECT USING (auth.uid() = reporter_user_id);

CREATE POLICY "Users can create reports" ON tarte_reports
    FOR INSERT WITH CHECK (auth.uid() = reporter_user_id);

-- Blocked Words: Anyone can view (for client-side filtering)
CREATE POLICY "Anyone can view blocked words" ON blocked_words
    FOR SELECT USING (TRUE);

-- Tarte Badges: Users can view all badges (for profile display)
CREATE POLICY "Anyone can view badges" ON tarte_badges
    FOR SELECT USING (TRUE);

-- =============================================
-- VIEWS: Vues utiles pour le frontend
-- =============================================

-- Vue des tartes avec total reactions
CREATE OR REPLACE VIEW tartes_with_stats AS
SELECT
    t.*,
    (t.reactions_bienmerite + t.reactions_solidaire + t.reactions_mdr + t.reactions_pareil) as total_reactions,
    (SELECT COUNT(*) FROM tarte_comments WHERE tarte_id = t.id) as comments_count
FROM tartes t
WHERE t.is_public = TRUE;

-- Vue des tendances (tartes les plus reactees des 24h)
CREATE OR REPLACE VIEW tartes_trending AS
SELECT
    t.*,
    (t.reactions_bienmerite + t.reactions_solidaire + t.reactions_mdr + t.reactions_pareil) as total_reactions
FROM tartes t
WHERE t.is_public = TRUE
  AND t.created_at >= NOW() - INTERVAL '24 hours'
ORDER BY total_reactions DESC
LIMIT 50;
