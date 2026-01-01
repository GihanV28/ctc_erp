'use client';

import React from 'react';
import { MapPin, Globe, Headphones, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';
import { FadeIn, SlideIn } from '../animations';
import { SIGNUP_URL } from '../../lib/constants';
import { scrollToSection } from '../../lib/utils';

export const Hero: React.FC = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-gray-900/60 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/images/hero/cargo-port.jpg)',
            backgroundColor: '#1f2937' // Fallback color
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <FadeIn>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Global Cargo Transport
            <br />
            Made Simple
          </h1>
        </FadeIn>

        <SlideIn direction="bottom" delay={0.2}>
          <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
            Fast, reliable, and secure shipping solutions for businesses worldwide. Track your
            shipments in real-time with Ceylon Cargo Transport.
          </p>
        </SlideIn>

        <SlideIn direction="bottom" delay={0.4}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              variant="primary"
              size="xl"
              onClick={() => (window.location.href = SIGNUP_URL)}
            >
              Join With Us
            </Button>
            <Button
              variant="outline"
              size="xl"
              className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white/20"
              onClick={() => scrollToSection('track')}
            >
              Track Shipment
            </Button>
          </div>
        </SlideIn>

        {/* Key Features */}
        <FadeIn delay={0.6}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center space-y-3 text-white">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-lg">Real-Time Tracking</h3>
            </div>
            <div className="flex flex-col items-center space-y-3 text-white">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                <Globe className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-lg">Global Coverage</h3>
            </div>
            <div className="flex flex-col items-center space-y-3 text-white">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                <Headphones className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-lg">24/7 Support</h3>
            </div>
          </div>
        </FadeIn>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <button
            onClick={() => scrollToSection('about')}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label="Scroll down"
          >
            <ChevronDown className="h-8 w-8" />
          </button>
        </div>
      </div>
    </section>
  );
};
