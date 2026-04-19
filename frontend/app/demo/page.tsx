'use client';
import React from 'react';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import { SplineScene } from '@/components/ui/spline';
import { Spotlight } from '@/components/ui/spotlight';
import { Card, CardContent } from '@/components/ui/card';

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">

      {/* ── Section 1: Container Scroll Animation ── */}
      <section className="py-10">
        <ContainerScroll
          titleComponent={
            <div className="text-center mb-6">
              <p className="text-sm font-mono text-violet-400 uppercase tracking-widest mb-3">
                Component Demo
              </p>
              <h2
                className="text-4xl md:text-6xl font-extrabold leading-tight"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                Scroll to{' '}
                <span className="text-violet-400">Unfold</span>
              </h2>
              <p className="mt-4 text-gray-400 text-base md:text-lg max-w-xl mx-auto">
                A 3D card that rotates as you scroll — built with Framer Motion's useScroll.
              </p>
            </div>
          }
        >
          {/* Card interior — Unsplash image */}
          <div className="relative w-full h-full rounded-xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&auto=format&fit=crop&q=80"
              alt="AI neural network visualization"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-8">
              <p className="text-xs font-mono text-violet-300 mb-2 uppercase tracking-widest">
                Live Preview
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                Rohith Dharavathu
              </h3>
              <p className="text-gray-300 text-sm mt-1">
                Data Scientist · ML Engineer · GenAI Builder
              </p>
            </div>
          </div>
        </ContainerScroll>
      </section>

      {/* ── Section 2: Spline 3D Scene ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-black">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="purple" />

        <div className="container mx-auto px-6 py-20">
          <div className="flex flex-col md:flex-row items-center gap-10">

            {/* Left — text */}
            <div className="flex-1 z-10">
              <p className="text-sm font-mono text-violet-400 uppercase tracking-widest mb-4">
                Interactive 3D
              </p>
              <h2
                className="text-4xl md:text-6xl font-extrabold leading-tight mb-6"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                Meet My{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
                  AI Universe
                </span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed max-w-md mb-8">
                An interactive 3D scene powered by Spline. Drag, rotate, and explore — built to
                showcase immersive experiences in the browser.
              </p>

              <div className="flex flex-wrap gap-3">
                {['React 19', 'Next.js 16', 'Framer Motion', 'Spline 3D'].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-mono border border-violet-500/30 bg-violet-500/10 text-violet-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — Spline scene */}
            <div className="flex-1 relative">
              <Card className="overflow-hidden border-violet-500/20">
                <CardContent className="p-0">
                  <div className="h-[500px] w-full relative bg-black rounded-xl">
                    <SplineScene
                      scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                      className="w-full h-full"
                    />
                    {/* Fallback gradient overlay while loading */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent pointer-events-none" />
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </section>

      {/* ── Footer note ── */}
      <div className="text-center py-8 text-gray-600 text-xs font-mono border-t border-white/5">
        /demo — ContainerScrollAnimation + SplineScene
      </div>
    </main>
  );
}
