-- =============================================
-- SYSTÈME PREMIUM DÉLI DÉLO
-- Tables et colonnes pour l'abonnement premium
-- =============================================

-- Ajouter les colonnes premium à la table users (si elle existe)
-- Sinon, créer la table users avec les champs nécessaires

-- Option 1: Si la table auth.users est utilisée directement
-- On crée une table user_profiles pour les données supplémentaires

CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    pseudo VARCHAR(50),
    age INT,
    city VARCHAR(100),
    avatar VARCHAR(50) DEFAULT '👤', -- Emoji ou URL
    avatar_url VARCHAR(500),
    bio TEXT, -- Biographie (max 200 caractères côté front)
    intentions TEXT[], -- 'friends', 'love', 'network'

    -- Champs Premium
    is_premium BOOLEAN DEFAULT FALSE,
    premium_since TIMESTAMP WITH TIME ZONE,
    premium_until TIMESTAMP WITH TIME ZONE,
    stripe_customer_id VARCHAR(255), -- Pour intégration Stripe
    stripe_subscription_id VARCHAR(255),

    -- Monnaies virtuelles
    billes INT DEFAULT 0,
    bonbons INT DEFAULT 10,

    -- Profil amoureux (résultats Jeu de l'Oie)
    attachement_style VARCHAR(50), -- 'secure', 'anxieux', 'evitant', 'desorganise'
    love_language VARCHAR(50), -- 'mots', 'temps', 'cadeaux', 'services', 'toucher'
    passion_score INT DEFAULT 50,
    autonomy_score INT DEFAULT 50,
    communication_score INT DEFAULT 50,

    -- Métadonnées
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_user_profiles_premium ON user_profiles(is_premium);
CREATE INDEX IF NOT EXISTS idx_user_profiles_stripe ON user_profiles(stripe_customer_id);

-- =============================================
-- MISE À JOUR DE LA TABLE GAMES
-- Ajouter le champ is_premium
-- =============================================

-- Ajouter la colonne is_premium à la table games si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'games' AND column_name = 'is_premium'
    ) THEN
        ALTER TABLE games ADD COLUMN is_premium BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Mettre à jour les jeux existants avec leur statut premium
UPDATE games SET is_premium = FALSE WHERE slug IN (
    'jeu-oie',
    'manege',
    'action-verite',
    'bonbon',
    'la-tarte',
    'proces'
);

UPDATE games SET is_premium = TRUE WHERE slug IN (
    'goonies',
    'temple-maudit',
    'dirty-dancing',
    'point-break',
    'refais-la-france',
    'apocalypse',
    'poesie',
    'lettre',
    'marelle',
    'chat-perche',
    'corde',
    'billes'
);

-- Insérer les nouveaux jeux s'ils n'existent pas
INSERT INTO games (slug, name, description, icon, category, is_premium, is_active) VALUES
    ('bonbon', 'C''est quoi ce bonbon ?', 'Devine les bonbons !', '🍬', 'fun', FALSE, TRUE),
    ('la-tarte', 'La Tarte', 'Tarte ou bisou ?', '🥧', 'fun', FALSE, TRUE),
    ('proces', 'Le Procès', 'Défends l''indéfendable', '⚖️', 'fun', FALSE, TRUE),
    ('apocalypse', 'Apocalypse', 'Fin du monde', '🧟', 'fun', TRUE, TRUE)
ON CONFLICT (slug) DO UPDATE SET
    is_premium = EXCLUDED.is_premium;

-- =============================================
-- TABLE: subscriptions
-- Historique des abonnements
-- =============================================

CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Informations de l'abonnement
    plan VARCHAR(50) DEFAULT 'premium_monthly', -- 'premium_monthly', 'premium_yearly'
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'cancelled', 'expired', 'past_due'
    amount_cents INT DEFAULT 500, -- 5€ = 500 centimes
    currency VARCHAR(3) DEFAULT 'EUR',

    -- Stripe
    stripe_subscription_id VARCHAR(255),
    stripe_payment_intent_id VARCHAR(255),

    -- Dates
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,

    -- Métadonnées
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe ON subscriptions(stripe_subscription_id);

-- =============================================
-- FONCTION: Vérifier si un utilisateur est premium
-- =============================================

CREATE OR REPLACE FUNCTION is_user_premium(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    is_prem BOOLEAN;
    premium_end TIMESTAMP WITH TIME ZONE;
BEGIN
    SELECT is_premium, premium_until INTO is_prem, premium_end
    FROM user_profiles
    WHERE id = user_uuid;

    -- Vérifie si premium ET si la date n'est pas expirée
    IF is_prem AND (premium_end IS NULL OR premium_end > NOW()) THEN
        RETURN TRUE;
    END IF;

    RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- TRIGGER: Mise à jour automatique de updated_at
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_user_profiles_updated ON user_profiles;
CREATE TRIGGER trigger_user_profiles_updated
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_subscriptions_updated ON subscriptions;
CREATE TRIGGER trigger_subscriptions_updated
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- user_profiles: chacun ne voit/modifie que son profil
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- subscriptions: chacun ne voit que ses abonnements
CREATE POLICY "Users can view own subscriptions" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- =============================================
-- VUE: Utilisateurs premium actifs
-- =============================================

CREATE OR REPLACE VIEW active_premium_users AS
SELECT
    up.id,
    up.pseudo,
    up.premium_since,
    up.premium_until,
    s.plan,
    s.status as subscription_status
FROM user_profiles up
LEFT JOIN subscriptions s ON up.id = s.user_id AND s.status = 'active'
WHERE up.is_premium = TRUE
    AND (up.premium_until IS NULL OR up.premium_until > NOW());

-- =============================================
-- COMMENTAIRES
-- =============================================

COMMENT ON TABLE user_profiles IS 'Profils utilisateurs avec informations premium';
COMMENT ON TABLE subscriptions IS 'Historique des abonnements premium';
COMMENT ON FUNCTION is_user_premium IS 'Vérifie si un utilisateur a un abonnement premium actif';
