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
    return Icon ? <Icon className="h-16 w-16" /> : null;
  };

  return (
    <Section id="services" background="gray" paddingY="xl">
      <Container>
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive logistics solutions tailored to your business needs
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      </Container>
    </Section>
  );
};
