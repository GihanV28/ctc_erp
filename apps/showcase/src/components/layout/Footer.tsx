'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Linkedin, Twitter, Instagram, Mail, Phone, MapPin, Send } from 'lucide-react';
import { CONTACT_INFO, SOCIAL_LINKS, FOOTER_LINKS } from '../../lib/constants';
import { scrollToSection } from '../../lib/utils';

export const Footer: React.FC = () => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const sectionId = href.substring(1);
      scrollToSection(sectionId);
    }
  };

  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 sm:mb-12">
          {/* About Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 text-white mb-4">
              <Image
                src="/images/logo/logo.png"
                alt="Ceylon Cargo Transport"
                width={120}
                height={40}
                priority
                className="h-8 sm:h-10 w-auto"
              />
            </div>
            <p className="text-xs sm:text-sm leading-relaxed mb-4">
              Your trusted partner for shipping from Cambodia to Sri Lanka and worldwide. Fast,
              reliable, and secure logistics solutions with expert customs clearance.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={SOCIAL_LINKS.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Telegram"
              >
                <Send className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Quick Links</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              {FOOTER_LINKS.quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-xs sm:text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Services</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              {FOOTER_LINKS.services.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-xs sm:text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Contact Us</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li className="flex items-start space-x-2 text-xs sm:text-sm">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-violet-400 flex-shrink-0 mt-0.5" />
                <span className="break-words">{CONTACT_INFO.address}</span>
              </li>
              <li className="flex items-center space-x-2 text-xs sm:text-sm">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-violet-400 flex-shrink-0" />
                <span>{CONTACT_INFO.phone}</span>
              </li>
              <li className="flex items-center space-x-2 text-xs sm:text-sm">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-violet-400 flex-shrink-0" />
                <span className="break-all">{CONTACT_INFO.email}</span>
              </li>
              <li className="text-xs sm:text-sm">
                <span className="text-white font-medium">Hours:</span> {CONTACT_INFO.hours}
              </li>
              <li className="text-xs sm:text-sm">
                <span className="text-white font-medium">Support:</span> {CONTACT_INFO.support247}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col items-center md:items-start space-y-2">
              <p className="text-xs sm:text-sm text-gray-400 text-center md:text-left">
                &copy; {new Date().getFullYear()} Ceylon Cargo Transport. All rights reserved.
              </p>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>Powered by</span>
                <Image
                  src="/images/logo/tcb.png"
                  alt="Canvas Box"
                  width={260}
                  height={80}
                  className="h-14 sm:h-16 md:h-20 w-auto opacity-70 hover:opacity-100 transition-opacity"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const span = document.createElement('span');
                      span.textContent = 'Canvas Box';
                      span.className = 'font-semibold';
                      parent.appendChild(span);
                    }
                  }}
                />
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              {FOOTER_LINKS.legal.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
