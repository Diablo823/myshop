import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export const useParticleAnimation = (particleCount: number = 100) => {
  const particlesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!particlesRef.current) return

    const particles = particlesRef.current.children
    const viewport = {
      height: window.innerHeight,
      width: window.innerWidth,
    }

    // Clear any existing animations
    gsap.killTweensOf(particles)

    gsap.set(particles, {
      opacity: 0,
      y: viewport.height,
      scale: 0,
      rotation: 0,
    })

    gsap.to(particles, {
      opacity: 1,
      y: -50, // Reduced travel distance
      scale: 1,
      rotation: 360,
      duration: 3,
      ease: 'power3.out',
      stagger: {
        from: 'random',
        amount: 2,
      },
      repeat: -1,
      onComplete: function() {
        if (particlesRef.current) {
          gsap.set(particles, { clearProps: 'all' })
        }
      }
    })

    // Cleanup function
    return () => {
      gsap.killTweensOf(particles)
    }
  }, [particleCount])

  return particlesRef
}