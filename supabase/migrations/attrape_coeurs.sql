-- =============================================
-- ATTRAPE-CŒURS - Tables pour GameCrush
-- =============================================

-- Table des relations Cupidon (qui peut chasser pour qui)
CREATE TABLE IF NOT EXISTS cupidons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cupidon_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    ami_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'refused')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    accepted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(cupidon_user_id, ami_user_id)
);

-- Table des cœurs attrapés
CREATE TABLE IF NOT EXISTS coeurs_attrapes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cupidon_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    pour_ami_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    profil_attrape_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    message_cupidon TEXT,
    mode_chasse VARCHAR(20) DEFAULT 'defile' CHECK (mode_chasse IN ('defile', 'filet', 'safari')),
    status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'seen', 'accepted', 'refused')),
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    seen_at TIMESTAMP WITH TIME ZONE,
    responded_at TIMESTAMP WITH TIME ZONE
);

-- Table des matchs Cupidon
CREATE TABLE IF NOT EXISTS matches_cupidon (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coeur_id UUID REFERENCES coeurs_attrapes(id) ON DELETE CASCADE,
    ami_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    profil_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    conversation_started BOOLEAN DEFAULT FALSE,
    date_irl BOOLEAN DEFAULT FALSE,
    couple_formed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des badges Cupidon
CREATE TABLE IF NOT EXISTS badges_cupidon (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_type VARCHAR(50) NOT NULL,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, badge_type)
);

-- Table des stats Cupidon
CREATE TABLE IF NOT EXISTS cupidon_stats (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    total_coeurs_attrapes INT DEFAULT 0,
    total_accepted INT DEFAULT 0,
    total_conversations INT DEFAULT 0,
    total_dates_irl INT DEFAULT 0,
    total_couples INT DEFAULT 0,
    cupidon_level INT DEFAULT 1,
    cupidon_points INT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des défis quotidiens
CREATE TABLE IF NOT EXISTS defis_cupidon (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    ami_cible_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date_defi DATE DEFAULT CURRENT_DATE,
    completed BOOLEAN DEFAULT FALSE,
    points_reward INT DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, date_defi)
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_cupidons_cupidon ON cupidons(cupidon_user_id);
CREATE INDEX IF NOT EXISTS idx_cupidons_ami ON cupidons(ami_user_id);
CREATE INDEX IF NOT EXISTS idx_coeurs_pour_ami ON coeurs_attrapes(pour_ami_user_id);
CREATE INDEX IF NOT EXISTS idx_coeurs_status ON coeurs_attrapes(status);
CREATE INDEX IF NOT EXISTS idx_matches_ami ON matches_cupidon(ami_user_id);

-- Fonction pour mettre à jour les stats automatiquement
CREATE OR REPLACE FUNCTION update_cupidon_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Mettre à jour le compteur de cœurs attrapés
    IF TG_TABLE_NAME = 'coeurs_attrapes' AND TG_OP = 'INSERT' THEN
        INSERT INTO cupidon_stats (user_id, total_coeurs_attrapes)
        VALUES (NEW.cupidon_user_id, 1)
        ON CONFLICT (user_id)
        DO UPDATE SET
            total_coeurs_attrapes = cupidon_stats.total_coeurs_attrapes + 1,
            updated_at = NOW();
    END IF;

    -- Mettre à jour quand un cœur est accepté
    IF TG_TABLE_NAME = 'coeurs_attrapes' AND TG_OP = 'UPDATE' AND NEW.status = 'accepted' THEN
        UPDATE cupidon_stats
        SET total_accepted = total_accepted + 1, updated_at = NOW()
        WHERE user_id = NEW.cupidon_user_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
DROP TRIGGER IF EXISTS trigger_coeur_insert ON coeurs_attrapes;
CREATE TRIGGER trigger_coeur_insert
    AFTER INSERT ON coeurs_attrapes
    FOR EACH ROW EXECUTE FUNCTION update_cupidon_stats();

DROP TRIGGER IF EXISTS trigger_coeur_update ON coeurs_attrapes;
CREATE TRIGGER trigger_coeur_update
    AFTER UPDATE ON coeurs_attrapes
    FOR EACH ROW EXECUTE FUNCTION update_cupidon_stats();

-- Fonction pour calculer le niveau Cupidon
CREATE OR REPLACE FUNCTION calculate_cupidon_level(matches INT)
RETURNS INT AS $$
BEGIN
    IF matches >= 50 THEN RETURN 5;
    ELSIF matches >= 31 THEN RETURN 4;
    ELSIF matches >= 16 THEN RETURN 3;
    ELSIF matches >= 6 THEN RETURN 2;
    ELSE RETURN 1;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- RLS Policies
ALTER TABLE cupidons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coeurs_attrapes ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches_cupidon ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges_cupidon ENABLE ROW LEVEL SECURITY;
ALTER TABLE cupidon_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE defis_cupidon ENABLE ROW LEVEL SECURITY;

-- Policies pour cupidons
CREATE POLICY "Users can view their cupidon relations" ON cupidons
    FOR SELECT USING (auth.uid() = cupidon_user_id OR auth.uid() = ami_user_id);

CREATE POLICY "Users can create cupidon invitations" ON cupidons
    FOR INSERT WITH CHECK (auth.uid() = cupidon_user_id);

CREATE POLICY "Users can update their cupidon status" ON cupidons
    FOR UPDATE USING (auth.uid() = ami_user_id);

-- Policies pour coeurs_attrapes
CREATE POLICY "Users can view hearts sent to them or by them" ON coeurs_attrapes
    FOR SELECT USING (auth.uid() = cupidon_user_id OR auth.uid() = pour_ami_user_id);

CREATE POLICY "Cupidons can send hearts" ON coeurs_attrapes
    FOR INSERT WITH CHECK (auth.uid() = cupidon_user_id);

CREATE POLICY "Recipients can update heart status" ON coeurs_attrapes
    FOR UPDATE USING (auth.uid() = pour_ami_user_id);

-- Policies pour stats et badges
CREATE POLICY "Users can view their own stats" ON cupidon_stats
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own badges" ON badges_cupidon
    FOR SELECT USING (auth.uid() = user_id);
