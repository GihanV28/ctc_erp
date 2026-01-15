import React from 'react';
import { Container } from '../../components/ui/Container';

export const metadata = {
  title: 'Privacy Policy | Ceylon Cargo Transport',
  description: 'Privacy Policy for Ceylon Cargo Transport',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-800 py-32">
      <Container>
        <div className="max-w-4xl mx-auto bg-gray-900 rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-300 mb-4">PRIVACY POLICY</h1>
          <p className="text-sm text-gray-500 mb-8">Effective Date: January 2025</p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-400 mb-4">Introduction</h2>
            <p className="text-gray-500 leading-relaxed">
              Ceylon Cargo Transport ("we," "our," or "us") respects your privacy and is committed to protecting your
              personal information. This Privacy Policy explains how we collect, use, and safeguard your data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-400 mb-4">Information We Collect</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-500">
              <li><strong className="text-gray-400">Personal Information:</strong> Name, address, phone number, email address</li>
              <li><strong className="text-gray-400">Shipping Information:</strong> Sender and recipient details, cargo descriptions, delivery addresses</li>
              <li><strong className="text-gray-400">Payment Information:</strong> Billing details and transaction records</li>
              <li><strong className="text-gray-400">Technical Data:</strong> IP address, browser type, device information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-400 mb-4">How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-500">
              <li>Process and deliver your shipments</li>
              <li>Communicate about your cargo status</li>
              <li>Process payments and maintain records</li>
              <li>Improve our services and customer experience</li>
              <li>Comply with legal and regulatory requirements</li>
              <li>Send promotional materials (with your consent)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-400 mb-4">Information Sharing</h2>
            <p className="text-gray-500 leading-relaxed mb-4">
              We do not sell your personal information. We may share data with:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-500">
              <li>Shipping partners and customs authorities for delivery purposes</li>
              <li>Payment processors for transaction handling</li>
              <li>Legal authorities when required by law</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-400 mb-4">Data Security</h2>
            <p className="text-gray-500 leading-relaxed">
              We implement industry-standard security measures to protect your information from unauthorized access,
              alteration, or disclosure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-400 mb-4">Your Rights</h2>
            <p className="text-gray-500 leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-500">
              <li>Access your personal information</li>
              <li>Request corrections or deletions</li>
              <li>Opt-out of marketing communications</li>
              <li>Request data portability</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-400 mb-4">Contact Us</h2>
            <p className="text-gray-500 leading-relaxed mb-4">For privacy concerns, contact us at:</p>
            <div className="space-y-2 text-gray-500">
              <p><strong className="text-gray-400">Email:</strong> info.cct@ceylongrp.com</p>
              <p><strong className="text-gray-400">Phone:</strong> +855 95 386 475</p>
              <p><strong className="text-gray-400">Address:</strong> B05, Lek muoy, Sangkat 1, Preah Sihanouk, Cambodia</p>
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}
