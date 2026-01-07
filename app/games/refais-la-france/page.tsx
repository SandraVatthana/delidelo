'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Types
type GameStep = 'intro' | 'budget' | 'result' | 'comparison'
type ProfileType =
  | 'general_baguette'
  | 'utopiste_bisounours'
  | 'liberal_decomplexe'
  | 'medecin_malgre_lui'
  | 'fromager_national'
  | 'equilibriste_prudent'
  | 'mecene_incompris'
  | 'sheriff_republique'
  | 'colibri_enrage'
  | 'anarchiste_joyeux'

interface Category {
  id: string
  icon: string
  name: string
  description: string
  isAbsurd?: boolean
}

interface Profile {
  id: ProfileType
  icon: string
  name: string
  description: string
  crushIdeal: string
  ennemiNaturel: string
  color: string
}

// Catégories de budget
const categories: Category[] = [
  // Sérieuses
  { id: 'sante', icon: '🏥', name: 'Santé', description: 'Pour que les urgences soient moins longues que Game of Thrones' },
  { id: 'education', icon: '🎓', name: 'Éducation', description: 'Former les futurs génies (ou au moins des gens qui savent compter)' },
  { id: 'securite', icon: '🚔', name: 'Sécurité', description: 'Police, pompiers, et gens qui courent après les méchants' },
  { id: 'ecologie', icon: '🌍', name: 'Écologie', description: 'Sauver la planète, une subvention à la fois' },
  { id: 'culture', icon: '🎭', name: 'Culture', description: 'Musées, théâtres, et trucs que personne va voir mais qu\'on finance quand même' },
  { id: 'economie', icon: '💼', name: 'Économie', description: 'Faire plaisir aux entreprises en espérant qu\'elles embauchent' },
  { id: 'social', icon: '🤝', name: 'Social', description: 'Aider ceux qui galèrent (donc à peu près tout le monde)' },
  { id: 'defense', icon: '🎖️', name: 'Défense', description: 'Au cas où on voudrait envahir la Belgique' },
  { id: 'transport', icon: '🚄', name: 'Transport', description: 'Pour que le TGV arrive à l\'heure (ha ha ha)' },
  { id: 'justice', icon: '⚖️', name: 'Justice', description: 'Mettre les méchants en prison et libérer les innocents (dans cet ordre)' },
  // Absurdes
  { id: 'fromage', icon: '🧀', name: 'Subvention au fromage', description: 'Le camembert ne va pas se protéger tout seul', isAbsurd: true },
  { id: 'baguette', icon: '🥖', name: 'Recherche baguette parfaite', description: 'Une priorité nationale évidente', isAbsurd: true },
  { id: 'coqs', icon: '🐓', name: 'Coqs officiels en mairie', description: 'Parce que le symbole de la France mérite un salaire', isAbsurd: true },
  { id: 'apero', icon: '🍷', name: 'Apéro national', description: 'Financer les pastis de la République', isAbsurd: true },
  { id: 'beret', icon: '🎨', name: 'Protection du béret', description: 'Patrimoine en voie de disparition', isAbsurd: true },
]

