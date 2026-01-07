/**
 * Hook de moderation style BD pour le Jeu de la Tarte
 * Remplace les insultes par des alternatives cartoon et detecte les noms propres
 */

// Dictionnaire des insultes et leurs remplacements BD
const insultReplacements: Record<string, string> = {
  // Mots vulgaires -> BD style
  'connard': 'Sac a crottes 💩',
  'connards': 'Sacs a crottes 💩',
  'connasse': 'Raclure de bidet 🚽',
  'connasses': 'Raclures de bidet 🚽',
  'salaud': 'Raclure de bidet 🚽',
  'salauds': 'Raclures de bidet 🚽',
  'salope': 'Raclure de bidet 🚽',
  'salopes': 'Raclures de bidet 🚽',
  'enfoire': 'Abruti des alpages 🐄',
  'enfoiré': 'Abruti des alpages 🐄',
  'enfoires': 'Abrutis des alpages 🐄',
  'enfoirés': 'Abrutis des alpages 🐄',
  'putain': 'Crotte de mammouth 🦣',
  'merde': 'Bouse de yack 🦬',
  'bordel': 'Crotte de mammouth 🦣',
  'con': 'Patate cosmique 🥔',
  'conne': 'Patate cosmique 🥔',
  'cons': 'Patates cosmiques 🥔',
  'connes': 'Patates cosmiques 🥔',
  'abruti': 'Debris du bulbe 🧠',
  'abrutie': 'Debris du bulbe 🧠',
  'abrutis': 'Debris du bulbe 🧠',
  'abruties': 'Debris du bulbe 🧠',
  'idiot': 'Nouille intergalactique 🍜',
  'idiote': 'Nouille intergalactique 🍜',
  'idiots': 'Nouilles intergalactiques 🍜',
  'imbecile': 'Cornichon 🥒',
  'imbécile': 'Cornichon 🥒',
  'imbeciles': 'Cornichons 🥒',
  'cretin': 'Triple buse 🦅',
  'crétin': 'Triple buse 🦅',
  'cretins': 'Triples buses 🦅',
  'crétins': 'Triples buses 🦅',
  'debile': 'Debris du bulbe 🧠',
  'débile': 'Debris du bulbe 🧠',
  'debiles': 'Debris du bulbe 🧠',
  'débiles': 'Debris du bulbe 🧠',
  'encule': '@#$%&! 🤬',
  'enculé': '@#$%&! 🤬',
  'encules': '@#$%&! 🤬',
  'enculés': '@#$%&! 🤬',
  'nique': '@#$%&! 🤬',
  'niquer': '@#$%&! 🤬',
  'baiser': '@#$%&! 🤬',
  'foutre': '@#$%&! 🤬',
  'chier': 'Crotte de mammouth 🦣',
  'pute': 'Raclure de bidet 🚽',
  'putes': 'Raclures de bidet 🚽',
  'batard': 'Debris du bulbe 🧠',
  'bâtard': 'Debris du bulbe 🧠',
  'batards': 'Debris du bulbe 🧠',
  'bâtards': 'Debris du bulbe 🧠',
  'fdp': 'Triple buse 🦅',
  'ntm': '@#$%&! 🤬',
  'tg': '@#$%&! 🤬',
  'pd': '@#$%&! 🤬',
  'pede': '@#$%&! 🤬',
  'pédé': '@#$%&! 🤬',
  'tapette': '@#$%&! 🤬',
  'gueule': 'face de 🥔',
  'ta gueule': '@#$%&! 🤬',
  'ferme la': '@#$%&! 🤬',
  'va te faire': '@#$%&! 🤬',
}

// Mots a bloquer completement (menaces, violence)
const blockedWords = [
  'tuer',
  'mort',
  'crever',
  'buter',
  'dégommer',
  'degommer',
  'eliminer',
  'éliminer',
  'suicide',
  'mourir',
  'violence',
  'tabasser',
  'frapper',
  'casser la gueule',
]

// Suggestions d'insultes BD
export const bdInsultSuggestions = [
  { text: 'Sac a crottes', icon: '💩' },
  { text: 'Raclure de bidet', icon: '🚽' },
  { text: 'Abruti des alpages', icon: '🐄' },
  { text: '@#$%&!', icon: '🤬' },
  { text: 'Debile du bulbe', icon: '🧠' },
  { text: 'Patate cosmique', icon: '🥔' },
  { text: 'Triple buse', icon: '🦅' },
  { text: 'Cornichon', icon: '🥒' },
  { text: 'Nouille intergalactique', icon: '🍜' },
  { text: 'Crotte de mammouth', icon: '🦣' },
  { text: 'Bouse de yack', icon: '🦬' },
  { text: 'Moule a gaufre', icon: '🧇' },
]

