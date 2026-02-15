'use client'

import { Button } from '@/components/ui/button'
import BackgroundMedia from '@/components/BackgroundMedia'
import Link from 'next/link'
import { MoreHorizontal } from 'lucide-react'

export default function Home() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black font-sans selection:bg-white selection:text-black">
      {/* 1. Base Layer: Background Media (Standard Starfield) */}
      <BackgroundMedia />

      {/* 2. Middle Layer: Earth Image (Left Side) - Ensuring Perfect Circle */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-1/2 overflow-visible">
        <img
          src="/images/earth.png"
          alt="Earth"
          className="absolute right-[-15%] top-[-10%] h-[120vh] w-[120vh] max-w-none object-cover brightness-100 contrast-125 drop-shadow-[0_0_100px_rgba(0,0,0,0.8)] grayscale-[0.2] animate-earth-drift"
        />
        {/* Subtle glow / haze on the edge */}
        <div
          className="absolute right-[-15%] top-[-10%] h-[120vh] w-[120vh] rounded-full bg-transparent shadow-[inset_-50px_0_100px_rgba(255,255,255,0.1)] animate-earth-drift"
        />
      </div>

      {/* 3. Top Navigation Bar */}
      <nav className="absolute left-0 top-0 z-50 flex w-full items-center justify-between px-8 py-6 animate-fade-in-down">
        <div className="flex items-center gap-2">
          {/* Logo inverts color based on position */}
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
            <path d="M12 2L14.4 9.6H22L15.8 14.3L18.2 21.9L12 17.2L5.8 21.9L8.2 14.3L2 9.6H9.6L12 2Z" fill="currentColor" />
          </svg>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/feed">
            <button className="flex items-center gap-3 overflow-hidden rounded-full border border-white/10 bg-black/40 p-1 pl-4 pr-1 backdrop-blur-md transition-all hover:scale-105 hover:bg-black/60">
              <span className="text-[10px] font-black uppercase tracking-widest text-white">Join Stargazer</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black">
                <div className="flex h-2 w-4 items-center gap-0.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-black/40" />
                  <div className="h-1.5 w-1.5 rounded-full bg-black" />
                </div>
              </div>
            </button>
          </Link>
          <button className="text-white/40 transition-colors hover:text-white pointer-events-auto">
            <MoreHorizontal className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* 4. Content Layer - High-Contrast Typography */}
      <div className="relative z-20 flex h-full flex-col justify-center px-12 md:px-24">
        <div className="group relative flex flex-col pt-20">
          <div className="absolute right-[15%] top-0 max-w-[200px] text-right text-[10px] uppercase tracking-[0.25em] text-white/50 opacity-0 transition-all duration-1000 group-hover:opacity-100 italic">
            Explore the Cosmos,<br />One Star at a Time
          </div>

          <h1 className="pointer-events-none relative flex flex-col font-black tracking-[-0.05em] animate-text-reveal">
            <span className="text-[10rem] leading-[0.8] text-white md:text-[15rem] drop-shadow-2xl">
              Stargazer
            </span>
          </h1>

          <div className="mt-6 flex max-w-sm flex-col gap-4 text-xs font-semibold uppercase tracking-widest text-white/60">
            <p className="flex items-center gap-4 animate-fade-in-right opacity-0" style={{ animationDelay: '0.8s' }}>
              <span className="h-[1px] w-12 bg-white/70"></span>
              Gateway to Cosmic Exploration
            </p>
            <p className="flex items-center gap-4 animate-fade-in-right opacity-0" style={{ animationDelay: '1.0s' }}>
              <span className="h-[1px] w-12 bg-white/20"></span>
              Interactive Solar Mapping
            </p>
            <p className="flex items-center gap-4 animate-fade-in-right opacity-0" style={{ animationDelay: '1.2s' }}>
              <span className="h-[1px] w-12 bg-white/20"></span>
              Deep Space Observation
            </p>
          </div>
        </div>
      </div>

      {/* 5. Space Taglines */}
      <div className="absolute bottom-12 left-1/2 z-30 -translate-x-1/2 text-center animate-fade-in-up opacity-0" style={{ animationDelay: '1.5s' }}>
        <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">
          Deciphering the<br />
          <span className="text-white/80">Ancient Starlight</span>
        </div>
      </div>

      {/* Grain / Noise Overlay */}
      <div className="pointer-events-none absolute inset-0 z-50 opacity-[0.04]" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
    </main>
  )
}
