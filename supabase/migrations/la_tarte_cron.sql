-- =============================================
-- CRON JOB pour Tarte du Jour
-- Execute tous les jours a minuit (00:00 UTC)
-- =============================================

-- Activer l'extension pg_cron si pas deja active
-- Note: Cela doit etre fait par un superuser dans Supabase Dashboard
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- La fonction de selection de la Tarte du Jour est deja creee dans la_tarte.sql
-- Cette migration ajoute le cron job pour l'executer automatiquement

-- Option 1: Via pg_cron (a configurer dans Supabase Dashboard > Database > Extensions)
-- SELECT cron.schedule(
--   'tarte-du-jour-daily',
--   '0 0 * * *',  -- Tous les jours a minuit UTC
--   $$SELECT select_tarte_du_jour()$$
-- );

-- Option 2: La fonction peut aussi etre appelee via une Edge Function
-- configuree avec un webhook scheduler (Supabase Dashboard > Edge Functions)

-- =============================================
-- BADGES pour le Jeu de la Tarte
-- =============================================

-- Liste des badges disponibles
COMMENT ON TABLE tarte_badges IS 'Badges gagnes par les utilisateurs dans le Jeu de la Tarte';

-- Types de badges:
-- 'patissier_debutant' : 1ere tarte lancee
-- 'sniper' : 10 tartes lancees
-- 'artisan' : 50 tartes lancees
-- 'solidaire' : 50 tartes ajoutees aux autres
-- 'poete_rage' : Une tarte avec 100+ reactions MDR
-- 'viral' : Une tarte avec 500+ reactions
-- 'tarte_du_jour' : Tarte du jour (la + reactions)
-- 'legende' : 10x Tarte du jour

-- =============================================
-- FONCTION: Attribuer les badges automatiquement
-- =============================================

CREATE OR REPLACE FUNCTION check_and_award_badges()
RETURNS TRIGGER AS $$
DECLARE
  user_tarte_count INT;
  user_solidaire_count INT;
  reaction_total INT;
BEGIN
  -- Compter les tartes de l'utilisateur
  IF TG_TABLE_NAME = 'tartes' THEN
    SELECT COUNT(*) INTO user_tarte_count
    FROM tartes
    WHERE user_id = NEW.user_id;

    -- Badge: Patissier Debutant (1ere tarte)
    IF user_tarte_count = 1 THEN
      INSERT INTO tarte_badges (user_id, badge_type)
      VALUES (NEW.user_id, 'patissier_debutant')
      ON CONFLICT (user_id, badge_type) DO NOTHING;
    END IF;

    -- Badge: Sniper (10 tartes)
    IF user_tarte_count = 10 THEN
      INSERT INTO tarte_badges (user_id, badge_type)
      VALUES (NEW.user_id, 'sniper')
      ON CONFLICT (user_id, badge_type) DO NOTHING;
    END IF;

    -- Badge: Artisan (50 tartes)
    IF user_tarte_count = 50 THEN
      INSERT INTO tarte_badges (user_id, badge_type)
      VALUES (NEW.user_id, 'artisan')
      ON CONFLICT (user_id, badge_type) DO NOTHING;
    END IF;
  END IF;

  -- Verifier les reactions pour les badges
  IF TG_TABLE_NAME = 'tarte_reactions' THEN
    -- Badge: Solidaire (50 reactions solidaire donnees)
    IF NEW.reaction_type = 'solidaire' THEN
      SELECT COUNT(*) INTO user_solidaire_count
      FROM tarte_reactions
      WHERE user_id = NEW.user_id AND reaction_type = 'solidaire';

      IF user_solidaire_count = 50 THEN
        INSERT INTO tarte_badges (user_id, badge_type)
        VALUES (NEW.user_id, 'solidaire')
        ON CONFLICT (user_id, badge_type) DO NOTHING;
      END IF;
    END IF;

    -- Verifier si la tarte atteint des milestones
    SELECT (reactions_bienmerite + reactions_solidaire + reactions_mdr + reactions_pareil)
    INTO reaction_total
    FROM tartes
    WHERE id = NEW.tarte_id;

    -- Badge: Poete de la Rage (100+ reactions MDR)
    IF reaction_total >= 100 THEN
      -- Donner le badge au proprietaire de la tarte
      INSERT INTO tarte_badges (user_id, badge_type)
      SELECT user_id, 'poete_rage'
      FROM tartes
      WHERE id = NEW.tarte_id
      ON CONFLICT (user_id, badge_type) DO NOTHING;
    END IF;

    -- Badge: Viral (500+ reactions)
    IF reaction_total >= 500 THEN
      INSERT INTO tarte_badges (user_id, badge_type)
      SELECT user_id, 'viral'
      FROM tartes
      WHERE id = NEW.tarte_id
      ON CONFLICT (user_id, badge_type) DO NOTHING;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour les badges
DROP TRIGGER IF EXISTS trigger_badge_on_tarte ON tartes;
CREATE TRIGGER trigger_badge_on_tarte
  AFTER INSERT ON tartes
  FOR EACH ROW EXECUTE FUNCTION check_and_award_badges();

DROP TRIGGER IF EXISTS trigger_badge_on_reaction ON tarte_reactions;
CREATE TRIGGER trigger_badge_on_reaction
  AFTER INSERT ON tarte_reactions
  FOR EACH ROW EXECUTE FUNCTION check_and_award_badges();