// Emojis de rage
export const rageEmojis = ['🤬', '💢', '💥', '⚡', '🔥', '☠️', '🌪️', '😤', '👿', '🤯']

// Emojis pour les cibles
export const targetEmojis = ['🧦', '🐍', '🦨', '🐀', '🪳', '🐌', '👻', '🤡', '👹', '🦠', '🗑️', '🚽', '🐷', '🦎']

// Liste de prenoms francais courants (pour detection)
const commonFirstNames = [
  // Masculins
  'jean', 'pierre', 'paul', 'jacques', 'michel', 'philippe', 'alain', 'patrick', 'nicolas', 'christophe',
  'david', 'eric', 'laurent', 'stephane', 'olivier', 'thierry', 'christian', 'daniel', 'pascal', 'bernard',
  'francois', 'frederic', 'julien', 'antoine', 'alexandre', 'thomas', 'kevin', 'maxime', 'romain', 'jeremy',
  'florian', 'guillaume', 'mathieu', 'vincent', 'benjamin', 'anthony', 'quentin', 'lucas', 'hugo', 'theo',
  'louis', 'nathan', 'leo', 'gabriel', 'raphael', 'arthur', 'jules', 'adam', 'noel', 'victor',
  'marc', 'bruno', 'jerome', 'yves', 'denis', 'serge', 'didier', 'joel', 'gilles', 'herve',
  // Feminins
  'marie', 'jeanne', 'francoise', 'monique', 'catherine', 'nathalie', 'isabelle', 'sylvie', 'valerie', 'sandrine',
  'stephanie', 'christine', 'sophie', 'anne', 'veronique', 'celine', 'emilie', 'aurelie', 'elodie', 'julie',
  'camille', 'laura', 'marine', 'pauline', 'charlotte', 'manon', 'lea', 'chloe', 'sarah', 'emma',
  'louise', 'alice', 'jade', 'lola', 'clara', 'ines', 'rose', 'lucie', 'eva', 'anna',
  'martine', 'nicole', 'danielle', 'annie', 'brigitte', 'patricia', 'corinne', 'laurence', 'agnes', 'helene',
  // Composes courants
  'jean-pierre', 'jean-paul', 'jean-claude', 'jean-michel', 'jean-marc', 'jean-louis', 'jean-francois',
  'marie-claire', 'marie-france', 'anne-marie', 'marie-helene', 'marie-christine',
]

// Liste de noms de famille francais courants
const commonLastNames = [
  'martin', 'bernard', 'thomas', 'petit', 'robert', 'richard', 'durand', 'dubois', 'moreau', 'laurent',
  'simon', 'michel', 'lefebvre', 'leroy', 'roux', 'david', 'bertrand', 'morel', 'fournier', 'girard',
  'bonnet', 'dupont', 'lambert', 'fontaine', 'rousseau', 'vincent', 'muller', 'lefevre', 'faure', 'andre',
  'mercier', 'blanc', 'guerin', 'boyer', 'garnier', 'chevalier', 'francois', 'legrand', 'gauthier', 'garcia',
  'perrin', 'robin', 'clement', 'morin', 'nicolas', 'henry', 'roussel', 'mathieu', 'gautier', 'masson',
  'marchand', 'duval', 'denis', 'dumont', 'marie', 'lemaire', 'noel', 'meyer', 'dufour', 'meunier',
  'brun', 'blanchard', 'giraud', 'joly', 'riviere', 'lucas', 'brunet', 'gaillard', 'barbier', 'arnaud',
  'martinez', 'gerard', 'roche', 'renard', 'schmitt', 'roy', 'leroux', 'colin', 'vidal', 'caron',
  'picard', 'roger', 'fabre', 'aubert', 'lemoine', 'renaud', 'dumas', 'lacroix', 'olivier', 'philippe',
]

// Regex pour detecter les numeros de telephone
const phonePattern = /(\+33|0)\s*[1-9](\s*\d{2}){4}/g

// Regex pour detecter les emails
const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g

// Regex pour detecter les patterns de noms (plusieurs formats)
const namePatterns = [
  /\b[A-Z][a-zàâäéèêëïîôùûüç]+\s+[A-Z][a-zàâäéèêëïîôùûüç]+\b/g,  // Jean Dupont
  /\b[A-Z][a-zàâäéèêëïîôùûüç]+\s+[A-Z]{2,}\b/g,                   // Jean DUPONT
  /\b[A-Z]{2,}\s+[A-Z][a-zàâäéèêëïîôùûüç]+\b/g,                   // JEAN Dupont
  /\b[A-Z][a-zàâäéèêëïîôùûüç]+-[A-Z][a-zàâäéèêëïîôùûüç]+\s+[A-Z][a-zàâäéèêëïîôùûüç]+\b/g, // Jean-Pierre Dupont
]

