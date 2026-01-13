'use client';

import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Container, Section } from '../ui/Container';
import { FeatureCard } from '../ui/Card';
import { FadeIn, ScaleIn } from '../animations';
import { FEATURES } from '../../lib/constants';

export const Features: React.FC = () => {
  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className="h-10 w-10 sm:h-12 sm:w-12" /> : null;
  };

  return (
    <Section id="features" background="white" paddingY="xl">
      <Container>
        <FadeIn>
          <div className="text-center mb-10 sm:mb-16 px-4 sm:px-0">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Why Choose Us?</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              We make international shipping simple, transparent, and reliable
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-0">
          {FEATURES.map((feature, index) => (
            <ScaleIn key={feature.id} delay={index * 0.1}>
              <FeatureCard
                icon={getIcon(feature.icon)}
                title={feature.title}
                description={feature.description}
              />
            </ScaleIn>
          ))}
        </div>
      </Container>
    </Section>
  );
};
