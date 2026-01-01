'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Container, Section } from '../ui/Container';
import { FadeIn } from '../animations';
import { FAQS } from '../../lib/constants';
import { cn } from '../../lib/utils';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Section id="faq" background="white" paddingY="xl">
      <Container size="lg">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about our services
            </p>
          </div>
        </FadeIn>

        <div className="max-w-3xl mx-auto space-y-4">
          {FAQS.map((faq, index) => (
            <FadeIn key={faq.id} delay={index * 0.05}>
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                  aria-expanded={openIndex === index}
                >
                  <span className="text-lg font-semibold text-gray-900 pr-8">{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 text-violet-600 flex-shrink-0 transition-transform duration-200',
                      openIndex === index && 'transform rotate-180'
                    )}
                  />
                </button>

                <div
                  className={cn(
                    'overflow-hidden transition-all duration-300',
                    openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  )}
                >
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </Section>
  );
};