// Profils politiques
const profiles: Profile[] = [
  {
    id: 'general_baguette',
    icon: '🎖️',
    name: 'Le Général Baguette',
    description: 'Tu mets tout dans la défense et le patrimoine. Tu serais pote avec De Gaulle.',
    crushIdeal: 'Quelqu\'un qui connaît les paroles de la Marseillaise.',
    ennemiNaturel: 'L\'Utopiste Bisounours',
    color: '#FFD700',
  },
  {
    id: 'utopiste_bisounours',
    icon: '🌸',
    name: 'L\'Utopiste Bisounours',
    description: 'Tu veux sauver le monde mais t\'as oublié de payer les flics. Bonne chance.',
    crushIdeal: 'Quelqu\'un qui trie ses déchets ET qui fait des câlins.',
    ennemiNaturel: 'Le Libéral Décomplexé',
    color: '#FF69B4',
  },
  {
    id: 'liberal_decomplexe',
    icon: '💰',
    name: 'Le Libéral Décomplexé',
    description: 'Moins d\'État, plus de fromage. Thatcher aurait validé.',
    crushIdeal: 'Quelqu\'un qui a lu "Atlas Shrugged" (ou fait semblant).',
    ennemiNaturel: 'L\'Utopiste Bisounours',
    color: '#00FF00',
  },
  {
    id: 'medecin_malgre_lui',
    icon: '🏥',
    name: 'Le Médecin Malgré Lui',
    description: 'Tu veux soigner tout le monde et éduquer les enfants. C\'est beau. C\'est cher. T\'as plus de thunes.',
    crushIdeal: 'Quelqu\'un qui a son carnet de vaccination à jour.',
    ennemiNaturel: 'Celui qui met 0 en santé',
    color: '#FF6B6B',
  },
  {
    id: 'fromager_national',
    icon: '🧀',
    name: 'Le Fromager National',
    description: 'Tu as mis plus de 15 milliards dans le fromage et la baguette. On ne sait pas si c\'est du génie ou de la folie. Probablement les deux.',
    crushIdeal: 'Quelqu\'un qui comprend tes priorités.',
    ennemiNaturel: 'Les intolérants au lactose',
    color: '#FFA500',
  },
  {
    id: 'equilibriste_prudent',
    icon: '⚖️',
    name: 'L\'Équilibriste Prudent',
    description: 'Tu as tout mis à parts égales. C\'est... raisonnable. Ennuyeux, mais raisonnable.',
    crushIdeal: 'Quelqu\'un d\'aussi indécis que toi.',
    ennemiNaturel: 'Les gens qui ont des convictions',
    color: '#808080',
  },
  {
    id: 'mecene_incompris',
    icon: '🎭',
    name: 'Le Mécène Incompris',
    description: 'Tu finances les musées, le théâtre, l\'opéra. Personne n\'ira, mais au moins c\'est beau.',
    crushIdeal: 'Quelqu\'un qui fait semblant d\'aimer l\'art contemporain.',
    ennemiNaturel: 'Les gens qui regardent la télé',
    color: '#9B59B6',
  },
  {
    id: 'sheriff_republique',
    icon: '🚔',
    name: 'Le Shérif de la République',
    description: 'Law and order, baby. Tu veux des flics partout et des juges qui travaillent.',
    crushIdeal: 'Quelqu\'un qui traverse au feu vert.',
    ennemiNaturel: 'Celui qui a mis 0 en sécurité',
    color: '#3498DB',
  },
  {
    id: 'colibri_enrage',
    icon: '🌍',
    name: 'Le Colibri Enragé',
    description: 'Tu as tout mis dans l\'écologie. La planète te remercie. Les profs, moins.',
    crushIdeal: 'Quelqu\'un qui composte.',
    ennemiNaturel: 'Total Energies (et ton voisin qui prend l\'avion)',
    color: '#2ECC71',
  },
  {
    id: 'anarchiste_joyeux',
    icon: '🎪',
    name: 'L\'Anarchiste Joyeux',
    description: 'Tu as mis 0 en sécurité, 0 en santé, et 50 milliards dans les coqs. On respecte le chaos.',
    crushIdeal: 'Quelqu\'un d\'aussi fou que toi.',
    ennemiNaturel: 'La logique',
    color: '#E74C3C',
  },
]

