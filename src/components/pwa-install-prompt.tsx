'use client'

import { useEffect, useState } from 'react'
import { X, Download, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if already installed (running in standalone mode)
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches
    setIsStandalone(isInStandaloneMode)

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOSDevice)

    // Check if user already dismissed the prompt
    const dismissed = localStorage.getItem('pwa-prompt-dismissed')
    const dismissedTime = dismissed ? parseInt(dismissed) : 0
    const oneWeek = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    const shouldShowAgain = Date.now() - dismissedTime > oneWeek

    // Handle the beforeinstallprompt event (Android/Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      const promptEvent = e as BeforeInstallPromptEvent
      setDeferredPrompt(promptEvent)
      
      // Show prompt if not dismissed recently
      if (shouldShowAgain) {
        // Wait a bit before showing (better UX)
        setTimeout(() => {
          setShowPrompt(true)
        }, 3000) // Show after 3 seconds
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // For iOS, show custom prompt if not installed
    if (isIOSDevice && !isInStandaloneMode && shouldShowAgain) {
      setTimeout(() => {
        setShowPrompt(true)
      }, 3000)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    await deferredPrompt.prompt()

    // Wait for the user to respond
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    } else {
      console.log('User dismissed the install prompt')
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    // Remember dismissal for 7 days
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString())
  }

  const handleNeverShow = () => {
    setShowPrompt(false)
    // Remember dismissal for a very long time
    localStorage.setItem('pwa-prompt-dismissed', (Date.now() + 365 * 24 * 60 * 60 * 1000).toString())
  }

  // Don't show if already installed or not ready
  if (isStandalone || !showPrompt) {
    return null
  }

  // iOS-specific prompt
  if (isIOS) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-black/90 to-transparent">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-6 animate-slide-up">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900 mb-1">
                Install Missing Semester
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Install this app on your iPhone: tap 
                <span className="inline-flex items-center mx-1 px-2 py-0.5 bg-blue-50 rounded text-blue-600 font-medium">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z" transform="rotate(90 12 12)"/>
                  </svg>
                </span>
                then "Add to Home Screen".
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>✓ Works offline</span>
                <span>•</span>
                <span>✓ Fast loading</span>
                <span>•</span>
                <span>✓ Native feel</span>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              onClick={handleNeverShow}
              variant="ghost"
              size="sm"
              className="flex-1 text-gray-600"
            >
              Don't show again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Android/Desktop prompt
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-black/90 to-transparent animate-slide-up">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <Download className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-1">
              Install Missing Semester
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Get quick access and work offline. Install this app on your device for the best experience.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>✓ Works offline</span>
              <span>•</span>
              <span>✓ Fast loading</span>
              <span>•</span>
              <span>✓ Push notifications</span>
              <span>•</span>
              <span>✓ Native feel</span>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            onClick={handleNeverShow}
            variant="ghost"
            size="sm"
            className="flex-1 text-gray-600"
          >
            Not now
          </Button>
          <Button
            onClick={handleInstallClick}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            size="sm"
          >
            Install App
          </Button>
        </div>
      </div>
    </div>
  )
}
