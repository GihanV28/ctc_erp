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
          <div className="text-center mb-10 sm:mb-16 px-4 sm:px-0">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about our services
            </p>
          </div>
        </FadeIn>

        <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4 px-4 sm:px-0">
          {FAQS.map((faq, index) => (
            <FadeIn key={faq.id} delay={index * 0.05}>
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-4 sm:p-6 text-left"
                  aria-expanded={openIndex === index}
                >
                  <span className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 pr-4 sm:pr-8">{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 sm:h-5 sm:w-5 text-violet-600 flex-shrink-0 transition-transform duration-200',
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
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{faq.answer}</p>
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
