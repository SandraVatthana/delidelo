-- Migration: Système de Billes et Bonbons
-- Date: 2025-01-06

-- ============================================
-- TABLE: user_profiles (mise à jour)
-- ============================================

ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS is_looking_for_dates BOOLEAN DEFAULT true;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS show_location BOOLEAN DEFAULT false;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS avatar_type VARCHAR(10) DEFAULT 'emoji';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS avatar_emoji VARCHAR(10) DEFAULT '👤';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS bonbon_totem VARCHAR(50);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS humor_style VARCHAR(50);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS visible_game_results TEXT[] DEFAULT '{}';

-- ============================================
-- TABLE: user_billes
-- Billes de l'utilisateur (monnaie d'action)
-- ============================================

CREATE TABLE IF NOT EXISTS user_billes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    bille_type VARCHAR(20) NOT NULL, -- 'bleue', 'rouge', 'cosmique', 'oeil_de_chat'
    source VARCHAR(20) NOT NULL, -- 'inscription', 'recharge', 'recu'
    from_user_id UUID REFERENCES auth.users(id), -- si reçue de quelqu'un
    is_collected BOOLEAN DEFAULT FALSE, -- gardée en collection ou dispo
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_billes_user_id ON user_billes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_billes_available ON user_billes(user_id, is_collected) WHERE is_collected = FALSE;

ALTER TABLE user_billes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own billes" ON user_billes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own billes" ON user_billes
    FOR INSERT WITH CHECK (auth.uid() = user_id OR source = 'recu');

CREATE POLICY "Users can update their own billes" ON user_billes
    FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- TABLE: user_bonbons
-- Bonbons de l'utilisateur (monnaie d'affection)
-- ============================================

CREATE TABLE IF NOT EXISTS user_bonbons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    bonbon_type VARCHAR(20) NOT NULL, -- 'malabar', 'carambar', 'sucette', 'reglisse', 'tetes_brulees', 'kinder', 'chocolat'
    source VARCHAR(20) NOT NULL, -- 'inscription', 'recharge'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_bonbons_user_id ON user_bonbons(user_id);

ALTER TABLE user_bonbons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bonbons" ON user_bonbons
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bonbons" ON user_bonbons
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bonbons" ON user_bonbons
    FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- TABLE: bonbons_sent
-- Historique des bonbons envoyés
-- ============================================

CREATE TABLE IF NOT EXISTS bonbons_sent (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    bonbon_type VARCHAR(20) NOT NULL,
    style VARCHAR(20) NOT NULL DEFAULT 'carte_postale', -- 'carte_postale', 'gif'
    media_url TEXT, -- URL du GIF ou image
    message TEXT,
    seen_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bonbons_sent_sender ON bonbons_sent(sender_id);
CREATE INDEX IF NOT EXISTS idx_bonbons_sent_receiver ON bonbons_sent(receiver_id);
CREATE INDEX IF NOT EXISTS idx_bonbons_sent_unseen ON bonbons_sent(receiver_id, seen_at) WHERE seen_at IS NULL;

ALTER TABLE bonbons_sent ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view bonbons they sent or received" ON bonbons_sent
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can insert bonbons they send" ON bonbons_sent
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update bonbons they received (mark as seen)" ON bonbons_sent
    FOR UPDATE USING (auth.uid() = receiver_id);

-- ============================================
-- TABLE: bille_invitations
-- Invitations par billes
-- ============================================

CREATE TABLE IF NOT EXISTS bille_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    bille_type VARCHAR(20) NOT NULL, -- 'bleue', 'rouge', 'cosmique', 'oeil_de_chat'
    invitation_type VARCHAR(20) NOT NULL, -- 'jeu', 'discussion', 'groupe', 'defi'
    game_id UUID, -- si invitation à un jeu
    message TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'collected', 'declined'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    responded_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_bille_invitations_sender ON bille_invitations(sender_id);
CREATE INDEX IF NOT EXISTS idx_bille_invitations_receiver ON bille_invitations(receiver_id);
CREATE INDEX IF NOT EXISTS idx_bille_invitations_pending ON bille_invitations(receiver_id, status) WHERE status = 'pending';

ALTER TABLE bille_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view invitations they sent or received" ON bille_invitations
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can insert invitations they send" ON bille_invitations
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update invitations they received" ON bille_invitations
    FOR UPDATE USING (auth.uid() = receiver_id);

-- ============================================
-- TABLE: purchases
-- Achats de recharges
-- ============================================

CREATE TABLE IF NOT EXISTS purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    item_type VARCHAR(20) NOT NULL, -- 'billes', 'bonbons'
    quantity INT NOT NULL DEFAULT 10,
    amount_cents INT NOT NULL, -- 200 = 2€
    stripe_payment_id TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'failed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);

ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own purchases" ON purchases
    FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- TABLE: game_results
-- Résultats de jeux pour affichage sur le profil
-- ============================================

CREATE TABLE IF NOT EXISTS game_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    game_slug VARCHAR(100) NOT NULL,
    result_type VARCHAR(100) NOT NULL,
    result_value TEXT NOT NULL,
    is_visible BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, result_type)
);