// Fonction de calcul du profil
const getProfile = (budget: Record<string, number>): ProfileType => {
  // Calcul des priorités (top 3)
  const priorities = Object.entries(budget)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([key]) => key)

  // Total catégories absurdes
  const absurdTotal = (budget.fromage || 0) + (budget.baguette || 0) +
                      (budget.coqs || 0) + (budget.apero || 0) + (budget.beret || 0)

  // Le Fromager National
  if (absurdTotal >= 15) {
    return 'fromager_national'
  }

  // L'Anarchiste Joyeux
  const zeros = Object.values(budget).filter(v => v === 0).length
  if (zeros >= 5 || absurdTotal >= 50) {
    return 'anarchiste_joyeux'
  }

  // L'Équilibriste Prudent
  const values = Object.values(budget).filter(v => v > 0)
  if (values.length >= 8) {
    const avg = values.reduce((a, b) => a + b, 0) / values.length
    const isBalanced = values.every(v => Math.abs(v - avg) < 5)
    if (isBalanced) {
      return 'equilibriste_prudent'
    }
  }

  // Profils par priorités
  if (priorities.includes('defense') && priorities.includes('securite')) {
    return 'general_baguette'
  }

  if (priorities.includes('ecologie') && budget.ecologie >= 30) {
    return 'colibri_enrage'
  }

  if (priorities.includes('ecologie') && priorities.includes('social')) {
    return 'utopiste_bisounours'
  }

  if (priorities.includes('economie') && (budget.social || 0) < 10) {
    return 'liberal_decomplexe'
  }

  if (priorities.includes('sante') && priorities.includes('education')) {
    return 'medecin_malgre_lui'
  }

  if (priorities.includes('securite') && priorities.includes('justice')) {
    return 'sheriff_republique'
  }

  if ((budget.culture || 0) >= 25) {
    return 'mecene_incompris'
  }

  // Default
  return 'equilibriste_prudent'
}

