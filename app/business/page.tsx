'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function BusinessPage() {
  const router = useRouter()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const handleStart = () => {
    router.push('/business/new')
  }

  const faqs = [
    { q: 'Combien de personnes peuvent participer ?', a: 'Le kit est optimisé pour 8-12 personnes, mais fonctionne de 4 à 12.' },
    { q: 'Faut-il une connexion internet ?', a: 'Oui, chaque participant joue sur son téléphone. Le wifi du resto suffit.' },
    { q: 'Combien de temps durent les jeux ?', a: 'Environ 1h30-2h au total, répartis sur le repas.' },
  ]

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0D001A 0%, #1A0033 100%)' }}>
      <style jsx>{`
        .page-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        section {
          padding: 4rem 0;
        }

        .btn-primary {
          display: inline-block;
          background: linear-gradient(135deg, #FF00FF 0%, #FF6B9D 100%);
          color: white;
          font-weight: bold;
          padding: 18px 48px;
          border-radius: 14px;
          font-size: 1.2rem;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          text-decoration: none;
        }
        .btn-primary:hover {
          transform: scale(1.05);
          box-shadow: 0 0 40px rgba(255, 0, 255, 0.5);
        }

        .faq-item {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .faq-item:hover {
          border-color: rgba(255, 255, 255, 0.2);
        }
        .faq-question {
          padding: 1rem 1.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: white;
          font-weight: 500;
        }
        .faq-answer {
          padding: 0 1.5rem 1rem;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.95rem;
        }

        .game-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        .game-icon span:first-child {
          font-size: 2.5rem;
        }
        .game-icon span:last-child {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.7);
          text-align: center;
        }

        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        .step-icon {
          font-size: 2rem;
        }
        .step-label {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.8);
        }
        .step-number {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .testimonial {
          text-align: center;
          padding: 0 1rem;
        }
        .testimonial-quote {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          font-style: italic;
          margin-bottom: 0.5rem;
        }
        .testimonial-author {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.5);
        }
      `}</style>

      {/* Header minimal */}
      <header className="py-4">
        <div className="page-container flex items-center justify-between">
          <Link href="/games" className="text-white/50 hover:text-white transition text-sm">
            ← Retour
          </Link>
          <span className="text-xl">🍽️</span>
        </div>
      </header>

      {/* SECTION 1: HERO */}
      <section style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
        <div className="page-container text-center">
          <div className="text-6xl mb-8">🍽️</div>
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{
              fontFamily: 'Bangers, cursive',
              color: '#FF00FF',
              textShadow: '0 0 30px rgba(255, 0, 255, 0.5), 3px 3px 0 #00FFFF'
            }}
          >
            LA RÉCRÉ BUSINESS
          </h1>
          <p
            className="text-xl mb-12"
            style={{ color: '#00FFFF', textShadow: '0 0 10px rgba(0, 255, 255, 0.5)' }}
          >
            "Le networking sans le malaise"
          </p>
          <button onClick={handleStart} className="btn-primary">
            Créer ma Récré
          </button>
        </div>
      </section>

      {/* SECTION 2: COMMENT ÇA MARCHE */}
      <section style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
        <div className="page-container">
          <p className="text-center text-white/60 mb-8">
            Vous choisissez le resto, on s'occupe du fun.
          </p>
          <div className="flex justify-center items-start gap-8 md:gap-16 flex-wrap">
            <div className="step-item">
              <span className="step-number">1.</span>
              <span className="step-icon">📝</span>
              <span className="step-label">Configurez</span>
            </div>
            <div className="step-item">
              <span className="step-number">2.</span>
              <span className="step-icon">📤</span>
              <span className="step-label">Invitez</span>
            </div>
            <div className="step-item">
              <span className="step-number">3.</span>
              <span className="step-icon">🎉</span>
              <span className="step-label">Jouez</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: LES JEUX */}
      <section>
        <div className="page-container text-center">
          <p className="text-white/70 mb-8">
            4 jeux inclus pour animer votre soirée
          </p>
          <div className="flex justify-center items-start gap-8 md:gap-12 flex-wrap">
            <div className="game-icon">
              <span>🎭</span>
              <span>Tête de<br/>l'Emploi</span>
            </div>
            <div className="game-icon">
              <span>🎤</span>
              <span>Pitch<br/>Absurde</span>
            </div>
            <div className="game-icon">
              <span>🧠</span>
              <span>Brainstorm<br/>Débile</span>
            </div>
            <div className="game-icon">
              <span>⚖️</span>
              <span>Procès du<br/>Bureau</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: TÉMOIGNAGES */}
      <section style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
        <div className="page-container">
          <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-12">
            <div className="testimonial">
              <p className="testimonial-quote">"On a plus échangé en 2h qu'en 6 mois"</p>
              <p className="testimonial-author">— Marie, CEO</p>
            </div>
            <div className="testimonial">
              <p className="testimonial-quote">"Enfin un event où on parle vraiment"</p>
              <p className="testimonial-author">— Lucas, Freelance</p>
            </div>
            <div className="testimonial">
              <p className="testimonial-quote">"J'ai signé un client"</p>
              <p className="testimonial-author">— Sophie, Consultante</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: FAQ */}
      <section>
        <div className="page-container">
          <div className="space-y-3 max-w-xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <div
                  className="faq-question"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span>{faq.q}</span>
                  <span style={{
                    transform: openFaq === index ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease'
                  }}>
                    ▼
                  </span>
                </div>
                {openFaq === index && (
                  <div className="faq-answer">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>
        <div className="page-container text-center">
          <p
            className="text-xl mb-8"
            style={{ color: 'rgba(255, 255, 255, 0.8)' }}
          >
            Prêt à révolutionner vos soirées ?
          </p>
          <button onClick={handleStart} className="btn-primary">
            Créer ma Récré Business
          </button>
        </div>
      </section>

      {/* Footer minimal */}
      <footer className="py-6 border-t border-white/10">
        <div className="page-container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
          <span>Un produit Déli Délo 🎠</span>
          <div className="flex gap-6">
            <Link href="/cgu" className="hover:text-white transition">CGV</Link>
            <a href="mailto:contact@aladelidelo.app" className="hover:text-white transition">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
