'use client';

import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Container, Section } from '../ui/Container';
import { ServiceCard } from '../ui/Card';
import { FadeIn, ScaleIn } from '../animations';
import { SERVICES } from '../../lib/constants';

export const Services: React.FC = () => {
  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16" /> : null;
  };

  return (
    <Section id="services" background="gray" paddingY="xl">
      <Container>
        <FadeIn>
          <div className="text-center mb-10 sm:mb-16 px-4 sm:px-0">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Our Services</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive logistics solutions for personal and business cargo needs
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-0">
          {SERVICES.map((service, index) => (
            <ScaleIn key={service.id} delay={index * 0.1}>
              <ServiceCard
                icon={getIcon(service.icon)}
                title={service.title}
                description={service.description}
                link={service.link}
              />
            </ScaleIn>
          ))}
        </div>
        <FadeIn>
          <div className="text-center mt-10 sm:mt-16 px-4 sm:px-0">
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Specializing in Sri Lanka shipping with worldwide reach to 50+ countries.
            </p>
          </div>
        </FadeIn>
      </Container>
    </Section>
  );
};
