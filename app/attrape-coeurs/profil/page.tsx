'use client'

import { useState } from 'react'
import Link from 'next/link'

// Niveaux Cupidon
const CUPIDON_LEVELS = [
  { level: 1, name: 'Cupidon Novice', minMatches: 0, icon: '🏹', color: '#FF00FF' },
  { level: 2, name: 'Cupidon Bronze', minMatches: 6, icon: '🥉', color: '#CD7F32' },
  { level: 3, name: 'Cupidon Argent', minMatches: 16, icon: '🥈', color: '#C0C0C0' },
  { level: 4, name: 'Cupidon Or', minMatches: 31, icon: '🥇', color: '#FFD700' },
  { level: 5, name: 'Cupidon Légendaire', minMatches: 50, icon: '👑', color: '#FF00FF' },
]

// Badges disponibles
const BADGES = [
  { id: 'first_catch', name: 'Premier Coeur', icon: '💘', description: 'Attraper ton premier coeur', earned: true },
  { id: 'matchmaker', name: 'Matchmaker', icon: '💕', description: 'Créer ton premier match', earned: true },
  { id: 'sniper', name: 'Sniper', icon: '🎯', description: '5 matchs réussis', earned: false },
  { id: 'cupid_army', name: 'Armée de Cupidons', icon: '🦋', description: 'Inviter 5 amis', earned: false },
  { id: 'love_guru', name: 'Guru de l\'Amour', icon: '🧘', description: '10 conversations initiées', earned: false },
  { id: 'wedding_planner', name: 'Wedding Planner', icon: '💒', description: 'Un couple formé grâce à toi', earned: false },
]

