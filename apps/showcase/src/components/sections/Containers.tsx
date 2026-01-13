'use client';

import React from 'react';
import { Container, Section } from '../ui/Container';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { FadeIn, SlideIn } from '../animations';
import { CONTAINERS } from '../../lib/constants';

export const Containers: React.FC = () => {
  return (
    <Section id="containers" background="white" paddingY="xl">
      <Container>
        <FadeIn>
          <div className="text-center mb-10 sm:mb-16 px-4 sm:px-0">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Container Options</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the right container for your cargo
            </p>
          </div>
        </FadeIn>

        <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
          {CONTAINERS.map((container, index) => {
            return (
              <SlideIn key={container.id} direction={index % 2 === 0 ? 'left' : 'right'}>
                <Card variant="hover">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Container Image */}
                    <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-violet-50 to-purple-50">
                      <img
                        src={container.image || '/images/containers/default.jpg'}
                        alt={container.name}
                        className="w-full h-48 sm:h-56 lg:h-64 object-cover"
                        onError={(e) => {
                          // Fallback to icon if image not found
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="flex items-center justify-center h-48 sm:h-56 lg:h-64">
                                <svg class="h-20 w-20 sm:h-24 sm:w-24 lg:h-32 lg:w-32 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                              </div>
                            `;
                          }
                        }}
                      />
                    </div>

                  {/* Container Details */}
                  <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{container.name}</h3>
                        <Badge variant="primary">{container.type}</Badge>
                      </div>
                    </div>

                    {/* Specifications */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500 mb-1">Dimensions</p>
                        <p className="text-sm sm:text-base font-semibold text-gray-900">
                          {container.dimensions.length}m × {container.dimensions.width}m ×{' '}
                          {container.dimensions.height}m
                        </p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500 mb-1">Capacity</p>
                        <p className="text-sm sm:text-base font-semibold text-gray-900">{container.capacity} m³</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500 mb-1">Max Load</p>
                        <p className="text-sm sm:text-base font-semibold text-gray-900">
                          {container.maxLoad.toLocaleString()} kg
                        </p>
                      </div>
                    </div>

                    {/* Features */}
                    {container.features && (
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {container.features.map((feature) => (
                          <Badge key={feature} variant="info" size="sm">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* CTA Button */}
                    <div className="pt-2">
                      <Button variant="outline" size="md" className="w-full sm:w-auto">
                        Request Quote
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </SlideIn>
            );
          })}
        </div>
      </Container>
    </Section>
  );
};
