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
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8 sm:mb-12 px-4 sm:px-0">
            Trusted by Businesses Worldwide
          </h2>
        </FadeIn>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-0">
          {STATS.map((stat, index) => (
            <FadeIn key={stat.id} delay={index * 0.1}>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-violet-100 rounded-full mb-3 sm:mb-4">
                  <CountUp
                    end={typeof stat.value === 'number' ? stat.value : parseInt(stat.value)}
                    suffix={stat.suffix}
                    prefix={stat.prefix}
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-violet-600"
                  />
                </div>
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 font-medium">{stat.label}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </Section>
  );
};