export default function ProfilCupidon() {
  const [activeTab, setActiveTab] = useState<'stats' | 'badges' | 'historique'>('stats')

  // Stats mock
  const stats = {
    level: 2,
    points: 320,
    pointsNextLevel: 500,
    coeursEnvoyes: 15,
    coeursAcceptes: 8,
    matchsReussis: 4,
    conversationsStarted: 6,
    datesIRL: 1,
    couplesFormes: 0,
    amisInvites: 3,
  }

  const currentLevel = CUPIDON_LEVELS.find(l => l.level === stats.level) || CUPIDON_LEVELS[0]
  const nextLevel = CUPIDON_LEVELS.find(l => l.level === stats.level + 1)
  const progressPercent = nextLevel
    ? ((stats.matchsReussis - currentLevel.minMatches) / (nextLevel.minMatches - currentLevel.minMatches)) * 100
    : 100

  // Historique mock
  const historique = [
    { date: 'Aujourd\'hui', action: 'Coeur accepté !', ami: 'LunaStar', profil: 'StarPlayer', type: 'success' },
    { date: 'Hier', action: 'Coeur envoyé', ami: 'MaxGamer', profil: 'NightOwl', type: 'sent' },
    { date: 'Hier', action: 'Match créé !', ami: 'LunaStar', profil: 'PixelQueen', type: 'match' },
    { date: 'Il y a 2 jours', action: 'Coeur refusé', ami: 'CyberKat', profil: 'GamerBoy', type: 'refused' },
  ]

  return (
    <div className="min-h-screen flex flex-col pb-20">
      <div className="bg-pattern" />

      {/* Header */}
      <header className="px-4 py-4">
        <div className="h-1 absolute top-0 left-0 right-0 bg-gradient-to-r from-[#FF00FF] via-[#00FFFF] to-[#39FF14]" />
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link
            href="/attrape-coeurs"
            className="inline-flex items-center gap-2 text-[#00FFFF] font-bold hover:text-[#FFFF00] transition"
          >
            ← Retour
          </Link>
        </div>
      </header>

      {/* Profil Card */}
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          <div className="card-90s pink p-6 text-center">
            {/* Avatar niveau */}
            <div className="relative inline-block mb-4">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-5xl"
                style={{
                  background: `linear-gradient(135deg, ${currentLevel.color}, #00FFFF)`,
                  boxShadow: `0 0 30px ${currentLevel.color}`,
                }}
              >
                {currentLevel.icon}
              </div>
              <div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-bold"
                style={{
                  background: currentLevel.color,
                  color: stats.level >= 4 ? 'black' : 'white',
                }}
              >
                Nv.{stats.level}
              </div>
            </div>

            {/* Titre */}
            <h1
              className="text-2xl font-bold mb-2"
              style={{ color: currentLevel.color, textShadow: `0 0 20px ${currentLevel.color}` }}
            >
              {currentLevel.name}
            </h1>

            {/* Points */}
            <div className="flex justify-center items-center gap-2 mb-4">
              <span className="text-3xl font-bold text-[#FFFF00]">{stats.points}</span>
              <span className="text-white/60">points</span>
            </div>

            {/* Barre de progression vers niveau suivant */}
            {nextLevel && (
              <div className="mb-6">
                <div className="flex justify-between text-xs text-white/60 mb-2">
                  <span>Prochain niveau</span>
                  <span>{stats.matchsReussis}/{nextLevel.minMatches} matchs</span>
                </div>
                <div className="h-3 bg-[#1A0033] border border-white/20 overflow-hidden">
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${progressPercent}%`,
                      background: `linear-gradient(90deg, ${currentLevel.color}, ${nextLevel.color})`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Stats rapides */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 bg-[#1A0033] border border-[#FF00FF]">
                <div className="text-2xl font-bold text-[#FF00FF]">{stats.coeursEnvoyes}</div>
                <div className="text-xs text-white/60">Envoyés</div>
              </div>
              <div className="p-3 bg-[#1A0033] border border-[#39FF14]">
                <div className="text-2xl font-bold text-[#39FF14]">{stats.matchsReussis}</div>
                <div className="text-xs text-white/60">Matchs</div>
              </div>
              <div className="p-3 bg-[#1A0033] border border-[#00FFFF]">
                <div className="text-2xl font-bold text-[#00FFFF]">{stats.conversationsStarted}</div>
                <div className="text-xs text-white/60">Convos</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-4">
        <div className="max-w-md mx-auto flex gap-2">
          {[
            { id: 'stats', label: 'Stats', icon: '📊' },
            { id: 'badges', label: 'Badges', icon: '🏆' },
            { id: 'historique', label: 'Historique', icon: '📜' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 py-2 font-bold text-sm transition border-2 ${
                activeTab === tab.id
                  ? 'bg-[#FF00FF] border-[#FF00FF] text-white'
                  : 'bg-transparent border-white/30 text-white/60 hover:border-[#FF00FF]'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenu tabs */}
      <main className="flex-1 px-4">
        <div className="max-w-md mx-auto">
          {activeTab === 'stats' && (
            <div className="space-y-4">
              {/* Stats détaillées */}
              <div className="card-90s p-4">
                <h3 className="font-bold text-[#FF00FF] mb-4 uppercase text-sm">Tes performances</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Coeurs envoyés', value: stats.coeursEnvoyes, icon: '💘' },
                    { label: 'Coeurs acceptés', value: stats.coeursAcceptes, icon: '💚' },
                    { label: 'Taux de succès', value: `${Math.round((stats.coeursAcceptes / stats.coeursEnvoyes) * 100)}%`, icon: '📈' },
                    { label: 'Matchs créés', value: stats.matchsReussis, icon: '💕' },
                    { label: 'Conversations', value: stats.conversationsStarted, icon: '💬' },
                    { label: 'Dates IRL', value: stats.datesIRL, icon: '☕' },
                    { label: 'Couples formés', value: stats.couplesFormes, icon: '💒' },
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
                      <span className="text-white/80 flex items-center gap-2">
                        <span>{stat.icon}</span>
                        {stat.label}
                      </span>
                      <span className="font-bold text-[#00FFFF]">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Défi quotidien */}
              <div className="card-90s pink p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-[#FFFF00] uppercase text-sm">Défi du jour</h3>
                  <span className="text-xs text-white/60">+50 pts</span>
                </div>
                <p className="text-white/80 mb-3">
                  Attrape un coeur pour <strong className="text-[#00FFFF]">MaxGamer</strong> aujourd'hui !
                </p>
                <Link
                  href="/attrape-coeurs/chasse/2"
                  className="block w-full py-2 bg-[#FFFF00] border-2 border-[#FFFF00] text-black font-bold text-center hover:opacity-90 transition"
                >
                  🎯 Relever le défi
                </Link>
              </div>
            </div>
          )}

          {activeTab === 'badges' && (
            <div className="grid grid-cols-2 gap-3">
              {BADGES.map((badge) => (
                <div
                  key={badge.id}
                  className={`card-90s p-4 text-center ${badge.earned ? '' : 'opacity-50'}`}
                >
                  <div className={`text-4xl mb-2 ${badge.earned ? '' : 'grayscale'}`}>
                    {badge.icon}
                  </div>
                  <h4 className={`font-bold text-sm ${badge.earned ? 'text-[#FF00FF]' : 'text-white/60'}`}>
                    {badge.name}
                  </h4>
                  <p className="text-xs text-white/40 mt-1">{badge.description}</p>
                  {badge.earned && (
                    <span className="inline-block mt-2 px-2 py-0.5 bg-[#39FF14] text-black text-xs font-bold">
                      ✓ Obtenu
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'historique' && (
            <div className="space-y-3">
              {historique.map((item, i) => (
                <div key={i} className="card-90s p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/40">{item.date}</span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 ${
                        item.type === 'success'
                          ? 'bg-[#39FF14] text-black'
                          : item.type === 'match'
                          ? 'bg-[#FF00FF] text-white'
                          : item.type === 'refused'
                          ? 'bg-[#FF3131] text-white'
                          : 'bg-white/20 text-white/60'
                      }`}
                    >
                      {item.action}
                    </span>
                  </div>
                  <p className="text-white/80">
                    <span className="text-[#00FFFF]">{item.profil}</span>
                    {' → '}
                    <span className="text-[#FF00FF]">{item.ami}</span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
