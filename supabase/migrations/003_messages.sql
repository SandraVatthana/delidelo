-- =============================================
-- SYSTÈME DE MESSAGERIE EN TEMPS RÉEL
-- Chat entre utilisateurs avec Supabase Realtime
-- =============================================

-- =============================================
-- TABLE: conversations
-- Conversations entre utilisateurs
-- =============================================
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    matched_game VARCHAR(100),  -- Le jeu via lequel ils ont matché
    matched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TABLE: conversation_participants
-- Participants d'une conversation
-- =============================================
CREATE TABLE IF NOT EXISTS conversation_participants (
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (conversation_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_conv_participants_user ON conversation_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_conv_participants_conv ON conversation_participants(conversation_id);

-- =============================================
-- TABLE: messages
-- Messages dans les conversations
-- =============================================
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'bonbon', 'gif', 'postcard', 'system')),
    metadata JSONB DEFAULT '{}',  -- Pour les bonbons, GIFs, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    edited_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conv_created ON messages(conversation_id, created_at DESC);

-- =============================================
-- TABLE: notifications
-- Notifications pour les utilisateurs
-- =============================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL CHECK (type IN ('message', 'bonbon', 'match', 'game_invite', 'system')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    emoji VARCHAR(10) DEFAULT '🔔',
    link VARCHAR(255),
    from_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id) WHERE read_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

