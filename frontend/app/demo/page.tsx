'use client'

import React from 'react'
import Image from 'next/image'
import { ContainerScroll } from '@/components/ui/container-scroll-animation'
import { SplineScene } from '@/components/ui/splite'
import { Card } from '@/components/ui/card'
import { Spotlight } from '@/components/ui/spotlight'

/** ContainerScroll demo — matches HeroScrollDemo from the spec */
function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white">
              Unleash the power of <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                Scroll Animations
              </span>
            </h1>
          </>
        }
      >
        <Image
          src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1400&auto=format&fit=crop&q=75"
          alt="AI data visualization dashboard"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  )
}

/** SplineScene demo — matches SplineSceneBasic from the spec */
function SplineSceneBasic() {
  return (
    <Card className="w-full h-[500px] bg-black/[0.96] relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />

      <div className="flex h-full">
        {/* Left content */}
        <div className="flex-1 p-8 relative z-10 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            Interactive 3D
          </h1>
          <p className="mt-4 text-neutral-300 max-w-lg">
            Bring your UI to life with beautiful 3D scenes. Create immersive
            experiences that capture attention and enhance your design.
          </p>
        </div>

        {/* Right content */}
        <div className="flex-1 relative">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>
    </Card>
  )
}

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      {/* ── Section 1: ContainerScroll ── */}
      <section className="py-10">
        <HeroScrollDemo />
      </section>

      {/* ── Section 2: SplineScene + Spotlight ── */}
      <section className="px-4 md:px-10 pb-20">
        <SplineSceneBasic />
      </section>

      <div className="text-center py-8 text-gray-600 text-xs font-mono border-t border-white/5">
        /demo — ContainerScrollAnimation + SplineScene
      </div>
    </main>
  )
}
