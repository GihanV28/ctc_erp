'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Container, Section } from '../ui/Container';
import { TestimonialCard } from '../ui/Card';
import { FadeIn } from '../animations';
import { TESTIMONIALS } from '../../lib/constants';

export const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  // Determine which testimonials to show based on screen size
  const getVisibleTestimonials = () => {
    const items = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % TESTIMONIALS.length;
      items.push(TESTIMONIALS[index]);
    }
    return items;
  };

  return (
    <Section id="testimonials" background="gray" paddingY="xl">
      <Container>
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don&apos;t just take our word for it
            </p>
          </div>
        </FadeIn>

        {/* Carousel */}
        <div className="relative">
          {/* Testimonial Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {getVisibleTestimonials().map((testimonial, index) => (
              <div
                key={`${testimonial.id}-${currentIndex}-${index}`}
                className="opacity-0 animate-fadeIn"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: 'forwards'
                }}
              >
                <TestimonialCard
                  content={testimonial.content}
                  author={testimonial.author}
                  rating={testimonial.rating}
                />
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex justify-center items-center gap-4 mb-6">
            <button
              onClick={goToPrevious}
              className="p-3 rounded-full bg-white shadow-lg hover:bg-violet-50 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-6 w-6 text-violet-600" />
            </button>
            <button
              onClick={goToNext}
              className="p-3 rounded-full bg-white shadow-lg hover:bg-violet-50 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6 text-violet-600" />
            </button>
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-2">
            {TESTIMONIALS.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-3 w-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-violet-600 w-8' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </Container>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </Section>
  );
};
