'use client';

import React, { useState } from 'react';
import PortalLayout from '@/components/layout/PortalLayout';
import {
  MessageCircle,
  Mail,
  Phone,
  Paperclip,
  Send,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';
import { mockUser } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';

const supportTickets = [
  {
    id: 'TKT-2024-001',
    title: 'Question about customs clearance',
    created: 'Nov 01, 2024',
    lastUpdate: '2 hours ago',
    status: 'in_progress' as const,
  },
  {
    id: 'TKT-2024-002',
    title: 'Delayed shipment notification',
    created: 'Oct 28, 2024',
    lastUpdate: '3 days ago',
    status: 'resolved' as const,
  },
  {
    id: 'TKT-2024-003',
    title: 'Invoice discrepancy',
    created: 'Nov 02, 2024',
    lastUpdate: '1 hour ago',
    status: 'open' as const,
  },
];

const ticketStatusConfig = {
  in_progress: {
    label: 'In Progress',
    color: 'bg-blue-100 text-blue-700',
  },
  resolved: {
    label: 'Resolved',
    color: 'bg-green-100 text-green-700',
  },
  open: {
    label: 'Open',
    color: 'bg-orange-100 text-orange-700',
  },
};

const faqs = [
  'How do I track my shipment?',
  'What payment methods do you accept?',
  'How long does shipping typically take?',
  'Can I modify my shipment after it has been created?',
  'What documents do I need for international shipping?',
  'How are shipping costs calculated?',
];

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: mockUser.name,
    email: mockUser.email,
    subject: '',
    category: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Support form submitted:', formData);
  };

  return (
    <PortalLayout
      title="Inquiry Center"
      subtitle="Submit inquiries for export import orders and get help with your shipments"
      headerAction={
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">{mockUser.name}</span>
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold">
            {mockUser.avatar}
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Support Options Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Live Chat */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Live Chat</h3>
                <p className="text-sm text-gray-600 mb-2">Chat with our inquiry team</p>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-xs text-green-600 font-medium">Available now</span>
                </div>
              </div>
            </div>
          </div>

          {/* Email Support */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Email Support</h3>
                <p className="text-sm text-gray-600 mb-2">support@ceyloncargo.com</p>
                <span className="text-xs text-gray-500">Response within 24hrs</span>
              </div>
            </div>
          </div>

          {/* Phone Support */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <Phone className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Phone Support</h3>
                <p className="text-sm text-gray-600 mb-2">+94 11 234 5678</p>
                <span className="text-xs text-gray-500">Mon-Fri, 9AM-6PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Send Message Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Send us a message</h3>

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

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  <Paperclip className="w-4 h-4" />
                  Attach file
                </button>

                <Button variant="primary" type="submit" className="gap-2">
                  <Send className="w-4 h-4" />
                  Send Message
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

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <button
                  key={index}
                  className="w-full flex items-center justify-between p-3 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span>{faq}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Support Tickets */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6">My Inquiry Tickets</h3>

          <div className="space-y-4">
            {supportTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{ticket.title}</h4>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{ticket.id}</span>
                    <span>Created: {ticket.created}</span>
                    <span>Last update: {ticket.lastUpdate}</span>
                  </div>
                </div>

                <span
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium',
                    ticketStatusConfig[ticket.status].color
                  )}
                >
                  {ticketStatusConfig[ticket.status].label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
