'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useUser } from '../../contexts/UserContext'

// Types
type GameStep = 'home' | 'my_answers' | 'invite_friends' | 'waiting' | 'friend_answers' | 'results'

interface ManageQuestion {
  id: number
  question: string
  options: string[]
}

interface Friend {
  id: string
  pseudo: string
  avatar: string
  selected?: boolean
}

interface FriendResult {
  friend: Friend
  score: number
  answers: number[] // index des réponses
  comment?: string
}

// Questions du Manège (10 questions)
const MANEGE_QUESTIONS: ManageQuestion[] = [
  {
    id: 1,
    question: "Ton dimanche parfait ?",
    options: [
      "Grasse mat + Netflix + plaid",
      "Brunch avec les potes",
      "Rando / sport / nature",
      "Je bosse, j'ai pas le temps"
    ]
  },
  {
    id: 2,
    question: "Ton plus gros défaut ?",
    options: [
      "Je suis bordélique",
      "Je suis toujours en retard",
      "Je suis têtu(e)",
      "Je parle trop"
    ]
  },
  {
    id: 3,
    question: "Ta honte secrète ?",
    options: [
      "Je regarde de la télé-réalité",
      "Je chante fort sous la douche",
      "Je google mon prénom parfois",
      "J'ai pleuré devant un Disney récemment"
    ]
  },
  {
    id: 4,
    question: "En soirée, tu es plutôt...",
    options: [
      "Le/la premier(e) sur la piste",
      "À discuter dans un coin",
      "À servir les verres",
      "Parti(e) à 22h"
    ]
  },
  {
    id: 5,
    question: "Ta plus grande peur ?",
    options: [
      "Les araignées / insectes",
      "Parler en public",
      "L'avion",
      "Finir seul(e)"
    ]
  },
  {
    id: 6,
    question: "Si tu gagnes au loto, tu fais quoi en premier ?",
    options: [
      "Je démissionne direct",
      "Je dis rien et je planifie",
      "J'invite tout le monde au resto",
      "Je panique et je cache l'argent"
    ]
  },
  {
    id: 7,
    question: "Le matin, tu es plutôt...",
    options: [
      "Debout avant le réveil, motivé(e)",
      "Snooze × 5 minimum",
      "Zombie jusqu'au café",
      "Ça dépend de la soirée d'avant"
    ]
  },
  {
    id: 8,
    question: "Ton red flag en amitié ?",
    options: [
      "Les gens qui annulent tout le temps",
      "Les gens qui parlent que d'eux",
      "Les gens qui critiquent tout",
      "Les gens jamais contents"
    ]
  },
  {
    id: 9,
    question: "Tu préfères...",
    options: [
      "Un message vocal de 3 minutes",
      "Un pavé de texte",
      "Un appel direct",
      "3 emojis et c'est tout"
    ]
  },
  {
    id: 10,
    question: "Ta série comfort ?",
    options: [
      "Friends / How I Met Your Mother",
      "The Office / Brooklyn 99",
      "Grey's Anatomy / séries médicales",
      "Aucune, je regarde jamais 2 fois"
    ]
  }
]

// Mock data - amis disponibles
const mockFriends: Friend[] = [
  { id: '1', pseudo: 'Marie', avatar: '👩' },
  { id: '2', pseudo: 'Lucas', avatar: '😎' },
  { id: '3', pseudo: 'Sophie', avatar: '🧑‍🦰' },
  { id: '4', pseudo: 'Antoine', avatar: '🧔' },
  { id: '5', pseudo: 'Emma', avatar: '👩‍🦳' },
  { id: '6', pseudo: 'Thomas', avatar: '🧑' },
]

// Mock data - invitations en attente
const mockPendingInvitations = [
  { id: 'inv1', fromUser: { pseudo: 'Marie', avatar: '👩' }, sessionId: 'sess1' },
  { id: 'inv2', fromUser: { pseudo: 'Lucas', avatar: '😎' }, sessionId: 'sess2' },
]

// Mock results (pour demo)
const mockResults: FriendResult[] = [
  { friend: { id: '1', pseudo: 'Marie', avatar: '👩' }, score: 8, answers: [1, 2, 0, 0, 3, 1, 1, 0, 2, 0], comment: "Je suis sa meilleure pote quand même" },
  { friend: { id: '2', pseudo: 'Lucas', avatar: '😎' }, score: 6, answers: [0, 2, 1, 1, 0, 0, 2, 1, 3, 1], comment: "Pas mal pour un collègue !" },
  { friend: { id: '3', pseudo: 'Sophie', avatar: '🧑‍🦰' }, score: 4, answers: [2, 1, 0, 2, 1, 2, 0, 2, 0, 2], comment: "Oups... je croyais te connaître" },
]