CREATE INDEX IF NOT EXISTS idx_game_results_user_id ON game_results(user_id);

ALTER TABLE game_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own game results" ON game_results
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view visible game results" ON game_results
    FOR SELECT USING (is_visible = true);

CREATE POLICY "Users can upsert their own game results" ON game_results
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own game results" ON game_results
    FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- FONCTION: init_user_billes_bonbons
-- Donner 10 billes et 10 bonbons à l'inscription
-- ============================================

CREATE OR REPLACE FUNCTION init_user_billes_bonbons()
RETURNS TRIGGER AS $$
BEGIN
    -- 10 billes (mix de types)
    INSERT INTO user_billes (user_id, bille_type, source) VALUES
        (NEW.id, 'bleue', 'inscription'),
        (NEW.id, 'bleue', 'inscription'),
        (NEW.id, 'bleue', 'inscription'),
        (NEW.id, 'bleue', 'inscription'),
        (NEW.id, 'rouge', 'inscription'),
        (NEW.id, 'rouge', 'inscription'),
        (NEW.id, 'rouge', 'inscription'),
        (NEW.id, 'cosmique', 'inscription'),
        (NEW.id, 'cosmique', 'inscription'),
        (NEW.id, 'oeil_de_chat', 'inscription');

    -- 10 bonbons (mix de types)
    INSERT INTO user_bonbons (user_id, bonbon_type, source) VALUES
        (NEW.id, 'malabar', 'inscription'),
        (NEW.id, 'malabar', 'inscription'),
        (NEW.id, 'carambar', 'inscription'),
        (NEW.id, 'carambar', 'inscription'),
        (NEW.id, 'sucette', 'inscription'),
        (NEW.id, 'sucette', 'inscription'),
        (NEW.id, 'reglisse', 'inscription'),
        (NEW.id, 'tetes_brulees', 'inscription'),
        (NEW.id, 'kinder', 'inscription'),
        (NEW.id, 'chocolat', 'inscription');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger à l'inscription
DROP TRIGGER IF EXISTS on_auth_user_created_billes_bonbons ON auth.users;
CREATE TRIGGER on_auth_user_created_billes_bonbons
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION init_user_billes_bonbons();

-- ============================================
-- FONCTION: send_bille_invitation
-- Envoyer une bille d'invitation
-- ============================================

