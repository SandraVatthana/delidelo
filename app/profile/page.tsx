'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUser } from '../contexts/UserContext'

// Avatars disponibles
const avatarOptions = [
  '👤', '😎', '🤠', '👩‍🦰', '👨‍🦱', '🧑', '👩‍🦳', '🧔', '👩‍🎤', '👨‍🎤', '🥷', '🦸', '🧛', '🧜', '🧚'
]

// Résultats de jeux qui peuvent être affichés sur le profil
const gameResultsOptions = [
  { id: 'bonbon_totem', icon: '🍬', label: 'Mon bonbon totem', game: 'C\'est quoi ce bonbon' },
  { id: 'red_flag', icon: '🚩', label: 'Mon red flag', game: 'Jeu de l\'Oie' },
  { id: 'crush_style', icon: '💕', label: 'Mon style crush', game: 'Le Manège' },
  { id: 'humor_type', icon: '😂', label: 'Mon type d\'humour', game: 'Action ou Vérité' },
  { id: 'ideal_date', icon: '🌅', label: 'Mon date idéal', game: 'La Marelle' },
]

export default function ProfilePage() {
  const router = useRouter()
  const { user: userData, setUser } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)

  // Données utilisateur avec nouveaux champs
  const [profileData, setProfileData] = useState({
    pseudo: userData.pseudo || 'Player123',
    avatar: userData.avatar || '👤',
    avatarType: 'emoji' as 'emoji' | 'photo',
    photoUrl: '',
    age: parseInt(userData.age) || 25,
    city: userData.city || 'Paris',
    bio: userData.bio || '',
    intentions: ['love', 'friends'],
    idealEvening: 'boardgames',
    childhoodGame: 'Mario Kart',
    threeWords: ['curieux', 'drôle', 'créatif'],
    // Nouveaux champs
    isCelib: true,
    showLocation: false,
    visibleGameResults: ['bonbon_totem', 'red_flag'],
  })
  const [isEditingBio, setIsEditingBio] = useState(false)
  const [tempBio, setTempBio] = useState(userData.bio || '')

  // Stats simulées
  const stats = {
    gamesPlayed: 12,
    matches: 5,
    points: 850,
    badges: 3,
    rank: 42,
  }

  // Badges débloqués
  const badges = [
    { id: 1, icon: '🎠', name: 'Premier Manège', desc: 'Premier tour de manège complété' },
    { id: 2, icon: '🎲', name: 'Joueur de l\'Oie', desc: 'Première partie de l\'Oie' },
    { id: 3, icon: '💕', name: 'First Match', desc: 'Premier match obtenu' },
  ]

  // Résultats de jeux mock
  const gameResults: Record<string, string> = {
    bonbon_totem: 'Fraise Tagada 🍓',
    red_flag: 'Quelqu\'un qui ghoste',
    crush_style: 'Romantique discret',
    humor_type: 'Absurde',
    ideal_date: 'Balade + resto',
  }

  const getIntentionLabel = (id: string) => {
    const labels: Record<string, string> = {
      love: '💕 Amour',
      friends: '🤝 Amitié',
      network: '🌐 Réseau',
      fun: '🎮 Fun',
    }
    return labels[id] || id
  }

  const toggleGameResult = (resultId: string) => {
    setProfileData(prev => ({
      ...prev,
      visibleGameResults: prev.visibleGameResults.includes(resultId)
        ? prev.visibleGameResults.filter(id => id !== resultId)
        : [...prev.visibleGameResults, resultId]
    }))
  }

  return (
    <div className="min-h-screen pb-12">
      {/* Background Pattern */}
      <div className="bg-pattern" />

      <style jsx>{`
        .top-nav {
          display: none;
        }
        @media (min-width: 768px) {
          .top-nav {
            display: flex;
            align-items: center;
            gap: 12px;
            flex-wrap: wrap;
            justify-content: center;
            padding-bottom: 8px;
          }
          .top-nav-item {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 8px 12px;
            font-size: 0.75rem;
            font-weight: bold;
            color: rgba(255, 255, 255, 0.8);
            transition: all 0.2s;
            border: 2px solid rgba(255, 255, 255, 0.25);
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.05);
          }
          .top-nav-item:hover {
            color: #FF00FF;
            border-color: #FF00FF;
            background: rgba(255, 0, 255, 0.15);
            text-shadow: 0 0 10px #FF00FF;
            transform: translateY(-2px);
          }
          .top-nav-item.active {
            color: #FF00FF;
            border-color: #FF00FF;
            background: rgba(255, 0, 255, 0.2);
            text-shadow: 0 0 10px #FF00FF;
            box-shadow: 0 0 15px rgba(255, 0, 255, 0.3);
          }
          .top-nav-item .nav-emoji {
            font-size: 1.2rem;
          }
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-40">
        <div className="h-1 bg-gradient-to-r from-[#FF00FF] via-[#00FFFF] to-[#39FF14]" />
        <div className="bg-[#1A0033]/95 backdrop-blur-sm px-4 py-5">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <Link href="/dashboard" className="logo-90s text-xl">
              <span className="animate-spin inline-block text-lg">🎠</span>
              Déli Délo
            </Link>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn-90s text-sm py-2 px-4"
            >
              {isEditing ? 'Annuler' : 'Modifier'}
            </button>
          </div>

          {/* Navigation desktop uniquement */}
          <nav className="max-w-5xl mx-auto mt-3">
            <div className="top-nav">
              <Link href="/dashboard" className="top-nav-item">
                <span className="nav-emoji">🏠</span>
                Accueil
              </Link>
              <Link href="/games/jeu-oie" className="top-nav-item">
                <span className="nav-emoji">🎲</span>
                Tirage
              </Link>
              <Link href="/games" className="top-nav-item">
                <span className="nav-emoji">🎮</span>
                JEUX
              </Link>
              <Link href="/messages" className="top-nav-item">
                <span className="nav-emoji">💬</span>
                Messages
              </Link>
              <Link href="/events" className="top-nav-item" style={{ color: '#FF6600' }}>
                <span className="nav-emoji">🍻</span>
                Events
              </Link>
              <Link href="/invite" className="top-nav-item">
                <span className="nav-emoji">👯</span>
                Inviter
              </Link>
              <Link href="/profile" className="top-nav-item active">
                <span className="nav-emoji">👤</span>
                Profil
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Contenu principal - Centré */}
      <main className="px-6 py-8" style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Profil Header - Centré avec avatar plus grand */}
        <div className="text-center mb-8">
          {/* Avatar 120px - Cliquable pour changer */}
          <button
            onClick={() => setShowAvatarPicker(true)}
            className="w-32 h-32 mx-auto border-4 border-[#FF00FF] rounded-full flex items-center justify-center text-6xl bg-[#330066] mb-4 relative overflow-hidden transition hover:scale-105"
            style={{ boxShadow: '0 0 40px #FF00FF50' }}
          >
            {profileData.avatarType === 'emoji' ? (
              profileData.avatar
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#FF00FF] to-[#00FFFF] flex items-center justify-center text-white text-2xl">
                📷
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 py-1 text-xs text-white">
              Modifier
            </div>
          </button>

          {/* Badge "Je suis célib" */}
          {profileData.isCelib && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 animate-pulse" style={{ background: 'linear-gradient(90deg, #FF00FF, #FF6B9D)', boxShadow: '0 0 20px rgba(255, 0, 255, 0.4)' }}>
              <span>💕</span>
              <span className="font-bold text-white text-sm">Je suis célib !</span>
            </div>
          )}

          {/* Pseudo */}
          <h1 className="text-3xl text-[#FF00FF] font-bold mb-2" style={{ textShadow: '0 0 15px #FF00FF' }}>
            {profileData.pseudo}
          </h1>
          <p className="text-white/60 text-lg mb-4">
            {profileData.age} ans • {profileData.city}
            {profileData.showLocation && <span className="ml-2">📍</span>}
          </p>

          {/* Compteurs billes/bonbons */}
          <div className="flex justify-center gap-4 mb-6">
            <Link href="/collection" className="flex items-center gap-2 px-4 py-2 rounded-full transition hover:scale-105" style={{ background: 'rgba(0, 255, 255, 0.15)', border: '2px solid rgba(0, 255, 255, 0.4)' }}>
              <span>🔵</span>
              <span className="text-[#00FFFF] font-bold">{userData.billes} billes</span>
            </Link>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: 'rgba(255, 0, 255, 0.15)', border: '2px solid rgba(255, 0, 255, 0.4)' }}>
              <span>🍬</span>
              <span className="text-[#FF00FF] font-bold">{userData.bonbons} bonbons</span>
            </div>
          </div>

          {/* Intentions - Plus grands */}
          <div className="flex justify-center gap-3 flex-wrap">
            {profileData.intentions.map(intent => (
              <span
                key={intent}
                className="px-4 py-2 text-sm font-bold rounded-lg"
                style={{ background: '#330066', border: '2px solid #00FFFF', color: '#00FFFF' }}
              >
                {getIntentionLabel(intent)}
              </span>
            ))}
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-white/10 my-8" />

        {/* Bio */}
        <div className="card-90s p-6 mb-8" style={{ borderColor: '#FF00FF40' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl text-[#FF00FF] font-bold" style={{ textShadow: '0 0 10px #FF00FF' }}>
              ✍️ MA BIO
            </h2>
            {!isEditingBio && (
              <button
                onClick={() => {
                  setTempBio(profileData.bio)
                  setIsEditingBio(true)
                }}
                className="px-3 py-1 text-sm rounded-lg font-bold transition hover:scale-105"
                style={{ background: 'rgba(255, 0, 255, 0.2)', color: '#FF00FF', border: '1px solid #FF00FF' }}
              >
                ✏️ Modifier
              </button>
            )}
          </div>

          {isEditingBio ? (
            <div>
              <textarea
                value={tempBio}
                onChange={(e) => setTempBio(e.target.value.slice(0, 200))}
                placeholder="Écris quelques mots sur toi... (200 caractères max)"
                className="w-full p-4 rounded-xl text-white placeholder-white/40 resize-none"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '2px solid #FF00FF',
                  minHeight: '120px',
                }}
                autoFocus
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-white/50">{tempBio.length}/200</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditingBio(false)}
                    className="px-4 py-2 text-sm rounded-lg font-bold"
                    style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'white' }}
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => {
                      setProfileData(prev => ({ ...prev, bio: tempBio }))
                      setUser({ bio: tempBio })
                      setIsEditingBio(false)
                    }}
                    className="px-4 py-2 text-sm rounded-lg font-bold"
                    style={{ background: '#FF00FF', color: 'white' }}
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {profileData.bio ? (
                <p className="text-white/90 text-lg leading-relaxed italic">
                  "{profileData.bio}"
                </p>
              ) : (
                <p className="text-white/40 italic">
                  Ajoute une petite bio pour te présenter aux autres joueurs...
                </p>
              )}
            </div>
          )}
        </div>

        {/* Stats - Cards plus espacées */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="card-90s p-5 text-center" style={{ borderColor: '#FF00FF40' }}>
            <div className="text-3xl font-bold text-[#FF00FF] mb-2">{stats.gamesPlayed}</div>
            <div className="text-xs text-white/60 uppercase">Parties</div>
          </div>
          <div className="card-90s p-5 text-center" style={{ borderColor: '#00FFFF40' }}>
            <div className="text-3xl font-bold text-[#00FFFF] mb-2">{stats.matches}</div>
            <div className="text-xs text-white/60 uppercase">Matchs</div>
          </div>
          <div className="card-90s p-5 text-center" style={{ borderColor: '#39FF1440' }}>
            <div className="text-3xl font-bold text-[#39FF14] mb-2">{stats.points}</div>
            <div className="text-xs text-white/60 uppercase">Points</div>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-white/10 my-8" />

        {/* Rang - Plus visible */}
        <div className="card-90s p-6 mb-8" style={{ borderColor: '#39FF14', boxShadow: '0 0 20px #39FF1430' }}>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">🏆</span>
            <div>
              <p className="text-2xl font-bold text-[#39FF14]" style={{ textShadow: '0 0 10px #39FF14' }}>
                Rang #{stats.rank}
              </p>
              <p className="text-white/60">Top 10% des joueurs</p>
            </div>
          </div>

          {/* Barre de progression */}
          <div className="bg-[#330066] rounded-full h-4 overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-[#39FF14] to-[#00FFFF]"
              style={{ width: '65%' }}
            />
          </div>
          <p className="text-right text-sm text-white/50">
            <span className="text-[#FFFF00] font-bold">150 pts</span> → prochain palier
          </p>
        </div>

        {/* Séparateur */}
        <div className="border-t border-white/10 my-8" />

        {/* Badges - Plus grands en grid */}
        <div className="mb-8">
          <h2 className="text-xl text-[#FFFF00] font-bold mb-6 text-center" style={{ textShadow: '0 0 10px #FFFF00' }}>
            🏅 MES BADGES ({badges.length})
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {badges.map(badge => (
              <div
                key={badge.id}
                className="card-90s p-5 text-center"
                style={{ borderColor: '#FFFF00', boxShadow: '0 0 15px #FFFF0040' }}
              >
                <div className="text-4xl mb-3">{badge.icon}</div>
                <p className="text-sm text-[#FFFF00] font-bold leading-tight">{badge.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-white/10 my-8" />

        {/* Infos personnelles */}
        <div className="card-90s p-6 mb-8" style={{ borderColor: '#FF00FF40' }}>
          <h2 className="text-xl text-[#FF00FF] font-bold mb-6 text-center" style={{ textShadow: '0 0 10px #FF00FF' }}>
            ✨ MON PROFIL
          </h2>

          <div className="space-y-6">
            <div className="text-center">
              <p className="text-xs text-white/40 uppercase mb-2">Soirée idéale</p>
              <p className="text-white font-bold text-lg">🎲 Jeux de société</p>
            </div>

            <div className="border-t border-white/10" />

            <div className="text-center">
              <p className="text-xs text-white/40 uppercase mb-2">Jeu d'enfance préféré</p>
              <p className="text-white font-bold text-lg">🎮 {profileData.childhoodGame}</p>
            </div>

            <div className="border-t border-white/10" />

            <div className="text-center">
              <p className="text-xs text-white/40 uppercase mb-2">3 mots qui me décrivent</p>
              <div className="flex gap-3 justify-center flex-wrap mt-2">
                {profileData.threeWords.map((word, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 text-sm font-bold rounded-lg"
                    style={{ background: '#FF00FF', color: 'white' }}
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-white/10 my-8" />

        {/* Séparateur */}
        <div className="border-t border-white/10 my-8" />

        {/* Résultats de jeux affichés */}
        <div className="mb-8">
          <h2 className="text-xl text-[#00FFFF] font-bold mb-4 text-center" style={{ textShadow: '0 0 10px #00FFFF' }}>
            🎮 MES RÉSULTATS DE JEUX
          </h2>
          <p className="text-white/50 text-sm text-center mb-6">
            Les autres joueurs verront ces infos sur ton profil
          </p>
          <div className="space-y-3">
            {gameResultsOptions.map(option => {
              const isVisible = profileData.visibleGameResults.includes(option.id)
              const result = gameResults[option.id]
              return (
                <div
                  key={option.id}
                  className="p-4 rounded-xl flex items-center gap-4"
                  style={{
                    background: isVisible ? 'rgba(0, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                    border: isVisible ? '2px solid rgba(0, 255, 255, 0.4)' : '2px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <span className="text-2xl">{option.icon}</span>
                  <div className="flex-1">
                    <div className="font-bold text-white text-sm">{option.label}</div>
                    {result && <div className="text-white/60 text-sm">{result}</div>}
                    <div className="text-xs text-white/40 mt-1">Via {option.game}</div>
                  </div>
                  <button
                    onClick={() => toggleGameResult(option.id)}
                    className="px-3 py-1.5 rounded-lg text-sm font-bold transition"
                    style={{
                      background: isVisible ? '#00FFFF' : 'rgba(255, 255, 255, 0.1)',
                      color: isVisible ? '#0D001A' : 'white',
                    }}
                  >
                    {isVisible ? '✓ Visible' : 'Masqué'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Actions - Plus d'espace */}
        <div className="space-y-4">
          <button
            onClick={() => setShowSettings(true)}
            className="btn-cta-secondary w-full justify-center py-4 text-lg"
          >
            ⚙️ Paramètres
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-full text-center py-4 text-[#FF3131] font-bold hover:text-[#FFFF00] transition text-lg"
          >
            Se déconnecter
          </button>
        </div>

        {/* Badge confiance - Plus d'espace */}
        <div className="flex justify-center gap-4 mt-8 flex-wrap">
          <span className="badge-90s badge-outline text-sm px-4 py-2">🇫🇷 IA Mistral</span>
          <span className="badge-90s badge-outline text-sm px-4 py-2">🔒 RGPD</span>
        </div>
      </main>

      {/* Modal Avatar Picker */}
      {showAvatarPicker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0, 0, 0, 0.8)' }}
          onClick={() => setShowAvatarPicker(false)}
        >
          <div
            className="w-full max-w-md p-6 rounded-2xl"
            style={{ background: '#1A0033', border: '3px solid #FF00FF' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-center mb-6" style={{ fontFamily: 'Bangers, cursive', color: '#FF00FF', textShadow: '0 0 15px #FF00FF' }}>
              Choisis ton avatar
            </h3>

            {/* Tabs Emoji / Photo */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setProfileData(prev => ({ ...prev, avatarType: 'emoji' }))}
                className="flex-1 py-3 rounded-lg font-bold transition"
                style={{
                  background: profileData.avatarType === 'emoji' ? '#FF00FF' : 'rgba(255, 255, 255, 0.1)',
                  color: profileData.avatarType === 'emoji' ? 'white' : 'rgba(255, 255, 255, 0.6)',
                }}
              >
                😎 Emoji
              </button>
              <button
                onClick={() => setProfileData(prev => ({ ...prev, avatarType: 'photo' }))}
                className="flex-1 py-3 rounded-lg font-bold transition"
                style={{
                  background: profileData.avatarType === 'photo' ? '#FF00FF' : 'rgba(255, 255, 255, 0.1)',
                  color: profileData.avatarType === 'photo' ? 'white' : 'rgba(255, 255, 255, 0.6)',
                }}
              >
                📷 Photo
              </button>
            </div>

            {profileData.avatarType === 'emoji' ? (
              <div className="grid grid-cols-5 gap-3">
                {avatarOptions.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => {
                      setProfileData(prev => ({ ...prev, avatar: emoji }))
                      setShowAvatarPicker(false)
                    }}
                    className="text-4xl p-3 rounded-xl transition hover:scale-110"
                    style={{
                      background: profileData.avatar === emoji ? '#FF00FF' : 'rgba(255, 255, 255, 0.05)',
                      border: profileData.avatar === emoji ? '2px solid #FF00FF' : '2px solid transparent',
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#FF00FF] to-[#00FFFF] flex items-center justify-center text-4xl">
                  📷
                </div>
                <p className="text-white/60 mb-4">Upload ta photo de profil</p>
                <button className="px-6 py-3 rounded-lg font-bold" style={{ background: '#FF00FF', color: 'white' }}>
                  Choisir une photo
                </button>
                <p className="text-xs text-white/40 mt-4">
                  Ta photo sera visible par les autres joueurs
                </p>
              </div>
            )}

            <button
              onClick={() => setShowAvatarPicker(false)}
              className="w-full mt-6 py-3 rounded-lg font-bold text-white/60"
              style={{ background: 'rgba(255, 255, 255, 0.05)' }}
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Modal Paramètres */}
      {showSettings && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0, 0, 0, 0.8)' }}
          onClick={() => setShowSettings(false)}
        >
          <div
            className="w-full max-w-md p-6 rounded-2xl"
            style={{ background: '#1A0033', border: '3px solid #00FFFF' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-center mb-6" style={{ fontFamily: 'Bangers, cursive', color: '#00FFFF', textShadow: '0 0 15px #00FFFF' }}>
              ⚙️ Paramètres
            </h3>

            <div className="space-y-4">
              {/* Toggle Célib */}
              <div
                className="p-4 rounded-xl flex items-center justify-between"
                style={{ background: 'rgba(255, 255, 255, 0.05)', border: '2px solid rgba(255, 0, 255, 0.3)' }}
              >
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>💕</span> Badge "Je suis célib"
                  </div>
                  <div className="text-xs text-white/50 mt-1">
                    Affiche que tu es célibataire
                  </div>
                </div>
                <button
                  onClick={() => setProfileData(prev => ({ ...prev, isCelib: !prev.isCelib }))}
                  className="w-14 h-8 rounded-full relative transition"
                  style={{
                    background: profileData.isCelib ? '#FF00FF' : 'rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <div
                    className="absolute top-1 w-6 h-6 rounded-full bg-white transition-all"
                    style={{ left: profileData.isCelib ? '28px' : '4px' }}
                  />
                </button>
              </div>

              {/* Toggle Géoloc */}
              <div
                className="p-4 rounded-xl flex items-center justify-between"
                style={{ background: 'rgba(255, 255, 255, 0.05)', border: '2px solid rgba(0, 255, 255, 0.3)' }}
              >
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>📍</span> Afficher ma localisation
                  </div>
                  <div className="text-xs text-white/50 mt-1">
                    Les autres verront ta ville
                  </div>
                </div>
                <button
                  onClick={() => setProfileData(prev => ({ ...prev, showLocation: !prev.showLocation }))}
                  className="w-14 h-8 rounded-full relative transition"
                  style={{
                    background: profileData.showLocation ? '#00FFFF' : 'rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <div
                    className="absolute top-1 w-6 h-6 rounded-full bg-white transition-all"
                    style={{ left: profileData.showLocation ? '28px' : '4px' }}
                  />
                </button>
              </div>

              {/* Info RGPD */}
              <div className="p-4 rounded-xl" style={{ background: 'rgba(57, 255, 20, 0.1)', border: '1px solid rgba(57, 255, 20, 0.3)' }}>
                <div className="flex items-start gap-3">
                  <span className="text-xl">🔒</span>
                  <div>
                    <div className="font-bold text-[#39FF14] text-sm">Tes données sont protégées</div>
                    <div className="text-xs text-white/50 mt-1">
                      Hébergement en Europe, conforme RGPD. Tu peux supprimer ton compte à tout moment.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="w-full mt-6 py-3 rounded-lg font-bold"
              style={{ background: '#00FFFF', color: '#0D001A' }}
            >
              Enregistrer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
