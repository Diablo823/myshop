'use client'

import Image from 'next/image'
import { useLinkStatus } from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Progress } from '@/components/ui/progress'

function Overlay() {
    const { pending } = useLinkStatus()
    const [progress, setProgress] = useState(0)
    const [mounted, setMounted] = useState(false)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    // Needed to safely use createPortal (avoids SSR mismatch)
    useEffect(() => setMounted(true), [])

    // Lock/unlock scroll
    useEffect(() => {
        document.body.style.overflow = pending ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [pending])

    // Simulate progress: fast at start, crawls near 90%
    useEffect(() => {
        if (pending) {
            setProgress(0)
            intervalRef.current = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(intervalRef.current!)
                        return 90
                    }
                    const increment = prev < 30 ? 8 : prev < 60 ? 4 : prev < 80 ? 2 : 0.5
                    return prev + increment
                })
            }, 150)
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current)
            setProgress(0)
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
    }, [pending])

    if (!mounted || !pending) return null

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">

            {/* Blurred backdrop */}
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm" />

            {/* Background blobs (from your loading.tsx) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-20 w-96 h-96 bg-amber-100/40 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-gray-100/50 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
            </div>

            {/* Center content */}
            <div className="relative flex flex-col items-center gap-6 z-10">

                {/* Animated rings + logo (from your loading.tsx) */}
                <div className="relative w-20 h-20 md:w-32 md:h-32">
                    {/* Glow */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-200/30 to-yellow-300/30 blur-xl animate-pulse" />
                    {/* Outer ring - Gold */}
                    <div
                        className="absolute inset-0 rounded-full border-2 border-amber-400/50 animate-spin"
                        style={{ animationDuration: '4s' }}
                    />
                    {/* Middle ring - Gray */}
                    <div
                        className="absolute inset-1.5 rounded-full border-2 border-gray-300/50 animate-spin"
                        style={{ animationDuration: '3s', animationDirection: 'reverse' }}
                    />
                    {/* Inner ring - Gold accent */}
                    <div
                        className="absolute inset-3 rounded-full border border-amber-500/40 animate-spin"
                        style={{ animationDuration: '2s' }}
                    />
                    {/* Logo */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-full border border-amber-200/50 shadow-lg" />
                        <div className="relative w-11 h-11 md:w-[72px] md:h-[72px] animate-pulse">
                            <Image
                                src="/logo.webp"
                                alt="US Cartel"
                                fill
                                sizes="(max-width: 768px) 44px, 72px"
                                priority
                                className="object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                            />
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="w-40 md:w-48 h-[1px] bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />

                {/* shadcn Progress bar with amber gradient */}
                <div className="w-40 md:w-64">
                    <Progress
                        value={progress}
                        className="h-1.5 bg-gray-200 border border-amber-200/50 [&>div]:bg-gradient-to-r [&>div]:from-amber-400 [&>div]:via-yellow-400 [&>div]:to-gray-900 [&>div]:transition-all [&>div]:duration-150"
                    />
                </div>

            </div>
        </div>,
        document.body
    )
}

export function CardOverlayLoader() {
    return <Overlay />
}
