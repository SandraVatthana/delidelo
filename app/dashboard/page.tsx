'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useUser } from '../contexts/UserContext'

// Mock data pour les anniversaires
const mockBirthdays = {
  today: [
    { id: '1', pseudo: 'Marie', avatar: '👩', age: 32 },
    { id: '2', pseudo: 'Lucas', avatar: '😎', age: 28 },
  ],
  thisWeek: [
    { id: '3', pseudo: 'Sophie', avatar: '🧑‍🦰', date: 'Jeudi 9 janvier' },
    { id: '4', pseudo: 'Antoine', avatar: '🧔', date: 'Samedi 11 janvier' },
    { id: '5', pseudo: 'Emma', avatar: '👩‍🦳', date: 'Dimanche 12 janvier' },
  ],
}

// Mock : vœux reçus si c'est mon anniversaire
const mockMyBirthdayWishes = {
  isMyBirthday: false, // Mettre à true pour tester
  wishCount: 12,
  wishes: [
    { sender: 'Marie', type: 'bonbon', bonbonType: 'Malabar' },
    { sender: 'Lucas', type: 'bille' },
    { sender: 'Sophie', type: 'simple' },
  ],
  totalBonbons: 3,
  totalBilles: 2,
}

export default function DashboardPage() {
  const { user: userData } = useUser()
  const [mounted, setMounted] = useState(false)
  const [showBirthdayModal, setShowBirthdayModal] = useState(false)
  const [wishedToday, setWishedToday] = useState<Record<string, string>>({}) // userId -> type de vœu
  const [showWishSent, setShowWishSent] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    // Afficher le modal si c'est mon anniversaire
    if (mockMyBirthdayWishes.isMyBirthday) {
      setTimeout(() => setShowBirthdayModal(true), 500)
    }
  }, [])

  const handleSendWish = (userId: string, type: 'bille' | 'bonbon' | 'simple') => {
    setWishedToday(prev => ({ ...prev, [userId]: type }))
    setShowWishSent(userId)
    setTimeout(() => setShowWishSent(null), 2000)
  }

  const stats = {
    billes: userData.billes || 0,
    bonbons: userData.bonbons || 10,
  }

  return (
    <div className="dashboard-page">
      <style jsx>{`
        /* ===== VARIABLES ===== */
        .dashboard-page {
          --neon-pink: #FF00FF;
          --neon-green: #39FF14;
          --neon-blue: #00FFFF;
          --neon-yellow: #FFFF00;
          --neon-orange: #FF6600;
          --purple-dark: #1A0033;
          --purple-mid: #330066;

          font-family: 'Comic Neue', system-ui, sans-serif;
          background: var(--purple-dark);
          color: #fff;
          min-height: 100vh;
          overflow-x: hidden;
          position: relative;
        }

        /* ===== BACKGROUND PATTERN ===== */
        .bg-pattern {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background:
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 50px,
              rgba(255, 0, 255, 0.03) 50px,
              rgba(255, 0, 255, 0.03) 100px
            ),
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 50px,
              rgba(0, 255, 255, 0.03) 50px,
              rgba(0, 255, 255, 0.03) 100px
            );
          z-index: 0;
          pointer-events: none;
        }

        /* ===== FLOATING SHAPES ===== */
        .shape {
          position: fixed;
          opacity: 0.5;
          animation: float 6s ease-in-out infinite;
          z-index: 1;
          pointer-events: none;
        }

        .shape-1 {
          top: 15%;
          left: 8%;
          width: 80px;
          height: 80px;
          background: var(--neon-pink);
          clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
          animation-delay: 0s;
        }

        .shape-2 {
          top: 25%;
          right: 10%;
          width: 60px;
          height: 60px;
          background: var(--neon-green);
          clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
          animation-delay: 1s;
        }

        .shape-3 {
          bottom: 30%;
          left: 5%;
          width: 50px;
          height: 50px;
          background: var(--neon-blue);
          border-radius: 50%;
          animation-delay: 2s;
        }

        .shape-4 {
          bottom: 20%;
          right: 8%;
          width: 70px;
          height: 70px;
          background: var(--neon-yellow);
          clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
          animation-delay: 3s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(10deg); }
        }

        /* ===== HEADER ===== */
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background: linear-gradient(90deg, var(--neon-pink), var(--neon-blue), var(--neon-green));
          padding: 3px;
        }

        .header-inner {
          background: var(--purple-dark);
          padding: 12px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-family: 'Bangers', cursive;
          font-size: 1.6rem;
          color: var(--neon-pink);
          text-shadow:
            0 0 10px var(--neon-pink),
            0 0 20px var(--neon-pink),
            2px 2px 0 var(--neon-blue);
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          letter-spacing: 1px;
        }

        .logo-icon {
          font-size: 1.4rem;
          animation: spin 4s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .currency-btns {
          display: flex;
          gap: 12px;
        }

        .currency-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: transparent;
          border: 2px solid;
          text-decoration: none;
          font-weight: 700;
          font-size: 0.9rem;
          transition: all 0.3s;
        }

        .currency-btn.billes {
          color: var(--neon-blue);
          border-color: var(--neon-blue);
          box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
        }

        .currency-btn.billes:hover {
          background: var(--neon-blue);
          color: var(--purple-dark);
          box-shadow: 0 0 20px var(--neon-blue);
        }

        .currency-btn.bonbons {
          color: var(--neon-pink);
          border-color: var(--neon-pink);
          box-shadow: 0 0 10px rgba(255, 0, 255, 0.3);
        }

        .currency-btn.bonbons:hover {
          background: var(--neon-pink);
          color: var(--purple-dark);
          box-shadow: 0 0 20px var(--neon-pink);
        }

        /* ===== NAV MENU ===== */
        .nav-menu {
          background: var(--purple-mid);
          padding: 8px 0;
          border-bottom: 2px solid var(--neon-pink);
        }

        .nav-items {
          display: flex;
          justify-content: center;
          gap: 8px;
          max-width: 800px;
          margin: 0 auto;
          padding: 0 10px;
          overflow-x: auto;
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          padding: 8px 12px;
          text-decoration: none;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all 0.3s;
          white-space: nowrap;
        }

        .nav-item:hover {
          color: var(--neon-green);
          text-shadow: 0 0 10px var(--neon-green);
        }

        .nav-item.active {
          color: var(--neon-yellow);
          text-shadow: 0 0 10px var(--neon-yellow);
        }

        .nav-item.highlight {
          color: var(--neon-pink);
          text-shadow: 0 0 15px var(--neon-pink);
        }

        .nav-item span:first-child {
          font-size: 1.2rem;
        }

        /* ===== MARQUEE ===== */
        .marquee-container {
          background: var(--neon-pink);
          padding: 10px 0;
          overflow: hidden;
        }

        .marquee {
          display: flex;
          animation: marquee 25s linear infinite;
        }

        .marquee-content {
          display: flex;
          gap: 40px;
          padding-right: 40px;
          white-space: nowrap;
        }

        .marquee-item {
          font-family: 'Bangers', cursive;
          font-size: 1rem;
          color: var(--purple-dark);
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* ===== HERO ===== */
        .hero {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 50px 20px 80px;
          max-width: 900px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .hero {
            padding: 30px 16px 60px;
          }
        }

        .mascot {
          font-size: 7rem;
          margin-bottom: 15px;
          animation: pulse 1.5s ease-in-out infinite;
          filter: drop-shadow(0 0 30px var(--neon-pink));
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .hero-title {
          font-family: 'Bangers', cursive;
          font-size: 3.5rem;
          color: var(--neon-yellow);
          margin-bottom: 15px;
          text-shadow:
            0 0 10px var(--neon-yellow),
            0 0 20px var(--neon-yellow),
            0 0 40px var(--neon-yellow),
            4px 4px 0 var(--neon-pink);
          letter-spacing: 4px;
          text-transform: uppercase;
        }

        @media (min-width: 640px) {
          .hero-title {
            font-size: 4.5rem;
          }
        }

        .hero-subtitle {
          font-size: 1.3rem;
          color: var(--neon-blue);
          font-weight: 700;
          text-shadow: 0 0 10px var(--neon-blue);
          margin-bottom: 35px;
          max-width: 500px;
        }

        /* ===== BUTTONS ===== */
        .cta-buttons {
          display: flex;
          flex-direction: column;
          gap: 24px;
          align-items: center;
          margin-bottom: 50px;
        }

        /* ===== BOUTON PRIMAIRE - ALLER À LA RÉCRÉ ===== */
        .btn-primary-wrapper {
          position: relative;
          padding: 6px;
          border-radius: 30px;
          background: linear-gradient(90deg, #FF00FF, #00FFFF, #FFFF00, #FF00FF);
          background-size: 300% 100%;
          animation: rainbow-border 3s linear infinite;
        }

        @keyframes rainbow-border {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          background: linear-gradient(135deg, #FF00FF 0%, #FF3399 50%, #FF00FF 100%);
          background-size: 200% 200%;
          color: #fff;
          padding: 28px 70px;
          font-family: 'Bangers', cursive;
          font-size: 2.2rem;
          letter-spacing: 4px;
          text-decoration: none;
          text-transform: uppercase;
          border: none;
          border-radius: 24px;
          box-shadow:
            0 0 30px var(--neon-pink),
            0 0 60px var(--neon-pink),
            0 0 100px rgba(255, 0, 255, 0.6),
            inset 0 0 30px rgba(255, 255, 255, 0.2);
          transition: all 0.3s;
          animation: btn-mega-glow 1.5s ease-in-out infinite, btn-gradient 3s ease infinite, btn-bounce 2s ease-in-out infinite;
          text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff;
          position: relative;
          overflow: hidden;
        }

        .btn-primary::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent 30%,
            rgba(255, 255, 255, 0.4) 50%,
            transparent 70%
          );
          animation: btn-shine 2s linear infinite;
        }

        .btn-primary::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 24px;
          padding: 3px;
          background: linear-gradient(45deg, #FF00FF, #00FFFF, #FFFF00, #FF00FF);
          background-size: 400% 400%;
          animation: rainbow-glow 4s ease infinite;
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }

        @keyframes rainbow-glow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes btn-shine {
          0% { transform: translateX(-100%) rotate(45deg); }
          100% { transform: translateX(100%) rotate(45deg); }
        }

        @keyframes btn-mega-glow {
          0%, 100% {
            box-shadow:
              0 0 30px var(--neon-pink),
              0 0 60px var(--neon-pink),
              0 0 100px rgba(255, 0, 255, 0.6),
              inset 0 0 30px rgba(255, 255, 255, 0.2);
          }
          50% {
            box-shadow:
              0 0 50px var(--neon-pink),
              0 0 100px var(--neon-pink),
              0 0 150px rgba(255, 0, 255, 0.8),
              inset 0 0 50px rgba(255, 255, 255, 0.3);
          }
        }

        @keyframes btn-gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes btn-bounce {
          0%, 100% { transform: scale(1) translateY(0); }
          25% { transform: scale(1.03) translateY(-4px); }
          50% { transform: scale(1) translateY(0); }
          75% { transform: scale(1.03) translateY(-4px); }
        }

        @keyframes btn-glow {
          0%, 100% { box-shadow: 0 0 40px var(--neon-pink), 0 0 80px rgba(255, 0, 255, 0.3); }
          50% { box-shadow: 0 0 60px var(--neon-pink), 0 0 100px rgba(255, 0, 255, 0.5); }
        }

        .btn-primary:hover {
          transform: scale(1.15) translateY(-5px) !important;
          box-shadow:
            0 0 60px var(--neon-pink),
            0 0 120px var(--neon-pink),
            0 0 180px rgba(255, 0, 255, 0.9),
            inset 0 0 60px rgba(255, 255, 255, 0.4);
          animation: none;
        }

        /* ===== BOUTON SECONDAIRE - INVITER MES POTES ===== */
        .btn-secondary-wrapper {
          position: relative;
          padding: 5px;
          border-radius: 25px;
          background: linear-gradient(90deg, #39FF14, #00FFFF, #39FF14);
          background-size: 200% 100%;
          animation: green-border-flow 2s linear infinite;
          box-shadow:
            0 0 20px rgba(57, 255, 20, 0.5),
            0 0 40px rgba(57, 255, 20, 0.3);
        }

        @keyframes green-border-flow {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background: linear-gradient(135deg, rgba(57, 255, 20, 0.2) 0%, rgba(57, 255, 20, 0.35) 50%, rgba(0, 255, 255, 0.2) 100%);
          background-size: 200% 200%;
          color: var(--neon-green);
          padding: 22px 55px;
          font-family: 'Bangers', cursive;
          font-size: 1.6rem;
          letter-spacing: 3px;
          text-decoration: none;
          text-transform: uppercase;
          border: none;
          border-radius: 20px;
          box-shadow:
            inset 0 0 25px rgba(57, 255, 20, 0.15),
            inset 0 0 50px rgba(0, 255, 255, 0.1);
          transition: all 0.3s;
          animation: btn-secondary-pulse 2s ease-in-out infinite, btn-secondary-gradient 4s ease infinite;
          text-shadow: 0 0 15px var(--neon-green), 0 0 25px var(--neon-green);
          position: relative;
          overflow: hidden;
        }

        .btn-secondary::before {
          content: '✨';
          position: absolute;
          left: 20px;
          font-size: 1.2rem;
          animation: sparkle-left 1.5s ease-in-out infinite;
        }

        .btn-secondary::after {
          content: '✨';
          position: absolute;
          right: 20px;
          font-size: 1.2rem;
          animation: sparkle-right 1.5s ease-in-out infinite 0.75s;
        }

        @keyframes sparkle-left {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        @keyframes sparkle-right {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        @keyframes btn-secondary-gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes btn-secondary-pulse {
          0%, 100% {
            box-shadow:
              inset 0 0 25px rgba(57, 255, 20, 0.15),
              inset 0 0 50px rgba(0, 255, 255, 0.1);
            transform: scale(1);
          }
          50% {
            box-shadow:
              inset 0 0 35px rgba(57, 255, 20, 0.25),
              inset 0 0 70px rgba(0, 255, 255, 0.15);
            transform: scale(1.02);
          }
        }

        .btn-secondary-wrapper:hover {
          box-shadow:
            0 0 40px rgba(57, 255, 20, 0.8),
            0 0 80px rgba(57, 255, 20, 0.5),
            0 0 120px rgba(0, 255, 255, 0.3);
        }

        .btn-secondary:hover {
          background: linear-gradient(135deg, var(--neon-green) 0%, #00E5CC 100%);
          color: var(--purple-dark);
          transform: scale(1.05);
          animation: none;
          text-shadow: none;
        }

        .invite-hint {
          font-size: 1rem;
          color: var(--neon-green);
          font-weight: 700;
          margin-top: 5px;
          text-shadow: 0 0 8px var(--neon-green);
          animation: hint-pulse 2s ease-in-out infinite;
        }

        @keyframes hint-pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }

        /* ===== STATS ===== */
        .stats-row {
          display: flex;
          gap: 25px;
          justify-content: center;
          margin-bottom: 30px;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.03);
          padding: 18px 30px;
          border: 2px solid var(--neon-blue);
          box-shadow:
            0 0 10px rgba(0, 255, 255, 0.3),
            inset 0 0 15px rgba(0, 255, 255, 0.1);
          text-align: center;
        }

        .stat-number {
          font-family: 'Bangers', cursive;
          font-size: 2.2rem;
          color: var(--neon-yellow);
          text-shadow: 0 0 15px var(--neon-yellow);
          letter-spacing: 2px;
        }

        .stat-label {
          font-weight: 700;
          color: var(--neon-blue);
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* ===== LINK ===== */
        .recre-link {
          color: var(--neon-green);
          font-weight: 700;
          text-decoration: none;
          font-size: 1rem;
          text-shadow: 0 0 10px var(--neon-green);
          transition: all 0.3s;
        }

        .recre-link:hover {
          color: var(--neon-yellow);
          text-shadow: 0 0 15px var(--neon-yellow);
        }

        /* ===== ANIMATIONS ===== */
        .fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .fade-in-delay-1 {
          animation: fadeIn 0.5s ease-out 0.1s forwards;
          opacity: 0;
        }

        .fade-in-delay-2 {
          animation: fadeIn 0.5s ease-out 0.2s forwards;
          opacity: 0;
        }

        .fade-in-delay-3 {
          animation: fadeIn 0.5s ease-out 0.3s forwards;
          opacity: 0;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ===== BIRTHDAY SECTION ===== */
        .birthday-section {
          background: rgba(255, 255, 255, 0.03);
          border: 2px solid rgba(255, 107, 171, 0.4);
          border-radius: 20px;
          padding: 24px;
          margin-top: 40px;
          box-shadow: 0 0 30px rgba(255, 107, 171, 0.1);
        }

        .birthday-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .birthday-title {
          font-family: 'Bangers', cursive;
          font-size: 1.5rem;
          color: #FF6BAB;
          text-shadow: 0 0 10px rgba(255, 107, 171, 0.5);
        }

        .birthday-subtitle {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.85rem;
          font-style: italic;
          margin-bottom: 20px;
        }

        .birthday-group-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--neon-yellow);
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .birthday-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          margin-bottom: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s;
        }

        .birthday-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 107, 171, 0.3);
        }

        .birthday-avatar {
          font-size: 2.5rem;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 107, 171, 0.15);
          border-radius: 50%;
          border: 2px solid rgba(255, 107, 171, 0.3);
        }

        .birthday-info {
          flex: 1;
        }

        .birthday-name {
          font-weight: 700;
          color: #fff;
          font-size: 1rem;
        }

        .birthday-age {
          color: var(--neon-pink);
          font-weight: 600;
        }

        .birthday-date {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.85rem;
        }

        .birthday-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .birthday-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 8px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          border: 2px solid;
          background: transparent;
          cursor: pointer;
          transition: all 0.2s;
        }

        .birthday-btn.bille {
          color: var(--neon-blue);
          border-color: var(--neon-blue);
        }

        .birthday-btn.bille:hover {
          background: var(--neon-blue);
          color: var(--purple-dark);
        }

        .birthday-btn.bonbon {
          color: var(--neon-pink);
          border-color: var(--neon-pink);
        }

        .birthday-btn.bonbon:hover {
          background: var(--neon-pink);
          color: var(--purple-dark);
        }

        .birthday-btn.simple {
          color: var(--neon-green);
          border-color: var(--neon-green);
        }

        .birthday-btn.simple:hover {
          background: var(--neon-green);
          color: var(--purple-dark);
        }

        .birthday-btn.sent {
          opacity: 0.5;
          cursor: not-allowed;
          background: rgba(255, 255, 255, 0.1);
        }

        .birthday-week-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .birthday-week-item:last-child {
          border-bottom: none;
        }

        .birthday-week-avatar {
          font-size: 1.5rem;
        }

        .birthday-week-info {
          flex: 1;
        }

        .birthday-week-name {
          color: #fff;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .birthday-week-date {
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.8rem;
        }

        .birthday-view-all {
          display: block;
          text-align: center;
          margin-top: 16px;
          color: var(--neon-pink);
          font-weight: 600;
          text-decoration: none;
          font-size: 0.9rem;
          transition: all 0.3s;
        }

        .birthday-view-all:hover {
          color: var(--neon-yellow);
          text-shadow: 0 0 10px var(--neon-yellow);
        }

        .wish-sent-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: linear-gradient(135deg, var(--neon-green), #00D4AA);
          color: var(--purple-dark);
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          animation: pop-in 0.3s ease-out;
        }

        @keyframes pop-in {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        /* ===== BIRTHDAY MODAL ===== */
        .birthday-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: modal-fade-in 0.3s ease-out;
        }

        @keyframes modal-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .birthday-modal {
          background: linear-gradient(180deg, #2D0A4E 0%, #1A0033 100%);
          border: 3px solid var(--neon-pink);
          border-radius: 24px;
          padding: 32px;
          max-width: 400px;
          width: 100%;
          text-align: center;
          box-shadow: 0 0 60px rgba(255, 0, 255, 0.4);
          animation: modal-pop 0.4s ease-out;
        }

        @keyframes modal-pop {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        .birthday-modal-emoji {
          font-size: 5rem;
          margin-bottom: 16px;
          animation: bounce 1s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }

        .birthday-modal-title {
          font-family: 'Bangers', cursive;
          font-size: 2rem;
          color: var(--neon-yellow);
          text-shadow: 0 0 20px var(--neon-yellow);
          margin-bottom: 16px;
        }

        .birthday-modal-count {
          font-size: 1.1rem;
          color: #fff;
          margin-bottom: 20px;
        }

        .birthday-modal-balloons {
          font-size: 1.5rem;
          letter-spacing: 4px;
          margin-bottom: 20px;
        }

        .birthday-modal-senders {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
          margin-bottom: 20px;
        }

        .birthday-modal-gifts {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 24px;
        }

        .birthday-modal-gifts-title {
          color: var(--neon-pink);
          font-weight: 700;
          margin-bottom: 12px;
        }

        .birthday-modal-gift-item {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #fff;
          font-size: 1rem;
          margin-bottom: 4px;
        }

        .birthday-modal-btn {
          display: inline-block;
          padding: 14px 32px;
          background: linear-gradient(135deg, var(--neon-pink), #FF3399);
          color: #fff;
          font-family: 'Bangers', cursive;
          font-size: 1.2rem;
          letter-spacing: 2px;
          text-decoration: none;
          border-radius: 30px;
          border: none;
          cursor: pointer;
          box-shadow: 0 0 30px rgba(255, 0, 255, 0.5);
          transition: all 0.3s;
        }

        .birthday-modal-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 0 50px rgba(255, 0, 255, 0.7);
        }

        .birthday-modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.5);
          font-size: 1.5rem;
          cursor: pointer;
          transition: color 0.3s;
        }

        .birthday-modal-close:hover {
          color: #fff;
        }
      `}</style>

      {/* Background pattern */}
      <div className="bg-pattern" />

      {/* Floating shapes */}
      <div className="shape shape-1" />
      <div className="shape shape-2" />
      <div className="shape shape-3" />
      <div className="shape shape-4" />

      {/* Header avec bordure néon */}
      <header className="header">
        <div className="header-inner">
          <Link href="/" className="logo">
            <span className="logo-icon">🎠</span>
            Déli Délo
          </Link>

          <div className="currency-btns">
            <Link href="/collection" className="currency-btn billes">
              <span>🔵</span>
              <span>{stats.billes}</span>
            </Link>
            <Link href="/boutique" className="currency-btn bonbons">
              <span>🍬</span>
              <span>{stats.bonbons}</span>
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <nav className="nav-menu">
          <div className="nav-items">
            <Link href="/dashboard" className="nav-item active">
              <span>🏠</span>
              <span>Accueil</span>
            </Link>
            <Link href="/games" className="nav-item highlight">
              <span>🎮</span>
              <span>Jeux</span>
            </Link>
            <Link href="/messages" className="nav-item">
              <span>💬</span>
              <span>Messages</span>
            </Link>
            <Link href="/events" className="nav-item">
              <span>🍻</span>
              <span>Events</span>
            </Link>
            <Link href="/invite" className="nav-item">
              <span>👯</span>
              <span>Inviter</span>
            </Link>
            <Link href="/profile" className="nav-item">
              <span>👤</span>
              <span>Profil</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* Spacer pour le header fixe */}
      <div style={{ height: '130px' }} />

      {/* Marquee banner */}
      <div className="marquee-container">
        <div className="marquee">
          <div className="marquee-content">
            <span className="marquee-item">🎮 Joue avec tes potes</span>
            <span className="marquee-item">💕 Rencontre des gens</span>
            <span className="marquee-item">🎯 Fini les convos chiantes</span>
            <span className="marquee-item">✨ Sois toi-même</span>
            <span className="marquee-item">🎠 Jeux d'enfance</span>
            <span className="marquee-item">💥 Vraies connexions</span>
          </div>
          <div className="marquee-content">
            <span className="marquee-item">🎮 Joue avec tes potes</span>
            <span className="marquee-item">💕 Rencontre des gens</span>
            <span className="marquee-item">🎯 Fini les convos chiantes</span>
            <span className="marquee-item">✨ Sois toi-même</span>
            <span className="marquee-item">🎠 Jeux d'enfance</span>
            <span className="marquee-item">💥 Vraies connexions</span>
          </div>
        </div>
      </div>

      {/* Hero section */}
      <section className="hero">
        {/* Mascotte */}
        <div className={`mascot ${mounted ? 'fade-in' : 'opacity-0'}`}>🐱</div>

        {/* Titre néon */}
        <h1 className={`hero-title ${mounted ? 'fade-in' : 'opacity-0'}`}>
          C'est toi le chat !
        </h1>

        {/* Sous-titre */}
        <p className={`hero-subtitle ${mounted ? 'fade-in-delay-1' : 'opacity-0'}`}>
          Le terrain de jeu secret des grands enfants
        </p>

        {/* Boutons */}
        <div className={`cta-buttons ${mounted ? 'fade-in-delay-1' : 'opacity-0'}`}>
          <div className="btn-primary-wrapper">
            <Link href="/games" className="btn-primary">
              🎮 ALLER À LA RÉCRÉ !
            </Link>
          </div>
          <div className="btn-secondary-wrapper">
            <Link href="/invite" className="btn-secondary">
              👯 INVITER MES POTES
            </Link>
          </div>
          <p className="invite-hint">+10 billes par ami invité !</p>
        </div>

        {/* Stats */}
        <div className={`stats-row ${mounted ? 'fade-in-delay-2' : 'opacity-0'}`}>
          <Link href="/collection" className="stat-card" style={{ textDecoration: 'none' }}>
            <div className="stat-number">🔵 {stats.billes}</div>
            <div className="stat-label">Billes</div>
          </Link>
          <Link href="/boutique" className="stat-card" style={{ textDecoration: 'none' }}>
            <div className="stat-number">🍬 {stats.bonbons}</div>
            <div className="stat-label">Bonbons</div>
          </Link>
        </div>

        {/* Lien */}
        <Link href="/games/history" className={`recre-link ${mounted ? 'fade-in-delay-3' : 'opacity-0'}`}>
          Voir mes dernières récrés →
        </Link>

        {/* Section Anniversaires */}
        {(mockBirthdays.today.length > 0 || mockBirthdays.thisWeek.length > 0) && (
          <div className={`birthday-section ${mounted ? 'fade-in-delay-3' : 'opacity-0'}`}>
            <div className="birthday-header">
              <span style={{ fontSize: '2rem' }}>🎂</span>
              <h2 className="birthday-title">ANNIVERSAIRES</h2>
            </div>
            <p className="birthday-subtitle">"Pour que personne soit oublié"</p>

            {/* Anniversaires aujourd'hui */}
            {mockBirthdays.today.length > 0 && (
              <div>
                <h3 className="birthday-group-title">
                  <span>🎈</span> Aujourd'hui
                </h3>
                {mockBirthdays.today.map(person => (
                  <div key={person.id} className="birthday-card">
                    <div className="birthday-avatar">{person.avatar}</div>
                    <div className="birthday-info">
                      <div className="birthday-name">
                        {person.pseudo} fête ses <span className="birthday-age">{person.age} ans</span> !
                      </div>
                    </div>
                    <div className="birthday-actions">
                      {wishedToday[person.id] ? (
                        <div className="wish-sent-badge">
                          ✓ Envoyé !
                        </div>
                      ) : showWishSent === person.id ? (
                        <div className="wish-sent-badge">
                          🎉 Envoyé !
                        </div>
                      ) : (
                        <>
                          <button
                            className="birthday-btn bille"
                            onClick={() => handleSendWish(person.id, 'bille')}
                          >
                            <span>🔵</span> Bille
                          </button>
                          <button
                            className="birthday-btn bonbon"
                            onClick={() => handleSendWish(person.id, 'bonbon')}
                          >
                            <span>🍬</span> Bonbon
                          </button>
                          <button
                            className="birthday-btn simple"
                            onClick={() => handleSendWish(person.id, 'simple')}
                          >
                            <span>🎉</span> Souhaiter
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Anniversaires cette semaine */}
            {mockBirthdays.thisWeek.length > 0 && (
              <div style={{ marginTop: mockBirthdays.today.length > 0 ? '24px' : '0' }}>
                <h3 className="birthday-group-title">
                  <span>📅</span> Cette semaine
                </h3>
                {mockBirthdays.thisWeek.map(person => (
                  <div key={person.id} className="birthday-week-item">
                    <span className="birthday-week-avatar">{person.avatar}</span>
                    <div className="birthday-week-info">
                      <div className="birthday-week-name">{person.pseudo}</div>
                      <div className="birthday-week-date">{person.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Link href="/birthdays" className="birthday-view-all">
              Voir tous les anniversaires →
            </Link>
          </div>
        )}
      </section>

      {/* Modal Anniversaire (quand c'est MON anniversaire) */}
      {showBirthdayModal && mockMyBirthdayWishes.isMyBirthday && (
        <div className="birthday-modal-overlay" onClick={() => setShowBirthdayModal(false)}>
          <div className="birthday-modal" onClick={e => e.stopPropagation()}>
            <div className="birthday-modal-emoji">🎂</div>
            <h2 className="birthday-modal-title">🎉 JOYEUX ANNIVERSAIRE !</h2>
            <p className="birthday-modal-count">
              <strong>{mockMyBirthdayWishes.wishCount} personnes</strong> te souhaitent<br />
              ton anniversaire !
            </p>
            <div className="birthday-modal-balloons">
              🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈
            </div>
            <p className="birthday-modal-senders">
              {mockMyBirthdayWishes.wishes.slice(0, 3).map(w => w.sender).join(', ')} et {mockMyBirthdayWishes.wishCount - 3} autres
            </p>
            <div className="birthday-modal-gifts">
              <div className="birthday-modal-gifts-title">🎁 Tu as aussi reçu :</div>
              <div className="birthday-modal-gift-item">
                <span>• {mockMyBirthdayWishes.totalBonbons} bonbons</span>
                <span>🍬</span>
              </div>
              <div className="birthday-modal-gift-item">
                <span>• {mockMyBirthdayWishes.totalBilles} billes</span>
                <span>🔵</span>
              </div>
            </div>
            <Link href="/birthday-wishes" className="birthday-modal-btn" onClick={() => setShowBirthdayModal(false)}>
              VOIR TOUS LES MESSAGES
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
