'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useUser } from '../../contexts/UserContext'

// Types
type GameStep = 'lobby' | 'join' | 'choose_side' | 'write_argument' | 'courtroom' | 'verdict' | 'create'
type Role = 'lawyer' | 'jury'
type Position = 'a' | 'b'

interface Argument {
  id: string
  username: string
  avatar: string
  content: string
  upvotes: number
  downvotes: number
  position: Position
  isOwn?: boolean
}

interface Trial {
  id: string
  emoji: string
  title: string
  positionA: string
  positionB: string
  lawyersCount: number
  juryCount: number
  status: 'open' | 'deliberation' | 'closed'
  category: string
  timeLeft?: string
  isNew?: boolean
  isHot?: boolean
  votesA?: number
  votesB?: number
  arguments?: Argument[]
}

// Catégories de procès
const trialCategories = [
  { id: 'bouffe', emoji: '🍽️', name: 'Bouffe' },
  { id: 'quotidien', emoji: '🏠', name: 'Vie quotidienne' },
  { id: 'communication', emoji: '💬', name: 'Communication' },
  { id: 'animaux', emoji: '🐾', name: 'Animaux' },
  { id: 'popculture', emoji: '🎬', name: 'Pop Culture' },
  { id: 'philosophie', emoji: '🤔', name: 'Philosophie débile' },
  { id: 'bureau', emoji: '💼', name: 'Bureau / Travail' },
]

// Fonction pour générer des stats aléatoires réalistes
const randomStats = () => ({
  lawyersCount: Math.floor(Math.random() * 15) + 2,
  juryCount: Math.floor(Math.random() * 50) + 5,
})

