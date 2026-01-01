'use client';

import React from 'react';
import { Container, Section } from '../ui/Container';
import { CountUp } from '../animations/CountUp';
import { FadeIn } from '../animations';
import { STATS } from '../../lib/constants';

export const Stats: React.FC = () => {
  return (
    <Section id="stats" background="gray" paddingY="lg">
      <Container>
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            Trusted by Businesses Worldwide
          </h2>
        </FadeIn>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat, index) => (
            <FadeIn key={stat.id} delay={index * 0.1}>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-32 h-32 bg-violet-100 rounded-full mb-4">
                  <CountUp
                    end={typeof stat.value === 'number' ? stat.value : parseInt(stat.value)}
                    suffix={stat.suffix}
                    prefix={stat.prefix}
                    className="text-4xl lg:text-5xl font-bold text-violet-600"
                  />
                </div>
                <p className="text-lg text-gray-600 font-medium">{stat.label}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </Section>
  );
};
