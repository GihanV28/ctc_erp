'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Container, Section } from '../ui/Container';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { FadeIn } from '../animations';
import { generateTrackingUrl } from '../../lib/utils';

export const Track: React.FC = () => {
  const [trackingId, setTrackingId] = useState('');

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      window.location.href = generateTrackingUrl(trackingId);
    }
  };

  return (
    <Section id="track" background="white" paddingY="lg">
      <Container size="md">
        <FadeIn>
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Track Your Shipment
            </h2>
            <p className="text-lg text-gray-600">
              Enter your tracking number to get real-time updates
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <form onSubmit={handleTrack} className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Enter Shipment ID or Tracking Number"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  leftIcon={<Search className="h-5 w-5" />}
                  className="text-lg"
                />
              </div>
              <Button type="submit" variant="primary" size="lg" className="sm:w-auto">
                Track Now
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4 text-center">
              Please log in to your account to track your shipments
            </p>
          </form>
        </FadeIn>
      </Container>
    </Section>
  );
};
