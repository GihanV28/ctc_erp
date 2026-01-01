'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Phone, Mail, Clock, Headphones } from 'lucide-react';
import { Container, Section } from '../ui/Container';
import { Input, Textarea, Select } from '../ui/Input';
import { Button } from '../ui/Button';
import { FadeIn, SlideIn } from '../animations';
import { CONTACT_INFO } from '../../lib/constants';
import { submitContactForm } from '../../lib/utils';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema)
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const result = await submitContactForm(data as { name: string; email: string; message: string; phone?: string; company?: string; service?: string });
      setSubmitStatus({ type: 'success', message: result.message });
      reset();
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Failed to send message. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const serviceOptions = [
    { value: 'ocean-freight', label: 'Ocean Freight' },
    { value: 'air-cargo', label: 'Air Cargo' },
    { value: 'ground-transport', label: 'Ground Transport' },
    { value: 'warehousing', label: 'Warehousing' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <Section id="contact" background="gray" paddingY="xl">
      <Container>
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions? We&apos;re here to help
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <SlideIn direction="left">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h3>

              {submitStatus && (
                <div
                  className={`p-4 rounded-lg mb-6 ${
                    submitStatus.type === 'success'
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                  {...register('name')}
                  label="Full Name"
                  placeholder="John Doe"
                  error={errors.name?.message}
                  required
                />

                <Input
                  {...register('email')}
                  type="email"
                  label="Email Address"
                  placeholder="john@example.com"
                  error={errors.email?.message}
                  required
                />

                <Input
                  {...register('phone')}
                  type="tel"
                  label="Phone Number"
                  placeholder="+94 77 123 4567"
                  error={errors.phone?.message}
                />

                <Input
                  {...register('company')}
                  label="Company Name"
                  placeholder="Acme Corporation"
                  error={errors.company?.message}
                />

                <Select
                  {...register('service')}
                  label="Service Interest"
                  options={serviceOptions}
                  error={errors.service?.message}
                />

                <Textarea
                  {...register('message')}
                  label="Message"
                  placeholder="Tell us how we can help you..."
                  rows={5}
                  error={errors.message?.message}
                  required
                />

                <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isSubmitting}>
                  Send Message
                </Button>
              </form>
            </div>
          </SlideIn>

          {/* Contact Information */}
          <SlideIn direction="right">
            <div className="space-y-8">
              {/* Head Office */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Head Office</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-violet-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Address</p>
                      <p className="text-gray-600">{CONTACT_INFO.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 text-violet-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Phone</p>
                      <p className="text-gray-600">{CONTACT_INFO.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-violet-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-gray-600">{CONTACT_INFO.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Clock className="h-6 w-6 text-violet-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Hours</p>
                      <p className="text-gray-600">{CONTACT_INFO.hours}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sales & Support */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Sales Inquiries</h3>
                <div className="space-y-2 mb-6">
                  <p className="text-gray-600">
                    <Mail className="inline h-4 w-4 mr-2" />
                    {CONTACT_INFO.salesEmail}
                  </p>
                  <p className="text-gray-600">
                    <Phone className="inline h-4 w-4 mr-2" />
                    {CONTACT_INFO.salesPhone}
                  </p>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4">Customer Support</h3>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <Mail className="inline h-4 w-4 mr-2" />
                    {CONTACT_INFO.supportEmail}
                  </p>
                  <p className="text-gray-600">
                    <Phone className="inline h-4 w-4 mr-2" />
                    {CONTACT_INFO.supportPhone}
                  </p>
                  <p className="text-gray-600">
                    <Headphones className="inline h-4 w-4 mr-2" />
                    Available {CONTACT_INFO.support247}
                  </p>
                </div>
              </div>
            </div>
          </SlideIn>
        </div>
      </Container>
    </Section>
  );
};
