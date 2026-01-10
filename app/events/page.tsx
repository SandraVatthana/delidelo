'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// Types
interface Event {
  id: string
  title: string
  theme: string
  themeEmoji: string
  location: string
  city: string
  date: string
  time: string
  spotsTotal: number
  spotsTaken: number
  organizer: {
    name: string
    avatar: string
  }
  description: string
  icebreaker: string
}

// Événements simulés
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Soirée Jeux de Société',
    theme: 'boardgames',
    themeEmoji: '🎲',
    location: 'Le Dernier Bar avant la Fin du Monde',
    city: 'Paris',
    date: '2025-01-18',
    time: '19:30',
    spotsTotal: 8,
    spotsTaken: 5,
    organizer: { name: 'Alex', avatar: '👩‍🦰' },
    description: 'On se retrouve pour une soirée jeux de société ! Ambiance détendue, je ramène quelques classiques (Catan, Uno, Loup-Garou).',
    icebreaker: 'Le Manège',
  },
  {
    id: '2',
    title: 'Brunch Gaming',
    theme: 'brunch',
    themeEmoji: '🥐',
    location: 'Café Oz',
    city: 'Lyon',
    date: '2025-01-19',
    time: '11:00',
    spotsTotal: 6,
    spotsTaken: 3,
    organizer: { name: 'Sam', avatar: '👨‍🦱' },
    description: 'Brunch tranquille + jeux de cartes. Venez comme vous êtes !',
    icebreaker: 'Action ou Vérité',
  },
  {
    id: '3',
    title: 'Apéro Rétro Gaming',
    theme: 'retrogaming',
    themeEmoji: '🕹️',
    location: 'Player One Bar',
    city: 'Paris',
    date: '2025-01-25',
    time: '18:00',
    spotsTotal: 10,
    spotsTaken: 7,
    organizer: { name: 'Jordan', avatar: '🧑' },
    description: 'On joue sur des bornes arcade des années 80-90. L\'établissement a Mario Kart, Street Fighter, Pac-Man...',
    icebreaker: 'Quiz 80s',
  },
  {
    id: '4',
    title: 'Soirée Karaoké Fun',
    theme: 'karaoke',
    themeEmoji: '🎤',
    location: 'K-Box Belleville',
    city: 'Paris',
    date: '2025-01-26',
    time: '20:00',
    spotsTotal: 8,
    spotsTaken: 2,
    organizer: { name: 'Charlie', avatar: '👱' },
    description: 'On chante faux ensemble ! Pas besoin d\'avoir une belle voix, juste de l\'énergie.',
    icebreaker: 'Dirty Dancing',
  },
  {
    id: '5',
    title: 'Escape Game + Bières',
    theme: 'escapegame',
    themeEmoji: '🔐',
    location: 'The Game Paris',
    city: 'Paris',
    date: '2025-02-01',
    time: '17:00',
    spotsTotal: 6,
    spotsTaken: 4,
    organizer: { name: 'Morgan', avatar: '🧔' },
    description: 'On fait un escape game ensemble puis on débriefe autour d\'une bière. Le thème : prison break !',
    icebreaker: 'Le Temple Maudit',
  },
]

// Villes disponibles
const cities = ['Toutes', 'Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Lille', 'Toulouse', 'Nantes']

// Thèmes
const themes = [
  { id: 'all', label: 'Tous', emoji: '🎯' },
  { id: 'boardgames', label: 'Jeux de société', emoji: '🎲' },
  { id: 'brunch', label: 'Brunch', emoji: '🥐' },
  { id: 'retrogaming', label: 'Rétro Gaming', emoji: '🕹️' },
  { id: 'karaoke', label: 'Karaoké', emoji: '🎤' },
  { id: 'escapegame', label: 'Escape Game', emoji: '🔐' },
]