/**
 * Detecte si le texte contient des noms propres
 * Version simplifiée : ne détecte que les patterns évidents
 */
function detectNames(text: string): string[] {
  const foundNames: string[] = []

  // 1. Detecter les patterns de noms avec majuscules (Prénom Nom)
  // Ex: "Jean Dupont", "Marie Martin", "Jean-Pierre Bernard"
  for (const pattern of namePatterns) {
    const matches = text.match(pattern) || []
    foundNames.push(...matches)
  }

  // 2. Detecter les mentions @ de style prenom.nom ou prenom_nom
  const atMentions = text.match(/@[a-zA-Z][a-zA-Z0-9_.]+/g) || []
  for (const mention of atMentions) {
    const name = mention.slice(1).toLowerCase()
    if (name.includes('.') || name.includes('_')) {
      const parts = name.split(/[._]/)
      if (parts.length >= 2) {
        const [first, last] = parts
        if (commonFirstNames.includes(first) || commonLastNames.includes(last)) {
          foundNames.push(mention)
        }
      }
    }
  }

  // Dedupliquer
  return [...new Set(foundNames)]
}

export interface ModerationResult {
  originalText: string
  cleanedText: string
  hasInsults: boolean
  hasBlockedWords: boolean
  hasPersonalInfo: boolean
  foundInsults: string[]
  foundBlockedWords: string[]
  foundPersonalInfo: string[]
  suggestions: typeof bdInsultSuggestions
}

/**
 * Analyse et nettoie un texte selon les regles BD
 */
export function moderateText(text: string): ModerationResult {
  let cleanedText = text
  const foundInsults: string[] = []
  const foundBlockedWords: string[] = []
  const foundPersonalInfo: string[] = []

  // Detecter et remplacer les insultes
  const lowerText = text.toLowerCase()
  for (const [insult, replacement] of Object.entries(insultReplacements)) {
    const regex = new RegExp(`\\b${insult}\\b`, 'gi')
    if (regex.test(cleanedText)) {
      foundInsults.push(insult)
      cleanedText = cleanedText.replace(regex, replacement)
    }
  }

  // Detecter les mots bloques (violence)
  for (const word of blockedWords) {
    if (lowerText.includes(word.toLowerCase())) {
      foundBlockedWords.push(word)
    }
  }

  // Detecter les noms propres (nouvelle methode amelioree)
  const names = detectNames(text)
  foundPersonalInfo.push(...names)

  // Detecter les telephones
  const phones = text.match(phonePattern) || []
  foundPersonalInfo.push(...phones)

  // Detecter les emails
  const emails = text.match(emailPattern) || []
  foundPersonalInfo.push(...emails)

  return {
    originalText: text,
    cleanedText,
    hasInsults: foundInsults.length > 0,
    hasBlockedWords: foundBlockedWords.length > 0,
    hasPersonalInfo: foundPersonalInfo.length > 0,
    foundInsults,
    foundBlockedWords,
    foundPersonalInfo,
    suggestions: bdInsultSuggestions,
  }
}

/**
 * Verifie si un texte contient des elements problematiques
 */
export function checkText(text: string): {
  isValid: boolean
  issues: string[]
  suggestions: string[]
} {
  const result = moderateText(text)
  const issues: string[] = []
  const suggestions: string[] = []

  if (result.hasBlockedWords) {
    issues.push('Contient des mots lies a la violence')
    suggestions.push('Reformule en mode cartoon, pas tribunal !')
  }

  if (result.hasPersonalInfo) {
    issues.push('Contient des informations personnelles')
    suggestions.push('Utilise un surnom rigolo (ex: "Mon ex le 🐍") au lieu d\'un vrai nom')
  }

  if (result.hasInsults) {
    suggestions.push(`On a remplace automatiquement par du style BD : ${result.foundInsults.join(', ')}`)
  }

  return {
    isValid: !result.hasBlockedWords && !result.hasPersonalInfo,
    issues,
    suggestions,
  }
}

/**
 * Hook React pour la moderation
 */
export function useBDModeration() {
  return {
    moderateText,
    checkText,
    bdInsultSuggestions,
    rageEmojis,
    targetEmojis,
  }
}

export default useBDModeration
