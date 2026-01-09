'use client';

import React, { useState, useRef } from 'react';
import PortalLayout from '@/components/layout/PortalLayout';
import {
  Paperclip,
  Send,
  HelpCircle,
  ChevronDown,
  X,
  FileText,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { useProfilePhoto } from '@/context/ProfilePhotoContext';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { inquiryService } from '@/services/inquiryService';

const faqs = [
  {
    question: 'How do I track my shipment?',
    answer: 'You can track your shipment by clicking on the "Tracking" tab in the navigation menu and entering your tracking number. You can find your tracking number in the shipment details on the "Shipments" page.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept various payment methods including bank transfers, credit cards (Visa, MasterCard, American Express), and PayPal. For large shipments, we also offer credit terms for verified business customers.'
  },
  {
    question: 'How long does shipping typically take?',
    answer: 'Shipping times vary depending on the origin and destination. Ocean freight typically takes 15-45 days, while air freight takes 3-7 days. You can view estimated delivery dates in your shipment details.'
  },
  {
    question: 'Can I modify my shipment after it has been created?',
    answer: 'You can request modifications to your shipment before it departs from the origin port. Please contact our support team immediately if you need to make changes. Some changes may incur additional fees.'
  },
  {
    question: 'What documents do I need for international shipping?',
    answer: 'Typically you need: Commercial Invoice, Packing List, Bill of Lading, Certificate of Origin, and any specific permits or licenses required for your goods. Our team will guide you through the documentation process.'
  },
  {
    question: 'How are shipping costs calculated?',
    answer: 'Shipping costs are calculated based on: cargo weight and volume, origin and destination ports, type of goods, shipping method (sea/air), insurance requirements, and any additional services. Request a quote for accurate pricing.'
  },
];

export default function SupportPage() {
  const { userName, userEmail } = useProfilePhoto();
  const [formData, setFormData] = useState({
    name: userName || '',
    email: userEmail || '',
    subject: '',
    category: '',
    message: '',
  });
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      // Check file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif'
      ];

      if (!allowedTypes.includes(file.type)) {
        alert('Only PDF, DOC, DOCX, Excel, CSV, and image files are allowed');
        return;
      }

      setAttachedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      await inquiryService.submitInquiry({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        category: formData.category,
        message: formData.message,
        file: attachedFile || undefined,
      });

      setSubmitSuccess(true);
      // Reset form
      setFormData({
        name: userName || '',
        email: userEmail || '',
        subject: '',
        category: '',
        message: '',
      });
      setAttachedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error: any) {
      setSubmitError(error.message || 'Failed to submit inquiry');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const getInitials = () => {
    if (!userName || userName === 'User') return 'U';
    const parts = userName.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return userName.substring(0, 2).toUpperCase();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <PortalLayout
      title="Inquiry Center"
      subtitle="Submit inquiries for export import orders and get help with your shipments"
      headerAction={
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">{userName}</span>
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold">
            {getInitials()}
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Send Message Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Send us a message</h3>

            {/* Success Message */}
            {submitSuccess && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-green-800">Inquiry Submitted Successfully!</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Thank you for contacting us. We'll get back to you within 24-48 hours.
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {submitError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <X className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-red-800">Error</h4>
                  <p className="text-sm text-red-700 mt-1">{submitError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="What do you need help with?"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value=""></option>
                  <option value="shipment">Shipment Issue</option>
                  <option value="billing">Billing Question</option>
                  <option value="technical">Technical Support</option>
                  <option value="general">General Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  rows={6}
                  placeholder="Please describe your issue or question in detail..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              {/* File Attachment */}
              {attachedFile && (
                <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{attachedFile.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(attachedFile.size)}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.jpeg,.png,.gif"
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
                  >
                    <Paperclip className="w-4 h-4" />
                    Attach file
                  </label>
                  {attachedFile && (
                    <span className="text-xs text-gray-500">(PDF, DOC, Excel, CSV, Images - Max 10MB)</span>
                  )}
                </div>

                <Button
                  variant="primary"
                  type="submit"
                  disabled={submitting}
                  className="gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <HelpCircle className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-bold text-gray-900">Frequently Asked Questions</h3>
            </div>

            <div className="space-y-2">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-900">{faq.question}</span>
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ml-2',
                        openFaqIndex === index && 'transform rotate-180'
                      )}
                    />
                  </button>
                  {openFaqIndex === index && (
                    <div className="px-4 pb-4 pt-2">
                      <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