// Procès pré-définis - TOUS LES 62 PROCÈS PAR CATÉGORIE
const mockTrials: Trial[] = [
  // ═══════════════════════════════════════════════════════════════
  // 🍽️ BOUFFE (12 procès)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'b1', emoji: '🍫', title: 'Chocolatine VS Pain au chocolat', positionA: 'Chocolatine', positionB: 'Pain au chocolat',
    ...randomStats(), status: 'deliberation', category: 'bouffe', timeLeft: '2h', isHot: true, votesA: 62, votesB: 38,
    arguments: [
      { id: '1', username: 'Lucas', avatar: '😎', content: '"Pain au chocolat" est une ABERRATION linguistique !', upvotes: 23, downvotes: 5, position: 'a' },
      { id: '2', username: 'Marie', avatar: '👩', content: 'L\'Académie française a tranché. C\'est PAIN AU CHOCOLAT.', upvotes: 18, downvotes: 12, position: 'b' },
    ],
  },
  {
    id: 'b2', emoji: '🍕', title: 'L\'ananas sur la pizza : délice ou hérésie ?', positionA: 'Délice tropical', positionB: 'Hérésie culinaire',
    ...randomStats(), status: 'open', category: 'bouffe', isHot: true,
  },
  {
    id: 'b3', emoji: '🥛', title: 'Le lait avant ou après les céréales ?', positionA: 'Lait d\'abord', positionB: 'Céréales d\'abord',
    ...randomStats(), status: 'deliberation', category: 'bouffe', timeLeft: '1h30', votesA: 28, votesB: 72,
  },
  {
    id: 'b4', emoji: '🍝', title: 'Casser les spaghettis : pratique ou sacrilège ?', positionA: 'Pratique !', positionB: 'Sacrilège absolu',
    ...randomStats(), status: 'open', category: 'bouffe', isNew: true,
  },
  {
    id: 'b5', emoji: '🥐', title: 'Croissant au beurre ou ordinaire ?', positionA: 'Beurre ou rien', positionB: 'Peu importe',
    ...randomStats(), status: 'open', category: 'bouffe',
  },
  {
    id: 'b6', emoji: '🍳', title: 'L\'œuf au plat : cuit ou coulant ?', positionA: 'Bien cuit', positionB: 'Coulant sinon rien',
    ...randomStats(), status: 'open', category: 'bouffe',
  },
  {
    id: 'b7', emoji: '☕', title: 'Café soluble : acceptable ou pas ?', positionA: 'Acceptable', positionB: 'Crime contre l\'humanité',
    ...randomStats(), status: 'deliberation', category: 'bouffe', timeLeft: '45min', votesA: 35, votesB: 65,
  },
  {
    id: 'b8', emoji: '🧀', title: 'La raclette en été : normal ou bizarre ?', positionA: 'Normal, c\'est trop bon', positionB: 'Bizarre et déplacé',
    ...randomStats(), status: 'open', category: 'bouffe',
  },
  {
    id: 'b9', emoji: '🥖', title: 'Le bout du pain : le meilleur ou le pire ?', positionA: 'Le meilleur !', positionB: 'Le pire, jetez-le',
    ...randomStats(), status: 'open', category: 'bouffe', isNew: true,
  },
  {
    id: 'b10', emoji: '🍟', title: 'Les frites : mayo ou ketchup ?', positionA: 'Mayo forever', positionB: 'Ketchup gang',
    ...randomStats(), status: 'deliberation', category: 'bouffe', timeLeft: '3h', isHot: true, votesA: 52, votesB: 48,
  },
  {
    id: 'b11', emoji: '🍪', title: 'Cookies : moelleux ou croquants ?', positionA: 'Moelleux', positionB: 'Croquants',
    ...randomStats(), status: 'open', category: 'bouffe',
  },
  {
    id: 'b12', emoji: '🥗', title: 'La salade : plat principal ou accompagnement ?', positionA: 'Plat principal', positionB: 'Juste accompagnement',
    ...randomStats(), status: 'open', category: 'bouffe',
  },

  // ═══════════════════════════════════════════════════════════════
  // 🏠 VIE QUOTIDIENNE (10 procès)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'q1', emoji: '🛏️', title: 'Faire son lit le matin : utile ou dictature ?', positionA: 'Utile et important', positionB: 'Dictature inutile',
    ...randomStats(), status: 'open', category: 'quotidien',
  },
  {
    id: 'q2', emoji: '🚿', title: 'Se doucher le matin ou le soir ?', positionA: 'Matin', positionB: 'Soir',
    ...randomStats(), status: 'deliberation', category: 'quotidien', timeLeft: '2h', votesA: 54, votesB: 46,
  },
  {
    id: 'q3', emoji: '🧻', title: 'Papier toilette : dessus ou dessous ?', positionA: 'Dessus', positionB: 'Dessous',
    ...randomStats(), status: 'open', category: 'quotidien', isHot: true,
  },
  {
    id: 'q4', emoji: '🧦', title: 'Chaussettes dans les sandales : génie ou crime ?', positionA: 'Génie incompris', positionB: 'Crime de mode',
    ...randomStats(), status: 'open', category: 'quotidien', isNew: true,
  },
  {
    id: 'q5', emoji: '⏰', title: 'Mettre 10 alarmes le matin : stratégie ou torture ?', positionA: 'Stratégie de survie', positionB: 'Auto-torture inutile',
    ...randomStats(), status: 'open', category: 'quotidien',
  },
  {
    id: 'q6', emoji: '🚗', title: 'Klaxonner dès que le feu est vert : légitime ?', positionA: 'Légitime, faut avancer', positionB: 'Relou et inutile',
    ...randomStats(), status: 'deliberation', category: 'quotidien', timeLeft: '1h', votesA: 38, votesB: 62,
  },
  {
    id: 'q7', emoji: '📦', title: 'Garder les boîtes vides "au cas où" : sage ou fou ?', positionA: 'Sage prévoyance', positionB: 'Symptôme de folie',
    ...randomStats(), status: 'open', category: 'quotidien',
  },
  {
    id: 'q8', emoji: '🛒', title: 'Prendre un caddie pour 3 articles : ok ou pas ?', positionA: 'OK, on sait jamais', positionB: 'Prends un panier !',
    ...randomStats(), status: 'open', category: 'quotidien',
  },
  {
    id: 'q9', emoji: '🚪', title: 'Sonner chez quelqu\'un sans prévenir : acceptable ?', positionA: 'Oui, c\'est convivial', positionB: 'Non, c\'est l\'horreur',
    ...randomStats(), status: 'open', category: 'quotidien', isNew: true,
  },
  {
    id: 'q10', emoji: '📱', title: 'Regarder son tel aux toilettes : hygiénique ?', positionA: 'Pas de jugement', positionB: 'Absolument dégueu',
    ...randomStats(), status: 'open', category: 'quotidien',
  },

  // ═══════════════════════════════════════════════════════════════
  // 💬 COMMUNICATION (10 procès)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'c1', emoji: '📱', title: 'Répondre "OK" à un long message : acceptable ?', positionA: 'Acceptable', positionB: 'Crime relationnel',
    ...randomStats(), status: 'open', category: 'communication', isHot: true,
  },
  {
    id: 'c2', emoji: '🔊', title: 'Vocaux de 3 minutes : pratique ou torture ?', positionA: 'Pratique et vivant', positionB: 'Torture auditive',
    ...randomStats(), status: 'deliberation', category: 'communication', timeLeft: '30min', votesA: 25, votesB: 75, isHot: true,
  },
  {
    id: 'c3', emoji: '👀', title: '"Vu" sans réponse : c\'est grave ?', positionA: 'Non, on a le droit', positionB: 'Oui, c\'est violent',
    ...randomStats(), status: 'open', category: 'communication',
  },
  {
    id: 'c4', emoji: '📺', title: 'Regarder la fin d\'une série sans l\'autre : trahison ?', positionA: 'Non, c\'est ma vie', positionB: 'Trahison impardonnable',
    ...randomStats(), status: 'deliberation', category: 'communication', timeLeft: '1h30', votesA: 40, votesB: 60,
  },
  {
    id: 'c5', emoji: '💬', title: 'Les "haha" vs "mdr" : lequel est sincère ?', positionA: 'haha = sincère', positionB: 'mdr = sincère',
    ...randomStats(), status: 'open', category: 'communication', isNew: true,
  },
  {
    id: 'c6', emoji: '🎂', title: 'Souhaiter l\'anniv sur le mur FB : ça compte ?', positionA: 'Oui, c\'est l\'intention', positionB: 'Non, c\'est le minimum',
    ...randomStats(), status: 'open', category: 'communication',
  },
  {
    id: 'c7', emoji: '📞', title: 'Appeler sans prévenir par SMS d\'abord : ok ?', positionA: 'OK, c\'est spontané', positionB: 'Non, préviens !',
    ...randomStats(), status: 'open', category: 'communication',
  },
  {
    id: 'c8', emoji: '😊', title: 'Utiliser des emojis au travail : professionnel ?', positionA: 'Oui, c\'est humain', positionB: 'Non, c\'est pas sérieux',
    ...randomStats(), status: 'open', category: 'communication',
  },
  {
    id: 'c9', emoji: '📧', title: 'Les mails "Bien reçu, merci" : utiles ou pas ?', positionA: 'Utiles et polis', positionB: 'Pollution de boîte mail',
    ...randomStats(), status: 'open', category: 'communication',
  },
  {
    id: 'c10', emoji: '✅', title: '"D\'acc" ou "OK" : lequel est plus froid ?', positionA: 'D\'acc est plus froid', positionB: 'OK est plus froid',
    ...randomStats(), status: 'open', category: 'communication', isNew: true,
  },

  // ═══════════════════════════════════════════════════════════════
  // 🐾 ANIMAUX (6 procès)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'a1', emoji: '🐱', title: 'Les chats sont-ils supérieurs aux chiens ?', positionA: 'Oui, évidemment', positionB: 'Non, les chiens > tout',
    ...randomStats(), status: 'deliberation', category: 'animaux', timeLeft: '45min', isHot: true, votesA: 51, votesB: 49,
  },
  {
    id: 'a2', emoji: '🦆', title: 'Combattre 100 canards ou 1 cheval géant ?', positionA: '100 canards', positionB: '1 cheval géant',
    ...randomStats(), status: 'open', category: 'animaux',
  },
  {
    id: 'a3', emoji: '🐦', title: 'Les pigeons : mignons ou rats volants ?', positionA: 'Mignons et utiles', positionB: 'Rats volants dégueu',
    ...randomStats(), status: 'open', category: 'animaux',
  },
  {
    id: 'a4', emoji: '🐠', title: 'Les poissons : vrais animaux de compagnie ?', positionA: 'Oui, ils comptent', positionB: 'Non, c\'est de la déco',
    ...randomStats(), status: 'open', category: 'animaux', isNew: true,
  },
  {
    id: 'a5', emoji: '🐶', title: 'Parler à son chien en bébé : normal ou weird ?', positionA: 'Normal, il comprend', positionB: 'Weird et gênant',
    ...randomStats(), status: 'open', category: 'animaux',
  },
  {
    id: 'a6', emoji: '🦎', title: 'Avoir un reptile comme animal : cool ou flippant ?', positionA: 'Cool et original', positionB: 'Flippant et bizarre',
    ...randomStats(), status: 'open', category: 'animaux',
  },

  // ═══════════════════════════════════════════════════════════════
  // 🎬 POP CULTURE (8 procès)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'p1', emoji: '🦸', title: 'Superman VS Sangoku : qui gagne ?', positionA: 'Superman', positionB: 'Sangoku',
    ...randomStats(), status: 'deliberation', category: 'popculture', timeLeft: '30min', votesA: 35, votesB: 65, isHot: true,
  },
  {
    id: 'p2', emoji: '🧙', title: 'Harry Potter VS Star Wars : meilleure saga ?', positionA: 'Harry Potter', positionB: 'Star Wars',
    ...randomStats(), status: 'deliberation', category: 'popculture', timeLeft: '2h', votesA: 45, votesB: 55, isHot: true,
  },
  {
    id: 'p3', emoji: '🎅', title: 'Le Père Noël : devrait-il être au chômage ?', positionA: 'Oui, c\'est un mythe', positionB: 'Non, laissez la magie',
    ...randomStats(), status: 'open', category: 'popculture',
  },
  {
    id: 'p4', emoji: '🎬', title: 'Les remakes : bonne ou mauvaise idée ?', positionA: 'Bonne idée parfois', positionB: 'Toujours une mauvaise idée',
    ...randomStats(), status: 'open', category: 'popculture',
  },
  {
    id: 'p5', emoji: '📺', title: 'Friends VS How I Met Your Mother ?', positionA: 'Friends forever', positionB: 'HIMYM > tout',
    ...randomStats(), status: 'open', category: 'popculture', isNew: true,
  },
  {
    id: 'p6', emoji: '🎮', title: 'Les jeux vidéo : sport ou pas sport ?', positionA: 'Oui, c\'est un e-sport', positionB: 'Non, c\'est pas du sport',
    ...randomStats(), status: 'open', category: 'popculture',
  },
  {
    id: 'p7', emoji: '🎵', title: 'Jul : génie ou catastrophe musicale ?', positionA: 'Génie incompris', positionB: 'Catastrophe auditive',
    ...randomStats(), status: 'deliberation', category: 'popculture', timeLeft: '1h', votesA: 42, votesB: 58,
  },
  {
    id: 'p8', emoji: '🦖', title: 'Dinosaures à plumes : cool ou décevant ?', positionA: 'Cool, c\'est la science', positionB: 'Décevant, je veux des écailles',
    ...randomStats(), status: 'open', category: 'popculture',
  },

  // ═══════════════════════════════════════════════════════════════
  // 🤔 PHILOSOPHIE DÉBILE (8 procès)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'ph1', emoji: '🍳', title: 'L\'œuf ou la poule en premier ?', positionA: 'L\'œuf', positionB: 'La poule',
    ...randomStats(), status: 'open', category: 'philosophie', isHot: true,
  },
  {
    id: 'ph2', emoji: '🌳', title: 'Un arbre qui tombe sans témoin fait-il du bruit ?', positionA: 'Oui, physiquement', positionB: 'Non, pas de témoin',
    ...randomStats(), status: 'deliberation', category: 'philosophie', timeLeft: '3h', votesA: 65, votesB: 35,
  },
  {
    id: 'ph3', emoji: '🤖', title: 'Les robots auront-ils des droits un jour ?', positionA: 'Oui, c\'est inévitable', positionB: 'Non, ce sont des machines',
    ...randomStats(), status: 'open', category: 'philosophie',
  },
  {
    id: 'ph4', emoji: '🌙', title: 'On dort vraiment ou on fait que cligner longtemps ?', positionA: 'On dort vraiment', positionB: 'Long clignotement',
    ...randomStats(), status: 'open', category: 'philosophie', isNew: true,
  },
  {
    id: 'ph5', emoji: '🧠', title: 'Est-ce qu\'on pense ou on EST nos pensées ?', positionA: 'On pense', positionB: 'On EST nos pensées',
    ...randomStats(), status: 'open', category: 'philosophie',
  },
  {
    id: 'ph6', emoji: '⏱️', title: 'Le temps existe-t-il ou on l\'a inventé ?', positionA: 'Il existe vraiment', positionB: 'On l\'a inventé',
    ...randomStats(), status: 'open', category: 'philosophie',
  },
  {
    id: 'ph7', emoji: '🎭', title: 'On est tous des PNJ dans la vie de quelqu\'un ?', positionA: 'Oui, forcément', positionB: 'Non, on est tous les héros',
    ...randomStats(), status: 'open', category: 'philosophie',
  },
  {
    id: 'ph8', emoji: '🔮', title: 'Si on pouvait voir le futur, le changerait-on ?', positionA: 'Oui, bien sûr', positionB: 'Non, c\'est le destin',
    ...randomStats(), status: 'open', category: 'philosophie', isNew: true,
  },

  // ═══════════════════════════════════════════════════════════════
  // 💼 BUREAU / TRAVAIL (8 procès)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'w1', emoji: '💼', title: 'Le télétravail : liberté ou prison dorée ?', positionA: 'Liberté totale', positionB: 'Prison dorée',
    ...randomStats(), status: 'deliberation', category: 'bureau', timeLeft: '2h', votesA: 72, votesB: 28, isHot: true,
  },
  {
    id: 'w2', emoji: '☕', title: 'La machine à café : lieu de perdition ?', positionA: 'Non, networking utile', positionB: 'Oui, perte de temps',
    ...randomStats(), status: 'open', category: 'bureau',
  },
  {
    id: 'w3', emoji: '🎧', title: 'Mettre des écouteurs = ne me parlez pas ?', positionA: 'Oui, c\'est le code', positionB: 'Non, on peut déranger',
    ...randomStats(), status: 'open', category: 'bureau',
  },
  {
    id: 'w4', emoji: '📅', title: 'Les réunions qui pouvaient être un mail ?', positionA: 'Inévitable parfois', positionB: 'Crime contre la productivité',
    ...randomStats(), status: 'deliberation', category: 'bureau', timeLeft: '1h', votesA: 15, votesB: 85, isHot: true,
  },
  {
    id: 'w5', emoji: '🍽️', title: 'Manger à son bureau : acceptable ?', positionA: 'Oui, gain de temps', positionB: 'Non, c\'est dégueu',
    ...randomStats(), status: 'open', category: 'bureau',
  },
  {
    id: 'w6', emoji: '🏃', title: 'Partir à 17h pile : mal vu ou légitime ?', positionA: 'Légitime et sain', positionB: 'Mal vu, faut rester',
    ...randomStats(), status: 'open', category: 'bureau', isNew: true,
  },
  {
    id: 'w7', emoji: '📧', title: 'CC ton boss dans tous les mails : prudent ou parano ?', positionA: 'Prudent et malin', positionB: 'Parano et relou',
    ...randomStats(), status: 'open', category: 'bureau',
  },
  {
    id: 'w8', emoji: '🎉', title: 'Les pots de départ : obligation ou plaisir ?', positionA: 'Plaisir convivial', positionB: 'Obligation pénible',
    ...randomStats(), status: 'open', category: 'bureau',
  },
]

