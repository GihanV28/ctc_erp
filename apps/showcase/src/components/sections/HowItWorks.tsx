'use client';

import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Container, Section } from '../ui/Container';
import { Button } from '../ui/Button';
import { FadeIn, SlideIn } from '../animations';
import { HOW_IT_WORKS_STEPS, SIGNUP_URL } from '../../lib/constants';

export const HowItWorks: React.FC = () => {
  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className="h-10 w-10 sm:h-12 sm:w-12" /> : null;
  };

  return (
    <Section id="how-it-works" background="gradient" paddingY="xl">
      <Container>
        <FadeIn>
          <div className="text-center mb-10 sm:mb-16 px-4 sm:px-0">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">How It Works</h2>
            <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
              Simple steps to start shipping with us
            </p>
          </div>
        </FadeIn>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12 px-4 sm:px-0">
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <SlideIn key={step.id} direction="bottom" delay={index * 0.15}>
              <div className="relative text-center">
                {/* Step Number */}
                <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg sm:text-xl z-10">
                  {step.number}
                </div>

                {/* Card */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 h-full border border-white/20">
                  <div className="text-white mb-3 sm:mb-4 flex justify-center">{getIcon(step.icon)}</div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">{step.title}</h3>
                  <p className="text-sm sm:text-base text-white/80">{step.description}</p>
                </div>

                {/* Connector Line (except last item) */}
                {index < HOW_IT_WORKS_STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-white/30" />
                )}
              </div>
            </SlideIn>
          ))}
        </div>

        {/* CTA Button */}
        <FadeIn delay={0.6}>
          <div className="text-center px-4 sm:px-0">
            <Button
              variant="secondary"
              size="xl"
              onClick={() => (window.location.href = SIGNUP_URL)}
              className="w-full sm:w-auto"
            >
              Start Shipping Now
            </Button>
          </div>
        </FadeIn>
      </Container>
    </Section>
  );
};
