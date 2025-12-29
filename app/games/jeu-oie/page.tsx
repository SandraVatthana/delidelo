'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ConfettiCelebration from '../../components/ConfettiCelebration'

// Types
interface GameCase {
  id: number
  type: 'normal' | 'oie' | 'pont' | 'hotel' | 'puits' | 'labyrinthe' | 'prison' | 'mort' | 'arrivee'
  category: string
  title: string
  content: string
  action?: string
  color: string
}

// Les 63 cases du Jeu de l'Oie Amoureux
const gameCases: GameCase[] = [
  // Depart
  { id: 0, type: 'normal', category: 'depart', title: 'Depart', content: 'Bienvenue dans le Jeu de l\'Oie Amoureux ! Lance le de pour commencer ton voyage vers une vie amoureuse epanouie.', color: '#39FF14' },

  // Cases 1-9 : Les bases de l'amour
  { id: 1, type: 'normal', category: 'bases', title: 'L\'amour de soi', content: 'Avant d\'aimer quelqu\'un, il faut s\'aimer soi-meme. Quelles sont 3 qualites que tu apprecies chez toi ?', action: 'Partage une qualite', color: '#FF00FF' },
  { id: 2, type: 'normal', category: 'bases', title: 'Les langages de l\'amour', content: 'Il existe 5 langages de l\'amour : mots valorisants, moments de qualite, cadeaux, services rendus, toucher. Quel est le tien ?', color: '#FF00FF' },
  { id: 3, type: 'normal', category: 'bases', title: 'L\'attachement securisant', content: 'Un attachement securisant permet de se sentir en confiance dans une relation. Tu peux compter sur l\'autre sans craindre l\'abandon.', color: '#FF00FF' },
  { id: 4, type: 'normal', category: 'bases', title: 'Communication non-violente', content: 'Observation + Sentiment + Besoin + Demande = la formule magique pour exprimer ses emotions sans blesser.', action: 'Reformule une critique', color: '#FF00FF' },
  { id: 5, type: 'oie', category: 'bases', title: 'L\'Oie de la Tendresse', content: 'Case Oie ! Tu doubles ton score. La tendresse est le ciment d\'une relation durable.', action: 'Avance encore', color: '#FFFF00' },
  { id: 6, type: 'normal', category: 'bases', title: 'Le respect mutuel', content: 'Le respect, c\'est accepter l\'autre tel qu\'il est, avec ses differences. C\'est la base de toute relation saine.', color: '#FF00FF' },
  { id: 7, type: 'normal', category: 'bases', title: 'L\'ecoute active', content: 'Ecouter vraiment, c\'est etre 100% present, sans preparer sa reponse. Repete ce que l\'autre dit avec tes mots.', action: 'Exercice d\'ecoute', color: '#FF00FF' },
  { id: 8, type: 'normal', category: 'bases', title: 'Les limites saines', content: 'Poser des limites n\'est pas egoiste, c\'est se respecter. "Non" est une phrase complete.', color: '#FF00FF' },
  { id: 9, type: 'oie', category: 'bases', title: 'L\'Oie du Consentement', content: 'Case Oie ! Le consentement est enthousiaste, informe, reversible, libre et specifique. TIREL !', action: 'Avance encore', color: '#FFFF00' },

  // Cases 10-20 : Dependance affective
  { id: 10, type: 'normal', category: 'dependance', title: 'Signes de dependance', content: 'Tu te sens incomplet(e) sans partenaire ? Tu as peur d\'etre seul(e) ? Ce sont des signes a surveiller.', color: '#00FFFF' },
  { id: 11, type: 'normal', category: 'dependance', title: 'Le vide interieur', content: 'Chercher a combler un vide avec l\'autre est un piege. Ce vide se remplit avec l\'amour de soi.', color: '#00FFFF' },
  { id: 12, type: 'pont', category: 'dependance', title: 'Le Pont de l\'Independance', content: 'Case Pont ! Tu sautes a la case 23 ! L\'independance emotionnelle est liberatrice.', action: 'Va case 23', color: '#FF6600' },
  { id: 13, type: 'normal', category: 'dependance', title: 'Jalousie excessive', content: 'La jalousie maladive revele une insecurite. Travaille sur ta confiance en toi plutot que controler l\'autre.', color: '#00FFFF' },
  { id: 14, type: 'oie', category: 'dependance', title: 'L\'Oie de la Liberte', content: 'Case Oie ! Etre libre ensemble, c\'est possible. La vraie relation n\'etouffe pas.', action: 'Avance encore', color: '#FFFF00' },
  { id: 15, type: 'normal', category: 'dependance', title: 'Les patterns repetitifs', content: 'Tu retombes toujours sur le meme type de partenaire toxique ? C\'est ton subconscient qui reproduit un schema familier.', color: '#00FFFF' },
  { id: 16, type: 'normal', category: 'dependance', title: 'Le besoin de validation', content: 'Chercher constamment l\'approbation de l\'autre te rend vulnerable. Ta valeur ne depend pas du regard exterieur.', color: '#00FFFF' },
  { id: 17, type: 'normal', category: 'dependance', title: 'L\'attachement anxieux', content: 'Peur de l\'abandon, besoin de reassurance constant... L\'attachement anxieux se guerit avec de la conscience et du travail.', color: '#00FFFF' },
  { id: 18, type: 'oie', category: 'dependance', title: 'L\'Oie de l\'Autonomie', content: 'Case Oie ! L\'autonomie emotionnelle, c\'est s\'epanouir seul(e) pour mieux s\'epanouir a deux.', action: 'Avance encore', color: '#FFFF00' },
  { id: 19, type: 'hotel', category: 'dependance', title: 'L\'Hotel de la Reflexion', content: 'Case Hotel ! Passe un tour pour reflechir a tes schemas relationnels. Prends le temps de l\'introspection.', action: 'Passe 1 tour', color: '#FF3131' },
  { id: 20, type: 'normal', category: 'dependance', title: 'Guerir ses blessures', content: 'La therapie, les livres, les podcasts... Il existe plein d\'outils pour guerir. Tu n\'es pas oblige(e) de le faire seul(e).', color: '#00FFFF' },

  // Cases 21-31 : Rencontres digitales
  { id: 21, type: 'normal', category: 'digital', title: 'Le profil authentique', content: 'Un bon profil dating reflete qui tu es vraiment. Evite les cliches et montre ta personnalite unique.', color: '#39FF14' },
  { id: 22, type: 'normal', category: 'digital', title: 'Les red flags en ligne', content: 'Profil vide, photos floues, refus d\'appel video, demandes d\'argent... Apprends a reperer les signaux d\'alarme.', color: '#39FF14' },
  { id: 23, type: 'oie', category: 'digital', title: 'L\'Oie du Matching', content: 'Case Oie ! Un bon match, c\'est quand les valeurs s\'alignent, pas juste l\'attirance physique.', action: 'Avance encore', color: '#FFFF00' },
  { id: 24, type: 'normal', category: 'digital', title: 'La conversation engageante', content: 'Pose des questions ouvertes, montre un interet sincere, evite les "salut ca va". Demarque-toi !', color: '#39FF14' },
  { id: 25, type: 'normal', category: 'digital', title: 'Du virtuel au reel', content: 'Ne reste pas trop longtemps en ligne. Propose un premier rendez-vous dans les 1-2 semaines pour verifier la compatibilite IRL.', color: '#39FF14' },
  { id: 26, type: 'normal', category: 'digital', title: 'Le premier date safe', content: 'Lieu public, previens un ami, aie ton propre transport. Ta securite passe avant tout.', color: '#39FF14' },
  { id: 27, type: 'oie', category: 'digital', title: 'L\'Oie de l\'Intuition', content: 'Case Oie ! Fais confiance a ton instinct. Si quelque chose te semble off, c\'est probablement le cas.', action: 'Avance encore', color: '#FFFF00' },
  { id: 28, type: 'puits', category: 'digital', title: 'Le Puits du Ghosting', content: 'Case Puits ! Tu es ghoste(e)... Attends qu\'un autre joueur te libere. Le ghosting, ca fait mal mais ca ne definit pas ta valeur.', action: 'Attends liberation', color: '#FF3131' },
  { id: 29, type: 'normal', category: 'digital', title: 'Les attentes realistes', content: 'Les applis ne sont pas des catalogues. Derriere chaque profil, il y a un humain avec ses imperfections.', color: '#39FF14' },
  { id: 30, type: 'normal', category: 'digital', title: 'La fatigue dating', content: 'Swiper a l\'infini peut etre epuisant. Fais des pauses, la personne ideale ne disparaitra pas.', color: '#39FF14' },
  { id: 31, type: 'labyrinthe', category: 'digital', title: 'Le Labyrinthe des Choix', content: 'Case Labyrinthe ! Retourne case 21. Trop de choix tue le choix. Parfois il faut revenir a l\'essentiel.', action: 'Retour case 21', color: '#FF3131' },

  // Cases 32-42 : Relations
  { id: 32, type: 'normal', category: 'relations', title: 'La phase lune de miel', content: 'Les premiers mois sont magiques mais temporaires. La vraie relation commence apres, quand l\'ivresse retombe.', color: '#FF00FF' },
  { id: 33, type: 'normal', category: 'relations', title: 'Les conflits sains', content: 'Un couple qui ne se dispute jamais n\'est pas sain. L\'important, c\'est COMMENT on se dispute.', color: '#FF00FF' },
  { id: 34, type: 'normal', category: 'relations', title: 'La charge mentale', content: 'Qui planifie les vacances, les repas, les anniversaires ? La charge mentale doit etre partagee equitablement.', color: '#FF00FF' },
  { id: 35, type: 'normal', category: 'relations', title: 'Les compromis', content: 'Faire des compromis n\'est pas se renier. C\'est construire ensemble en tenant compte de l\'autre.', color: '#FF00FF' },
  { id: 36, type: 'oie', category: 'relations', title: 'L\'Oie de la Complicite', content: 'Case Oie ! La complicite se cultive. Riez ensemble, creez des rituels, partagez des secrets.', action: 'Avance encore', color: '#FFFF00' },
  { id: 37, type: 'normal', category: 'relations', title: 'L\'intimite emotionnelle', content: 'L\'intimite va au-dela du physique. C\'est pouvoir etre vulnerable sans crainte du jugement.', color: '#FF00FF' },
  { id: 38, type: 'normal', category: 'relations', title: 'Le projet de vie commun', content: 'Enfants, mariage, lieu de vie... Ces sujets doivent etre abordes tot pour eviter les incompatibilites majeures.', color: '#FF00FF' },
  { id: 39, type: 'prison', category: 'relations', title: 'La Prison du Controle', content: 'Case Prison ! Tu as voulu controler l\'autre. Passe 3 tours en reflexion. Le controle n\'est jamais de l\'amour.', action: 'Passe 3 tours', color: '#FF3131' },
  { id: 40, type: 'normal', category: 'relations', title: 'La gratitude', content: 'Exprimer sa reconnaissance renforce le lien. Dis merci pour les petites choses du quotidien.', color: '#FF00FF' },
  { id: 41, type: 'normal', category: 'relations', title: 'La sexualite epanouie', content: 'Le desir fluctue, c\'est normal. La communication sur les envies et limites est cle.', color: '#FF00FF' },
  { id: 42, type: 'oie', category: 'relations', title: 'L\'Oie de la Croissance', content: 'Case Oie ! Un couple evolue. Grandissez ensemble, pas l\'un a cote de l\'autre.', action: 'Avance encore', color: '#FFFF00' },

  // Cases 43-53 : Developpement personnel
  { id: 43, type: 'normal', category: 'perso', title: 'Connais-toi toi-meme', content: 'Quelles sont tes valeurs ? Tes deal-breakers ? Tes besoins non-negociables ? Fais le point.', color: '#00FFFF' },
  { id: 44, type: 'normal', category: 'perso', title: 'La therapie', content: 'Consulter un psy n\'est pas un signe de faiblesse. C\'est un acte de courage et d\'amour envers soi.', color: '#00FFFF' },
  { id: 45, type: 'oie', category: 'perso', title: 'L\'Oie de la Resilience', content: 'Case Oie ! Chaque echec amoureux est une lecon. Tu deviens plus fort(e) a chaque experience.', action: 'Avance encore', color: '#FFFF00' },
  { id: 46, type: 'normal', category: 'perso', title: 'L\'estime de soi', content: 'Tu merites d\'etre aime(e) pour qui tu es. Si quelqu\'un te demande de changer, ce n\'est pas le bon.', color: '#00FFFF' },
  { id: 47, type: 'normal', category: 'perso', title: 'Les passions', content: 'Cultive tes passions independamment de ta vie amoureuse. Ca te rend plus interessant(e) et epanoui(e).', color: '#00FFFF' },
  { id: 48, type: 'normal', category: 'perso', title: 'Le cercle social', content: 'Tes amis et ta famille sont precieux. Ne les neglige pas pour une relation amoureuse.', color: '#00FFFF' },
  { id: 49, type: 'normal', category: 'perso', title: 'La solitude choisie', content: 'Etre seul(e) n\'est pas une punition. C\'est une opportunite de mieux se connaitre.', color: '#00FFFF' },
  { id: 50, type: 'mort', category: 'perso', title: 'La Mort de l\'Ego', content: 'Case Mort ! Retourne au depart. Parfois, il faut tout recommencer pour mieux repartir.', action: 'Retour depart', color: '#000000' },
  { id: 51, type: 'oie', category: 'perso', title: 'L\'Oie du Renouveau', content: 'Case Oie ! Chaque jour est une nouvelle chance. Le passe ne definit pas ton futur amoureux.', action: 'Avance encore', color: '#FFFF00' },
  { id: 52, type: 'normal', category: 'perso', title: 'La meditation', content: 'Prends 5 minutes par jour pour te recentrer. Ca reduit l\'anxiete et ameliore tes relations.', color: '#00FFFF' },
  { id: 53, type: 'normal', category: 'perso', title: 'Les affirmations', content: '"Je suis digne d\'amour", "Je merite le respect". Repete-les chaque matin.', color: '#00FFFF' },

  // Cases 54-62 : Culture de l'amour
  { id: 54, type: 'oie', category: 'culture', title: 'L\'Oie de la Sagesse', content: 'Case Oie ! L\'amour s\'apprend. Lis, ecoute des podcasts, informe-toi sur les relations saines.', action: 'Avance encore', color: '#FFFF00' },
  { id: 55, type: 'normal', category: 'culture', title: 'Les mythes de l\'amour', content: 'L\'ame soeur, le coup de foudre, le prince charmant... Deconstruis ces mythes qui sabotent tes relations.', color: '#FF6600' },
  { id: 56, type: 'normal', category: 'culture', title: 'Le polyamour', content: 'L\'amour exclusif n\'est pas la seule option. Certains vivent heureux en relation libre. A chacun sa verite.', color: '#FF6600' },
  { id: 57, type: 'normal', category: 'culture', title: 'La diversite amoureuse', content: 'Hetero, homo, bi, pan, ace... Toutes les orientations sont valides. L\'amour est universel.', color: '#FF6600' },
  { id: 58, type: 'normal', category: 'culture', title: 'Les relations a distance', content: 'L\'amour a distance peut fonctionner avec de la communication, de la confiance et un projet de retrouvailles.', color: '#FF6600' },
  { id: 59, type: 'normal', category: 'culture', title: 'L\'amour apres 40 ans', content: 'Trouver l\'amour n\'a pas d\'age. Certains rencontrent l\'amour de leur vie a 50, 60, 70 ans...', color: '#FF6600' },
  { id: 60, type: 'oie', category: 'culture', title: 'L\'Oie de l\'Espoir', content: 'Case Oie ! L\'espoir est permis. La bonne personne existe. Continue d\'y croire.', action: 'Avance encore', color: '#FFFF00' },
  { id: 61, type: 'normal', category: 'culture', title: 'La rupture saine', content: 'Parfois, se separer est le plus beau cadeau. Une rupture respectueuse permet de guerir.', color: '#FF6600' },
  { id: 62, type: 'normal', category: 'culture', title: 'Le deuil amoureux', content: 'Le temps guerit. Autorise-toi a pleurer, puis a renaitre. La vie continue.', color: '#FF6600' },

  // Case 63 : Arrivee
  { id: 63, type: 'arrivee', category: 'arrivee', title: 'L\'Amour Epanoui', content: 'BRAVO ! Tu as termine le parcours ! Tu as toutes les cles pour vivre une vie amoureuse epanouie. L\'amour, c\'est aussi un jeu d\'apprentissage permanent !', color: '#39FF14' },
]