export default function RefaisLaFrancePage() {
  const router = useRouter()
  const [step, setStep] = useState<GameStep>('intro')
  const [budget, setBudget] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {}
    categories.forEach(cat => {
      initial[cat.id] = 0
    })
    return initial
  })
  const [showAllCategories, setShowAllCategories] = useState(false)
  const [profileResult, setProfileResult] = useState<Profile | null>(null)
  const [matchProfile, setMatchProfile] = useState<{ name: string; profile: Profile; budget: Record<string, number> } | null>(null)

  // Générer un profil de match aléatoire pour la démo
  const generateMatchProfile = () => {
    const names = ['Thomas', 'Camille', 'Lucas', 'Emma', 'Hugo', 'Léa', 'Nathan', 'Chloé']
    const randomName = names[Math.floor(Math.random() * names.length)]

    // Générer un budget différent du joueur
    const matchBudget: Record<string, number> = {}
    let remaining = 100
    const shuffledCategories = [...categories].sort(() => Math.random() - 0.5)

    shuffledCategories.forEach((cat, index) => {
      if (index === shuffledCategories.length - 1) {
        matchBudget[cat.id] = remaining
      } else {
        const max = Math.min(remaining, 30)
        const value = Math.floor(Math.random() * max)
        matchBudget[cat.id] = value
        remaining -= value
      }
    })

    const matchProfileType = getProfile(matchBudget)
    const matchProfileData = profiles.find(p => p.id === matchProfileType)!

    return {
      name: randomName,
      profile: matchProfileData,
      budget: matchBudget
    }
  }

  // Budget total et restant
  const TOTAL_BUDGET = 100
  const usedBudget = Object.values(budget).reduce((a, b) => a + b, 0)
  const remainingBudget = TOTAL_BUDGET - usedBudget

  // Mettre à jour une catégorie
  const updateBudget = (categoryId: string, value: number) => {
    const currentValue = budget[categoryId]
    const diff = value - currentValue

    // Vérifier qu'on ne dépasse pas le budget
    if (usedBudget + diff <= TOTAL_BUDGET) {
      setBudget(prev => ({ ...prev, [categoryId]: value }))
    } else {
      // Ajuster à la valeur max possible
      const maxValue = currentValue + remainingBudget
      setBudget(prev => ({ ...prev, [categoryId]: maxValue }))
    }
  }

  // Valider le budget
  const handleValidate = () => {
    const profileType = getProfile(budget)
    const profile = profiles.find(p => p.id === profileType)!
    setProfileResult(profile)
    setStep('result')

    // Sauvegarder le résultat
    localStorage.setItem('refais_la_france_budget', JSON.stringify(budget))
    localStorage.setItem('refais_la_france_profile', profileType)
  }

  // Catégories à afficher
  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, 6)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background */}
      <div className="bg-pattern" />

      <style jsx>{`
        .budget-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }
        .budget-fill {
          height: 100%;
          background: linear-gradient(90deg, #FF00FF, #00FFFF);
          transition: width 0.3s ease;
        }
        .budget-fill.warning {
          background: linear-gradient(90deg, #FFFF00, #FF6600);
        }
        .budget-fill.danger {
          background: linear-gradient(90deg, #FF3131, #FF6600);
        }
        .category-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          outline: none;
        }
        .category-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          background: #FF00FF;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px #FF00FF;
          transition: transform 0.2s;
        }
        .category-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
        .category-slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          background: #FF00FF;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px #FF00FF;
        }
        .category-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 16px;
          transition: all 0.2s;
        }
        .category-card:hover {
          border-color: rgba(255, 0, 255, 0.3);
        }
        .category-card.absurd {
          background: rgba(255, 165, 0, 0.05);
          border-color: rgba(255, 165, 0, 0.2);
        }
        .result-bar {
          height: 16px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          overflow: hidden;
        }
        .result-fill {
          height: 100%;
          border-radius: 8px;
          transition: width 0.5s ease;
        }
        .disclaimer-box {
          background: rgba(255, 255, 0, 0.1);
          border: 2px dashed rgba(255, 255, 0, 0.3);
          border-radius: 12px;
          padding: 16px;
        }
        .profile-card {
          background: rgba(255, 255, 255, 0.05);
          border: 3px solid;
          border-radius: 20px;
          padding: 24px;
          text-align: center;
        }
      `}</style>

      {/* Header */}
      <header className="p-4">
        <div className="h-1 bg-gradient-to-r from-[#FF00FF] via-[#FFFF00] to-[#00FFFF] mb-4" />
        <div className="flex items-center justify-between">
          <Link href="/games" className="text-white/60 hover:text-white transition flex items-center gap-2">
            <span>←</span>
            <span className="text-sm">Retour</span>
          </Link>
          <div className="logo-90s text-xl">
            <span className="text-2xl mr-2">🏛️</span>
            Refais la France
          </div>
          <div className="w-16" />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 pb-8 w-full" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1.5rem 2rem' }}>

        {/* INTRO */}
        {step === 'intro' && (
          <div className="py-8">
            <div className="text-center mb-8">
              <div className="text-8xl mb-6 animate-pulse filter drop-shadow-[0_0_30px_#FFFF00]">🏛️</div>
              <h1
                className="text-4xl font-bold mb-4"
                style={{ fontFamily: 'Bangers, cursive', color: '#FFFF00', textShadow: '0 0 20px #FFFF00, 3px 3px 0 #FF00FF' }}
              >
                REFAIS LA FRANCE
              </h1>
              <p className="text-white/80 text-lg mb-2">
                Tu as <span className="text-[#39FF14] font-bold" style={{ textShadow: '0 0 10px #39FF14' }}>100 milliards</span>. Pas un de plus.
              </p>
              <p className="text-white/60">
                Fais tes choix, assume tes priorités.
              </p>
              <p className="text-[#FF00FF] text-sm mt-4 italic">
                (Spoiler : tu vas énerver quelqu'un)
              </p>
            </div>

            {/* Disclaimer */}
            <div className="disclaimer-box mb-8">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="text-[#FFFF00] font-bold text-sm mb-2">
                    Ceci est un jeu, pas un programme politique.
                  </p>
                  <p className="text-white/60 text-sm">
                    Si tu veux vraiment refaire la France, présente-toi aux élections.
                  </p>
                </div>
              </div>
            </div>

            {/* Comment ça marche */}
            <div className="card-90s p-6 mb-8">
              <h3 className="text-[#00FFFF] font-bold mb-4 text-center" style={{ textShadow: '0 0 10px #00FFFF' }}>
                Comment ça marche ?
              </h3>
              <ul className="space-y-4 text-white/80">
                <li className="flex items-start gap-3">
                  <span className="text-2xl">💰</span>
                  <span>Répartis 100 milliards entre 15 catégories</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">🎭</span>
                  <span>Découvre ton profil politique (satirique)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">💕</span>
                  <span>Compare avec tes potes et débattez !</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setStep('budget')}
              className="btn-cta-primary w-full justify-center text-lg"
            >
              🗳️ C'est parti !
            </button>
          </div>
        )}

        {/* BUDGET */}
        {step === 'budget' && (
          <div className="py-4">
            {/* Budget restant sticky */}
            <div className="sticky top-0 z-10 bg-[#0D001A]/95 backdrop-blur-sm py-4 mb-6 -mx-5 px-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-bold">💰 Budget restant</span>
                <span
                  className={`text-2xl font-bold ${remainingBudget <= 10 ? 'text-[#FF3131]' : remainingBudget <= 30 ? 'text-[#FFFF00]' : 'text-[#39FF14]'}`}
                  style={{ textShadow: remainingBudget <= 10 ? '0 0 10px #FF3131' : remainingBudget <= 30 ? '0 0 10px #FFFF00' : '0 0 10px #39FF14' }}
                >
                  {remainingBudget} Mds
                </span>
              </div>
              <div className="budget-bar">
                <div
                  className={`budget-fill ${remainingBudget <= 10 ? 'danger' : remainingBudget <= 30 ? 'warning' : ''}`}
                  style={{ width: `${remainingBudget}%` }}
                />
              </div>
              {remainingBudget === 0 && (
                <p className="text-[#39FF14] text-xs mt-2 text-center">
                  Budget épuisé ! Tu peux valider ou réajuster.
                </p>
              )}
            </div>

            <p className="text-white/60 text-center mb-6">
              Glisse pour répartir ton budget :
            </p>

            {/* Catégories */}
            <div className="space-y-4 mb-6">
              {visibleCategories.map(category => (
                <div
                  key={category.id}
                  className={`category-card ${category.isAbsurd ? 'absurd' : ''}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{category.icon}</span>
                      <span className="text-white font-bold">{category.name}</span>
                      {category.isAbsurd && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#FFA500]/20 text-[#FFA500]">
                          WTF
                        </span>
                      )}
                    </div>
                    <span
                      className="text-lg font-bold"
                      style={{
                        color: budget[category.id] > 0 ? '#39FF14' : 'rgba(255,255,255,0.3)',
                        textShadow: budget[category.id] > 0 ? '0 0 10px #39FF14' : 'none'
                      }}
                    >
                      {budget[category.id]} Mds
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={budget[category.id]}
                    onChange={(e) => updateBudget(category.id, parseInt(e.target.value))}
                    className="category-slider mb-2"
                  />

                  <p className="text-white/40 text-xs italic">
                    "{category.description}"
                  </p>
                </div>
              ))}
            </div>

            {/* Voir plus/moins */}
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="w-full text-center text-[#00FFFF] text-sm py-3 hover:underline"
            >
              {showAllCategories ? '− Réduire' : `+ Voir les ${categories.length - 6} autres catégories`}
            </button>

            {/* Disclaimer footer */}
            <div className="mt-6 p-3 text-center border-t border-white/10">
              <p className="text-white/30 text-xs">
                ⚠️ Refais la France est un jeu satirique à visée humoristique.
                <br />
                Si ce jeu te met en colère, respire un coup et va jouer au Jeu de l'Oie.
              </p>
            </div>
          </div>
        )}

        {/* RESULT */}
        {step === 'result' && profileResult && (
          <div className="py-6">
            <div className="text-center mb-6">
              <p className="text-white/60 text-sm mb-2">🗳️ TON PROFIL POLITIQUE</p>
            </div>

            {/* Profile Card */}
            <div
              className="profile-card mb-8"
              style={{ borderColor: profileResult.color }}
            >
              <div
                className="text-7xl mb-4"
                style={{ filter: `drop-shadow(0 0 20px ${profileResult.color})` }}
              >
                {profileResult.icon}
              </div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{
                  fontFamily: 'Bangers, cursive',
                  color: profileResult.color,
                  textShadow: `0 0 15px ${profileResult.color}`
                }}
              >
                {profileResult.name}
              </h2>
              <p className="text-white/80 mb-6">
                {profileResult.description}
              </p>

              <div className="space-y-4 text-left">
                <div className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <p className="text-[#FF00FF] text-sm font-bold mb-1">💕 Ton crush idéal :</p>
                  <p className="text-white/70 text-sm">{profileResult.crushIdeal}</p>
                </div>
                <div className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <p className="text-[#FF3131] text-sm font-bold mb-1">😤 Ton ennemi naturel :</p>
                  <p className="text-white/70 text-sm">{profileResult.ennemiNaturel}</p>
                </div>
              </div>
            </div>

            {/* Budget Recap */}
            <div className="card-90s p-5 mb-6">
              <h3 className="text-[#00FFFF] font-bold mb-4" style={{ textShadow: '0 0 10px #00FFFF' }}>
                📊 TON BUDGET
              </h3>
              <div className="space-y-3">
                {Object.entries(budget)
                  .filter(([, value]) => value > 0)
                  .sort((a, b) => b[1] - a[1])
                  .map(([catId, value]) => {
                    const cat = categories.find(c => c.id === catId)!
                    return (
                      <div key={catId}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-white/80">
                            {cat.icon} {cat.name}
                          </span>
                          <span className="text-sm text-[#39FF14] font-bold">
                            {value} Mds
                          </span>
                        </div>
                        <div className="result-bar">
                          <div
                            className="result-fill"
                            style={{
                              width: `${value}%`,
                              background: cat.isAbsurd
                                ? 'linear-gradient(90deg, #FFA500, #FFD700)'
                                : `linear-gradient(90deg, ${profileResult.color}, ${profileResult.color}80)`
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}

                {/* Montrer les 0 importants */}
                {Object.entries(budget)
                  .filter(([catId, value]) => value === 0 && ['sante', 'securite', 'education'].includes(catId))
                  .map(([catId]) => {
                    const cat = categories.find(c => c.id === catId)!
                    return (
                      <div key={catId} className="flex items-center justify-between text-white/30">
                        <span className="text-sm">
                          {cat.icon} {cat.name}
                        </span>
                        <span className="text-sm">
                          0 Mds 💀
                        </span>
                      </div>
                    )
                  })}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  // Simuler un partage
                  if (navigator.share) {
                    navigator.share({
                      title: `Je suis ${profileResult.name} sur Déli Délo !`,
                      text: profileResult.description,
                      url: window.location.href
                    })
                  }
                }}
                className="btn-cta-primary w-full justify-center"
                style={{ background: 'linear-gradient(135deg, #00FFFF 0%, #00B4D8 100%)' }}
              >
                🔗 Partager mon profil
              </button>
              <button
                onClick={() => {
                  const match = generateMatchProfile()
                  setMatchProfile(match)
                  setStep('comparison')
                }}
                className="btn-cta-primary w-full justify-center"
                style={{ background: 'linear-gradient(135deg, #FF00FF 0%, #FF6B9D 100%)' }}
              >
                ⚔️ Comparer avec un pote
              </button>
              <button
                onClick={() => {
                  setBudget(() => {
                    const initial: Record<string, number> = {}
                    categories.forEach(cat => {
                      initial[cat.id] = 0
                    })
                    return initial
                  })
                  setStep('budget')
                  setProfileResult(null)
                }}
                className="w-full text-center text-white/50 text-sm py-3 hover:text-white/80 transition"
              >
                🎮 Rejouer
              </button>
            </div>

            {/* Disclaimer */}
            <div className="mt-8 p-3 text-center border-t border-white/10">
              <p className="text-white/30 text-xs">
                ⚠️ Déli Délo n'a aucune affiliation politique.
                <br />
                Si ce résultat te met en colère, c'est peut-être le moment d'en discuter avec ton match.
              </p>
            </div>
          </div>
        )}

        {/* COMPARISON */}
        {step === 'comparison' && profileResult && matchProfile && (
          <div className="py-6">
            <div className="text-center mb-6">
              <p className="text-white/60 text-sm mb-2">⚔️ DUEL POLITIQUE</p>
            </div>

            {/* VS Cards */}
            <div className="flex items-center justify-center gap-4 mb-6">
              {/* Your profile */}
              <div
                className="flex-1 p-4 rounded-xl text-center"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: `2px solid ${profileResult.color}`
                }}
              >
                <div className="text-4xl mb-2">{profileResult.icon}</div>
                <div
                  className="text-sm font-bold mb-1"
                  style={{ color: profileResult.color }}
                >
                  {profileResult.name.replace(/^(Le |La |L')/, '')}
                </div>
                <div className="text-white/50 text-xs">(Toi)</div>
              </div>

              <div className="text-3xl font-bold text-[#FFFF00]" style={{ textShadow: '0 0 10px #FFFF00' }}>
                VS
              </div>

              {/* Match profile */}
              <div
                className="flex-1 p-4 rounded-xl text-center"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: `2px solid ${matchProfile.profile.color}`
                }}
              >
                <div className="text-4xl mb-2">{matchProfile.profile.icon}</div>
                <div
                  className="text-sm font-bold mb-1"
                  style={{ color: matchProfile.profile.color }}
                >
                  {matchProfile.profile.name.replace(/^(Le |La |L')/, '')}
                </div>
                <div className="text-white/50 text-xs">({matchProfile.name})</div>
              </div>
            </div>

            {/* Compatibility message */}
            <div
              className="p-4 rounded-xl text-center mb-6"
              style={{
                background: profileResult.ennemiNaturel.includes(matchProfile.profile.name.replace(/^(Le |La |L')/, ''))
                  ? 'rgba(255, 0, 0, 0.1)'
                  : profileResult.id === matchProfile.profile.id
                    ? 'rgba(57, 255, 20, 0.1)'
                    : 'rgba(255, 255, 0, 0.1)',
                border: profileResult.ennemiNaturel.includes(matchProfile.profile.name.replace(/^(Le |La |L')/, ''))
                  ? '2px solid rgba(255, 0, 0, 0.3)'
                  : profileResult.id === matchProfile.profile.id
                    ? '2px solid rgba(57, 255, 20, 0.3)'
                    : '2px solid rgba(255, 255, 0, 0.3)'
              }}
            >
              {profileResult.ennemiNaturel.includes(matchProfile.profile.name.replace(/^(Le |La |L')/, '')) ? (
                <>
                  <p className="text-[#FF3131] font-bold mb-2">
                    😱 Vous êtes ennemis naturels !
                  </p>
                  <p className="text-white/70 text-sm">
                    Soit ça clash, soit c'est le grand amour.
                    <br />
                    Y'a pas de milieu.
                  </p>
                </>
              ) : profileResult.id === matchProfile.profile.id ? (
                <>
                  <p className="text-[#39FF14] font-bold mb-2">
                    🎉 Vous êtes du même bord !
                  </p>
                  <p className="text-white/70 text-sm">
                    Même vision politique, même délire.
                    <br />
                    C'est soit l'ennui, soit l'amour fou.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-[#FFFF00] font-bold mb-2">
                    🤔 Des visions différentes...
                  </p>
                  <p className="text-white/70 text-sm">
                    Assez différents pour débattre,
                    <br />
                    pas assez pour se détester. Intéressant.
                  </p>
                </>
              )}
            </div>

            {/* Biggest differences */}
            <div className="card-90s p-5 mb-6">
              <h3 className="text-[#00FFFF] font-bold mb-4" style={{ textShadow: '0 0 10px #00FFFF' }}>
                📊 VOS PLUS GRANDES DIFFÉRENCES
              </h3>
              <div className="space-y-4">
                {categories
                  .map(cat => ({
                    ...cat,
                    diff: Math.abs((budget[cat.id] || 0) - (matchProfile.budget[cat.id] || 0)),
                    yours: budget[cat.id] || 0,
                    theirs: matchProfile.budget[cat.id] || 0
                  }))
                  .filter(cat => cat.diff > 5)
                  .sort((a, b) => b.diff - a.diff)
                  .slice(0, 4)
                  .map(cat => (
                    <div key={cat.id}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white/80 text-sm">
                          {cat.icon} {cat.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white/50 w-12">Toi: {cat.yours}</span>
                        <div className="flex-1 h-4 rounded-full bg-white/10 overflow-hidden relative">
                          <div
                            className="absolute left-0 top-0 h-full rounded-full"
                            style={{
                              width: `${cat.yours}%`,
                              background: profileResult.color
                            }}
                          />
                          <div
                            className="absolute right-0 top-0 h-full rounded-full opacity-50"
                            style={{
                              width: `${cat.theirs}%`,
                              background: matchProfile.profile.color
                            }}
                          />
                        </div>
                        <span className="text-xs text-white/50 w-16 text-right">{matchProfile.name}: {cat.theirs}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Debate topic */}
            <div
              className="p-4 rounded-xl mb-6"
              style={{
                background: 'rgba(255, 0, 255, 0.1)',
                border: '2px dashed rgba(255, 0, 255, 0.3)'
              }}
            >
              <p className="text-[#FF00FF] text-sm font-bold mb-2">💬 Sujet de débat suggéré :</p>
              <p className="text-white/80 text-center italic">
                {(() => {
                  const biggestDiff = categories
                    .map(cat => ({
                      ...cat,
                      diff: Math.abs((budget[cat.id] || 0) - (matchProfile.budget[cat.id] || 0))
                    }))
                    .sort((a, b) => b.diff - a.diff)[0]

                  const debates: Record<string, string> = {
                    sante: "Les urgences, c'est vraiment si grave ?",
                    education: "L'école, ça sert encore à quelque chose ?",
                    securite: "Plus de flics = plus de sécurité ?",
                    ecologie: "Sauver la planète ou sauver l'économie ?",
                    culture: "Les musées, c'est pour les vieux ?",
                    economie: "Les entreprises méritent-elles des aides ?",
                    social: "L'assistanat, mythe ou réalité ?",
                    defense: "On a vraiment besoin d'une armée ?",
                    transport: "Le TGV pour tous ou que pour les riches ?",
                    justice: "La justice est-elle vraiment aveugle ?",
                    fromage: "Le camembert mérite-t-il des milliards ?",
                    baguette: "La baguette parfaite existe-t-elle ?",
                    coqs: "Les coqs sont-ils essentiels à la République ?",
                    apero: "L'apéro, patrimoine national ?",
                    beret: "Le béret, c'est has-been ou vintage ?"
                  }

                  return `"${debates[biggestDiff.id] || 'C\'est quoi le plus important dans un pays ?'}"`
                })()}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={() => router.push('/messages')}
                className="btn-cta-primary w-full justify-center"
              >
                💬 En discuter avec {matchProfile.name}
              </button>
              <button
                onClick={() => {
                  const match = generateMatchProfile()
                  setMatchProfile(match)
                }}
                className="btn-cta-primary w-full justify-center"
                style={{ background: 'linear-gradient(135deg, #00FFFF 0%, #00B4D8 100%)' }}
              >
                🔄 Comparer avec un autre pote
              </button>
              <button
                onClick={() => setStep('result')}
                className="w-full text-center text-white/50 text-sm py-3 hover:text-white/80 transition"
              >
                ← Retour à mon profil
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Footer CTA (Budget step only) */}
      {step === 'budget' && (
        <footer className="p-5 bg-[#1A0033]/80 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-md mx-auto">
            <button
              onClick={handleValidate}
              disabled={usedBudget === 0}
              className="btn-cta-primary w-full justify-center text-lg"
              style={{
                opacity: usedBudget > 0 ? 1 : 0.5,
                cursor: usedBudget > 0 ? 'pointer' : 'not-allowed',
              }}
            >
              {usedBudget === 0 ? 'Répartis ton budget d\'abord' : `Valider mon budget 🗳️`}
            </button>
            {remainingBudget > 0 && usedBudget > 0 && (
              <p className="text-center text-white/40 text-xs mt-2">
                💡 Il te reste {remainingBudget} Mds à répartir (ou pas, c'est toi qui décides)
              </p>
            )}
          </div>
        </footer>
      )}
    </div>
  )
}