-- =============================================
-- FUNCTION: get_or_create_conversation
-- Récupère ou crée une conversation entre deux utilisateurs
-- =============================================
CREATE OR REPLACE FUNCTION get_or_create_conversation(
    p_user1_id UUID,
    p_user2_id UUID,
    p_matched_game VARCHAR(100) DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_conversation_id UUID;
BEGIN
    -- Chercher une conversation existante
    SELECT cp1.conversation_id INTO v_conversation_id
    FROM conversation_participants cp1
    INNER JOIN conversation_participants cp2 ON cp1.conversation_id = cp2.conversation_id
    WHERE cp1.user_id = p_user1_id AND cp2.user_id = p_user2_id
    LIMIT 1;

    -- Si pas de conversation, en créer une
    IF v_conversation_id IS NULL THEN
        INSERT INTO conversations (matched_game) VALUES (p_matched_game)
        RETURNING id INTO v_conversation_id;

        INSERT INTO conversation_participants (conversation_id, user_id)
        VALUES
            (v_conversation_id, p_user1_id),
            (v_conversation_id, p_user2_id);
    END IF;

    RETURN v_conversation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- FUNCTION: send_message
-- Envoie un message et crée les notifications
-- =============================================
CREATE OR REPLACE FUNCTION send_message(
    p_conversation_id UUID,
    p_sender_id UUID,
    p_content TEXT,
    p_message_type VARCHAR(20) DEFAULT 'text',
    p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    v_message_id UUID;
    v_recipient_id UUID;
    v_sender_name TEXT;
    v_notif_title TEXT;
    v_notif_emoji VARCHAR(10);
BEGIN
    -- Insérer le message
    INSERT INTO messages (conversation_id, sender_id, content, message_type, metadata)
    VALUES (p_conversation_id, p_sender_id, p_content, p_message_type, p_metadata)
    RETURNING id INTO v_message_id;

    -- Mettre à jour la conversation
    UPDATE conversations SET updated_at = NOW() WHERE id = p_conversation_id;

    -- Récupérer le destinataire
    SELECT user_id INTO v_recipient_id
    FROM conversation_participants
    WHERE conversation_id = p_conversation_id AND user_id != p_sender_id
    LIMIT 1;

    -- Récupérer le nom de l'expéditeur
    SELECT COALESCE(pseudo, 'Quelqu''un') INTO v_sender_name
    FROM profiles WHERE id = p_sender_id;

    -- Déterminer le type de notification
    CASE p_message_type
        WHEN 'bonbon' THEN
            v_notif_title := 'Bonbon reçu !';
            v_notif_emoji := '🍬';
        WHEN 'gif' THEN
            v_notif_title := 'GIF reçu !';
            v_notif_emoji := '🎬';
        WHEN 'postcard' THEN
            v_notif_title := 'Carte postale !';
            v_notif_emoji := '📮';
        ELSE
            v_notif_title := 'Nouveau message';
            v_notif_emoji := '💬';
    END CASE;

    -- Créer la notification pour le destinataire
    IF v_recipient_id IS NOT NULL THEN
        INSERT INTO notifications (user_id, type, title, message, emoji, link, from_user_id)
        VALUES (
            v_recipient_id,
            CASE WHEN p_message_type = 'bonbon' THEN 'bonbon' ELSE 'message' END,
            v_notif_title,
            v_sender_name || ' t''a envoyé un message',
            v_notif_emoji,
            '/messages',
            p_sender_id
        );
    END IF;

    RETURN v_message_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- FUNCTION: get_conversations_with_unread
-- Récupère les conversations avec le compte de messages non-lus
-- =============================================
CREATE OR REPLACE FUNCTION get_conversations_with_unread(p_user_id UUID)
RETURNS TABLE (
    conversation_id UUID,
    other_user_id UUID,
    other_user_name TEXT,
    other_user_avatar TEXT,
    matched_game VARCHAR,
    last_message TEXT,
    last_message_at TIMESTAMPTZ,
    unread_count BIGINT,
    is_online BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.id as conversation_id,
        p.id as other_user_id,
        COALESCE(p.pseudo, 'Utilisateur') as other_user_name,
        COALESCE(p.avatar, '👤') as other_user_avatar,
        c.matched_game,
        (
            SELECT m.content
            FROM messages m
            WHERE m.conversation_id = c.id AND m.deleted_at IS NULL
            ORDER BY m.created_at DESC
            LIMIT 1
        ) as last_message,
        c.updated_at as last_message_at,
        (
            SELECT COUNT(*)
            FROM messages m
            WHERE m.conversation_id = c.id
              AND m.sender_id != p_user_id
              AND m.created_at > cp.last_read_at
              AND m.deleted_at IS NULL
        ) as unread_count,
        COALESCE(p.is_online, FALSE) as is_online
    FROM conversations c
    INNER JOIN conversation_participants cp ON cp.conversation_id = c.id AND cp.user_id = p_user_id
    INNER JOIN conversation_participants cp2 ON cp2.conversation_id = c.id AND cp2.user_id != p_user_id
    INNER JOIN profiles p ON p.id = cp2.user_id
    ORDER BY c.updated_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- FUNCTION: mark_conversation_read
-- Marque tous les messages d'une conversation comme lus
-- =============================================
CREATE OR REPLACE FUNCTION mark_conversation_read(
    p_conversation_id UUID,
    p_user_id UUID
)
RETURNS VOID AS $$
BEGIN
    UPDATE conversation_participants
    SET last_read_at = NOW()
    WHERE conversation_id = p_conversation_id AND user_id = p_user_id;

    -- Marquer les notifications liées comme lues
    UPDATE notifications
    SET read_at = NOW()
    WHERE user_id = p_user_id
      AND type IN ('message', 'bonbon')
      AND from_user_id IN (
          SELECT user_id FROM conversation_participants
          WHERE conversation_id = p_conversation_id AND user_id != p_user_id
      )
      AND read_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- FUNCTION: get_unread_notifications_count
-- Compte les notifications non-lues
-- =============================================
CREATE OR REPLACE FUNCTION get_unread_notifications_count(p_user_id UUID)
RETURNS BIGINT AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)
        FROM notifications
        WHERE user_id = p_user_id AND read_at IS NULL
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Conversations: On peut voir les conversations où on participe
CREATE POLICY "Users can view their conversations" ON conversations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM conversation_participants
            WHERE conversation_id = id AND user_id = auth.uid()
        )
    );

-- Participants: On peut voir les participants de ses conversations
CREATE POLICY "Users can view conversation participants" ON conversation_participants
    FOR SELECT USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM conversation_participants cp
            WHERE cp.conversation_id = conversation_id AND cp.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their participation" ON conversation_participants
    FOR UPDATE USING (user_id = auth.uid());

-- Messages: On peut voir les messages de ses conversations
CREATE POLICY "Users can view messages in their conversations" ON messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM conversation_participants
            WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can send messages to their conversations" ON messages
    FOR INSERT WITH CHECK (
        sender_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM conversation_participants
            WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()
        )
    );

-- Notifications: On peut voir ses propres notifications
CREATE POLICY "Users can view their notifications" ON notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their notifications" ON notifications
    FOR UPDATE USING (user_id = auth.uid());

-- =============================================
-- ENABLE REALTIME
-- Important: Activer Realtime pour les messages
-- =============================================
-- Dans Supabase Dashboard > Database > Replication, activer:
-- - messages
-- - notifications
-- - conversation_participants

-- Ou via SQL:
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- =============================================
-- TRIGGER: Update conversation on new message
-- =============================================
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversations SET updated_at = NOW() WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_conversation_timestamp
    AFTER INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_timestamp();