// Sujets suggérés pour créer un procès (organisés par catégorie)
const suggestedTopics = [
  // 🍽️ BOUFFE
  { emoji: '🥛', title: 'Le lait avant ou après les céréales ?', a: 'Lait d\'abord', b: 'Céréales d\'abord', category: 'bouffe' },
  { emoji: '🍕', title: 'L\'ananas sur la pizza : délice ou hérésie ?', a: 'Délice tropical', b: 'Hérésie culinaire', category: 'bouffe' },
  { emoji: '🍫', title: 'Chocolatine ou pain au chocolat ?', a: 'Chocolatine', b: 'Pain au chocolat', category: 'bouffe' },
  { emoji: '🍝', title: 'Casser les spaghettis : pratique ou sacrilège ?', a: 'Pratique', b: 'Sacrilège', category: 'bouffe' },
  { emoji: '🥐', title: 'Croissant au beurre ou ordinaire ?', a: 'Beurre ou rien', b: 'Peu importe', category: 'bouffe' },
  { emoji: '🍳', title: 'L\'œuf au plat : cuit ou coulant ?', a: 'Bien cuit', b: 'Coulant sinon rien', category: 'bouffe' },
  { emoji: '☕', title: 'Café soluble : acceptable ou pas ?', a: 'Acceptable', b: 'Crime contre l\'humanité', category: 'bouffe' },
  { emoji: '🧀', title: 'La raclette en été : normal ou bizarre ?', a: 'Normal, c\'est trop bon', b: 'Bizarre et déplacé', category: 'bouffe' },
  { emoji: '🥖', title: 'Le bout du pain : le meilleur ou le pire ?', a: 'Le meilleur !', b: 'Le pire, jetez-le', category: 'bouffe' },
  { emoji: '🍟', title: 'Les frites : mayo ou ketchup ?', a: 'Mayo forever', b: 'Ketchup gang', category: 'bouffe' },
  { emoji: '🍪', title: 'Cookies : moelleux ou croquants ?', a: 'Moelleux', b: 'Croquants', category: 'bouffe' },
  { emoji: '🥗', title: 'La salade : plat principal ou accompagnement ?', a: 'Plat principal', b: 'Juste accompagnement', category: 'bouffe' },

  // 🏠 VIE QUOTIDIENNE
  { emoji: '🛏️', title: 'Faire son lit le matin : utile ou dictature ?', a: 'Utile et important', b: 'Dictature inutile', category: 'quotidien' },
  { emoji: '🚿', title: 'Se doucher le matin ou le soir ?', a: 'Matin', b: 'Soir', category: 'quotidien' },
  { emoji: '🧻', title: 'Papier toilette : dessus ou dessous ?', a: 'Dessus', b: 'Dessous', category: 'quotidien' },
  { emoji: '🧦', title: 'Chaussettes dans les sandales : génie ou crime ?', a: 'Génie incompris', b: 'Crime de mode', category: 'quotidien' },
  { emoji: '⏰', title: 'Mettre 10 alarmes le matin : stratégie ou torture ?', a: 'Stratégie de survie', b: 'Auto-torture inutile', category: 'quotidien' },
  { emoji: '🚗', title: 'Klaxonner dès que le feu est vert : légitime ?', a: 'Légitime, faut avancer', b: 'Relou et inutile', category: 'quotidien' },
  { emoji: '📦', title: 'Garder les boîtes vides "au cas où" : sage ou fou ?', a: 'Sage prévoyance', b: 'Symptôme de folie', category: 'quotidien' },
  { emoji: '🛒', title: 'Prendre un caddie pour 3 articles : ok ou pas ?', a: 'OK, on sait jamais', b: 'Prends un panier !', category: 'quotidien' },
  { emoji: '🚪', title: 'Sonner chez quelqu\'un sans prévenir : acceptable ?', a: 'Oui, c\'est convivial', b: 'Non, c\'est l\'horreur', category: 'quotidien' },
  { emoji: '📱', title: 'Regarder son tel aux toilettes : hygiénique ?', a: 'Pas de jugement', b: 'Absolument dégueu', category: 'quotidien' },

  // 💬 COMMUNICATION
  { emoji: '📱', title: 'Répondre "OK" à un long message : acceptable ?', a: 'Acceptable', b: 'Crime relationnel', category: 'communication' },
  { emoji: '🔊', title: 'Vocaux de 3 minutes : pratique ou torture ?', a: 'Pratique et vivant', b: 'Torture auditive', category: 'communication' },
  { emoji: '👀', title: '"Vu" sans réponse : c\'est grave ?', a: 'Non, on a le droit', b: 'Oui, c\'est violent', category: 'communication' },
  { emoji: '📺', title: 'Regarder la fin d\'une série sans l\'autre : trahison ?', a: 'Non, c\'est ma vie', b: 'Trahison impardonnable', category: 'communication' },
  { emoji: '💬', title: 'Les "haha" vs "mdr" : lequel est sincère ?', a: 'haha = sincère', b: 'mdr = sincère', category: 'communication' },
  { emoji: '🎂', title: 'Souhaiter l\'anniv sur le mur FB : ça compte ?', a: 'Oui, c\'est l\'intention', b: 'Non, c\'est le minimum', category: 'communication' },
  { emoji: '📞', title: 'Appeler sans prévenir par SMS d\'abord : ok ?', a: 'OK, c\'est spontané', b: 'Non, préviens !', category: 'communication' },
  { emoji: '😊', title: 'Utiliser des emojis au travail : professionnel ?', a: 'Oui, c\'est humain', b: 'Non, c\'est pas sérieux', category: 'communication' },
  { emoji: '📧', title: 'Les mails "Bien reçu, merci" : utiles ou pas ?', a: 'Utiles et polis', b: 'Pollution de boîte mail', category: 'communication' },
  { emoji: '✅', title: '"D\'acc" ou "OK" : lequel est plus froid ?', a: 'D\'acc est plus froid', b: 'OK est plus froid', category: 'communication' },

  // 🐾 ANIMAUX
  { emoji: '🐱', title: 'Les chats sont-ils supérieurs aux chiens ?', a: 'Oui, évidemment', b: 'Non, les chiens > tout', category: 'animaux' },
  { emoji: '🦆', title: 'Combattre 100 canards ou 1 cheval géant ?', a: '100 canards', b: '1 cheval géant', category: 'animaux' },
  { emoji: '🐦', title: 'Les pigeons : mignons ou rats volants ?', a: 'Mignons et utiles', b: 'Rats volants dégueu', category: 'animaux' },
  { emoji: '🐠', title: 'Les poissons : vrais animaux de compagnie ?', a: 'Oui, ils comptent', b: 'Non, c\'est de la déco', category: 'animaux' },
  { emoji: '🐶', title: 'Parler à son chien en bébé : normal ou weird ?', a: 'Normal, il comprend', b: 'Weird et gênant', category: 'animaux' },
  { emoji: '🦎', title: 'Avoir un reptile comme animal : cool ou flippant ?', a: 'Cool et original', b: 'Flippant et bizarre', category: 'animaux' },

  // 🎬 POP CULTURE
  { emoji: '🦸', title: 'Superman VS Sangoku : qui gagne ?', a: 'Superman', b: 'Sangoku', category: 'popculture' },
  { emoji: '🧙', title: 'Harry Potter VS Star Wars : meilleure saga ?', a: 'Harry Potter', b: 'Star Wars', category: 'popculture' },
  { emoji: '🎅', title: 'Le Père Noël : devrait-il être au chômage ?', a: 'Oui, c\'est un mythe', b: 'Non, laissez la magie', category: 'popculture' },
  { emoji: '🎬', title: 'Les remakes : bonne ou mauvaise idée ?', a: 'Bonne idée parfois', b: 'Toujours une mauvaise idée', category: 'popculture' },
  { emoji: '📺', title: 'Friends VS How I Met Your Mother ?', a: 'Friends forever', b: 'HIMYM > tout', category: 'popculture' },
  { emoji: '🎮', title: 'Les jeux vidéo : sport ou pas sport ?', a: 'Oui, c\'est un e-sport', b: 'Non, c\'est pas du sport', category: 'popculture' },
  { emoji: '🎵', title: 'Jul : génie ou catastrophe musicale ?', a: 'Génie incompris', b: 'Catastrophe auditive', category: 'popculture' },
  { emoji: '🦖', title: 'Dinosaures à plumes : cool ou décevant ?', a: 'Cool, c\'est la science', b: 'Décevant, je veux des écailles', category: 'popculture' },

  // 🤔 PHILOSOPHIE DÉBILE
  { emoji: '🍳', title: 'L\'œuf ou la poule en premier ?', a: 'L\'œuf', b: 'La poule', category: 'philosophie' },
  { emoji: '🌳', title: 'Un arbre qui tombe sans témoin fait-il du bruit ?', a: 'Oui, physiquement', b: 'Non, pas de témoin', category: 'philosophie' },
  { emoji: '🤖', title: 'Les robots auront-ils des droits un jour ?', a: 'Oui, c\'est inévitable', b: 'Non, ce sont des machines', category: 'philosophie' },
  { emoji: '🌙', title: 'On dort vraiment ou on fait que cligner longtemps ?', a: 'On dort vraiment', b: 'Long clignotement', category: 'philosophie' },
  { emoji: '🧠', title: 'Est-ce qu\'on pense ou on EST nos pensées ?', a: 'On pense', b: 'On EST nos pensées', category: 'philosophie' },
  { emoji: '⏱️', title: 'Le temps existe-t-il ou on l\'a inventé ?', a: 'Il existe vraiment', b: 'On l\'a inventé', category: 'philosophie' },
  { emoji: '🎭', title: 'On est tous des PNJ dans la vie de quelqu\'un ?', a: 'Oui, forcément', b: 'Non, on est tous les héros', category: 'philosophie' },
  { emoji: '🔮', title: 'Si on pouvait voir le futur, le changerait-on ?', a: 'Oui, bien sûr', b: 'Non, c\'est le destin', category: 'philosophie' },

  // 💼 BUREAU / TRAVAIL
  { emoji: '💼', title: 'Le télétravail : liberté ou prison dorée ?', a: 'Liberté totale', b: 'Prison dorée', category: 'bureau' },
  { emoji: '☕', title: 'La machine à café : lieu de perdition ?', a: 'Non, networking utile', b: 'Oui, perte de temps', category: 'bureau' },
  { emoji: '🎧', title: 'Mettre des écouteurs = ne me parlez pas ?', a: 'Oui, c\'est le code', b: 'Non, on peut déranger', category: 'bureau' },
  { emoji: '📅', title: 'Les réunions qui pouvaient être un mail ?', a: 'Inévitable parfois', b: 'Crime contre la productivité', category: 'bureau' },
  { emoji: '🍽️', title: 'Manger à son bureau : acceptable ?', a: 'Oui, gain de temps', b: 'Non, c\'est dégueu', category: 'bureau' },
  { emoji: '🏃', title: 'Partir à 17h pile : mal vu ou légitime ?', a: 'Légitime et sain', b: 'Mal vu, faut rester', category: 'bureau' },
  { emoji: '📧', title: 'CC ton boss dans tous les mails : prudent ou parano ?', a: 'Prudent et malin', b: 'Parano et relou', category: 'bureau' },
  { emoji: '🎉', title: 'Les pots de départ : obligation ou plaisir ?', a: 'Plaisir convivial', b: 'Obligation pénible', category: 'bureau' },
]

