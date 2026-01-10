'use client'

import { useState, useRef } from 'react'
import html2canvas from 'html2canvas'

interface SharePostcardProps {
  isOpen: boolean
  onClose: () => void
  gameName: string
  gameEmoji: string
  score: number
  playerName: string
  partnerName?: string
  customMessage?: string
}

export default function SharePostcard({
  isOpen,
  onClose,
  gameName,
  gameEmoji,
  score,
  playerName,
  partnerName,
  customMessage
}: SharePostcardProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [shareStep, setShareStep] = useState<'preview' | 'share'>('preview')
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const postcardRef = useRef<HTMLDivElement>(null)

  if (!isOpen) return null

  const generateImage = async () => {
    if (!postcardRef.current) return null

    setIsGenerating(true)
    try {
      const canvas = await html2canvas(postcardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      })
      const dataUrl = canvas.toDataURL('image/png')
      setGeneratedImage(dataUrl)
      setShareStep('share')
      return dataUrl
    } catch (error) {
      console.error('Erreur génération image:', error)
      return null
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadImage = () => {
    if (!generatedImage) return
    const link = document.createElement('a')
    link.download = `gamecrush-${gameName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`
    link.href = generatedImage
    link.click()
  }

  const copyToClipboard = async () => {
    if (!generatedImage) return
    try {
      const response = await fetch(generatedImage)
      const blob = await response.blob()
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
      alert('Image copiée ! Colle-la dans ton app préférée 📋')
    } catch {
      // Fallback: télécharger l'image
      downloadImage()
    }
  }

  const shareText = customMessage ||
    `🎠 Coucou de Déli Délo land ! J'ai obtenu ${score} points au ${gameName} ${gameEmoji} - Viens jouer avec moi !`

  const shareUrl = `https://delidelo.netlify.app/invite?from=${encodeURIComponent(playerName)}`

  const shareToWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`
    window.open(url, '_blank')
  }

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`
    window.open(url, '_blank')
  }

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    window.open(url, '_blank')
  }

  const shareNative = async () => {
    if (navigator.share) {
      try {
        if (generatedImage) {
          const response = await fetch(generatedImage)
          const blob = await response.blob()
          const file = new File([blob], 'gamecrush-score.png', { type: 'image/png' })
          await navigator.share({
            title: `${gameName} - Score: ${score}`,
            text: shareText,
            url: shareUrl,
            files: [file]
          })
        } else {
          await navigator.share({
            title: `${gameName} - Score: ${score}`,
            text: shareText,
            url: shareUrl,
          })
        }
      } catch (err) {
        console.log('Partage annulé')
      }
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0, 0, 0, 0.9)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        style={{ background: '#1A0033', border: '3px solid #FF00FF', boxShadow: '0 0 40px rgba(255, 0, 255, 0.3)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 text-center" style={{ background: 'linear-gradient(135deg, #FF00FF 0%, #00FFFF 100%)' }}>
          <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'Bangers, cursive', textShadow: '2px 2px 0 #000' }}>
            📮 Partager mon score
          </h3>
        </div>

        <div className="p-4">
          {shareStep === 'preview' ? (
            <>
              {/* Carte Postale Preview */}
              <div
                ref={postcardRef}
                className="rounded-xl overflow-hidden mb-4"
                style={{
                  background: 'linear-gradient(135deg, #FF00FF 0%, #FF6B9D 30%, #FFB347 70%, #00FFFF 100%)',
                  padding: '3px',
                }}
              >
                <div
                  className="rounded-lg p-6 text-center"
                  style={{
                    background: 'linear-gradient(180deg, #1A0033 0%, #330066 100%)',
                  }}
                >
                  {/* Titre */}
                  <div className="mb-4">
                    <span className="text-4xl">🎠</span>
                    <h4
                      className="text-xl font-bold text-white mt-2"
                      style={{ fontFamily: 'Bangers, cursive', textShadow: '0 0 15px #FF00FF' }}
                    >
                      Coucou de Déli Délo land !
                    </h4>
                  </div>

                  {/* Score */}
                  <div
                    className="py-4 px-6 rounded-xl mb-4"
                    style={{
                      background: 'rgba(255, 0, 255, 0.2)',
                      border: '2px solid #FF00FF',
                      boxShadow: '0 0 20px rgba(255, 0, 255, 0.3)'
                    }}
                  >
                    <div className="text-5xl mb-2">{gameEmoji}</div>
                    <p className="text-white/80 text-sm mb-1">{playerName} a joué au</p>
                    <p className="text-2xl font-bold text-[#00FFFF]" style={{ textShadow: '0 0 10px #00FFFF' }}>
                      {gameName}
                    </p>
                    {partnerName && (
                      <p className="text-white/60 text-sm mt-1">avec {partnerName}</p>
                    )}
                  </div>

                  {/* Points */}
                  <div className="mb-4">
                    <div
                      className="inline-block px-8 py-3 rounded-full"
                      style={{
                        background: 'linear-gradient(135deg, #FFD700, #FF8C00)',
                        boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)'
                      }}
                    >
                      <span className="text-3xl font-bold text-[#1A0033]">⭐ {score} points</span>
                    </div>
                  </div>

                  {/* Invitation */}
                  <p className="text-[#39FF14] font-bold" style={{ textShadow: '0 0 10px #39FF14' }}>
                    Je t'invite à jouer aussi !
                  </p>

                  {/* Logo */}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <span className="text-white/50 text-xs">🎠 delidelo.app</span>
                  </div>
                </div>
              </div>

              {/* Bouton Générer */}
              <button
                onClick={generateImage}
                disabled={isGenerating}
                className="w-full py-4 rounded-xl font-bold text-lg transition"
                style={{
                  background: isGenerating
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'linear-gradient(135deg, #FF00FF 0%, #00FFFF 100%)',
                  color: 'white',
                  boxShadow: isGenerating ? 'none' : '0 0 20px rgba(255, 0, 255, 0.4)',
                }}
              >
                {isGenerating ? '⏳ Génération...' : '✨ Créer ma carte postale'}
              </button>
            </>
          ) : (
            <>
              {/* Image générée */}
              {generatedImage && (
                <div className="mb-4 rounded-xl overflow-hidden border-2 border-[#FF00FF]">
                  <img src={generatedImage} alt="Carte postale" className="w-full" />
                </div>
              )}

              {/* Boutons de partage */}
              <div className="space-y-3">
                {/* Partage natif (mobile) */}
                {typeof navigator !== 'undefined' && 'share' in navigator && (
                  <button
                    onClick={shareNative}
                    className="w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3"
                    style={{
                      background: 'linear-gradient(135deg, #FF00FF 0%, #00FFFF 100%)',
                      color: 'white',
                      boxShadow: '0 0 20px rgba(255, 0, 255, 0.4)',
                    }}
                  >
                    <span className="text-2xl">📤</span>
                    Partager
                  </button>
                )}

                {/* WhatsApp */}
                <button
                  onClick={shareToWhatsApp}
                  className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-3 transition hover:scale-[1.02]"
                  style={{
                    background: '#25D366',
                    color: 'white',
                  }}
                >
                  <span className="text-2xl">💬</span>
                  WhatsApp
                </button>

                {/* Facebook */}
                <button
                  onClick={shareToFacebook}
                  className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-3 transition hover:scale-[1.02]"
                  style={{
                    background: '#1877F2',
                    color: 'white',
                  }}
                >
                  <span className="text-2xl">📘</span>
                  Facebook
                </button>

                {/* Twitter/X */}
                <button
                  onClick={shareToTwitter}
                  className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-3 transition hover:scale-[1.02]"
                  style={{
                    background: '#000000',
                    color: 'white',
                  }}
                >
                  <span className="text-2xl">𝕏</span>
                  Twitter / X
                </button>

                {/* Copier l'image */}
                <button
                  onClick={copyToClipboard}
                  className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-3 transition hover:scale-[1.02]"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    color: 'white',
                  }}
                >
                  <span className="text-2xl">📋</span>
                  Copier l'image (Instagram, Snap...)
                </button>

                {/* Télécharger */}
                <button
                  onClick={downloadImage}
                  className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-3 transition hover:scale-[1.02]"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    color: 'white',
                  }}
                >
                  <span className="text-2xl">💾</span>
                  Télécharger l'image
                </button>
              </div>

              {/* Revenir à la preview */}
              <button
                onClick={() => setShareStep('preview')}
                className="w-full mt-4 py-2 text-white/50 hover:text-white transition text-sm"
              >
                ← Modifier la carte
              </button>
            </>
          )}

          {/* Fermer */}
          <button
            onClick={onClose}
            className="w-full mt-4 py-3 text-white/50 hover:text-white transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}