CREATE OR REPLACE FUNCTION send_bille_invitation(
    p_sender_id UUID,
    p_receiver_id UUID,
    p_bille_type VARCHAR(20),
    p_invitation_type VARCHAR(20),
    p_game_id UUID DEFAULT NULL,
    p_message TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_bille_id UUID;
    v_invitation_id UUID;
BEGIN
    -- Trouver une bille disponible du bon type
    SELECT id INTO v_bille_id
    FROM user_billes
    WHERE user_id = p_sender_id
      AND bille_type = p_bille_type
      AND is_collected = FALSE
    LIMIT 1;

    IF v_bille_id IS NULL THEN
        RAISE EXCEPTION 'Pas de bille % disponible', p_bille_type;
    END IF;

    -- Supprimer la bille de l'inventaire du sender
    DELETE FROM user_billes WHERE id = v_bille_id;

    -- Créer l'invitation
    INSERT INTO bille_invitations (sender_id, receiver_id, bille_type, invitation_type, game_id, message)
    VALUES (p_sender_id, p_receiver_id, p_bille_type, p_invitation_type, p_game_id, p_message)
    RETURNING id INTO v_invitation_id;

    RETURN v_invitation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FONCTION: respond_to_bille_invitation
-- Répondre à une invitation (accepter/garder/refuser)
-- ============================================

CREATE OR REPLACE FUNCTION respond_to_bille_invitation(
    p_invitation_id UUID,
    p_response VARCHAR(20) -- 'accepted', 'collected', 'declined'
)
RETURNS BOOLEAN AS $$
DECLARE
    v_invitation RECORD;
BEGIN
    -- Récupérer l'invitation
    SELECT * INTO v_invitation
    FROM bille_invitations
    WHERE id = p_invitation_id AND status = 'pending';

    IF v_invitation IS NULL THEN
        RETURN FALSE;
    END IF;

    -- Mettre à jour le status
    UPDATE bille_invitations
    SET status = p_response, responded_at = NOW()
    WHERE id = p_invitation_id;

    -- Si "collected", ajouter la bille à la collection du receiver
    IF p_response = 'collected' THEN
        INSERT INTO user_billes (user_id, bille_type, source, from_user_id, is_collected)
        VALUES (v_invitation.receiver_id, v_invitation.bille_type, 'recu', v_invitation.sender_id, TRUE);
    END IF;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FONCTION: send_bonbon
-- Envoyer un bonbon
-- ============================================

CREATE OR REPLACE FUNCTION send_bonbon(
    p_sender_id UUID,
    p_receiver_id UUID,
    p_bonbon_type VARCHAR(20),
    p_style VARCHAR(20) DEFAULT 'carte_postale',
    p_media_url TEXT DEFAULT NULL,
    p_message TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_bonbon_id UUID;
    v_sent_id UUID;
BEGIN
    -- Trouver un bonbon disponible du bon type
    SELECT id INTO v_bonbon_id
    FROM user_bonbons
    WHERE user_id = p_sender_id AND bonbon_type = p_bonbon_type
    LIMIT 1;

    IF v_bonbon_id IS NULL THEN
        RAISE EXCEPTION 'Pas de bonbon % disponible', p_bonbon_type;
    END IF;

    -- Supprimer le bonbon de l'inventaire
    DELETE FROM user_bonbons WHERE id = v_bonbon_id;

    -- Créer l'envoi
    INSERT INTO bonbons_sent (sender_id, receiver_id, bonbon_type, style, media_url, message)
    VALUES (p_sender_id, p_receiver_id, p_bonbon_type, p_style, p_media_url, p_message)
    RETURNING id INTO v_sent_id;

    RETURN v_sent_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FONCTION: add_recharge
-- Ajouter des billes ou bonbons après achat
-- ============================================

CREATE OR REPLACE FUNCTION add_recharge(
    p_user_id UUID,
    p_item_type VARCHAR(20), -- 'billes' ou 'bonbons'
    p_quantity INT DEFAULT 10
)
RETURNS BOOLEAN AS $$
BEGIN
    IF p_item_type = 'billes' THEN
        -- Ajouter des billes (mix de types)
        FOR i IN 1..p_quantity LOOP
            INSERT INTO user_billes (user_id, bille_type, source)
            VALUES (
                p_user_id,
                CASE (i % 4)
                    WHEN 0 THEN 'bleue'
                    WHEN 1 THEN 'rouge'
                    WHEN 2 THEN 'cosmique'
                    ELSE 'oeil_de_chat'
                END,
                'recharge'
            );
        END LOOP;
    ELSIF p_item_type = 'bonbons' THEN
        -- Ajouter des bonbons (mix de types)
        FOR i IN 1..p_quantity LOOP
            INSERT INTO user_bonbons (user_id, bonbon_type, source)
            VALUES (
                p_user_id,
                CASE (i % 7)
                    WHEN 0 THEN 'malabar'
                    WHEN 1 THEN 'carambar'
                    WHEN 2 THEN 'sucette'
                    WHEN 3 THEN 'reglisse'
                    WHEN 4 THEN 'tetes_brulees'
                    WHEN 5 THEN 'kinder'
                    ELSE 'chocolat'
                END,
                'recharge'
            );
        END LOOP;
    ELSE
        RETURN FALSE;
    END IF;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- VUES: Compteurs pour l'UI
-- ============================================

CREATE OR REPLACE VIEW user_billes_count AS
SELECT
    user_id,
    bille_type,
    COUNT(*) FILTER (WHERE is_collected = FALSE) as available,
    COUNT(*) FILTER (WHERE is_collected = TRUE) as collected
FROM user_billes
GROUP BY user_id, bille_type;

CREATE OR REPLACE VIEW user_bonbons_count AS
SELECT
    user_id,
    bonbon_type,
    COUNT(*) as count
FROM user_bonbons
GROUP BY user_id, bonbon_type;
