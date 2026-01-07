'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { moderateText } from '@/hooks/useBDModeration'

// Types
type GameStep = 'accueil' | 'question' | 'resultat' | 'profil'

interface Question {
  id: number
  indice: string
  reponse: string
  emoji: string
  difficulte: 'facile' | 'moyen' | 'difficile'
}

interface PlayerAnswer {
  pseudo: string
  reponse: string
  isCorrect: boolean
}

interface GameState {
  currentQuestion: number
  answers: { questionId: number; answer: string; isCorrect: boolean }[]
  score: number
}

// Liste des 20 questions
const questions: Question[] = [
  // Bonbons classiques
  { id: 1, indice: "Je suis marron, je deviens gluant quand tu me mâches, et j'ai une blague nulle à l'intérieur", reponse: "Carambar", emoji: "🟫", difficulte: 'facile' },
  { id: 2, indice: "Je suis rose, je colle aux dents et je perds mon goût en 30 secondes", reponse: "Malabar", emoji: "🍬", difficulte: 'facile' },
  { id: 3, indice: "Je suis long, noir, et tu me déroules lentement pour me savourer", reponse: "Rouleau de réglisse", emoji: "➰", difficulte: 'moyen' },
  { id: 4, indice: "Tu me lèches et je change de couleur", reponse: "Sucette Chupa Chups", emoji: "🍭", difficulte: 'moyen' },
  { id: 5, indice: "Je suis dur dehors, tout mou dedans, et je fonds dans ta bouche", reponse: "Chamallow chocolat", emoji: "☁️", difficulte: 'moyen' },
  { id: 6, indice: "Je ressemble à un œuf, je suis surprise, et les enfants m'adorent", reponse: "Kinder Surprise", emoji: "🥚", difficulte: 'facile' },
  { id: 7, indice: "Je suis rouge, en forme de lacet, et tu m'aspires comme un spaghetti", reponse: "Fraise Tagada Lace", emoji: "🍓", difficulte: 'moyen' },
  { id: 8, indice: "Je suis petit, jaune, et je pique la langue", reponse: "Têtes brûlées", emoji: "💥", difficulte: 'facile' },
  { id: 9, indice: "Je suis blanc, je craque sous la dent, et dedans c'est que du chocolat", reponse: "Galak / Crunch", emoji: "🍫", difficulte: 'facile' },
  { id: 10, indice: "Tu me trempes dans ton café et je deviens tout mou", reponse: "Speculoos", emoji: "🍪", difficulte: 'facile' },
  // Bonbons avancés (nostalgie 90s/2000s)
  { id: 11, indice: "Je suis une poudre qui pétille et qui fait peur aux parents", reponse: "Pop Rocks / Peta Zetas", emoji: "✨", difficulte: 'moyen' },
  { id: 12, indice: "Je ressemble à un hamburger mais je suis sucré", reponse: "Bonbon Trolli Burger", emoji: "🍔", difficulte: 'moyen' },
  { id: 13, indice: "Tu dois me dérouler comme un mètre, je suis acide et multicolore", reponse: "Mètre ruban acidulé", emoji: "📏", difficulte: 'difficile' },
  { id: 14, indice: "Je suis une boule, je change de couleur, et tu mets 1h à me finir", reponse: "Jawbreaker / Mammouth", emoji: "🔵", difficulte: 'difficile' },
  { id: 15, indice: "Je suis vert, gélatineux, et j'ai la forme d'un amphibien", reponse: "Crocodile Haribo", emoji: "🐊", difficulte: 'facile' },
  // Souvenirs régressifs
  { id: 16, indice: "Tu me lances contre le mur et je reviens", reponse: "Balle rebondissante", emoji: "🔴", difficulte: 'facile' },
  { id: 17, indice: "Tu me colles sur ton doigt et tu fais des bulles", reponse: "Pâte à prout / Slime", emoji: "🟢", difficulte: 'moyen' },
  { id: 18, indice: "Je suis petit, en verre, et tu me lances pour toucher les autres", reponse: "Bille", emoji: "🔵", difficulte: 'facile' },
  { id: 19, indice: "Tu me fais tourner sur ton doigt et je reste en équilibre", reponse: "Toupie", emoji: "🌀", difficulte: 'facile' },
  { id: 20, indice: "Tu me plies, tu souffles dedans, et PAF !", reponse: "Pétard en papier", emoji: "💨", difficulte: 'moyen' },
]

