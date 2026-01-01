'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Package } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn, scrollToSection } from '../../lib/utils';
import { NAV_LINKS, SIGNUP_URL, LOGIN_URL } from '../../lib/constants';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const sectionId = href.substring(1);
      scrollToSection(sectionId);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 text-violet-600 hover:text-violet-700 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setIsMobileMenuOpen(false);
            }}
          >
            <Package className="h-8 w-8" />
            <span className="text-xl font-bold">Ceylon Cargo Transport</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-gray-700 hover:text-violet-600 font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href={LOGIN_URL}
              className="text-violet-600 hover:text-violet-700 font-medium transition-colors"
            >
              Log In
            </a>
            <Button variant="primary" size="md" onClick={() => (window.location.href = SIGNUP_URL)}>
              Join With Us
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700 hover:text-violet-600 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-6 space-y-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="block text-gray-700 hover:text-violet-600 font-medium py-2 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 border-t border-gray-200 space-y-3">
              <a
                href={LOGIN_URL}
                className="block text-center text-violet-600 hover:text-violet-700 font-medium py-2 transition-colors"
              >
                Log In
              </a>
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={() => {
                  window.location.href = SIGNUP_URL;
                  setIsMobileMenuOpen(false);
                }}
              >
                Join With Us
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