export default function ManegePage() {
  const { user } = useUser()
  const [step, setStep] = useState<GameStep>('home')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [myAnswers, setMyAnswers] = useState<number[]>([])
  const [friendAnswers, setFriendAnswers] = useState<number[]>([])
  const [selectedFriends, setSelectedFriends] = useState<string[]>([])
  const [answeringFor, setAnsweringFor] = useState<typeof mockPendingInvitations[0] | null>(null)
  const [showResults, setShowResults] = useState(false)

  const userBilles = user.billes || 5

  const handleMyAnswer = (answerIndex: number) => {
    const newAnswers = [...myAnswers, answerIndex]
    setMyAnswers(newAnswers)

    if (currentQuestion < MANEGE_QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1)
      }, 300)
    } else {
      // Toutes les questions répondues, passer aux invitations
      setTimeout(() => {
        setStep('invite_friends')
        setCurrentQuestion(0)
      }, 500)
    }
  }

  const handleFriendAnswer = (answerIndex: number) => {
    const newAnswers = [...friendAnswers, answerIndex]
    setFriendAnswers(newAnswers)

    if (currentQuestion < MANEGE_QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1)
      }, 300)
    } else {
      // Terminé !
      setTimeout(() => {
        setShowResults(true)
      }, 500)
    }
  }

  const toggleFriendSelection = (friendId: string) => {
    if (selectedFriends.includes(friendId)) {
      setSelectedFriends(selectedFriends.filter(id => id !== friendId))
    } else {
      if (selectedFriends.length < userBilles) {
        setSelectedFriends([...selectedFriends, friendId])
      }
    }
  }

  const launchManege = () => {
    if (selectedFriends.length === 0) return
    // En vrai, on créerait la session Supabase ici
    alert(`Manège lancé ! ${selectedFriends.length} invitations envoyées (démo)`)
    setStep('waiting')
  }

  const startAnsweringForFriend = (invitation: typeof mockPendingInvitations[0]) => {
    setAnsweringFor(invitation)
    setFriendAnswers([])
    setCurrentQuestion(0)
    setStep('friend_answers')
  }

  const resetGame = () => {
    setStep('home')
    setCurrentQuestion(0)
    setMyAnswers([])
    setFriendAnswers([])
    setSelectedFriends([])
    setAnsweringFor(null)
    setShowResults(false)
  }

  // Calculer le score pour la démo
  const calculateScore = (answers: number[], correct: number[]) => {
    return answers.reduce((score, ans, idx) => ans === correct[idx] ? score + 1 : score, 0)
  }

  return (
    <div className="min-h-screen pb-20" style={{ background: 'linear-gradient(180deg, #1A0033 0%, #2D0A4E 50%, #1A0033 100%)' }}>
      <style jsx>{`
        .manege-icon {
          font-size: 5rem;
          animation: spin-slow 8s linear infinite;
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .option-btn {
          width: 100%;
          padding: 18px 20px;
          background: rgba(255, 255, 255, 0.03);
          border: 2px solid rgba(255, 255, 255, 0.15);
          border-radius: 16px;
          text-align: left;
          color: #fff;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
          margin-bottom: 12px;
        }

        .option-btn:hover {
          background: rgba(255, 0, 255, 0.1);
          border-color: #FF00FF;
          transform: translateX(8px);
        }

        .option-btn.selected {
          background: linear-gradient(135deg, #FF00FF 0%, #00FFFF 100%);
          border-color: transparent;
        }

        .friend-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s;
          margin-bottom: 12px;
        }

        .friend-card:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .friend-card.selected {
          border-color: #39FF14;
          background: rgba(57, 255, 20, 0.1);
        }

        .friend-avatar {
          font-size: 2rem;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 50%;
        }

        .checkbox {
          width: 24px;
          height: 24px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .checkbox.checked {
          background: #39FF14;
          border-color: #39FF14;
        }

        .progress-dots {
          display: flex;
          gap: 8px;
          justify-content: center;
          margin-bottom: 24px;
        }

        .progress-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          transition: all 0.3s;
        }

        .progress-dot.active {
          background: #FF00FF;
          box-shadow: 0 0 10px #FF00FF;
        }

        .progress-dot.completed {
          background: #39FF14;
        }

        .result-card {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 20px;
          padding: 20px;
          margin-bottom: 16px;
          border: 2px solid rgba(255, 255, 255, 0.1);
        }

        .result-card.gold {
          border-color: #FFD700;
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%);
        }

        .result-card.silver {
          border-color: #C0C0C0;
          background: linear-gradient(135deg, rgba(192, 192, 192, 0.1) 0%, rgba(192, 192, 192, 0.05) 100%);
        }

        .result-card.bronze {
          border-color: #CD7F32;
          background: linear-gradient(135deg, rgba(205, 127, 50, 0.1) 0%, rgba(205, 127, 50, 0.05) 100%);
        }

        .invitation-card {
          background: rgba(255, 255, 255, 0.03);
          border: 2px solid rgba(255, 0, 255, 0.3);
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .detail-question {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 12px;
        }

        .answer-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
          font-size: 0.9rem;
        }

        .answer-correct {
          color: #39FF14;
        }

        .answer-wrong {
          color: #FF3131;
        }

        .moment-card {
          background: rgba(255, 215, 0, 0.1);
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-radius: 16px;
          padding: 20px;
          margin-top: 24px;
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-40">
        <div className="h-1 bg-gradient-to-r from-[#FF00FF] via-[#FFD700] to-[#00FFFF]" />
        <div className="bg-[#1A0033]/95 backdrop-blur-sm px-4 py-4">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <Link href="/games" className="text-white/60 hover:text-white transition flex items-center gap-2">
              <span>←</span>
              <span>Retour</span>
            </Link>
            <h1 className="text-xl font-bold flex items-center gap-2" style={{ fontFamily: 'Bangers, cursive', color: '#FF00FF', textShadow: '0 0 15px #FF00FF' }}>
              <span className="text-2xl">🎠</span>
              Le Manège
            </h1>
            <div className="w-16" />
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>

        {/* ÉCRAN HOME */}
        {step === 'home' && (
          <div className="text-center">
            <div className="manege-icon mb-6">🎠</div>
            <h2 className="text-2xl font-bold text-white mb-2" style={{ textShadow: '0 0 15px #FF00FF' }}>
              LE MANÈGE
            </h2>
            <p className="text-[#00FFFF] font-bold mb-8" style={{ textShadow: '0 0 10px #00FFFF' }}>
              "Qui te connaît le mieux ?"
            </p>
            <p className="text-white/60 mb-8 max-w-md mx-auto">
              Monte sur le manège et découvre si tes potes te connaissent vraiment.
            </p>

            {/* Options principales */}
            <div className="space-y-4 mb-8">
              <button
                onClick={() => {
                  setMyAnswers([])
                  setCurrentQuestion(0)
                  setStep('my_answers')
                }}
                className="w-full py-5 px-6 rounded-2xl font-bold text-lg text-left flex items-center gap-4"
                style={{ background: 'linear-gradient(135deg, #FF00FF 0%, #9933FF 100%)', boxShadow: '0 0 30px rgba(255, 0, 255, 0.3)' }}
              >
                <span className="text-3xl">🎯</span>
                <div>
                  <div className="text-white">JE MONTE SUR LE MANÈGE</div>
                  <div className="text-white/70 text-sm font-normal">Mes potes répondent sur moi</div>
                </div>
              </button>

              <button
                className="w-full py-5 px-6 rounded-2xl font-bold text-lg text-left flex items-center gap-4"
                style={{ background: 'rgba(0, 255, 255, 0.1)', border: '3px solid #00FFFF' }}
                disabled={mockPendingInvitations.length === 0}
              >
                <span className="text-3xl">👥</span>
                <div>
                  <div className="text-[#00FFFF]">UN POTE M'A INVITÉ</div>
                  <div className="text-white/50 text-sm font-normal">Je réponds sur lui/elle</div>
                </div>
              </button>
            </div>

            {/* Invitations en attente */}
            {mockPendingInvitations.length > 0 && (
              <div>
                <h3 className="text-white/60 text-sm font-bold mb-3 text-left flex items-center gap-2">
                  <span>📬</span> INVITATIONS EN ATTENTE
                </h3>
                {mockPendingInvitations.map(inv => (
                  <div key={inv.id} className="invitation-card">
                    <span className="text-2xl">{inv.fromUser.avatar}</span>
                    <div className="flex-1">
                      <p className="text-white font-bold">{inv.fromUser.pseudo} veut savoir si tu la/le connais</p>
                    </div>
                    <button
                      onClick={() => startAnsweringForFriend(inv)}
                      className="px-4 py-2 rounded-lg font-bold text-sm"
                      style={{ background: '#FF00FF', color: '#fff' }}
                    >
                      Répondre
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ÉCRAN MES RÉPONSES */}
        {step === 'my_answers' && (
          <div>
            <div className="text-center mb-6">
              <p className="text-white/60 text-sm mb-1">🎠 TES VRAIES RÉPONSES</p>
              <p className="text-[#FF00FF] font-bold">Question {currentQuestion + 1}/{MANEGE_QUESTIONS.length}</p>
            </div>

            {/* Progress dots */}
            <div className="progress-dots">
              {MANEGE_QUESTIONS.map((_, idx) => (
                <div
                  key={idx}
                  className={`progress-dot ${idx === currentQuestion ? 'active' : ''} ${idx < currentQuestion ? 'completed' : ''}`}
                />
              ))}
            </div>

            <div className="p-4 rounded-xl mb-6 text-center" style={{ background: 'rgba(255, 0, 255, 0.1)', border: '2px dashed rgba(255, 0, 255, 0.3)' }}>
              <p className="text-white/70 text-sm">
                🤫 Réponds honnêtement. Personne ne verra tes réponses avant la fin du jeu.
              </p>
            </div>

            <h2 className="text-xl text-white font-bold text-center mb-6">
              {MANEGE_QUESTIONS[currentQuestion].question}
            </h2>

            <div className="space-y-3">
              {MANEGE_QUESTIONS[currentQuestion].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleMyAnswer(idx)}
                  className="option-btn"
                >
                  {option}
                </button>
              ))}
            </div>

            <button
              onClick={resetGame}
              className="w-full py-3 mt-6 text-white/50 hover:text-white transition"
            >
              ← Annuler
            </button>
          </div>
        )}

        {/* ÉCRAN INVITER AMIS */}
        {step === 'invite_friends' && (
          <div>
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🎠</div>
              <h2 className="text-xl text-white font-bold mb-2">QUI VA RÉPONDRE SUR TOI ?</h2>
              <p className="text-white/60 text-sm">
                Invite tes potes à deviner tes réponses.<br />
                Chaque invitation coûte <span className="text-[#00FFFF] font-bold">1 bille 🔵</span>
              </p>
            </div>

            {/* Liste des amis */}
            <div className="mb-6">
              {mockFriends.map(friend => (
                <div
                  key={friend.id}
                  className={`friend-card ${selectedFriends.includes(friend.id) ? 'selected' : ''}`}
                  onClick={() => toggleFriendSelection(friend.id)}
                >
                  <div className="friend-avatar">{friend.avatar}</div>
                  <div className="flex-1">
                    <p className="text-white font-bold">{friend.pseudo}</p>
                  </div>
                  <div className={`checkbox ${selectedFriends.includes(friend.id) ? 'checked' : ''}`}>
                    {selectedFriends.includes(friend.id) && <span className="text-[#1A0033]">✓</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Résumé coût */}
            <div className="p-4 rounded-xl mb-6" style={{ background: 'rgba(0, 255, 255, 0.1)', border: '2px solid rgba(0, 255, 255, 0.3)' }}>
              <div className="flex justify-between items-center">
                <span className="text-white/70">
                  💰 {selectedFriends.length} pote{selectedFriends.length > 1 ? 's' : ''} sélectionné{selectedFriends.length > 1 ? 's' : ''} = {selectedFriends.length} bille{selectedFriends.length > 1 ? 's' : ''}
                </span>
                <span className="text-[#00FFFF] font-bold">Tu as : {userBilles} 🔵</span>
              </div>
            </div>

            {/* Bouton lancer */}
            <button
              onClick={launchManege}
              disabled={selectedFriends.length === 0}
              className="w-full py-4 rounded-xl font-bold text-lg"
              style={{
                background: selectedFriends.length > 0 ? 'linear-gradient(135deg, #FF00FF 0%, #00FFFF 100%)' : 'rgba(255, 255, 255, 0.1)',
                color: selectedFriends.length > 0 ? '#fff' : 'rgba(255, 255, 255, 0.3)',
                cursor: selectedFriends.length > 0 ? 'pointer' : 'not-allowed',
                boxShadow: selectedFriends.length > 0 ? '0 0 30px rgba(255, 0, 255, 0.3)' : 'none',
              }}
            >
              🎠 LANCER LE MANÈGE
            </button>

            <button
              onClick={resetGame}
              className="w-full py-3 mt-3 text-white/50 hover:text-white transition"
            >
              ← Retour
            </button>
          </div>
        )}

        {/* ÉCRAN WAITING */}
        {step === 'waiting' && (
          <div className="text-center">
            <div className="manege-icon mb-6">🎠</div>
            <h2 className="text-2xl text-white font-bold mb-4">TON MANÈGE TOURNE !</h2>
            <p className="text-white/60 mb-8">
              En attente des réponses de tes potes...<br />
              Tu recevras une notification quand quelqu'un aura répondu.
            </p>

            <div className="p-4 rounded-xl mb-6" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '2px solid rgba(255, 255, 255, 0.1)' }}>
              <p className="text-white/60 text-sm mb-2">Invitations envoyées :</p>
              <div className="flex justify-center gap-2 flex-wrap">
                {selectedFriends.map(id => {
                  const friend = mockFriends.find(f => f.id === id)
                  return friend ? (
                    <span key={id} className="px-3 py-1 rounded-full text-sm" style={{ background: 'rgba(255, 0, 255, 0.2)', color: '#FF00FF' }}>
                      {friend.avatar} {friend.pseudo}
                    </span>
                  ) : null
                })}
              </div>
            </div>

            {/* Bouton demo pour voir les résultats */}
            <button
              onClick={() => setStep('results')}
              className="w-full py-4 rounded-xl font-bold text-lg mb-4"
              style={{ background: 'linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)', color: '#1A0033' }}
            >
              🎉 VOIR LES RÉSULTATS (démo)
            </button>

            <button
              onClick={resetGame}
              className="w-full py-3 text-white/50 hover:text-white transition"
            >
              ← Retour à l'accueil
            </button>
          </div>
        )}

        {/* ÉCRAN RÉPONDRE SUR UN POTE */}
        {step === 'friend_answers' && answeringFor && !showResults && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl text-white font-bold mb-2" style={{ fontFamily: 'Bangers, cursive', textShadow: '0 0 15px rgba(0, 255, 255, 0.5)' }}>
                SELON TOI,<br />
                <span style={{ color: '#00FFFF' }}>{answeringFor.fromUser.pseudo.toUpperCase()}</span> A <span style={{ color: '#FF00FF', fontSize: '1.6em', textShadow: '0 0 20px #FF00FF' }}>RÉPONDU</span> QUOI ?
              </h2>
              <p className="text-[#00FFFF] font-bold mt-4">Question {currentQuestion + 1}/{MANEGE_QUESTIONS.length}</p>
            </div>

            {/* Progress dots */}
            <div className="progress-dots">
              {MANEGE_QUESTIONS.map((_, idx) => (
                <div
                  key={idx}
                  className={`progress-dot ${idx === currentQuestion ? 'active' : ''} ${idx < currentQuestion ? 'completed' : ''}`}
                  style={{ background: idx === currentQuestion ? '#00FFFF' : idx < currentQuestion ? '#39FF14' : undefined }}
                />
              ))}
            </div>

            <h2 className="text-xl text-white font-bold text-center mb-6">
              {MANEGE_QUESTIONS[currentQuestion].question}
            </h2>

            <div className="space-y-3">
              {MANEGE_QUESTIONS[currentQuestion].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleFriendAnswer(idx)}
                  className="option-btn"
                >
                  {option}
                </button>
              ))}
            </div>

            <button
              onClick={resetGame}
              className="w-full py-3 mt-6 text-white/50 hover:text-white transition"
            >
              ← Annuler
            </button>
          </div>
        )}

        {/* ÉCRAN RÉSULTATS APRÈS AVOIR RÉPONDU SUR UN POTE */}
        {step === 'friend_answers' && showResults && answeringFor && (
          <div className="text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl text-white font-bold mb-2">TERMINÉ !</h2>
            <p className="text-white/60 mb-6">
              Tu as répondu aux questions sur {answeringFor.fromUser.pseudo}.<br />
              Les résultats seront visibles quand tout le monde aura répondu !
            </p>

            <div className="p-4 rounded-xl mb-6" style={{ background: 'rgba(57, 255, 20, 0.1)', border: '2px solid rgba(57, 255, 20, 0.3)' }}>
              <p className="text-[#39FF14] font-bold">
                ✓ Tes réponses ont été enregistrées
              </p>
            </div>

            <button
              onClick={resetGame}
              className="w-full py-4 rounded-xl font-bold text-lg"
              style={{ background: 'linear-gradient(135deg, #FF00FF 0%, #00FFFF 100%)' }}
            >
              🎠 RETOUR AU MANÈGE
            </button>
          </div>
        )}

        {/* ÉCRAN RÉSULTATS FINAUX */}
        {step === 'results' && (
          <div>
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🎠</div>
              <p className="text-white/60 text-sm">RÉSULTATS DU MANÈGE DE</p>
              <h2 className="text-2xl text-white font-bold" style={{ textShadow: '0 0 15px #FF00FF' }}>
                {user.pseudo || 'TOI'}
              </h2>
            </div>

            {/* Classement */}
            <div className="mb-8">
              <h3 className="text-[#FFD700] font-bold mb-4 flex items-center gap-2">
                <span>🏆</span> QUI TE CONNAÎT LE MIEUX ?
              </h3>

              {mockResults.map((result, idx) => {
                const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'
                const cardClass = idx === 0 ? 'gold' : idx === 1 ? 'silver' : 'bronze'
                return (
                  <div key={result.friend.id} className={`result-card ${cardClass}`}>
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{medal}</span>
                      <span className="text-2xl">{result.friend.avatar}</span>
                      <div className="flex-1">
                        <p className="text-white font-bold">{result.friend.pseudo}</p>
                        <p className="text-white/50 text-sm italic">"{result.comment}"</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold" style={{ color: idx === 0 ? '#FFD700' : idx === 1 ? '#C0C0C0' : '#CD7F32' }}>
                          {result.score}/10
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Détail des réponses */}
            <div className="mb-8">
              <h3 className="text-[#00FFFF] font-bold mb-4 flex items-center gap-2">
                <span>📊</span> DÉTAIL DES RÉPONSES
              </h3>

              {MANEGE_QUESTIONS.slice(0, 3).map((q, qIdx) => (
                <div key={q.id} className="detail-question">
                  <p className="text-white/60 text-sm">Q{qIdx + 1} : {q.question}</p>
                  <p className="text-[#39FF14] text-sm mt-1">
                    ✅ Ta réponse : "{q.options[myAnswers[qIdx] || 0]}"
                  </p>
                  {mockResults.map(result => (
                    <div key={result.friend.id} className={`answer-row ${result.answers[qIdx] === (myAnswers[qIdx] || 0) ? 'answer-correct' : 'answer-wrong'}`}>
                      <span>{result.answers[qIdx] === (myAnswers[qIdx] || 0) ? '✅' : '❌'}</span>
                      <span>{result.friend.pseudo} : {q.options[result.answers[qIdx]]}</span>
                    </div>
                  ))}
                </div>
              ))}

              <button className="text-[#00FFFF] text-sm font-bold mt-2">
                Voir toutes les réponses ↓
              </button>
            </div>

            {/* Moment gênant */}
            <div className="moment-card">
              <h4 className="text-[#FFD700] font-bold mb-2">😂 LE MOMENT GÊNANT</h4>
              <p className="text-white/70 text-sm mb-2">"{MANEGE_QUESTIONS[2].question}"</p>
              <p className="text-white mb-2">
                Ta vraie réponse : <span className="text-[#39FF14]">"{MANEGE_QUESTIONS[2].options[myAnswers[2] || 1]}"</span>
              </p>
              <p className="text-white/60 text-sm">
                Tout le monde a dit : "{MANEGE_QUESTIONS[2].options[0]}"
              </p>
              <div className="mt-3 p-3 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                <p className="text-white/70 text-sm">
                  💬 <strong>Lucas</strong> a commenté : "QUOI ?! Je pensais vraiment que c'était ça ! Ma vie est un mensonge."
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 mt-8">
              <button
                className="w-full py-4 rounded-xl font-bold text-lg"
                style={{ background: 'linear-gradient(135deg, #00FFFF 0%, #0099FF 100%)', color: '#1A0033' }}
              >
                📤 PARTAGER
              </button>
              <button
                onClick={resetGame}
                className="w-full py-4 rounded-xl font-bold text-lg"
                style={{ background: 'rgba(255, 0, 255, 0.15)', border: '2px solid #FF00FF', color: '#FF00FF' }}
              >
                🎠 REFAIRE UN MANÈGE
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