// Fausses réponses des "autres joueurs" pour le fun
const fakeAnswers: { [key: number]: PlayerAnswer[] } = {
  1: [
    { pseudo: "Lucas", reponse: "Mon oncle bourré à Noël", isCorrect: false },
    { pseudo: "Marie", reponse: "Un Carambar !", isCorrect: true },
    { pseudo: "Antoine", reponse: "La conversation de mon date Tinder", isCorrect: false },
  ],
  2: [
    { pseudo: "Emma", reponse: "Mon ex qui promet de changer", isCorrect: false },
    { pseudo: "Hugo", reponse: "Malabar", isCorrect: true },
    { pseudo: "Léa", reponse: "Ma motivation le lundi", isCorrect: false },
  ],
  3: [
    { pseudo: "Lucas", reponse: "Mon ex qui explique pourquoi c'est pas lui le problème", isCorrect: false },
    { pseudo: "Marie", reponse: "Le générique de fin de Games of Thrones", isCorrect: false },
    { pseudo: "Thomas", reponse: "Réglisse", isCorrect: true },
  ],
  4: [
    { pseudo: "Camille", reponse: "Mon humeur selon la météo", isCorrect: false },
    { pseudo: "Nathan", reponse: "Une Chupa Chups !", isCorrect: true },
    { pseudo: "Julie", reponse: "La vérité selon mon ex", isCorrect: false },
  ],
  5: [
    { pseudo: "Alex", reponse: "Moi quand je fais semblant d'être fort", isCorrect: false },
    { pseudo: "Sarah", reponse: "Chamallow enrobé", isCorrect: true },
    { pseudo: "Maxime", reponse: "Mon cœur de pierre (lol)", isCorrect: false },
  ],
  6: [
    { pseudo: "Emma", reponse: "Mon compte en banque", isCorrect: false },
    { pseudo: "Lucas", reponse: "Kinder Surprise !", isCorrect: true },
    { pseudo: "Clara", reponse: "Ma vie amoureuse (spoiler: la surprise c'est qu'il y a rien)", isCorrect: false },
  ],
  7: [
    { pseudo: "Hugo", reponse: "Mon chat à 3h du mat avec un élastique", isCorrect: false },
    { pseudo: "Léa", reponse: "Fraise Tagada lacet", isCorrect: true },
    { pseudo: "Tom", reponse: "Les spaghettis bolognaise de ma coloc", isCorrect: false },
  ],
  8: [
    { pseudo: "Julie", reponse: "Mon patron quand je demande une augmentation", isCorrect: false },
    { pseudo: "Nathan", reponse: "Têtes brûlées", isCorrect: true },
    { pseudo: "Marie", reponse: "La vérité qui fait mal", isCorrect: false },
  ],
  9: [
    { pseudo: "Thomas", reponse: "Ma personnalité: craquante dehors, fondante dedans", isCorrect: false },
    { pseudo: "Camille", reponse: "Galak !", isCorrect: true },
    { pseudo: "Alex", reponse: "Les promesses de mon ex", isCorrect: false },
  ],
  10: [
    { pseudo: "Sarah", reponse: "Moi après 3 verres", isCorrect: false },
    { pseudo: "Maxime", reponse: "Speculoos", isCorrect: true },
    { pseudo: "Emma", reponse: "Mes résolutions du 1er janvier", isCorrect: false },
  ],
  11: [
    { pseudo: "Clara", reponse: "Les nouvelles que mon ex m'envoie", isCorrect: false },
    { pseudo: "Hugo", reponse: "Pop Rocks !", isCorrect: true },
    { pseudo: "Lucas", reponse: "Mon avenir professionnel", isCorrect: false },
  ],
  12: [
    { pseudo: "Léa", reponse: "La street food qui ment sur son contenu", isCorrect: false },
    { pseudo: "Tom", reponse: "Bonbon burger Trolli", isCorrect: true },
    { pseudo: "Julie", reponse: "Mon régime qui commence lundi", isCorrect: false },
  ],
  13: [
    { pseudo: "Nathan", reponse: "L'explication de mon mec pour justifier son retard", isCorrect: false },
    { pseudo: "Marie", reponse: "Le mètre ruban acidulé !", isCorrect: true },
    { pseudo: "Thomas", reponse: "Mon fils de 7 ans avec un mètre", isCorrect: false },
  ],
  14: [
    { pseudo: "Camille", reponse: "Mes problèmes existentiels", isCorrect: false },
    { pseudo: "Alex", reponse: "Un Mammouth / Jawbreaker", isCorrect: true },
    { pseudo: "Sarah", reponse: "Mon abonnement Netflix qui finit jamais", isCorrect: false },
  ],
  15: [
    { pseudo: "Maxime", reponse: "Mon coloc dans son bain", isCorrect: false },
    { pseudo: "Emma", reponse: "Crocodile Haribo", isCorrect: true },
    { pseudo: "Clara", reponse: "Mon ex (amphibien = à sang froid, logique)", isCorrect: false },
  ],
  16: [
    { pseudo: "Hugo", reponse: "Mon karma", isCorrect: false },
    { pseudo: "Léa", reponse: "Balle rebondissante", isCorrect: true },
    { pseudo: "Lucas", reponse: "Les messages de mon ex après chaque cuite", isCorrect: false },
  ],
  17: [
    { pseudo: "Tom", reponse: "Mon nez quand je suis malade", isCorrect: false },
    { pseudo: "Julie", reponse: "Du slime / pâte à prout", isCorrect: true },
    { pseudo: "Nathan", reponse: "Les conversations profondes à 3h du mat", isCorrect: false },
  ],
  18: [
    { pseudo: "Marie", reponse: "Une bille !", isCorrect: true },
    { pseudo: "Thomas", reponse: "Mon œil de verre (nan je déconne)", isCorrect: false },
    { pseudo: "Camille", reponse: "Les indirects sur Instagram", isCorrect: false },
  ],
  19: [
    { pseudo: "Alex", reponse: "Ma vie professionnelle", isCorrect: false },
    { pseudo: "Sarah", reponse: "Une toupie", isCorrect: true },
    { pseudo: "Maxime", reponse: "Mon cerveau après un Red Bull", isCorrect: false },
  ],
  20: [
    { pseudo: "Emma", reponse: "Mon couple", isCorrect: false },
    { pseudo: "Clara", reponse: "Pétard en papier !", isCorrect: true },
    { pseudo: "Hugo", reponse: "La bulle immobilière", isCorrect: false },
  ],
}

