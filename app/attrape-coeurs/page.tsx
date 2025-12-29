'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Données mock pour la démo
const mockAmis = [
  { id: '1', pseudo: 'LunaStar', photo: null, coeursRecus: 3, status: 'active' },
  { id: '2', pseudo: 'MaxGamer', photo: null, coeursRecus: 1, status: 'active' },
  { id: '3', pseudo: 'CyberKat', photo: null, coeursRecus: 5, status: 'active' },
]

const mockCoeursRecus = [
  { id: '1', dePseudo: 'Anonyme', pourMoi: true, message: "Je pense que tu lui plairais !", isNew: true },
  { id: '2', dePseudo: 'LunaStar', pourMoi: true, message: "Mon pote te trouve trop stylé(e) !", isNew: true },
]

export default function AttrapeCoeurs() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'amis' | 'coeurs'>('amis')
  const [showInviteModal, setShowInviteModal] = useState(false)

  // Stats Cupidon mock
  const cupidonStats = {
    level: 2,
    points: 120,
    coeursEnvoyes: 8,
    matchsReussis: 2,
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background Pattern */}
      <div className="bg-pattern" />

      {/* Header */}
      <header className="px-4 py-4 border-b-2 border-[#FF00FF]/30">
        <div className="h-1 absolute top-0 left-0 right-0 bg-gradient-to-r from-[#FF00FF] via-[#00FFFF] to-[#39FF14]" />
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-[#00FFFF] font-bold hover:text-[#FFFF00] transition"
          >
            ← Retour
          </Link>
          <div className="text-4xl animate-bounce">🏹</div>
          <Link
            href="/attrape-coeurs/profil"
            className="flex items-center gap-2 px-3 py-1 bg-[#FF00FF]/20 border-2 border-[#FF00FF] hover:bg-[#FF00FF]/40 transition"
          >
            <span className="text-sm font-bold text-[#FF00FF]">Nv.{cupidonStats.level}</span>
            <span className="text-lg">💘</span>
          </Link>
        </div>
      </header>

      {/* Titre principal */}
      <div className="text-center py-6 px-4">
        <h1 className="logo-90s justify-center text-3xl mb-2">Attrape-Coeurs</h1>
        <p className="text-[#00FFFF] font-bold" style={{ textShadow: '0 0 10px #00FFFF' }}>
          Joue les Cupidons pour tes potes !
        </p>
      </div>

      {/* Stats rapides */}
      <div className="px-4 mb-6">
        <div className="max-w-md mx-auto grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-[#330066] border-2 border-[#FF00FF]">
            <div className="text-2xl mb-1">💘</div>
            <div className="text-xl font-bold text-[#FF00FF]">{cupidonStats.coeursEnvoyes}</div>
            <div className="text-xs text-white/60">Envoyés</div>
          </div>
          <div className="text-center p-3 bg-[#330066] border-2 border-[#39FF14]">
            <div className="text-2xl mb-1">💕</div>
            <div className="text-xl font-bold text-[#39FF14]">{cupidonStats.matchsReussis}</div>
            <div className="text-xs text-white/60">Matchs</div>
          </div>
          <div className="text-center p-3 bg-[#330066] border-2 border-[#FFFF00]">
            <div className="text-2xl mb-1">⭐</div>
            <div className="text-xl font-bold text-[#FFFF00]">{cupidonStats.points}</div>
            <div className="text-xs text-white/60">Points</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-4">
        <div className="max-w-md mx-auto flex gap-2">
          <button
            onClick={() => setActiveTab('amis')}
            className={`flex-1 py-3 font-bold text-sm transition border-2 ${
              activeTab === 'amis'
                ? 'bg-[#FF00FF] border-[#FF00FF] text-white'
                : 'bg-transparent border-white/30 text-white/60 hover:border-[#FF00FF]'
            }`}
          >
            👥 MES AMIS
          </button>
          <button
            onClick={() => setActiveTab('coeurs')}
            className={`flex-1 py-3 font-bold text-sm transition border-2 relative ${
              activeTab === 'coeurs'
                ? 'bg-[#39FF14] border-[#39FF14] text-black'
                : 'bg-transparent border-white/30 text-white/60 hover:border-[#39FF14]'
            }`}
          >
            📬 MES COEURS
            {mockCoeursRecus.filter(c => c.isNew).length > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#FF3131] text-white text-xs font-bold flex items-center justify-center animate-pulse">
                {mockCoeursRecus.filter(c => c.isNew).length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <main className="flex-1 px-4 pb-24">
        <div className="max-w-md mx-auto">
          {activeTab === 'amis' && (
            <>
              {/* Bouton inviter */}
              <button
                onClick={() => setShowInviteModal(true)}
                className="w-full mb-4 p-4 border-2 border-dashed border-[#00FFFF] text-[#00FFFF] font-bold hover:bg-[#00FFFF]/10 transition flex items-center justify-center gap-2"
              >
                ➕ Inviter un ami célibataire
              </button>

              {/* Liste des amis */}
              {mockAmis.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🦋</div>
                  <p className="text-white/60 mb-4">Pas encore d'amis à matcher !</p>
                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="btn-cta-primary"
                  >
                    Inviter mes potes
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {mockAmis.map((ami) => (
                    <div
                      key={ami.id}
                      className="card-90s cyan p-4 flex items-center gap-4"
                    >
                      {/* Avatar */}
                      <div className="w-14 h-14 bg-gradient-to-br from-[#FF00FF] to-[#00FFFF] flex items-center justify-center text-2xl font-bold">
                        {ami.pseudo[0]}
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <h3 className="font-bold text-white text-lg">{ami.pseudo}</h3>
                        <p className="text-sm text-[#00FFFF]">
                          {ami.coeursRecus} coeur{ami.coeursRecus > 1 ? 's' : ''} reçu{ami.coeursRecus > 1 ? 's' : ''}
                        </p>
                      </div>

                      {/* Bouton chasser */}
                      <button
                        onClick={() => router.push(`/attrape-coeurs/chasse/${ami.id}`)}
                        className="px-4 py-2 bg-[#FF00FF] border-2 border-[#FF00FF] text-white font-bold hover:bg-[#FF00FF]/80 transition flex items-center gap-2"
                      >
                        🎯 Chasser
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* CTA principal */}
              {mockAmis.length > 0 && (
                <button
                  onClick={() => router.push('/attrape-coeurs/chasse')}
                  className="btn-cta-primary w-full mt-6 justify-center"
                >
                  🏹 CHASSER POUR UN AMI
                </button>
              )}
            </>
          )}

          {activeTab === 'coeurs' && (
            <>
              {mockCoeursRecus.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💌</div>
                  <p className="text-white/60 mb-4">Aucun coeur reçu pour l'instant</p>
                  <p className="text-sm text-white/40">
                    Demande à tes amis de jouer les Cupidons pour toi !
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {mockCoeursRecus.map((coeur) => (
                    <div
                      key={coeur.id}
                      className={`card-90s p-4 ${coeur.isNew ? 'pink animate-pulse' : ''}`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Icône */}
                        <div className="w-12 h-12 bg-gradient-to-br from-[#FF00FF] to-[#FF3131] flex items-center justify-center text-2xl">
                          💘
                        </div>

                        {/* Contenu */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-[#FF00FF]">
                              {coeur.dePseudo}
                            </span>
                            {coeur.isNew && (
                              <span className="px-2 py-0.5 bg-[#39FF14] text-black text-xs font-bold">
                                NOUVEAU
                              </span>
                            )}
                          </div>
                          <p className="text-white/80 text-sm italic">"{coeur.message}"</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-4">
                        <button className="flex-1 py-2 bg-[#39FF14] border-2 border-[#39FF14] text-black font-bold hover:bg-[#39FF14]/80 transition">
                          💚 Voir le profil
                        </button>
                        <button className="flex-1 py-2 bg-transparent border-2 border-white/30 text-white/60 font-bold hover:border-[#FF3131] hover:text-[#FF3131] transition">
                          Pas maintenant
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Modal Invitation */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="card-90s pink p-6 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🦋</div>
              <h2 className="text-2xl font-bold text-[#FF00FF] mb-2" style={{ textShadow: '0 0 10px #FF00FF' }}>
                Inviter un ami
              </h2>
              <p className="text-white/60 text-sm">
                Envoie le lien à un(e) ami(e) célibataire pour pouvoir chasser des coeurs pour lui/elle !
              </p>
            </div>

            {/* Options d'invitation */}
            <div className="space-y-3 mb-6">
              <button className="w-full py-3 bg-[#25D366] border-2 border-[#25D366] text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition">
                <span className="text-xl">📱</span>
                Partager via WhatsApp
              </button>
              <button className="w-full py-3 bg-[#00FFFF] border-2 border-[#00FFFF] text-black font-bold flex items-center justify-center gap-2 hover:opacity-90 transition">
                <span className="text-xl">📋</span>
                Copier le lien
              </button>
            </div>

            <button
              onClick={() => setShowInviteModal(false)}
              className="w-full py-3 bg-transparent border-2 border-white/30 text-white/60 font-bold hover:border-white hover:text-white transition"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Navigation bottom */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#1A0033]/95 border-t-2 border-[#FF00FF]/30 backdrop-blur-lg">
        <div className="max-w-md mx-auto flex">
          <Link href="/dashboard" className="flex-1 py-4 text-center text-white/60 hover:text-[#FF00FF] transition">
            <div className="text-2xl mb-1">🎮</div>
            <div className="text-xs font-bold">Accueil</div>
          </Link>
          <Link href="/swipe" className="flex-1 py-4 text-center text-white/60 hover:text-[#FF00FF] transition">
            <div className="text-2xl mb-1">💝</div>
            <div className="text-xs font-bold">Swipe</div>
          </Link>
          <Link href="/attrape-coeurs" className="flex-1 py-4 text-center text-[#FF00FF]">
            <div className="text-2xl mb-1">🏹</div>
            <div className="text-xs font-bold">Cupidon</div>
          </Link>
          <Link href="/messages" className="flex-1 py-4 text-center text-white/60 hover:text-[#FF00FF] transition">
            <div className="text-2xl mb-1">💬</div>
            <div className="text-xs font-bold">Messages</div>
          </Link>
          <Link href="/profile" className="flex-1 py-4 text-center text-white/60 hover:text-[#FF00FF] transition">
            <div className="text-2xl mb-1">👤</div>
            <div className="text-xs font-bold">Profil</div>
          </Link>
        </div>
      </nav>
    </div>
  )
}