export default function EventsPage() {
  const [selectedCity, setSelectedCity] = useState('Toutes')
  const [selectedTheme, setSelectedTheme] = useState('all')
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  // Filtrer les événements
  const filteredEvents = mockEvents.filter(event => {
    const cityMatch = selectedCity === 'Toutes' || event.city === selectedCity
    const themeMatch = selectedTheme === 'all' || event.theme === selectedTheme
    return cityMatch && themeMatch
  })

  // Formater la date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const days = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM']
    const months = ['JAN', 'FÉV', 'MAR', 'AVR', 'MAI', 'JUN', 'JUL', 'AOÛ', 'SEP', 'OCT', 'NOV', 'DÉC']
    return {
      day: days[date.getDay()],
      date: date.getDate(),
      month: months[date.getMonth()],
    }
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
            color: #FF6600;
            border-color: #FF6600;
            background: rgba(255, 102, 0, 0.2);
            text-shadow: 0 0 10px #FF6600;
            box-shadow: 0 0 15px rgba(255, 102, 0, 0.3);
          }
          .top-nav-item .nav-emoji {
            font-size: 1.2rem;
          }
        }
      `}</style>

      {/* Header avec navigation */}
      <header className="sticky top-0 z-40">
        <div className="h-1 bg-gradient-to-r from-[#FF00FF] via-[#00FFFF] to-[#39FF14]" />
        <div className="bg-[#1A0033]/95 backdrop-blur-sm px-4 py-5">
          {/* Ligne 1: Logo + Notifications */}
          <div className="max-w-5xl mx-auto flex items-center justify-between mb-3">
            <Link href="/" className="logo-90s text-xl">
              <span className="animate-spin inline-block text-lg">🎠</span>
              Déli Délo
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
              <Link href="/games" className="top-nav-item">
                <span className="nav-emoji">🎮</span>
                JEUX
              </Link>
              <Link href="/messages" className="top-nav-item">
                <span className="nav-emoji">💬</span>
                Messages
              </Link>
              <Link href="/events" className="top-nav-item active">
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
      <main className="px-6 py-8" style={{ maxWidth: '800px', margin: '0 auto' }}>
        {!selectedEvent ? (
          <>
            {/* Bannière Image */}
            <div className="relative w-full h-48 mb-6 rounded-lg overflow-hidden" style={{ border: '3px solid #FF6600', boxShadow: '0 0 20px #FF660050' }}>
              <Image
                src="/Images/games/events-irl.png"
                alt="Events IRL"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A0033] via-transparent to-transparent" />
            </div>

            {/* Titre */}
            <div className="text-center mb-8">
              <h1
                className="text-2xl font-bold mb-2"
                style={{ fontFamily: 'Bangers, cursive', color: '#FF6600', textShadow: '0 0 15px #FF6600' }}
              >
                🍻 Events près de chez toi
              </h1>
              <p className="text-white/60 text-sm">Rencontres IRL autour d'activités fun !</p>
            </div>

            {/* Filtres */}
            <div className="space-y-4 mb-6">
              {/* Ville */}
              <div>
                <label className="text-xs text-white/40 uppercase mb-2 block">📍 Ville</label>
                <div className="flex flex-wrap gap-2">
                  {cities.slice(0, 5).map(city => (
                    <button
                      key={city}
                      onClick={() => setSelectedCity(city)}
                      className={`px-3 py-1 text-sm font-bold transition ${
                        selectedCity === city
                          ? 'bg-[#FF6600] text-[#1A0033]'
                          : 'bg-[#330066] border-2 border-[#FF6600]/30 text-[#FF6600]'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              {/* Thème */}
              <div>
                <label className="text-xs text-white/40 uppercase mb-2 block">🎯 Thème</label>
                <div className="flex flex-wrap gap-2">
                  {themes.map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme.id)}
                      className={`px-3 py-1 text-sm font-bold transition ${
                        selectedTheme === theme.id
                          ? 'bg-[#FF6600] text-[#1A0033]'
                          : 'bg-[#330066] border-2 border-[#FF6600]/30 text-[#FF6600]'
                      }`}
                    >
                      {theme.emoji} {theme.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Liste des événements */}
            <div className="space-y-4">
              {filteredEvents.length > 0 ? (
                filteredEvents.map(event => {
                  const dateInfo = formatDate(event.date)
                  const spotsLeft = event.spotsTotal - event.spotsTaken
                  const almostFull = spotsLeft <= 2

                  return (
                    <div
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className="card-90s p-4 cursor-pointer transition-all hover:scale-[1.02]"
                      style={{ borderColor: '#FF6600', boxShadow: '0 0 15px #FF660040' }}
                    >
                      <div className="flex gap-4">
                        {/* Date */}
                        <div className="text-center min-w-[60px]">
                          <div className="text-sm font-bold text-[#FF6600]">{dateInfo.day}</div>
                          <div className="text-2xl font-bold text-white">{dateInfo.date}</div>
                          <div className="text-xs text-white/60">{dateInfo.month}</div>
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl">{event.themeEmoji}</span>
                            <h3 className="font-bold text-white">{event.title}</h3>
                          </div>
                          <p className="text-sm text-white/60 mb-1">📍 {event.location}, {event.city}</p>
                          <p className="text-sm text-white/60 mb-2">🕐 {event.time}</p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{event.organizer.avatar}</span>
                              <span className="text-xs text-white/50">par {event.organizer.name}</span>
                            </div>
                            <span className={`text-xs font-bold ${almostFull ? 'text-[#FF3131]' : 'text-[#39FF14]'}`}>
                              👥 {event.spotsTaken}/{event.spotsTotal} {almostFull && '🔥'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="card-90s p-8 text-center">
                  <div className="text-6xl mb-4">😢</div>
                  <h3 className="text-xl text-white mb-2">Aucun event trouvé</h3>
                  <p className="text-white/60 mb-6">
                    Pas d'événement avec ces critères. Sois le premier à en créer un !
                  </p>
                  <Link href="/events/create" className="btn-cta-primary inline-flex" style={{ background: '#FF6600' }}>
                    🎉 Créer un event
                  </Link>
                </div>
              )}
            </div>

            {/* CTA Créer */}
            <div
              className="mt-6 p-4 text-center"
              style={{ border: '2px dashed #FF6600', background: 'rgba(255, 102, 0, 0.05)' }}
            >
              <p className="text-sm text-white/70 mb-3">T'as un bar préféré ? Organise ta propre soirée !</p>
              <Link href="/events/create" className="btn-cta-primary inline-flex" style={{ background: '#FF6600' }}>
                🎉 Créer un event
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* Détail d'un événement */}
            <button
              onClick={() => setSelectedEvent(null)}
              className="text-[#00FFFF] font-bold hover:text-[#FFFF00] transition mb-4"
            >
              ← Retour aux events
            </button>

            <div className="card-90s p-6" style={{ borderColor: '#FF6600' }}>
              {/* Header event */}
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">{selectedEvent.themeEmoji}</div>
                <h1 className="text-2xl font-bold text-white mb-2">{selectedEvent.title}</h1>
                <p className="text-[#FF6600] font-bold">
                  {formatDate(selectedEvent.date).day} {formatDate(selectedEvent.date).date} {formatDate(selectedEvent.date).month} à {selectedEvent.time}
                </p>
              </div>

              {/* Lieu */}
              <div className="bg-[#330066] p-4 mb-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="font-bold text-white">{selectedEvent.location}</p>
                    <p className="text-sm text-white/60">{selectedEvent.city}</p>
                  </div>
                </div>
              </div>

              {/* Organisateur */}
              <div className="flex items-center gap-3 mb-4 p-3 bg-[#330066]/50">
                <span className="text-3xl">{selectedEvent.organizer.avatar}</span>
                <div>
                  <p className="text-xs text-white/50">Organisé par</p>
                  <p className="font-bold text-[#FF6600]">{selectedEvent.organizer.name}</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <h3 className="text-sm text-white/40 uppercase mb-2">Description</h3>
                <p className="text-white/80">{selectedEvent.description}</p>
              </div>

              {/* Jeu brise-glace */}
              <div className="bg-[#FF6600]/10 border-2 border-[#FF6600] p-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎲</span>
                  <div>
                    <p className="text-xs text-white/50">Jeu brise-glace prévu</p>
                    <p className="font-bold text-[#FF6600]">{selectedEvent.icebreaker}</p>
                  </div>
                </div>
              </div>

              {/* Places */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-white/60">Places</span>
                  <span className="font-bold text-[#39FF14]">
                    {selectedEvent.spotsTaken}/{selectedEvent.spotsTotal}
                  </span>
                </div>
                <div className="h-3 bg-[#330066] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#39FF14] transition-all"
                    style={{ width: `${(selectedEvent.spotsTaken / selectedEvent.spotsTotal) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-white/40 mt-1">
                  {selectedEvent.spotsTotal - selectedEvent.spotsTaken} places restantes
                </p>
              </div>

              {/* Participants (placeholder) */}
              <div className="mb-6">
                <h3 className="text-sm text-white/40 uppercase mb-2">Participants</h3>
                <div className="flex -space-x-2">
                  {Array(selectedEvent.spotsTaken).fill(0).map((_, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-[#330066] border-2 border-[#FF6600] flex items-center justify-center text-lg"
                    >
                      {['👩‍🦰', '👨‍🦱', '🧑', '👱', '🧔'][i % 5]}
                    </div>
                  ))}
                  {selectedEvent.spotsTotal - selectedEvent.spotsTaken > 0 && (
                    <div className="w-10 h-10 rounded-full bg-[#330066] border-2 border-dashed border-white/30 flex items-center justify-center text-xs text-white/50">
                      +{selectedEvent.spotsTotal - selectedEvent.spotsTaken}
                    </div>
                  )}
                </div>
              </div>

              {/* CTA */}
              <button
                className="btn-cta-primary w-full justify-center"
                style={{ background: '#FF6600' }}
              >
                ✋ Je participe !
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