// Types d'humour
const humorStyles = [
  { id: 'absurde', name: 'ABSURDE ASSUMÉ', description: "Tu vois des blagues là où personne n'en cherche. C'est un don.", emoji: '🤪' },
  { id: 'reference', name: 'RÉFÉRENCEUR FOU', description: "Tu cites, tu compares, tu fais des parallèles improbables. Wikipedia te craint.", emoji: '🎬' },
  { id: 'naif', name: 'FAUSSEMENT NAÏF', description: "Tu fais l'innocent mais on sait tous que t'as compris le sous-entendu.", emoji: '😇' },
  { id: 'coquin', name: 'SUBTILEMENT COQUIN', description: "Tu glisses des sous-entendus avec la grâce d'un chat. Bravo.", emoji: '😏' },
  { id: 'sarcastique', name: 'SARCASTIQUE PRO', description: "Ton cynisme est un art. Bienvenue au club.", emoji: '🙄' },
]

// Bonbons totems
const bonbonTotems = [
  { id: 'carambar', name: 'Carambar', description: "Drôle, un peu collant, et toujours une blague nulle à raconter", emoji: '🟫' },
  { id: 'malabar', name: 'Malabar', description: "Intense au début, puis tu te calmes. Mais on t'oublie pas.", emoji: '🍬' },
  { id: 'reglisse', name: 'Réglisse', description: "On t'aime ou on te déteste. Pas de demi-mesure avec toi.", emoji: '➰' },
  { id: 'chamallow', name: 'Chamallow', description: "Tout doux dehors, tout doux dedans. Un vrai câlin ambulant.", emoji: '☁️' },
  { id: 'tetebrulee', name: 'Têtes brûlées', description: "Tu piques, tu surprends, tu réveilles. On s'ennuie jamais avec toi.", emoji: '💥' },
  { id: 'kinder', name: 'Kinder Surprise', description: "Plein de surprises cachées. On sait jamais ce qu'on va découvrir.", emoji: '🥚' },
]