export default function ProcesPage() {
  const { user } = useUser()
  const [step, setStep] = useState<GameStep>('lobby')
  const [selectedTrial, setSelectedTrial] = useState<Trial | null>(null)
  const [role, setRole] = useState<Role | null>(null)
  const [position, setPosition] = useState<Position | null>(null)
  const [argument, setArgument] = useState('')
  const [myArgument, setMyArgument] = useState<Argument | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [finalVote, setFinalVote] = useState<Position | null>(null)
  const [showVerdict, setShowVerdict] = useState(false)

  // Création de procès
  const [newTrial, setNewTrial] = useState({
    title: '',
    emoji: '⚖️',
    positionA: '',
    positionB: '',
    duration: '24',
    visibility: 'public',
  })
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [lobbyCategory, setLobbyCategory] = useState<string | null>(null)

  // Filtrer les sujets par catégorie (pour création)
  const filteredTopics = selectedCategory
    ? suggestedTopics.filter(t => t.category === selectedCategory)
    : suggestedTopics

  // Filtrer les procès par catégorie (pour lobby)
  const filteredTrials = lobbyCategory
    ? mockTrials.filter(t => t.category === lobbyCategory)
    : mockTrials

  // Grouper les procès par catégorie pour affichage
  const trialsByCategory = trialCategories.map(cat => ({
    ...cat,
    trials: mockTrials.filter(t => t.category === cat.id),
  }))

  const handleJoinTrial = (trial: Trial) => {
    setSelectedTrial(trial)
    setStep('join')
  }

  const handleSelectRole = (selectedRole: Role) => {
    setRole(selectedRole)
    if (selectedRole === 'lawyer') {
      setStep('choose_side')
    } else {
      setStep('courtroom')
    }
  }

  const handleSelectPosition = (pos: Position) => {
    setPosition(pos)
    setStep('write_argument')
  }

  const handleSubmitArgument = () => {
    if (!argument.trim() || !selectedTrial) return

    const newArg: Argument = {
      id: 'own',
      username: user.pseudo || 'Toi',
      avatar: '🧑',
      content: argument,
      upvotes: 0,
      downvotes: 0,
      position: position!,
      isOwn: true,
    }
    setMyArgument(newArg)
    setStep('courtroom')
  }

  const handleVoteArgument = (argId: string, voteType: 'up' | 'down') => {
    // Simuler le vote (sera remplacé par Supabase)
    console.log(`Vote ${voteType} on argument ${argId}`)
  }

  const handleFinalVote = (pos: Position) => {
    setFinalVote(pos)
    setHasVoted(true)
  }

  const handleShowVerdict = () => {
    setShowVerdict(true)
    setStep('verdict')
  }

  const handleCreateTrial = () => {
    // Simuler la création (sera remplacé par Supabase)
    console.log('Creating trial:', newTrial)
    alert('Tribunal créé ! (En démo)')
    setStep('lobby')
  }

  const resetGame = () => {
    setStep('lobby')
    setSelectedTrial(null)
    setRole(null)
    setPosition(null)
    setArgument('')
    setMyArgument(null)
    setHasVoted(false)
    setFinalVote(null)
    setShowVerdict(false)
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Background */}
      <div className="fixed inset-0 z-0" style={{ background: 'linear-gradient(180deg, #1A0033 0%, #2D0A4E 50%, #1A0033 100%)' }} />

      <style jsx>{`
        .trial-card {
          background: rgba(255, 255, 255, 0.03);
          border: 2px solid rgba(139, 69, 19, 0.4);
          border-radius: 16px;
          padding: 20px;
          transition: all 0.3s;
          cursor: pointer;
        }
        .trial-card:hover {
          border-color: #DAA520;
          box-shadow: 0 0 30px rgba(218, 165, 32, 0.3);
          transform: translateY(-3px);
        }
        .role-card {
          background: rgba(255, 255, 255, 0.05);
          border: 3px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 30px;
          text-align: center;
          transition: all 0.3s;
          cursor: pointer;
          flex: 1;
        }
        .role-card:hover {
          border-color: #DAA520;
          box-shadow: 0 0 30px rgba(218, 165, 32, 0.4);
          transform: scale(1.02);
        }
        .position-card {
          background: rgba(255, 255, 255, 0.05);
          border: 3px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 25px;
          text-align: center;
          transition: all 0.3s;
          cursor: pointer;
          flex: 1;
        }
        .position-card:hover {
          transform: scale(1.02);
        }
        .position-card.position-a:hover {
          border-color: #FF6B6B;
          box-shadow: 0 0 30px rgba(255, 107, 107, 0.4);
        }
        .position-card.position-b:hover {
          border-color: #4ECDC4;
          box-shadow: 0 0 30px rgba(78, 205, 196, 0.4);
        }
        .argument-card {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 12px;
          border-left: 4px solid;
        }
        .argument-card.position-a {
          border-left-color: #FF6B6B;
        }
        .argument-card.position-b {
          border-left-color: #4ECDC4;
        }
        .vote-btn {
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
          transition: all 0.2s;
          border: 2px solid transparent;
        }
        .vote-btn:hover {
          transform: scale(1.1);
        }
        .vote-btn.up {
          background: rgba(57, 255, 20, 0.2);
          color: #39FF14;
        }
        .vote-btn.up:hover {
          border-color: #39FF14;
        }
        .vote-btn.down {
          background: rgba(255, 49, 49, 0.2);
          color: #FF3131;
        }
        .vote-btn.down:hover {
          border-color: #FF3131;
        }
        .gavel-animation {
          animation: gavel 0.5s ease-in-out;
        }
        @keyframes gavel {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-30deg); }
        }
        .progress-bar {
          height: 24px;
          border-radius: 12px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
        }
        .progress-a {
          background: linear-gradient(90deg, #FF6B6B, #FF8E8E);
          transition: width 0.5s ease;
        }
        .progress-b {
          background: linear-gradient(90deg, #4ECDC4, #7EDDD6);
          transition: width 0.5s ease;
        }
        .badge-hot {
          background: linear-gradient(135deg, #FF6B6B, #FF8E53);
          color: white;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: bold;
        }
        .badge-new {
          background: linear-gradient(135deg, #39FF14, #00D4AA);
          color: #0D001A;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: bold;
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .trial-card {
            padding: 16px;
          }
          .role-card, .position-card {
            padding: 20px;
          }
          .argument-card {
            padding: 12px;
          }
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-40 relative">
        <div className="h-1 bg-gradient-to-r from-[#8B4513] via-[#DAA520] to-[#8B4513]" />
        <div className="bg-[#1A0033]/95 backdrop-blur-sm px-4 py-4">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <Link href="/games" className="text-white/60 hover:text-white transition flex items-center gap-2">
              <span>←</span>
              <span>Retour</span>
            </Link>
            <h1 className="text-xl font-bold flex items-center gap-2" style={{ fontFamily: 'Bangers, cursive', color: '#DAA520', textShadow: '0 0 15px #DAA520' }}>
              <span className="text-2xl">⚖️</span>
              Le Procès Absurde
            </h1>
            <div className="w-16" />
          </div>
        </div>
      </header>

      {/* Contenu principal - CENTRÉ */}
      <main className="relative z-10" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', paddingTop: '2rem' }}>

        {/* LOBBY - Liste des procès */}
        {step === 'lobby' && (
          <div>
            <div className="text-center mb-6">
              <p className="text-[#DAA520] font-bold text-lg" style={{ textShadow: '0 0 10px #DAA520' }}>
                "Défends l'indéfendable"
              </p>
              <p className="text-white/50 text-sm mt-1">
                {mockTrials.length} procès disponibles
              </p>
            </div>

            {/* Filtres par catégorie */}
            <div className="mb-6">
              <div className="flex gap-2 flex-wrap justify-center">
                <button
                  onClick={() => setLobbyCategory(null)}
                  className="px-4 py-2 rounded-full text-sm font-bold transition"
                  style={{
                    background: !lobbyCategory ? 'linear-gradient(135deg, #DAA520 0%, #FFD700 100%)' : 'rgba(255, 255, 255, 0.05)',
                    border: !lobbyCategory ? 'none' : '2px solid rgba(255, 255, 255, 0.1)',
                    color: !lobbyCategory ? '#1A0033' : 'rgba(255, 255, 255, 0.6)',
                  }}
                >
                  🎯 Tous ({mockTrials.length})
                </button>
                {trialCategories.map(cat => {
                  const count = mockTrials.filter(t => t.category === cat.id).length
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setLobbyCategory(cat.id)}
                      className="px-4 py-2 rounded-full text-sm font-bold transition"
                      style={{
                        background: lobbyCategory === cat.id ? 'linear-gradient(135deg, #DAA520 0%, #FFD700 100%)' : 'rgba(255, 255, 255, 0.05)',
                        border: lobbyCategory === cat.id ? 'none' : '2px solid rgba(255, 255, 255, 0.1)',
                        color: lobbyCategory === cat.id ? '#1A0033' : 'rgba(255, 255, 255, 0.6)',
                      }}
                    >
                      {cat.emoji} {cat.name} ({count})
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Affichage des procès */}
            {lobbyCategory ? (
              /* Vue filtrée par catégorie */
              <div className="mb-8">
                <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <span className="text-xl">{trialCategories.find(c => c.id === lobbyCategory)?.emoji}</span>
                  {trialCategories.find(c => c.id === lobbyCategory)?.name.toUpperCase()}
                  <span className="text-white/40 text-sm ml-2">({filteredTrials.length} procès)</span>
                </h2>
                <div className="space-y-3">
                  {filteredTrials.map(trial => (
                    <div
                      key={trial.id}
                      className="trial-card"
                      onClick={() => handleJoinTrial(trial)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">{trial.emoji}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="text-white font-bold text-sm">{trial.title}</h3>
                            {trial.isHot && <span className="badge-hot">🔥 HOT</span>}
                            {trial.isNew && <span className="badge-new">✨ NEW</span>}
                          </div>
                          <p className="text-white/60 text-xs mb-2">
                            {trial.lawyersCount} avocats • {trial.juryCount} jurés
                            {trial.status === 'deliberation' && trial.timeLeft && (
                              <span className="text-[#DAA520]"> • ⏱️ {trial.timeLeft}</span>
                            )}
                            {trial.status === 'open' && (
                              <span className="text-[#39FF14]"> • Ouvert</span>
                            )}
                          </p>
                          {trial.status === 'deliberation' && trial.votesA && trial.votesB && (
                            <div className="progress-bar mt-2" style={{ height: '16px' }}>
                              <div className="progress-a" style={{ width: `${trial.votesA}%` }}>
                                <span className="text-[10px] font-bold px-1">{trial.votesA}%</span>
                              </div>
                              <div className="progress-b" style={{ width: `${trial.votesB}%` }}>
                                <span className="text-[10px] font-bold px-1">{trial.votesB}%</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="text-white/40 text-xl">›</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Vue par catégorie (tous) */
              <div className="space-y-8 mb-8">
                {trialsByCategory.map(category => (
                  <div key={category.id}>
                    <h2 className="text-white font-bold text-lg mb-3 flex items-center gap-2 sticky top-20 bg-[#1A0033]/95 py-2 -mx-2 px-2 z-10 backdrop-blur-sm">
                      <span className="text-xl">{category.emoji}</span>
                      {category.name.toUpperCase()}
                      <span className="text-white/40 text-sm ml-2">({category.trials.length})</span>
                    </h2>
                    <div className="space-y-3">
                      {category.trials.map(trial => (
                        <div
                          key={trial.id}
                          className="trial-card"
                          onClick={() => handleJoinTrial(trial)}
                        >
                          <div className="flex items-start gap-4">
                            <div className="text-3xl">{trial.emoji}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h3 className="text-white font-bold text-sm">{trial.title}</h3>
                                {trial.isHot && <span className="badge-hot">🔥 HOT</span>}
                                {trial.isNew && <span className="badge-new">✨ NEW</span>}
                              </div>
                              <p className="text-white/60 text-xs mb-2">
                                {trial.lawyersCount} avocats • {trial.juryCount} jurés
                                {trial.status === 'deliberation' && trial.timeLeft && (
                                  <span className="text-[#DAA520]"> • ⏱️ {trial.timeLeft}</span>
                                )}
                                {trial.status === 'open' && (
                                  <span className="text-[#39FF14]"> • Ouvert</span>
                                )}
                              </p>
                              {trial.status === 'deliberation' && trial.votesA && trial.votesB && (
                                <div className="progress-bar mt-2" style={{ height: '16px' }}>
                                  <div className="progress-a" style={{ width: `${trial.votesA}%` }}>
                                    <span className="text-[10px] font-bold px-1">{trial.votesA}%</span>
                                  </div>
                                  <div className="progress-b" style={{ width: `${trial.votesB}%` }}>
                                    <span className="text-[10px] font-bold px-1">{trial.votesB}%</span>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="text-white/40 text-xl">›</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3 sticky bottom-4">
              <button
                onClick={() => setStep('create')}
                className="w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3"
                style={{ background: 'linear-gradient(135deg, #DAA520 0%, #FFD700 100%)', color: '#1A0033', boxShadow: '0 4px 20px rgba(218, 165, 32, 0.4)' }}
              >
                <span className="text-xl">➕</span>
                CRÉER MON PROCÈS
              </button>

              <button
                className="w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3"
                style={{ background: 'rgba(26, 0, 51, 0.95)', border: '2px solid rgba(218, 165, 32, 0.4)', color: '#DAA520' }}
              >
                <span className="text-xl">📜</span>
                VOIR LES PROCÈS DE MES POTES
              </button>
            </div>
          </div>
        )}

        {/* JOIN - Choisir son rôle */}
        {step === 'join' && selectedTrial && (
          <div>
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{selectedTrial.emoji}</div>
              <h2 className="text-2xl text-white font-bold mb-2" style={{ textShadow: '0 0 15px #DAA520' }}>
                {selectedTrial.title}
              </h2>
              <p className="text-white/60">
                {selectedTrial.lawyersCount} avocats • {selectedTrial.juryCount} membres du jury
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-[#DAA520] font-bold text-center mb-6 text-lg">
                Tu veux être :
              </h3>

              <div className="flex gap-4">
                <div
                  className="role-card"
                  onClick={() => handleSelectRole('lawyer')}
                >
                  <div className="text-5xl mb-4">👨‍⚖️</div>
                  <h4 className="text-xl text-white font-bold mb-2">AVOCAT</h4>
                  <p className="text-white/60 text-sm">
                    Je plaide et je défends ma position !
                  </p>
                </div>

                <div
                  className="role-card"
                  onClick={() => handleSelectRole('jury')}
                >
                  <div className="text-5xl mb-4">🧑‍⚖️</div>
                  <h4 className="text-xl text-white font-bold mb-2">MEMBRE DU JURY</h4>
                  <p className="text-white/60 text-sm">
                    Je regarde les débats et je vote
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep('lobby')}
              className="w-full py-3 text-white/50 hover:text-white transition"
            >
              ← Retour aux procès
            </button>
          </div>
        )}

        {/* CHOOSE SIDE - Choisir son camp (avocat) */}
        {step === 'choose_side' && selectedTrial && (
          <div>
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">{selectedTrial.emoji}</div>
              <h2 className="text-xl text-white font-bold mb-2">
                {selectedTrial.title}
              </h2>
            </div>

            <div className="mb-6">
              <h3 className="text-[#DAA520] font-bold text-center mb-6 text-lg">
                Choisis ton camp :
              </h3>

              <div className="flex gap-4">
                <div
                  className="position-card position-a"
                  onClick={() => handleSelectPosition('a')}
                >
                  <div className="text-4xl mb-3">🔴</div>
                  <h4 className="text-lg text-[#FF6B6B] font-bold mb-2">
                    {selectedTrial.positionA}
                  </h4>
                  <p className="text-white/50 text-sm">
                    {Math.floor(selectedTrial.lawyersCount / 2)} avocats
                  </p>
                </div>

                <div
                  className="position-card position-b"
                  onClick={() => handleSelectPosition('b')}
                >
                  <div className="text-4xl mb-3">🔵</div>
                  <h4 className="text-lg text-[#4ECDC4] font-bold mb-2">
                    {selectedTrial.positionB}
                  </h4>
                  <p className="text-white/50 text-sm">
                    {Math.ceil(selectedTrial.lawyersCount / 2)} avocats
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl mb-6" style={{ background: 'rgba(218, 165, 32, 0.1)', border: '2px dashed rgba(218, 165, 32, 0.4)' }}>
              <p className="text-[#DAA520] text-sm text-center">
                ⚠️ <strong>Attention :</strong> tu défends peut-être l'inverse de ce que tu penses vraiment. C'est ça le fun !
              </p>
            </div>

            <button
              onClick={() => setStep('join')}
              className="w-full py-3 text-white/50 hover:text-white transition"
            >
              ← Retour
            </button>
          </div>
        )}

        {/* WRITE ARGUMENT - Écrire son plaidoyer */}
        {step === 'write_argument' && selectedTrial && position && (
          <div>
            <div className="text-center mb-6">
              <p className="text-white/60 text-sm mb-2">⚖️ TON PLAIDOYER</p>
              <h2 className="text-xl text-white font-bold">
                Tu défends : <span style={{ color: position === 'a' ? '#FF6B6B' : '#4ECDC4' }}>
                  {position === 'a' ? selectedTrial.positionA : selectedTrial.positionB}
                </span>
              </h2>
            </div>

            <div className="mb-6">
              <label className="text-white/60 text-sm mb-2 block">
                Écris ton argumentaire (max 500 caractères) :
              </label>
              <textarea
                value={argument}
                onChange={(e) => setArgument(e.target.value.slice(0, 500))}
                placeholder="Mesdames et messieurs les jurés..."
                className="w-full p-4 rounded-xl text-white placeholder-white/30 resize-none"
                style={{ background: 'rgba(255, 255, 255, 0.05)', border: '2px solid rgba(218, 165, 32, 0.4)', minHeight: '200px' }}
              />
              <div className="flex justify-between mt-2">
                <p className="text-white/40 text-xs">
                  💡 Tips : Sois passionné(e), absurde, drôle !
                </p>
                <p className="text-white/40 text-xs">{argument.length}/500</p>
              </div>
            </div>

            <button
              onClick={handleSubmitArgument}
              disabled={argument.length < 20}
              className="w-full py-4 rounded-xl font-bold text-lg"
              style={{
                background: argument.length >= 20 ? 'linear-gradient(135deg, #DAA520 0%, #FFD700 100%)' : 'rgba(255, 255, 255, 0.1)',
                color: argument.length >= 20 ? '#1A0033' : 'rgba(255, 255, 255, 0.3)',
                cursor: argument.length >= 20 ? 'pointer' : 'not-allowed',
              }}
            >
              SOUMETTRE MON PLAIDOYER
            </button>

            <button
              onClick={() => setStep('choose_side')}
              className="w-full py-3 mt-3 text-white/50 hover:text-white transition"
            >
              ← Retour
            </button>
          </div>
        )}

        {/* COURTROOM - Salle d'audience */}
        {step === 'courtroom' && selectedTrial && (
          <div>
            <div className="text-center mb-6">
              <p className="text-white/60 text-sm mb-1">⚖️ TRIBUNAL EN SESSION</p>
              <h2 className="text-xl text-white font-bold flex items-center justify-center gap-2">
                <span>{selectedTrial.emoji}</span>
                {selectedTrial.title}
              </h2>
            </div>

            {/* Colonnes des arguments */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-[#FF6B6B] font-bold text-sm mb-3 text-center">
                  TEAM {selectedTrial.positionA.toUpperCase()}
                </h3>
                {selectedTrial.arguments?.filter(a => a.position === 'a').map(arg => (
                  <div key={arg.id} className="argument-card position-a">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{arg.avatar}</span>
                      <span className="text-white font-bold text-sm">{arg.username}</span>
                    </div>
                    <p className="text-white/80 text-sm mb-3">"{arg.content}"</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVoteArgument(arg.id, 'up')}
                        className="vote-btn up text-xs"
                      >
                        👍 {arg.upvotes}
                      </button>
                      <button
                        onClick={() => handleVoteArgument(arg.id, 'down')}
                        className="vote-btn down text-xs"
                      >
                        👎 {arg.downvotes}
                      </button>
                    </div>
                  </div>
                ))}
                {myArgument && myArgument.position === 'a' && (
                  <div className="argument-card position-a" style={{ border: '2px solid #DAA520' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{myArgument.avatar}</span>
                      <span className="text-[#DAA520] font-bold text-sm">Toi ⭐</span>
                    </div>
                    <p className="text-white/80 text-sm mb-3">"{myArgument.content}"</p>
                    <div className="flex gap-2">
                      <span className="text-xs text-white/40">👍 {myArgument.upvotes}</span>
                      <span className="text-xs text-white/40">👎 {myArgument.downvotes}</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-[#4ECDC4] font-bold text-sm mb-3 text-center">
                  TEAM {selectedTrial.positionB.toUpperCase()}
                </h3>
                {selectedTrial.arguments?.filter(a => a.position === 'b').map(arg => (
                  <div key={arg.id} className="argument-card position-b">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{arg.avatar}</span>
                      <span className="text-white font-bold text-sm">{arg.username}</span>
                    </div>
                    <p className="text-white/80 text-sm mb-3">"{arg.content}"</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVoteArgument(arg.id, 'up')}
                        className="vote-btn up text-xs"
                      >
                        👍 {arg.upvotes}
                      </button>
                      <button
                        onClick={() => handleVoteArgument(arg.id, 'down')}
                        className="vote-btn down text-xs"
                      >
                        👎 {arg.downvotes}
                      </button>
                    </div>
                  </div>
                ))}
                {myArgument && myArgument.position === 'b' && (
                  <div className="argument-card position-b" style={{ border: '2px solid #DAA520' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{myArgument.avatar}</span>
                      <span className="text-[#DAA520] font-bold text-sm">Toi ⭐</span>
                    </div>
                    <p className="text-white/80 text-sm mb-3">"{myArgument.content}"</p>
                    <div className="flex gap-2">
                      <span className="text-xs text-white/40">👍 {myArgument.upvotes}</span>
                      <span className="text-xs text-white/40">👎 {myArgument.downvotes}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Votes en cours */}
            <div className="p-4 rounded-xl mb-6" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '2px solid rgba(218, 165, 32, 0.3)' }}>
              <h4 className="text-[#DAA520] font-bold text-sm mb-3 text-center">📊 VOTES EN COURS</h4>

              <div className="progress-bar mb-2">
                <div className="progress-a flex items-center justify-start" style={{ width: `${selectedTrial.votesA || 50}%` }}>
                  <span className="text-xs font-bold px-2">{selectedTrial.positionA} {selectedTrial.votesA || 50}%</span>
                </div>
                <div className="progress-b flex items-center justify-end" style={{ width: `${selectedTrial.votesB || 50}%` }}>
                  <span className="text-xs font-bold px-2">{selectedTrial.votesB || 50}% {selectedTrial.positionB}</span>
                </div>
              </div>

              {selectedTrial.timeLeft && (
                <p className="text-center text-white/60 text-sm">
                  ⏱️ Délibération dans {selectedTrial.timeLeft}
                </p>
              )}
            </div>

            {/* Actions selon le rôle */}
            {role === 'jury' && !hasVoted && (
              <div className="mb-6">
                <h4 className="text-white font-bold text-center mb-4">🗳️ TON VOTE</h4>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleFinalVote('a')}
                    className="flex-1 py-4 rounded-xl font-bold"
                    style={{ background: 'rgba(255, 107, 107, 0.2)', border: '2px solid #FF6B6B', color: '#FF6B6B' }}
                  >
                    {selectedTrial.positionA}
                  </button>
                  <button
                    onClick={() => handleFinalVote('b')}
                    className="flex-1 py-4 rounded-xl font-bold"
                    style={{ background: 'rgba(78, 205, 196, 0.2)', border: '2px solid #4ECDC4', color: '#4ECDC4' }}
                  >
                    {selectedTrial.positionB}
                  </button>
                </div>
              </div>
            )}

            {hasVoted && (
              <div className="p-4 rounded-xl mb-6 text-center" style={{ background: 'rgba(57, 255, 20, 0.1)', border: '2px solid rgba(57, 255, 20, 0.4)' }}>
                <p className="text-[#39FF14] font-bold">
                  ✓ Tu as voté pour {finalVote === 'a' ? selectedTrial.positionA : selectedTrial.positionB}
                </p>
              </div>
            )}

            {role === 'lawyer' && (
              <button
                className="w-full py-4 rounded-xl font-bold text-lg mb-4"
                style={{ background: 'rgba(218, 165, 32, 0.2)', border: '2px solid #DAA520', color: '#DAA520' }}
              >
                ✍️ AJOUTER UN ARGUMENT
              </button>
            )}

            {/* Bouton verdict (pour démo) */}
            <button
              onClick={handleShowVerdict}
              className="w-full py-4 rounded-xl font-bold text-lg"
              style={{ background: 'linear-gradient(135deg, #DAA520 0%, #FFD700 100%)', color: '#1A0033' }}
            >
              🔨 VOIR LE VERDICT (démo)
            </button>

            <button
              onClick={resetGame}
              className="w-full py-3 mt-3 text-white/50 hover:text-white transition"
            >
              ← Retour aux procès
            </button>
          </div>
        )}

        {/* VERDICT */}
        {step === 'verdict' && selectedTrial && (
          <div className="text-center">
            <div className="mb-6">
              <div className="text-7xl mb-4 gavel-animation">🔨</div>
              <p className="text-white/60 text-sm mb-2">⚖️ VERDICT RENDU !</p>
              <h2 className="text-xl text-white font-bold mb-4">
                {selectedTrial.emoji} {selectedTrial.title}
              </h2>
            </div>

            {/* Gagnant */}
            <div className="p-6 rounded-2xl mb-6" style={{ background: 'linear-gradient(135deg, rgba(218, 165, 32, 0.2) 0%, rgba(255, 215, 0, 0.1) 100%)', border: '3px solid #DAA520' }}>
              <p className="text-3xl mb-2">🎉</p>
              <h3 className="text-2xl font-bold mb-2" style={{ color: '#DAA520', textShadow: '0 0 15px #DAA520' }}>
                {selectedTrial.positionA.toUpperCase()} L'EMPORTE !
              </h3>
              <p className="text-white/80">
                {selectedTrial.votesA || 62}% contre {selectedTrial.votesB || 38}%
              </p>
              <p className="text-white/60 text-sm mt-1">
                {selectedTrial.juryCount + selectedTrial.lawyersCount} votes
              </p>
            </div>

            {/* Meilleur plaidoyer */}
            <div className="p-4 rounded-xl mb-6 text-left" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '2px solid rgba(255, 255, 255, 0.1)' }}>
              <h4 className="text-[#FFD700] font-bold mb-3">🏆 MEILLEUR PLAIDOYER :</h4>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🧑‍🦰</span>
                <div>
                  <p className="text-white font-bold">Sophie - 31 upvotes</p>
                  <p className="text-white/70 text-sm italic mt-1">
                    "Chocolatine, c'est le vrai nom occitan, bande d'incultes parisiens !"
                  </p>
                </div>
              </div>
            </div>

            {/* Ton score */}
            {(myArgument || hasVoted) && (
              <div className="p-4 rounded-xl mb-6 text-left" style={{ background: 'rgba(0, 255, 255, 0.05)', border: '2px solid rgba(0, 255, 255, 0.3)' }}>
                <h4 className="text-[#00FFFF] font-bold mb-3">📊 TON SCORE :</h4>
                <ul className="space-y-2 text-white/80 text-sm">
                  {myArgument && (
                    <>
                      <li>• {myArgument.upvotes + 12} upvotes sur ton plaidoyer</li>
                      <li>• Tu as convaincu 9 personnes</li>
                    </>
                  )}
                  {hasVoted && (
                    <li>• Tu as voté pour le {finalVote === 'a' ? 'gagnant' : 'perdant'} !</li>
                  )}
                  <li className="text-[#FFD700]">• Badge débloqué : "Avocat en herbe" ⚖️</li>
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <button
                className="w-full py-4 rounded-xl font-bold text-lg"
                style={{ background: 'linear-gradient(135deg, #00FFFF 0%, #00B4D8 100%)', color: '#1A0033' }}
              >
                🔗 PARTAGER LE VERDICT
              </button>
              <button
                onClick={resetGame}
                className="w-full py-4 rounded-xl font-bold text-lg"
                style={{ background: 'rgba(218, 165, 32, 0.2)', border: '2px solid #DAA520', color: '#DAA520' }}
              >
                ⚖️ REJOUER UN AUTRE PROCÈS
              </button>
            </div>
          </div>
        )}

        {/* CREATE - Créer un procès */}
        {step === 'create' && (
          <div>
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">➕</div>
              <h2 className="text-2xl text-white font-bold" style={{ textShadow: '0 0 15px #DAA520' }}>
                CRÉER MON PROCÈS
              </h2>
            </div>

            <div className="space-y-5 mb-6">
              {/* Sujet */}
              <div>
                <label className="text-white/60 text-sm mb-2 block">Le sujet du débat :</label>
                <input
                  type="text"
                  value={newTrial.title}
                  onChange={(e) => setNewTrial({ ...newTrial, title: e.target.value })}
                  placeholder='Ex: "Les chats sont supérieurs aux chiens"'
                  className="w-full p-4 rounded-xl text-white placeholder-white/30"
                  style={{ background: 'rgba(255, 255, 255, 0.05)', border: '2px solid rgba(218, 165, 32, 0.4)' }}
                />
              </div>

              {/* Positions */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white/60 text-sm mb-2 block">Position A :</label>
                  <input
                    type="text"
                    value={newTrial.positionA}
                    onChange={(e) => setNewTrial({ ...newTrial, positionA: e.target.value })}
                    placeholder='Ex: "Oui"'
                    className="w-full p-3 rounded-xl text-white placeholder-white/30"
                    style={{ background: 'rgba(255, 107, 107, 0.1)', border: '2px solid rgba(255, 107, 107, 0.4)' }}
                  />
                </div>
                <div>
                  <label className="text-white/60 text-sm mb-2 block">Position B :</label>
                  <input
                    type="text"
                    value={newTrial.positionB}
                    onChange={(e) => setNewTrial({ ...newTrial, positionB: e.target.value })}
                    placeholder='Ex: "Non"'
                    className="w-full p-3 rounded-xl text-white placeholder-white/30"
                    style={{ background: 'rgba(78, 205, 196, 0.1)', border: '2px solid rgba(78, 205, 196, 0.4)' }}
                  />
                </div>
              </div>

              {/* Emoji */}
              <div>
                <label className="text-white/60 text-sm mb-2 block">Emoji du procès :</label>
                <div className="flex gap-2 flex-wrap">
                  {['⚖️', '🐱', '🐕', '🍕', '🍫', '🧦', '🛏️', '☕', '📱', '🎮'].map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => setNewTrial({ ...newTrial, emoji })}
                      className="text-2xl p-3 rounded-xl transition"
                      style={{
                        background: newTrial.emoji === emoji ? 'rgba(218, 165, 32, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                        border: newTrial.emoji === emoji ? '2px solid #DAA520' : '2px solid transparent',
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Durée */}
              <div>
                <label className="text-white/60 text-sm mb-2 block">Durée du débat :</label>
                <div className="flex gap-3">
                  {[
                    { value: '1', label: '1 heure' },
                    { value: '24', label: '24 heures' },
                    { value: '168', label: '1 semaine' },
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setNewTrial({ ...newTrial, duration: option.value })}
                      className="flex-1 py-3 rounded-xl font-bold text-sm transition"
                      style={{
                        background: newTrial.duration === option.value ? 'rgba(218, 165, 32, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                        border: newTrial.duration === option.value ? '2px solid #DAA520' : '2px solid rgba(255, 255, 255, 0.1)',
                        color: newTrial.duration === option.value ? '#DAA520' : 'rgba(255, 255, 255, 0.6)',
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Visibilité */}
              <div>
                <label className="text-white/60 text-sm mb-2 block">Visibilité :</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setNewTrial({ ...newTrial, visibility: 'public' })}
                    className="flex-1 py-3 px-4 rounded-xl font-bold text-sm transition"
                    style={{
                      background: newTrial.visibility === 'public' ? 'rgba(57, 255, 20, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      border: newTrial.visibility === 'public' ? '2px solid #39FF14' : '2px solid rgba(255, 255, 255, 0.1)',
                      color: newTrial.visibility === 'public' ? '#39FF14' : 'rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    🌍 Public
                  </button>
                  <button
                    onClick={() => setNewTrial({ ...newTrial, visibility: 'private' })}
                    className="flex-1 py-3 px-4 rounded-xl font-bold text-sm transition"
                    style={{
                      background: newTrial.visibility === 'private' ? 'rgba(255, 0, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      border: newTrial.visibility === 'private' ? '2px solid #FF00FF' : '2px solid rgba(255, 255, 255, 0.1)',
                      color: newTrial.visibility === 'private' ? '#FF00FF' : 'rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    🔒 Privé
                  </button>
                </div>
              </div>
            </div>

            {/* Suggestions par catégorie */}
            <div className="mb-6">
              <p className="text-white/60 text-sm mb-3">💡 Idées de sujets ({filteredTopics.length}) :</p>

              {/* Filtres par catégorie */}
              <div className="flex gap-2 flex-wrap mb-4">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="px-3 py-2 rounded-lg text-xs font-bold transition"
                  style={{
                    background: !selectedCategory ? 'rgba(218, 165, 32, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                    border: !selectedCategory ? '2px solid #DAA520' : '2px solid rgba(255, 255, 255, 0.1)',
                    color: !selectedCategory ? '#DAA520' : 'rgba(255, 255, 255, 0.6)',
                  }}
                >
                  🎯 Tous
                </button>
                {trialCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className="px-3 py-2 rounded-lg text-xs font-bold transition"
                    style={{
                      background: selectedCategory === cat.id ? 'rgba(218, 165, 32, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                      border: selectedCategory === cat.id ? '2px solid #DAA520' : '2px solid rgba(255, 255, 255, 0.1)',
                      color: selectedCategory === cat.id ? '#DAA520' : 'rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    {cat.emoji} {cat.name}
                  </button>
                ))}
              </div>

              {/* Liste des sujets filtrés */}
              <div className="max-h-64 overflow-y-auto pr-2 space-y-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#DAA520 rgba(255,255,255,0.1)' }}>
                {filteredTopics.map((topic, i) => (
                  <button
                    key={i}
                    onClick={() => setNewTrial({
                      ...newTrial,
                      title: topic.title,
                      emoji: topic.emoji,
                      positionA: topic.a,
                      positionB: topic.b,
                    })}
                    className="w-full p-3 rounded-xl text-left transition hover:border-[#DAA520]"
                    style={{ background: 'rgba(255, 255, 255, 0.03)', border: '2px solid rgba(255, 255, 255, 0.1)' }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{topic.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-bold text-sm truncate">{topic.title}</p>
                        <p className="text-white/50 text-xs">
                          {topic.a} VS {topic.b}
                        </p>
                      </div>
                      <span className="text-white/30 text-lg">+</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <button
              onClick={handleCreateTrial}
              disabled={!newTrial.title || !newTrial.positionA || !newTrial.positionB}
              className="w-full py-4 rounded-xl font-bold text-lg"
              style={{
                background: newTrial.title && newTrial.positionA && newTrial.positionB
                  ? 'linear-gradient(135deg, #DAA520 0%, #FFD700 100%)'
                  : 'rgba(255, 255, 255, 0.1)',
                color: newTrial.title && newTrial.positionA && newTrial.positionB
                  ? '#1A0033'
                  : 'rgba(255, 255, 255, 0.3)',
                cursor: newTrial.title && newTrial.positionA && newTrial.positionB
                  ? 'pointer'
                  : 'not-allowed',
              }}
            >
              ⚖️ OUVRIR LE TRIBUNAL
            </button>

            <button
              onClick={() => setStep('lobby')}
              className="w-full py-3 mt-3 text-white/50 hover:text-white transition"
            >
              ← Retour aux procès
            </button>
          </div>
        )}

      </main>
    </div>
  )
}