// Categories avec couleurs
const categoryColors: Record<string, { bg: string, text: string, glow: string }> = {
  depart: { bg: '#39FF14', text: '#1A0033', glow: '#39FF14' },
  bases: { bg: '#FF00FF', text: 'white', glow: '#FF00FF' },
  dependance: { bg: '#00FFFF', text: '#1A0033', glow: '#00FFFF' },
  digital: { bg: '#39FF14', text: '#1A0033', glow: '#39FF14' },
  relations: { bg: '#FF00FF', text: 'white', glow: '#FF00FF' },
  perso: { bg: '#00FFFF', text: '#1A0033', glow: '#00FFFF' },
  culture: { bg: '#FF6600', text: 'white', glow: '#FF6600' },
  arrivee: { bg: '#FFFF00', text: '#1A0033', glow: '#FFFF00' },
}

// Les faces du de avec emojis
const deFaces = ['', '\u2680', '\u2681', '\u2682', '\u2683', '\u2684', '\u2685']

export default function JeuOiePage() {
  const [position, setPosition] = useState(0)
  const [diceValue, setDiceValue] = useState(0)
  const [isRolling, setIsRolling] = useState(false)
  const [currentCase, setCurrentCase] = useState<GameCase | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [turnsToWait, setTurnsToWait] = useState(0)
  const [waitingForRescue, setWaitingForRescue] = useState(false)
  const [history, setHistory] = useState<number[]>([0])
  const [showRules, setShowRules] = useState(false)

  // Lancer le de
  const rollDice = () => {
    if (isRolling || turnsToWait > 0 || waitingForRescue || gameWon) return

    setIsRolling(true)

    // Animation du de
    let count = 0
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1)
      count++
      if (count >= 15) {
        clearInterval(interval)
        const finalValue = Math.floor(Math.random() * 6) + 1
        setDiceValue(finalValue)

        setTimeout(() => {
          movePlayer(finalValue)
          setIsRolling(false)
        }, 500)
      }
    }, 100)
  }

  // Deplacer le joueur
  const movePlayer = (steps: number) => {
    let newPosition = position + steps

    // Si on depasse 63, on rebondit
    if (newPosition > 63) {
      newPosition = 63 - (newPosition - 63)
    }

    setPosition(newPosition)
    setHistory(prev => [...prev, newPosition])

    // Afficher la case
    const caseInfo = gameCases.find(c => c.id === newPosition)
    if (caseInfo) {
      setCurrentCase(caseInfo)
      setShowModal(true)

      // Gerer les effets speciaux
      handleSpecialCase(caseInfo)
    }
  }

  // Gerer les cases speciales
  const handleSpecialCase = (caseInfo: GameCase) => {
    switch (caseInfo.type) {
      case 'oie':
        // Double le mouvement
        setTimeout(() => {
          setShowModal(false)
          movePlayer(diceValue)
        }, 2000)
        break
      case 'pont':
        // Saute a la case 23
        setTimeout(() => {
          setPosition(23)
          setHistory(prev => [...prev, 23])
          setShowModal(false)
        }, 2000)
        break
      case 'hotel':
        // Passe 1 tour
        setTurnsToWait(1)
        break
      case 'puits':
        // Attend liberation
        setWaitingForRescue(true)
        break
      case 'labyrinthe':
        // Retour case 21
        setTimeout(() => {
          setPosition(21)
          setHistory(prev => [...prev, 21])
          setShowModal(false)
        }, 2000)
        break
      case 'prison':
        // Passe 3 tours
        setTurnsToWait(3)
        break
      case 'mort':
        // Retour au depart
        setTimeout(() => {
          setPosition(0)
          setHistory([0])
          setShowModal(false)
        }, 2000)
        break
      case 'arrivee':
        setGameWon(true)
        break
    }
  }

  // Fermer le modal et decompter les tours
  const closeModal = () => {
    setShowModal(false)
    if (turnsToWait > 0) {
      setTurnsToWait(prev => prev - 1)
    }
  }

  // Liberer du puits (pour le mode multijoueur futur)
  const rescueFromWell = () => {
    setWaitingForRescue(false)
    setShowModal(false)
  }

  // Nouvelle partie
  const resetGame = () => {
    setPosition(0)
    setDiceValue(0)
    setGameWon(false)
    setTurnsToWait(0)
    setWaitingForRescue(false)
    setHistory([0])
    setShowModal(false)
  }

  return (
    <div className="min-h-screen pb-8">
      {/* Background Pattern */}
      <div className="bg-pattern" />

      <style jsx>{`
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
          color: #39FF14;
          border-color: #39FF14;
          background: rgba(57, 255, 20, 0.2);
          text-shadow: 0 0 10px #39FF14;
          box-shadow: 0 0 15px rgba(57, 255, 20, 0.3);
        }
        .top-nav-item .nav-emoji {
          font-size: 1.1rem;
        }
        @media (min-width: 768px) {
          .top-nav {
            gap: 10px;
            padding-bottom: 10px;
          }
          .top-nav-item {
            padding: 12px 18px;
            font-size: 0.9rem;
            gap: 8px;
          }
          .top-nav-item .nav-emoji {
            font-size: 1.2rem;
          }
        }
        .dice-3d {
          perspective: 300px;
        }
        .dice-face {
          transform-style: preserve-3d;
          transition: transform 0.1s;
        }
        .dice-rolling {
          animation: diceRoll 0.1s infinite;
        }
        @keyframes diceRoll {
          0% { transform: rotateX(0deg) rotateY(0deg); }
          25% { transform: rotateX(90deg) rotateY(45deg); }
          50% { transform: rotateX(180deg) rotateY(90deg); }
          75% { transform: rotateX(270deg) rotateY(135deg); }
          100% { transform: rotateX(360deg) rotateY(180deg); }
        }
        .game-case {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.8rem;
          border-radius: 8px;
          transition: all 0.3s;
          cursor: pointer;
        }
        .game-case:hover {
          transform: scale(1.1);
          z-index: 10;
        }
        .game-case.current {
          animation: pulse 1s infinite;
          box-shadow: 0 0 20px currentColor;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .player-token {
          position: absolute;
          width: 30px;
          height: 30px;
          font-size: 1.5rem;
          animation: bounce 0.5s infinite alternate;
          z-index: 20;
          pointer-events: none;
        }
        @keyframes bounce {
          from { transform: translateY(0); }
          to { transform: translateY(-5px); }
        }
      `}</style>

      <ConfettiCelebration trigger={gameWon} />

      {/* Header avec navigation */}
      <header className="sticky top-0 z-40">
        <div className="h-1 bg-gradient-to-r from-[#FF00FF] via-[#00FFFF] to-[#39FF14]" />
        <div className="bg-[#1A0033]/95 backdrop-blur-sm px-4 py-3">
          {/* Ligne 1: Logo + Notifications */}
          <div className="max-w-5xl mx-auto flex items-center justify-between mb-3">
            <Link href="/" className="logo-90s text-xl">
              <span className="animate-spin inline-block text-lg">🎠</span>
              GameCrush
            </Link>

            <button className="relative p-2 text-white/60 hover:text-[#FFFF00] transition">
              <span className="text-2xl">🔔</span>
            </button>
          </div>

          {/* Ligne 2: Navigation */}
          <nav className="max-w-5xl mx-auto">
            <div className="top-nav">
              <Link href="/dashboard" className="top-nav-item">
                <span className="nav-emoji">🏠</span>
                Accueil
              </Link>
              <Link href="/games/jeu-oie" className="top-nav-item active">
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
              <Link href="/profile" className="top-nav-item">
                <span className="nav-emoji">👤</span>
                Profil
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="px-4 py-5 max-w-2xl mx-auto">
        {/* Titre */}
        <div className="text-center mb-6">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ fontFamily: 'Bangers, cursive', color: '#39FF14', textShadow: '0 0 15px #39FF14, 3px 3px 0 #FF00FF' }}
          >
            🎲 Le Jeu de l'Oie Amoureux
          </h1>
          <p className="text-[#00FFFF] text-sm">
            63 cases pour apprendre l'amour en s'amusant !
          </p>
        </div>

        {/* Zone de jeu */}
        <div className="card-90s p-6 mb-6" style={{ borderColor: '#39FF14', boxShadow: '0 0 20px #39FF1430' }}>
          {/* Stats */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-center">
              <div className="text-xs text-white/50">Position</div>
              <div className="text-2xl font-bold text-[#39FF14]">{position}/63</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-white/50">Dernier de</div>
              <div className="text-4xl">{deFaces[diceValue] || '🎲'}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-white/50">Coups</div>
              <div className="text-2xl font-bold text-[#FF00FF]">{history.length - 1}</div>
            </div>
          </div>

          {/* De et bouton */}
          <div className="text-center mb-6">
            <button
              onClick={rollDice}
              disabled={isRolling || turnsToWait > 0 || waitingForRescue || gameWon}
              className={`
                dice-3d inline-block p-6 rounded-2xl transition-all
                ${isRolling ? 'dice-rolling' : ''}
                ${(turnsToWait > 0 || waitingForRescue || gameWon) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 cursor-pointer'}
              `}
              style={{
                background: 'linear-gradient(135deg, #330066, #1A0033)',
                border: '4px solid #FFFF00',
                boxShadow: isRolling ? '0 0 30px #FFFF00' : '0 0 15px #FFFF0050'
              }}
            >
              <span className="text-6xl block">{isRolling ? deFaces[diceValue] || '🎲' : deFaces[diceValue] || '🎲'}</span>
            </button>

            <p className="text-white/60 text-sm mt-3">
              {gameWon ? '🎉 Partie terminee !' :
               turnsToWait > 0 ? `\u23f3 Attends encore ${turnsToWait} tour(s)` :
               waitingForRescue ? '🕳️ Tu es dans le puits ! (Clique pour continuer)' :
               isRolling ? 'Le de roule...' : 'Clique pour lancer le de !'}
            </p>

            {waitingForRescue && (
              <button
                onClick={rescueFromWell}
                className="mt-3 px-4 py-2 bg-[#00FFFF] text-[#1A0033] font-bold rounded-lg hover:scale-105 transition"
              >
                Sortir du puits
              </button>
            )}
          </div>

          {/* Plateau simplifie (cases en ligne) */}
          <div className="mb-6">
            <div className="text-xs text-white/40 mb-2 text-center">Ton parcours</div>
            <div className="flex flex-wrap justify-center gap-1">
              {[0, 10, 20, 30, 40, 50, 60, 63].map(milestone => {
                const caseInfo = gameCases.find(c => c.id === milestone)
                const isCurrentArea = position >= milestone && position < (milestone === 60 ? 64 : milestone + 10)
                return (
                  <div
                    key={milestone}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      position === milestone ? 'ring-2 ring-white animate-pulse' : ''
                    } ${isCurrentArea ? 'opacity-100 scale-110' : 'opacity-50'}`}
                    style={{
                      background: caseInfo ? categoryColors[caseInfo.category]?.bg : '#330066',
                      color: caseInfo ? categoryColors[caseInfo.category]?.text : 'white',
                      boxShadow: isCurrentArea ? `0 0 10px ${caseInfo?.color}` : 'none'
                    }}
                  >
                    {milestone === 0 ? '🏁' : milestone === 63 ? '🏆' : milestone}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Legende des categories */}
          <div className="text-xs text-center space-y-1">
            <div className="flex flex-wrap justify-center gap-2">
              <span style={{ color: '#FF00FF' }}>💕 Bases (1-9)</span>
              <span style={{ color: '#00FFFF' }}>🔗 Dependance (10-20)</span>
              <span style={{ color: '#39FF14' }}>📱 Digital (21-31)</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <span style={{ color: '#FF00FF' }}>💑 Relations (32-42)</span>
              <span style={{ color: '#00FFFF' }}>🌱 Perso (43-53)</span>
              <span style={{ color: '#FF6600' }}>📚 Culture (54-62)</span>
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-3 justify-center mb-6">
          <button
            onClick={() => setShowRules(true)}
            className="px-4 py-2 bg-[#330066] border-2 border-[#00FFFF] text-[#00FFFF] font-bold rounded-lg hover:bg-[#00FFFF] hover:text-[#1A0033] transition"
          >
            📜 Regles
          </button>
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-[#330066] border-2 border-[#FF00FF] text-[#FF00FF] font-bold rounded-lg hover:bg-[#FF00FF] hover:text-[#1A0033] transition"
          >
            🔄 Recommencer
          </button>
        </div>

        {/* Historique */}
        <div className="card-90s p-4" style={{ borderColor: '#FF00FF30' }}>
          <h3 className="text-sm text-white/50 mb-2">Historique des cases visitees</h3>
          <div className="flex flex-wrap gap-1">
            {history.slice(-20).map((pos, idx) => {
              const caseInfo = gameCases.find(c => c.id === pos)
              return (
                <span
                  key={idx}
                  className="px-2 py-1 rounded text-xs font-bold"
                  style={{
                    background: caseInfo ? categoryColors[caseInfo.category]?.bg + '40' : '#33006640',
                    color: caseInfo?.color || '#fff',
                  }}
                >
                  {pos}
                </span>
              )
            })}
          </div>
        </div>
      </main>

      {/* Modal case */}
      {showModal && currentCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div
            className="bg-[#1A0033] border-4 rounded-2xl max-w-md w-full p-6 relative"
            style={{
              borderColor: currentCase.color,
              boxShadow: `0 0 30px ${currentCase.color}50`
            }}
          >
            {/* Numero de case */}
            <div
              className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full font-bold"
              style={{ background: currentCase.color, color: '#1A0033' }}
            >
              Case {currentCase.id}
            </div>

            {/* Type de case special */}
            {currentCase.type !== 'normal' && (
              <div className="text-center text-4xl mb-4">
                {currentCase.type === 'oie' && '🪿'}
                {currentCase.type === 'pont' && '🌉'}
                {currentCase.type === 'hotel' && '🏨'}
                {currentCase.type === 'puits' && '🕳️'}
                {currentCase.type === 'labyrinthe' && '🌀'}
                {currentCase.type === 'prison' && '⛓️'}
                {currentCase.type === 'mort' && '💀'}
                {currentCase.type === 'arrivee' && '🏆'}
              </div>
            )}

            {/* Titre */}
            <h2
              className="text-xl font-bold text-center mb-4"
              style={{ color: currentCase.color, textShadow: `0 0 10px ${currentCase.color}` }}
            >
              {currentCase.title}
            </h2>

            {/* Contenu */}
            <p className="text-white/90 text-center mb-4 leading-relaxed">
              {currentCase.content}
            </p>

            {/* Action */}
            {currentCase.action && (
              <div
                className="text-center py-2 px-4 rounded-lg mb-4 font-bold"
                style={{ background: currentCase.color + '30', color: currentCase.color }}
              >
                \u26a1 {currentCase.action}
              </div>
            )}

            {/* Bouton fermer */}
            <button
              onClick={closeModal}
              className="w-full py-3 font-bold rounded-lg transition hover:scale-105"
              style={{
                background: currentCase.color,
                color: '#1A0033'
              }}
            >
              {gameWon ? '🎉 Voir mes resultats !' : 'Continuer'}
            </button>
          </div>
        </div>
      )}

      {/* Modal regles */}
      {showRules && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-[#1A0033] border-4 border-[#FFFF00] rounded-2xl max-w-md w-full p-6 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-[#FFFF00] text-center mb-4">
              📜 Regles du Jeu de l'Oie Amoureux
            </h2>

            <div className="space-y-3 text-white/80 text-sm">
              <p>🎯 <strong>But :</strong> Atteindre la case 63 pour gagner !</p>

              <p>🎲 <strong>De :</strong> Lance le de et avance du nombre de cases indique.</p>

              <div>
                <p className="font-bold text-[#FFFF00] mb-1">Cases speciales :</p>
                <ul className="space-y-1 ml-4">
                  <li>🪿 <strong>Oie :</strong> Relance le de et avance encore !</li>
                  <li>🌉 <strong>Pont :</strong> Saute directement a la case 23</li>
                  <li>🏨 <strong>Hotel :</strong> Passe 1 tour</li>
                  <li>🕳️ <strong>Puits :</strong> Bloque jusqu'a liberation</li>
                  <li>🌀 <strong>Labyrinthe :</strong> Retourne case 21</li>
                  <li>⛓️ <strong>Prison :</strong> Passe 3 tours</li>
                  <li>💀 <strong>Mort :</strong> Retourne au depart</li>
                </ul>
              </div>

              <p>📚 <strong>Apprentissage :</strong> Chaque case contient un conseil sur l'amour et les relations !</p>

              <p>🏆 <strong>Victoire :</strong> Tu dois tomber exactement sur 63. Si tu depasses, tu rebondis !</p>
            </div>

            <button
              onClick={() => setShowRules(false)}
              className="w-full mt-6 py-3 bg-[#FFFF00] text-[#1A0033] font-bold rounded-lg hover:scale-105 transition"
            >
              C'est compris !
            </button>
          </div>
        </div>
      )}

      {/* Ecran de victoire */}
      {gameWon && !showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
          <div className="bg-[#1A0033] border-4 border-[#39FF14] rounded-2xl max-w-md w-full p-8 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h2
              className="text-2xl font-bold mb-4"
              style={{ color: '#39FF14', textShadow: '0 0 20px #39FF14' }}
            >
              FELICITATIONS !
            </h2>
            <p className="text-white/80 mb-6">
              Tu as parcouru les 63 cases du Jeu de l'Oie Amoureux ! Tu possedes maintenant toutes les cles pour vivre une vie amoureuse epanouie.
            </p>

            <div className="bg-[#330066] p-4 rounded-lg mb-6">
              <div className="text-sm text-white/50 mb-2">Tes stats</div>
              <div className="flex justify-around">
                <div>
                  <div className="text-2xl font-bold text-[#FF00FF]">{history.length - 1}</div>
                  <div className="text-xs text-white/50">coups</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#00FFFF]">{history.filter((v, i, a) => a.indexOf(v) === i).length}</div>
                  <div className="text-xs text-white/50">cases visitees</div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={resetGame}
                className="flex-1 py-3 bg-[#FF00FF] text-white font-bold rounded-lg hover:scale-105 transition"
              >
                🔄 Rejouer
              </button>
              <Link
                href="/games"
                className="flex-1 py-3 bg-[#39FF14] text-[#1A0033] font-bold rounded-lg hover:scale-105 transition text-center"
              >
                🎮 Autres jeux
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