// Mots interdits pour la modération
const MOTS_INTERDITS = [
  "bite", "couilles", "nichons", "teub", "chatte", "cul",
  "baiser", "niquer", "sucer", "branler",
  "pute", "salope", "pd", "tapette", "negro", "bougnoule",
]

const MOTS_A_CENSURER = ["merde", "putain", "bordel", "con", "connard", "connasse"]

export default function BonbonGamePage() {
  const router = useRouter()
  const [step, setStep] = useState<GameStep>('accueil')
  const [gameState, setGameState] = useState<GameState>({
    currentQuestion: 0,
    answers: [],
    score: 0,
  })
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([])
  const [showModerationPopup, setShowModerationPopup] = useState(false)
  const [moderationMessage, setModerationMessage] = useState('')

  // Profil stats
  const [profilStats, setProfilStats] = useState({
    creativite: 0,
    sousEntendus: 0,
    nostalgie: 0,
    wtf: 0,
  })

  // Sélectionner 10 questions aléatoires au début
  useEffect(() => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5)
    setSelectedQuestions(shuffled.slice(0, 10))
  }, [])

  // Modération de la réponse
  const moderateAnswer = (text: string): { isBlocked: boolean; isCensored: boolean; cleanText: string } => {
    const lowerText = text.toLowerCase()

    // Check mots interdits
    for (const mot of MOTS_INTERDITS) {
      if (lowerText.includes(mot)) {
        return { isBlocked: true, isCensored: false, cleanText: text }
      }
    }

    // Check mots à censurer
    let cleanText = text
    let isCensored = false
    for (const mot of MOTS_A_CENSURER) {
      if (lowerText.includes(mot)) {
        isCensored = true
        const regex = new RegExp(mot, 'gi')
        cleanText = cleanText.replace(regex, mot[0] + '***')
      }
    }

    return { isBlocked: false, isCensored, cleanText }
  }

  const handleSubmitAnswer = () => {
    if (!currentAnswer.trim()) return

    const modResult = moderateAnswer(currentAnswer)

    if (modResult.isBlocked) {
      setModerationMessage("Ta réponse contient des mots qu'on peut pas afficher ici. On est sur une cour de récré, pas sur Pornhub. 😅")
      setShowModerationPopup(true)
      return
    }

    const currentQ = selectedQuestions[gameState.currentQuestion]
    const isCorrect = currentAnswer.toLowerCase().includes(currentQ.reponse.toLowerCase().split(' ')[0].toLowerCase()) ||
                      currentQ.reponse.toLowerCase().includes(currentAnswer.toLowerCase())

    setGameState(prev => ({
      ...prev,
      answers: [...prev.answers, {
        questionId: currentQ.id,
        answer: modResult.cleanText,
        isCorrect
      }],
      score: isCorrect ? prev.score + 1 : prev.score,
    }))

    setShowResult(true)
  }

  const handleNextQuestion = () => {
    setShowResult(false)
    setCurrentAnswer('')

    if (gameState.currentQuestion >= 9) {
      // Calculer les stats du profil
      const answers = gameState.answers
      const creativite = Math.min(100, Math.round((answers.filter(a => !a.isCorrect).length / 10) * 100 + Math.random() * 20))
      const sousEntendus = Math.round(Math.random() * 40 + 50)
      const nostalgie = Math.round(Math.random() * 30 + 40)
      const wtf = Math.round(Math.random() * 40 + 30)

      setProfilStats({ creativite, sousEntendus, nostalgie, wtf })
      setStep('profil')
    } else {
      setGameState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
      }))
    }
  }

  const getHumorStyle = () => {
    // Basé sur les stats, déterminer le style d'humour
    if (profilStats.sousEntendus > 70) return humorStyles.find(h => h.id === 'coquin')!
    if (profilStats.wtf > 60) return humorStyles.find(h => h.id === 'absurde')!
    if (profilStats.nostalgie > 60) return humorStyles.find(h => h.id === 'reference')!
    if (profilStats.creativite > 70) return humorStyles.find(h => h.id === 'sarcastique')!
    return humorStyles.find(h => h.id === 'naif')!
  }

  const getBonbonTotem = () => {
    // Basé sur les stats, déterminer le bonbon totem
    if (profilStats.sousEntendus > 70) return bonbonTotems.find(b => b.id === 'reglisse')!
    if (profilStats.wtf > 60) return bonbonTotems.find(b => b.id === 'tetebrulee')!
    if (profilStats.creativite > 70) return bonbonTotems.find(b => b.id === 'kinder')!
    if (profilStats.nostalgie > 50) return bonbonTotems.find(b => b.id === 'carambar')!
    return bonbonTotems.find(b => b.id === 'chamallow')!
  }

  // Écran d'accueil
  if (step === 'accueil') {
    return (
      <div
        className="min-h-screen w-full flex flex-col justify-center items-center p-4"
        style={{
          background: 'var(--purple-dark)',
          margin: 0,
        }}
      >
        {/* Bouton retour en position absolue */}
        <Link
          href="/games"
          className="absolute top-6 left-6 inline-flex items-center gap-2 text-[var(--neon-blue)] hover:text-[var(--neon-pink)] transition"
        >
          ← Retour aux jeux
        </Link>

        {/* Conteneur principal centré */}
        <div
          className="w-[90vw] max-w-[500px] min-h-[70vh] flex flex-col justify-center items-center text-center py-8"
        >
          <div className="text-8xl mb-8 animate-bounce">🍬</div>

          <h1 className="text-5xl font-bangers text-[var(--neon-pink)] mb-3" style={{ textShadow: '0 0 20px var(--neon-pink)' }}>
            C'EST QUOI CE BONBON ?
          </h1>

          <p className="text-[var(--neon-yellow)] text-xl mb-4 font-bold">
            Je sens que ça va partir en 🍭
          </p>

          <p className="text-[var(--neon-blue)] text-lg mb-10 italic">
            "Le jeu où ta réponse en dit long sur toi"
          </p>

          <div className="flex justify-center gap-6 text-5xl mb-10">
            🍭 🍫 🍬 🍪 🧁
          </div>

          <div className="w-full bg-[var(--purple-mid)] border-2 border-[var(--neon-pink)] p-8 mb-10" style={{ boxShadow: '0 0 20px rgba(255,0,255,0.3)' }}>
            <p className="text-white text-xl mb-5">
              <strong>10 indices mystérieux</strong>
            </p>
            <p className="text-white text-xl mb-5">
              Des bonbons de ton enfance
            </p>
            <p className="text-white text-xl">
              Et des réponses... <span className="text-[var(--neon-yellow)]">créatives</span>
            </p>
          </div>

          <button
            onClick={() => setStep('question')}
            className="w-full py-5 px-8 text-2xl font-bangers tracking-wider text-white transition-all duration-300 hover:scale-105"
            style={{
              background: 'var(--neon-pink)',
              boxShadow: '0 0 30px var(--neon-pink)',
              clipPath: 'polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)',
            }}
          >
            🍬 JOUER
          </button>

          <p className="mt-8 text-[var(--neon-green)] text-base italic">
            💡 Les meilleures réponses sont rarement les bonnes réponses.
          </p>
        </div>
      </div>
    )
  }

  // Écran de question
  if (step === 'question' && !showResult) {
    const currentQ = selectedQuestions[gameState.currentQuestion]
    if (!currentQ) return null

    return (
      <div
        className="min-h-screen w-full flex flex-col justify-center items-center p-4"
        style={{ background: 'var(--purple-dark)', margin: 0 }}
      >
        {/* Header en position absolue */}
        <div className="absolute top-8 left-8 right-8 flex justify-between items-center">
          <Link href="/games" className="text-[var(--neon-blue)] hover:text-[var(--neon-pink)] transition text-lg">
            ← Quitter
          </Link>
          <div className="text-[var(--neon-yellow)] font-bangers text-2xl">
            🍬 QUESTION {gameState.currentQuestion + 1}/10
          </div>
        </div>

        <div className="w-[90vw] max-w-[500px] flex flex-col justify-center items-center py-8">
          {/* Indice */}
          <div className="w-full bg-[var(--purple-mid)] border-3 border-[var(--neon-blue)] p-8 mb-8" style={{ boxShadow: '0 0 20px rgba(0,255,255,0.3)' }}>
            <p className="text-[var(--neon-blue)] font-bold mb-4 uppercase tracking-wider text-lg">Indice :</p>
            <p className="text-white text-2xl italic leading-relaxed">
              "{currentQ.indice}"
            </p>
          </div>

          {/* Input réponse */}
          <div className="w-full mb-8">
            <label className="block text-[var(--neon-green)] font-bold mb-3 uppercase tracking-wider text-lg">
              Ta réponse :
            </label>
            <input
              type="text"
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmitAnswer()}
              placeholder="Tape ta réponse..."
              className="w-full p-5 text-xl bg-[var(--purple-mid)] border-2 border-[var(--neon-pink)] text-white placeholder-gray-500 focus:outline-none focus:border-[var(--neon-yellow)]"
              style={{ boxShadow: 'inset 0 0 10px rgba(255,0,255,0.2)' }}
              autoFocus
            />
          </div>

          <p className="text-center text-[var(--neon-green)] text-base mb-8 italic">
            💡 Sois créatif ! Y'a pas de mauvaise réponse.
          </p>

          <button
            onClick={handleSubmitAnswer}
            disabled={!currentAnswer.trim()}
            className="w-full py-5 text-2xl font-bangers tracking-wider text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            style={{
              background: currentAnswer.trim() ? 'var(--neon-green)' : 'gray',
              boxShadow: currentAnswer.trim() ? '0 0 20px var(--neon-green)' : 'none',
            }}
          >
            VALIDER
          </button>
        </div>

        {/* Popup modération */}
        {showModerationPopup && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--purple-mid)] border-3 border-[var(--neon-red)] p-6 max-w-md" style={{ boxShadow: '0 0 30px rgba(255,49,49,0.5)' }}>
              <h3 className="text-2xl font-bangers text-[var(--neon-red)] mb-4">🚫 OUPS !</h3>
              <p className="text-white mb-6">{moderationMessage}</p>
              <button
                onClick={() => {
                  setShowModerationPopup(false)
                  setCurrentAnswer('')
                }}
                className="w-full py-3 bg-[var(--neon-blue)] text-white font-bold"
              >
                MODIFIER MA RÉPONSE
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Écran de résultat (après chaque question)
  if (step === 'question' && showResult) {
    const currentQ = selectedQuestions[gameState.currentQuestion]
    const lastAnswer = gameState.answers[gameState.answers.length - 1]
    const otherAnswers = fakeAnswers[currentQ.id] || []

    return (
      <div
        className="min-h-screen w-full flex flex-col justify-center items-center p-4"
        style={{ background: 'var(--purple-dark)', margin: 0 }}
      >
        <div className="w-[90vw] max-w-[500px] flex flex-col justify-center items-center py-8">
          <h2 className="text-3xl font-bangers text-[var(--neon-yellow)] text-center mb-8">
            🍬 RÉSULTAT
          </h2>

          {/* Indice rappel */}
          <div className="w-full bg-[var(--purple-mid)] border-2 border-[var(--neon-blue)] p-5 mb-5">
            <p className="text-[var(--neon-blue)] text-base mb-2 font-bold">INDICE :</p>
            <p className="text-white italic text-lg">"{currentQ.indice}"</p>
          </div>

          {/* Ta réponse */}
          <div className="w-full bg-[var(--purple-mid)] border-2 border-[var(--neon-pink)] p-5 mb-5">
            <p className="text-[var(--neon-pink)] text-base mb-2 font-bold">TA RÉPONSE :</p>
            <p className="text-white text-xl">"{lastAnswer.answer}"</p>
          </div>

          {/* Vraie réponse */}
          <div className="w-full bg-[var(--purple-mid)] border-2 border-[var(--neon-green)] p-5 mb-8">
            <p className="text-[var(--neon-green)] text-base mb-2 font-bold">LA VRAIE RÉPONSE :</p>
            <p className="text-white text-2xl flex items-center gap-3">
              <span className="text-3xl">{currentQ.emoji}</span>
              {currentQ.reponse}
              {lastAnswer.isCorrect && <span className="text-[var(--neon-green)]">✅</span>}
            </p>
          </div>

          {/* Réponses des autres */}
          <div className="w-full bg-[var(--purple-mid)] border-2 border-[var(--neon-yellow)] p-5 mb-8">
            <p className="text-[var(--neon-yellow)] text-base mb-4 font-bold">😂 RÉPONSES DES AUTRES JOUEURS :</p>
            <ul className="space-y-3">
              {otherAnswers.map((answer, idx) => (
                <li key={idx} className="text-white text-base">
                  • "{answer.reponse}" {answer.isCorrect && '✅'} <span className="text-gray-400">- @{answer.pseudo}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={handleNextQuestion}
            className="w-full py-5 text-2xl font-bangers tracking-wider text-white transition-all duration-300 hover:scale-105"
            style={{
              background: 'var(--neon-pink)',
              boxShadow: '0 0 20px var(--neon-pink)',
            }}
          >
            {gameState.currentQuestion >= 9 ? 'VOIR MON PROFIL →' : 'QUESTION SUIVANTE →'}
          </button>
        </div>
      </div>
    )
  }

  // Écran profil bonbon final
  if (step === 'profil') {
    const humorStyle = getHumorStyle()
    const bonbonTotem = getBonbonTotem()

    return (
      <div
        className="min-h-screen w-full flex flex-col justify-center items-center p-4 py-12"
        style={{ background: 'var(--purple-dark)', margin: 0 }}
      >
        <div className="w-[90vw] max-w-[500px] flex flex-col justify-center items-center">
          <h1 className="text-4xl font-bangers text-[var(--neon-pink)] text-center mb-4" style={{ textShadow: '0 0 20px var(--neon-pink)' }}>
            🍬 TON PROFIL BONBON
          </h1>

          {/* Score */}
          <div className="text-center mb-8">
            <p className="text-white text-2xl">
              SCORE : <span className="text-[var(--neon-yellow)] font-bold">{gameState.score}/10</span> bonnes réponses
            </p>
            <p className="text-[var(--neon-blue)] text-base italic mt-2">
              (Mais c'est pas le but du jeu 😉)
            </p>
          </div>

          {/* Style d'humour */}
          <div className="w-full bg-[var(--purple-mid)] border-3 border-[var(--neon-yellow)] p-6 mb-6" style={{ boxShadow: '0 0 20px rgba(255,255,0,0.3)' }}>
            <p className="text-[var(--neon-yellow)] text-sm mb-2">🎭 TON STYLE D'HUMOUR</p>
            <h2 className="text-2xl font-bangers text-white mb-2 flex items-center gap-2">
              <span className="text-3xl">{humorStyle.emoji}</span>
              {humorStyle.name}
            </h2>
            <p className="text-gray-300 italic">{humorStyle.description}</p>
          </div>

          {/* Stats */}
          <div className="w-full bg-[var(--purple-mid)] border-2 border-[var(--neon-blue)] p-4 mb-6">
            <p className="text-[var(--neon-blue)] text-sm mb-4">📊 TES STATS</p>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white">Créativité</span>
                  <span className="text-[var(--neon-green)]">{profilStats.creativite}%</span>
                </div>
                <div className="h-3 bg-gray-700 rounded">
                  <div className="h-full bg-[var(--neon-green)] rounded" style={{ width: `${profilStats.creativite}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white">Niveau sous-entendus 😏</span>
                  <span className="text-[var(--neon-pink)]">{profilStats.sousEntendus}%</span>
                </div>
                <div className="h-3 bg-gray-700 rounded">
                  <div className="h-full bg-[var(--neon-pink)] rounded" style={{ width: `${profilStats.sousEntendus}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white">Nostalgie 90s</span>
                  <span className="text-[var(--neon-yellow)]">{profilStats.nostalgie}%</span>
                </div>
                <div className="h-3 bg-gray-700 rounded">
                  <div className="h-full bg-[var(--neon-yellow)] rounded" style={{ width: `${profilStats.nostalgie}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white">Réponses WTF</span>
                  <span className="text-[var(--neon-orange)]">{profilStats.wtf}%</span>
                </div>
                <div className="h-3 bg-gray-700 rounded">
                  <div className="h-full bg-[var(--neon-orange)] rounded" style={{ width: `${profilStats.wtf}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Bonbon totem */}
          <div className="w-full bg-[var(--purple-mid)] border-3 border-[var(--neon-pink)] p-6 mb-6" style={{ boxShadow: '0 0 20px rgba(255,0,255,0.3)' }}>
            <p className="text-[var(--neon-pink)] text-sm mb-2">🍬 TON BONBON TOTEM</p>
            <h2 className="text-3xl font-bangers text-white mb-2 flex items-center gap-3">
              <span className="text-4xl">{bonbonTotem.emoji}</span>
              {bonbonTotem.name}
            </h2>
            <p className="text-gray-300 italic">"{bonbonTotem.description}"</p>
          </div>

          {/* Afficher sur profil */}
          <div className="w-full bg-[var(--purple-mid)] border-2 border-[var(--neon-green)] p-4 mb-6">
            <p className="text-[var(--neon-green)] text-sm mb-3">📱 AFFICHER SUR MON PROFIL ?</p>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-white cursor-pointer">
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-[var(--neon-pink)]" />
                Mon style d'humour
              </label>
              <label className="flex items-center gap-2 text-white cursor-pointer">
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-[var(--neon-pink)]" />
                Mon bonbon totem
              </label>
              <label className="flex items-center gap-2 text-white cursor-pointer">
                <input type="checkbox" className="w-5 h-5 accent-[var(--neon-pink)]" />
                Mes stats détaillées
              </label>
              <label className="flex items-center gap-2 text-white cursor-pointer">
                <input type="checkbox" className="w-5 h-5 accent-[var(--neon-pink)]" />
                Ma meilleure réponse
              </label>
            </div>
          </div>

          {/* Boutons */}
          <div className="w-full space-y-3">
            <button
              onClick={() => {
                // TODO: Sauvegarder le profil
                router.push('/games')
              }}
              className="w-full py-4 text-xl font-bangers tracking-wider text-white transition-all duration-300 hover:scale-105"
              style={{
                background: 'var(--neon-green)',
                boxShadow: '0 0 20px var(--neon-green)',
              }}
            >
              SAUVEGARDER
            </button>

            <button
              onClick={() => {
                setStep('accueil')
                setGameState({ currentQuestion: 0, answers: [], score: 0 })
                setSelectedQuestions([...questions].sort(() => Math.random() - 0.5).slice(0, 10))
              }}
              className="w-full py-3 border-2 border-[var(--neon-blue)] text-[var(--neon-blue)] font-bold hover:bg-[var(--neon-blue)] hover:text-[var(--purple-dark)] transition"
            >
              🔄 REJOUER
            </button>

            <Link
              href="/games"
              className="block w-full py-3 text-center text-[var(--neon-pink)] hover:underline"
            >
              ← Retour aux jeux
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return null
}
