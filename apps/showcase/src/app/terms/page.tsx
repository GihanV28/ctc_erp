import React from 'react';
import { Container } from '../../components/ui/Container';

export const metadata = {
  title: 'Terms of Service | Ceylon Cargo Transport',
  description: 'Terms of Service for Ceylon Cargo Transport',
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-32">
      <Container>
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">TERMS OF SERVICE</h1>
          <p className="text-sm text-gray-600 mb-8">Effective Date: January 2025</p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By using Ceylon Cargo Transport services, you agree to these Terms of Service. If you do not agree, please do
              not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Services Provided</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Ceylon Cargo Transport provides international cargo shipping services from Cambodia to Sri Lanka and
              worldwide destinations, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Personal cargo transportation</li>
              <li>Business cargo solutions</li>
              <li>Customs clearance assistance</li>
              <li>Door-to-door pickup and delivery</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Customer Responsibilities</h2>
            <p className="text-gray-700 leading-relaxed mb-4">You agree to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Provide accurate shipping information</li>
              <li>Ensure cargo complies with all applicable laws</li>
              <li>Properly package items for shipping</li>
              <li>Pay all fees and charges on time</li>
              <li>Declare prohibited or restricted items</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Prohibited Items</h2>
            <p className="text-gray-700 leading-relaxed mb-4">We do not ship:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Illegal substances or contraband</li>
              <li>Hazardous materials without proper documentation</li>
              <li>Perishable goods without prior arrangement</li>
              <li>Items prohibited by customs regulations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Pricing and Payment</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Prices are quoted based on weight, dimensions, and destination</li>
              <li>Payment is due before shipment unless credit terms are arranged</li>
              <li>Additional fees may apply for customs, duties, or special handling</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Liability and Insurance</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>We handle cargo with reasonable care</li>
              <li>Insurance is available and recommended for valuable items</li>
              <li>Liability is limited to the declared value of cargo</li>
              <li>Claims must be filed within 30 days of delivery</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Delivery Terms</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Delivery times are estimates, not guarantees</li>
              <li>Delays may occur due to customs, weather, or unforeseen circumstances</li>
              <li>We are not liable for delays beyond our control</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Customs and Duties</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Customers are responsible for all customs duties and taxes</li>
              <li>We provide customs clearance assistance but do not guarantee clearance</li>
              <li>Incorrect declarations may result in delays or penalties</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Cancellation and Refunds</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Cancellations must be made before shipment dispatch</li>
              <li>Refunds are subject to cancellation fees</li>
              <li>No refunds once cargo has been dispatched</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Dispute Resolution</h2>
            <p className="text-gray-700 leading-relaxed mb-4">Disputes will be resolved through:</p>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Good faith negotiation</li>
              <li>Mediation if necessary</li>
              <li>Jurisdiction of Cambodian courts</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed mb-4">Our liability is limited to the lesser of:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Actual damages proven</li>
              <li>Declared value of cargo</li>
              <li>Maximum of $100 per kilogram unless higher value is declared and insured</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these terms. Continued use of our services constitutes acceptance of updated
              terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>Email:</strong> info.cct@ceylongrp.com</p>
              <p><strong>Phone:</strong> +855 95 386 475</p>
              <p><strong>Address:</strong> B05, Lek muoy, Sangkat 1, Preah Sihanouk, Cambodia</p>
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}
