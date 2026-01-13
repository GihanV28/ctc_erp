'use client';

import React from 'react';
import { MapPin, Truck, Headphones, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';
import { FadeIn, SlideIn } from '../animations';
import { SIGNUP_URL } from '../../lib/constants';
import { scrollToSection } from '../../lib/utils';

export const Hero: React.FC = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 to-gray-900/70 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=80)',
            backgroundColor: '#1f2937' // Fallback color
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 md:py-32 text-center">
        <FadeIn>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Global Cargo Transport
            <br />
            Made Simple
          </h1>
        </FadeIn>

        <SlideIn direction="bottom" delay={0.2}>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-2">
            Fast, reliable, and secure shipping from Cambodia to Sri Lanka and worldwide. Track your
            shipments in real-time with Ceylon Cargo Transport.
          </p>
        </SlideIn>

        <SlideIn direction="bottom" delay={0.4}>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-10 sm:mb-16 px-4 sm:px-0">
            <Button
              variant="primary"
              size="xl"
              onClick={() => (window.location.href = SIGNUP_URL)}
              className="w-full sm:w-auto"
            >
              Join With Us
            </Button>
          </div>
        </SlideIn>

        {/* Key Features */}
        <FadeIn delay={0.6}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto px-4 sm:px-0">
            <div className="flex flex-col items-center space-y-2 sm:space-y-3 text-white">
              <div className="p-2 sm:p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                <MapPin className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
              <h3 className="font-semibold text-base sm:text-lg">Real-Time Tracking</h3>
            </div>
            <div className="flex flex-col items-center space-y-2 sm:space-y-3 text-white">
              <div className="p-2 sm:p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                <Truck className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
              <h3 className="font-semibold text-base sm:text-lg">Door-to-Door Service</h3>
            </div>
            <div className="flex flex-col items-center space-y-2 sm:space-y-3 text-white">
              <div className="p-2 sm:p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                <Headphones className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
              <h3 className="font-semibold text-base sm:text-lg">24/7 Support</h3>
            </div>
          </div>
        </FadeIn>

      </div>

      {/* Scroll Indicator - positioned relative to section, not content */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center animate-bounce">
        <button
          onClick={() => scrollToSection('about')}
          className="text-white hover:text-gray-200 transition-colors"
          aria-label="Scroll down"
        >
          <ChevronDown className="h-8 w-8" />
        </button>
      </div>
    </section>
  );
};
