'use client';

import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Container, Section } from '../ui/Container';
import { Button } from '../ui/Button';
import { FadeIn, SlideIn } from '../animations';

export const About: React.FC = () => {
  const keyPoints = [
    'Your Trusted Logistics Partner',
    'Direct to Sri Lanka & Worldwide',
    'Expert Customs Clearance',
    'Complete Door-to-Door Service'
  ];

  return (
    <Section id="about" background="white" paddingY="xl">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Image */}
          <SlideIn direction="left">
            <div className="relative mx-4 sm:mx-0">
              <img
                src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&h=600&fit=crop"
                alt="Ceylon Cargo Transport Warehouse Interior"
                className="rounded-xl shadow-lg w-full h-[280px] sm:h-[350px] md:h-[400px] lg:h-[500px] object-cover"
              />
              <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-violet-600 text-white p-4 sm:p-6 rounded-lg shadow-xl z-10">
                <p className="text-2xl sm:text-4xl font-bold">100%</p>
                <p className="text-xs sm:text-sm">On-Time Delivery</p>
              </div>
            </div>
          </SlideIn>

          {/* Content */}
          <SlideIn direction="right">
            <div className="space-y-4 sm:space-y-6 mt-8 lg:mt-0 px-4 sm:px-0">
              <div>
                <h2 className="text-xs sm:text-sm font-semibold text-violet-600 uppercase tracking-wide mb-2">
                  Who We Are
                </h2>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Ceylon Cargo Transport
                </h3>
              </div>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Since 2024, Ceylon Cargo Transport has been connecting Cambodia to Sri Lanka
                and beyond. We provide complete cargo solutions for both personal and business
                needs, offering direct shipping services that bring reliability and peace of mind to
                every delivery. Whether it&apos;s a cherished package for family or critical business
                freight, we treat every shipment with the care it deserves.
              </p>

              <div className="space-y-2 sm:space-y-3">
                {keyPoints.map((point, index) => (
                  <FadeIn key={point} delay={index * 0.1}>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-700 font-medium">{point}</span>
                    </div>
                  </FadeIn>
                ))}
              </div>

              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Learn More
              </Button>
            </div>
          </SlideIn>
        </div>
      </Container>
    </Section>
  );
};
