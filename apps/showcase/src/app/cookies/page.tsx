import React from 'react';
import { Container } from '../../components/ui/Container';

export const metadata = {
  title: 'Cookie Policy | Ceylon Cargo Transport',
  description: 'Cookie Policy for Ceylon Cargo Transport',
};

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gray-800 py-32">
      <Container>
        <div className="max-w-4xl mx-auto bg-gray-900 rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-300 mb-4">COOKIE POLICY</h1>
          <p className="text-sm text-gray-500 mb-8">Effective Date: January 2025</p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-400 mb-4">What Are Cookies?</h2>
            <p className="text-gray-500 leading-relaxed">
              Cookies are small text files stored on your device when you visit our website. They help us improve your
              browsing experience and provide better services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-400 mb-4">Types of Cookies We Use</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-400 mb-2">Essential Cookies</h3>
                <p className="text-gray-500 mb-2">Required for website functionality:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-500">
                  <li>Session management</li>
                  <li>Security features</li>
                  <li>Login authentication</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-400 mb-2">Performance Cookies</h3>
                <p className="text-gray-500 mb-2">Help us understand how visitors use our site:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-500">
                  <li>Page views and navigation patterns</li>
                  <li>Error tracking</li>
                  <li>Load times</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-400 mb-2">Functional Cookies</h3>
                <p className="text-gray-500 mb-2">Remember your preferences:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-500">
                  <li>Language selection</li>
                  <li>Location settings</li>
                  <li>Previous searches</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-400 mb-2">Marketing Cookies (Optional)</h3>
                <p className="text-gray-500 mb-2">Used with your consent for:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-500">
                  <li>Personalized advertising</li>
                  <li>Social media integration</li>
                  <li>Analytics tracking</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-400 mb-4">Third-Party Cookies</h2>
            <p className="text-gray-500 leading-relaxed mb-4">
              We may use third-party services that set cookies:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-500">
              <li>Google Analytics (website analytics)</li>
              <li>Payment processors (transaction security)</li>
              <li>Social media platforms (sharing features)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-400 mb-4">Managing Cookies</h2>
            <p className="text-gray-500 leading-relaxed mb-4">You can control cookies through:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-500">
              <li><strong className="text-gray-400">Browser Settings:</strong> Most browsers allow you to refuse or delete cookies</li>
              <li><strong className="text-gray-400">Cookie Consent Banner:</strong> Manage preferences when you first visit our site</li>
              <li><strong className="text-gray-400">Opt-Out Tools:</strong> Third-party opt-out mechanisms</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-400 mb-4">How to Disable Cookies</h2>
            <div className="space-y-2 text-gray-500">
              <p><strong className="text-gray-400">Chrome:</strong> Settings &gt; Privacy and Security &gt; Cookies</p>
              <p><strong className="text-gray-400">Firefox:</strong> Options &gt; Privacy & Security &gt; Cookies</p>
              <p><strong className="text-gray-400">Safari:</strong> Preferences &gt; Privacy &gt; Cookies</p>
              <p><strong className="text-gray-400">Edge:</strong> Settings &gt; Privacy &gt; Cookies</p>
            </div>
            <p className="text-gray-500 mt-4 italic">
              Note: Disabling essential cookies may affect website functionality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-400 mb-4">Cookie Duration</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-500">
              <li><strong className="text-gray-400">Session Cookies:</strong> Deleted when you close your browser</li>
              <li><strong className="text-gray-400">Persistent Cookies:</strong> Remain until expiration date or manual deletion</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-400 mb-4">Updates to This Policy</h2>
            <p className="text-gray-500 leading-relaxed">
              We may update this Cookie Policy periodically. Check this page for the latest information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-400 mb-4">Contact Us</h2>
            <p className="text-gray-500 leading-relaxed mb-4">For questions about our cookie usage:</p>
            <div className="space-y-2 text-gray-500">
              <p><strong className="text-gray-400">Email:</strong> info.cct@ceylongrp.com</p>
              <p><strong className="text-gray-400">Phone:</strong> +855 95 386 475</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-400 mb-4">Your Consent</h2>
            <p className="text-gray-500 leading-relaxed">
              By using our website, you consent to our use of cookies as described in this policy. You can withdraw consent at
              any time by adjusting your cookie settings.
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-700 text-center text-sm text-gray-500">
            <p>Last Updated: January 2025</p>
            <p className="mt-2">Ceylon Cargo Transport - Cambodia</p>
          </div>
        </div>
      </Container>
    </div>
  );
}
