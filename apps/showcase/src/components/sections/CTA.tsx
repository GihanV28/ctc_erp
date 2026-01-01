'use client';

import React from 'react';
import { Container, Section } from '../ui/Container';
import { Button } from '../ui/Button';
import { FadeIn } from '../animations';
import { SIGNUP_URL, LOGIN_URL } from '../../lib/constants';
import { scrollToSection } from '../../lib/utils';

export const CTA: React.FC = () => {
  return (
    <Section id="cta" background="gradient" paddingY="xl">
      <Container>
        <FadeIn>
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to Ship Globally?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Join thousands of businesses who trust Ceylon Cargo Transport for their logistics
              needs. Create your account today and get started.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                variant="secondary"
                size="xl"
                onClick={() => (window.location.href = SIGNUP_URL)}
              >
                Join With Us
              </Button>
              <Button
                variant="outline"
                size="xl"
                className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white/20"
                onClick={() => scrollToSection('contact')}
              >
                Contact Sales
              </Button>
            </div>

            <p className="text-white/80 text-sm">
              Already have an account?{' '}
              <a href={LOGIN_URL} className="underline hover:text-white font-medium">
                Log in here
              </a>
            </p>
          </div>
        </FadeIn>
      </Container>
    </Section>
  );
};
