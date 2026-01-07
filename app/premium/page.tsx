'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useUser } from '../contexts/UserContext'

export default function PremiumPage() {
  const { user } = useUser()
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Utilise le vrai statut premium depuis UserContext
  const userIsPremium = user.isPremium

  const handleSubscribe = async () => {
    setIsProcessing(true)
    // TODO: Intégrer Stripe ici
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsProcessing(false)
    setShowConfirmation(true)
  }

  const features = [
    { emoji: '🎮', title: 'Tous les jeux débloqués', desc: 'Accède à l\'intégralité du catalogue de jeux' },
    { emoji: '🆕', title: '1 jeu EXCLUSIF chaque mois', desc: 'Sois le premier à découvrir les nouveautés' },
    { emoji: '🍬', title: 'Bonbons illimités', desc: 'Envoie autant de bonbons que tu veux' },
    { emoji: '🔮', title: 'Billes rares + échange', desc: 'Collectionne les billes légendaires' },
    { emoji: '🍻', title: 'Organiser des soirées IRL', desc: 'Crée des events et invite ta communauté' },
    { emoji: '⚡', title: 'Profil boosté', desc: 'Plus de visibilité dans les matchs' },
  ]

  if (userIsPremium) {
    return (
      <div className="min-h-screen pb-20" style={{ background: 'linear-gradient(180deg, #1A0033 0%, #2D0A4E 50%, #1A0033 100%)' }}>
        <header className="sticky top-0 z-40">
          <div className="h-1 bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700]" />
          <div className="bg-[#1A0033]/95 backdrop-blur-sm px-4 py-4">
            <div className="max-w-lg mx-auto flex items-center justify-between">
              <Link href="/dashboard" className="text-white/60 hover:text-white transition flex items-center gap-2">
                <span>←</span>
                <span>Retour</span>
              </Link>
              <h1 className="text-xl font-bold" style={{ fontFamily: 'Bangers, cursive', color: '#FFD700', textShadow: '0 0 15px rgba(255, 215, 0, 0.5)' }}>
                💎 Premium
              </h1>
              <div className="w-16" />
            </div>
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 py-8 text-center">
          <div className="text-7xl mb-4">💎</div>
          <h2
            className="text-3xl font-bold mb-4"
            style={{
              fontFamily: 'Bangers, cursive',
              color: '#FFD700',
              textShadow: '0 0 20px rgba(255, 215, 0, 0.5)'
            }}
          >
            Tu es Premium !
          </h2>
          <p className="text-white/80 mb-8">
            Merci de soutenir Déli Délo ! Tu as accès à tous les avantages.
          </p>

          <div
            className="p-6 rounded-xl mb-6"
            style={{
              background: 'rgba(255, 215, 0, 0.1)',
              border: '2px solid #FFD700'
            }}
          >
            <p className="text-[#FFD700] font-bold mb-2">Ton abonnement</p>
            <p className="text-white/70 text-sm">
              {user.premiumUntil
                ? `Actif jusqu'au ${new Date(user.premiumUntil).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`
                : 'Abonnement actif'}
            </p>
            <p className="text-white/50 text-xs mt-2">Renouvellement automatique</p>
          </div>

          <Link
            href="/games"
            className="inline-block px-8 py-4 rounded-xl font-bold text-lg transition hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              color: '#1A0033'
            }}
          >
            🎮 Jouer maintenant
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20" style={{ background: 'linear-gradient(180deg, #1A0033 0%, #2D0A4E 50%, #1A0033 100%)' }}>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer {
          background: linear-gradient(90deg, #FFD700, #FFA500, #FFD700, #FFA500);
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-40">
        <div className="h-1 shimmer" />
        <div className="bg-[#1A0033]/95 backdrop-blur-sm px-4 py-4">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <Link href="/dashboard" className="text-white/60 hover:text-white transition flex items-center gap-2">
              <span>←</span>
              <span>Retour</span>
            </Link>
            <h1 className="text-xl font-bold" style={{ fontFamily: 'Bangers, cursive', color: '#FFD700', textShadow: '0 0 15px rgba(255, 215, 0, 0.5)' }}>
              💎 Premium
            </h1>
            <div className="w-16" />
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-8">
          <div className="text-7xl mb-4 float-animation">💎</div>
          <h2
            className="text-4xl font-bold mb-2"
            style={{
              fontFamily: 'Bangers, cursive',
              color: '#FFD700',
              textShadow: '0 0 20px rgba(255, 215, 0, 0.5)'
            }}
          >
            DÉLI DÉLO PREMIUM
          </h2>
          <p className="text-[#FF00FF] text-2xl font-bold mb-4" style={{ textShadow: '0 0 10px #FF00FF' }}>
            5€/mois
          </p>
          <p className="text-white/70">
            Débloque tout. Joue sans limites.
          </p>
        </div>

        {/* Features */}
        <div
          className="rounded-2xl p-6 mb-8"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05))',
            border: '2px solid #FFD700',
            boxShadow: '0 0 30px rgba(255, 215, 0, 0.2)'
          }}
        >
          <h3 className="text-[#FFD700] font-bold text-lg mb-4 text-center">Ce qui t'attend :</h3>
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="text-2xl">{feature.emoji}</div>
                <div>
                  <p className="text-white font-bold">{feature.title}</p>
                  <p className="text-white/60 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleSubscribe}
          disabled={isProcessing}
          className="w-full py-5 rounded-xl font-bold text-xl transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            color: '#1A0033',
            boxShadow: '0 0 30px rgba(255, 215, 0, 0.5)'
          }}
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span>
              Chargement...
            </span>
          ) : (
            'S\'ABONNER - 5€/mois'
          )}
        </button>

        {/* Tagline */}
        <p className="text-center text-white/50 text-sm mt-4">
          💡 Moins cher qu'un McDo. Plus fun qu'un scroll Instagram.
        </p>

        {/* Comparison */}
        <div className="mt-8">
          <h3 className="text-center text-white/80 font-bold mb-4">Gratuit vs Premium</h3>
          <div className="grid grid-cols-2 gap-4">
            {/* Free */}
            <div
              className="p-4 rounded-xl text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '2px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <p className="text-[#39FF14] font-bold mb-3">GRATUIT</p>
              <ul className="text-left text-xs text-white/60 space-y-2">
                <li>✅ 6 jeux de base</li>
                <li>✅ Jeu de l'Oie</li>
                <li>✅ 10 bonbons/jour</li>
                <li>❌ Jeux premium</li>
                <li>❌ Events IRL</li>
                <li>❌ Billes rares</li>
              </ul>
            </div>

            {/* Premium */}
            <div
              className="p-4 rounded-xl text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 165, 0, 0.1))',
                border: '2px solid #FFD700'
              }}
            >
              <p className="text-[#FFD700] font-bold mb-3">💎 PREMIUM</p>
              <ul className="text-left text-xs text-white/80 space-y-2">
                <li>✅ TOUS les jeux</li>
                <li>✅ Jeu de l'Oie</li>
                <li>✅ Bonbons illimités</li>
                <li>✅ Jeux exclusifs</li>
                <li>✅ Events IRL</li>
                <li>✅ Billes rares</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-8">
          <h3 className="text-center text-white/80 font-bold mb-4">Questions fréquentes</h3>
          <div className="space-y-3">
            <details className="group">
              <summary
                className="p-4 rounded-xl cursor-pointer list-none flex justify-between items-center"
                style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
              >
                <span className="text-white/80 text-sm">Comment annuler ?</span>
                <span className="text-white/50 group-open:rotate-180 transition">▼</span>
              </summary>
              <div className="p-4 text-white/60 text-sm">
                Tu peux annuler à tout moment depuis ton profil. L'accès reste actif jusqu'à la fin de la période payée.
              </div>
            </details>

            <details className="group">
              <summary
                className="p-4 rounded-xl cursor-pointer list-none flex justify-between items-center"
                style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
              >
                <span className="text-white/80 text-sm">Paiement sécurisé ?</span>
                <span className="text-white/50 group-open:rotate-180 transition">▼</span>
              </summary>
              <div className="p-4 text-white/60 text-sm">
                Oui ! Le paiement est géré par Stripe, leader mondial du paiement en ligne. Tes données bancaires sont 100% sécurisées.
              </div>
            </details>

            <details className="group">
              <summary
                className="p-4 rounded-xl cursor-pointer list-none flex justify-between items-center"
                style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
              >
                <span className="text-white/80 text-sm">Essai gratuit ?</span>
                <span className="text-white/50 group-open:rotate-180 transition">▼</span>
              </summary>
              <div className="p-4 text-white/60 text-sm">
                Tu as déjà accès à 6 jeux gratuits ! Teste-les et passe Premium quand tu es prêt(e).
              </div>
            </details>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-8 flex justify-center gap-6 text-white/40 text-xs">
          <div className="text-center">
            <div className="text-xl mb-1">🔒</div>
            <p>Paiement<br/>sécurisé</p>
          </div>
          <div className="text-center">
            <div className="text-xl mb-1">↩️</div>
            <p>Annulation<br/>facile</p>
          </div>
          <div className="text-center">
            <div className="text-xl mb-1">💬</div>
            <p>Support<br/>réactif</p>
          </div>
        </div>
      </main>

      {/* Popup confirmation (placeholder) */}
      {showConfirmation && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0, 0, 0, 0.9)' }}
        >
          <div
            className="max-w-md w-full rounded-2xl p-8 text-center"
            style={{
              background: 'linear-gradient(135deg, #1A0033, #2D0A4E)',
              border: '3px solid #FFD700',
              boxShadow: '0 0 50px rgba(255, 215, 0, 0.4)'
            }}
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2
              className="text-2xl font-bold mb-4"
              style={{
                fontFamily: 'Bangers, cursive',
                color: '#FFD700',
                textShadow: '0 0 15px rgba(255, 215, 0, 0.5)'
              }}
            >
              Bientôt disponible !
            </h2>
            <p className="text-white/80 mb-6">
              Le paiement sera activé très prochainement. Laisse-nous ton email pour être prévenu(e) !
            </p>

            <div className="mb-6">
              <input
                type="email"
                placeholder="ton@email.com"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border-2 border-white/20 text-white placeholder-white/40 focus:border-[#FFD700] focus:outline-none transition"
              />
            </div>

            <button
              onClick={() => setShowConfirmation(false)}
              className="w-full py-3 rounded-xl font-bold transition hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                color: '#1A0033'
              }}
            >
              Me prévenir 📧
            </button>

            <button
              onClick={() => setShowConfirmation(false)}
              className="mt-4 text-white/50 text-sm hover:text-white/80 transition"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
