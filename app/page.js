'use client';

import React from 'react';
import Hero from "@/components/hero"
import FeaturedProperties from "@/components/featured-properties"
import SellWithUs from "@/components/sell-with-us"
import AboutUs from "@/components/about-us"
import MapSection from "@/components/mapSection"
import ScrollReveal from "@/components/ScrollReveal"

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-neutral-50">
      <section className="relative fade-in py-0">
        <Hero />
      </section>
      
      <section className="w-full py-0">
        <FeaturedProperties />
      </section>
      
      <section className="w-full py-0">
        <SellWithUs />
      </section>
      
      <section className="w-full py-0">
        <MapSection />
      </section>
    </div>
  )
}

