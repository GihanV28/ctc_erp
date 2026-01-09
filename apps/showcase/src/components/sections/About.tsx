'use client';

import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Container, Section } from '../ui/Container';
import { Button } from '../ui/Button';
import { FadeIn, SlideIn } from '../animations';

export const About: React.FC = () => {
  const keyPoints = [
    'ISO 9001:2015 Certified',
    '50+ Countries Served',
    '15+ Years of Excellence',
    '10,000+ Successful Shipments'
  ];

  return (
    <Section id="about" background="white" paddingY="xl">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <SlideIn direction="left">
            <div className="relative">
              <img
                src="/images/about/warehouse-interior.jpg"
                alt="Ceylon Cargo Transport Warehouse Interior"
                className="rounded-xl shadow-lg w-full h-[500px] object-cover"
                style={{ backgroundColor: '#e5e7eb' }}
                onError={(e) => {
                  e.currentTarget.style.backgroundColor = '#9333ea';
                  e.currentTarget.style.opacity = '0.1';
                }}
              />
              <div className="absolute -bottom-6 -right-6 bg-violet-600 text-white p-6 rounded-lg shadow-xl z-10">
                <p className="text-4xl font-bold">15+</p>
                <p className="text-sm">Years Experience</p>
              </div>
            </div>
          </SlideIn>

          {/* Content */}
          <SlideIn direction="right">
            <div className="space-y-6">
              <div>
                <h2 className="text-sm font-semibold text-violet-600 uppercase tracking-wide mb-2">
                  Who We Are
                </h2>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Ceylon Cargo Transport
                </h3>
              </div>

              <p className="text-lg text-gray-600 leading-relaxed">
                With over 15 years of experience in international logistics, Ceylon Cargo Transport
                has established itself as a leader in cargo transportation. We specialize in ocean
                freight, air cargo, and ground transportation, serving businesses across 50+
                countries.
              </p>

              <div className="space-y-3">
                {keyPoints.map((point, index) => (
                  <FadeIn key={point} delay={index * 0.1}>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">{point}</span>
                    </div>
                  </FadeIn>
                ))}
              </div>

              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </SlideIn>
        </div>
      </Container>
    </Section>
  );
};
