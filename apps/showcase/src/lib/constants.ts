import type { Service, Feature, Testimonial, Stat, Container, FAQ, Step } from '../types';

export const SERVICES: Service[] = [
  {
    id: 'ocean-freight',
    title: 'Ocean Freight',
    description: 'Cost-effective sea cargo transportation for large shipments. Container shipping with full tracking capabilities.',
    icon: 'Ship',
    link: '#services'
  },
  {
    id: 'air-cargo',
    title: 'Air Cargo',
    description: 'Fast and reliable air freight services for time-sensitive deliveries worldwide.',
    icon: 'Plane',
    link: '#services'
  },
  {
    id: 'ground-transport',
    title: 'Ground Transport',
    description: 'Domestic and cross-border trucking services with real-time GPS tracking.',
    icon: 'Truck',
    link: '#services'
  },
  {
    id: 'warehousing',
    title: 'Warehousing',
    description: 'Secure storage facilities with inventory management and distribution services.',
    icon: 'Warehouse',
    link: '#services'
  },
  {
    id: 'customs-clearance',
    title: 'Customs Clearance',
    description: 'Expert customs brokerage to ensure smooth clearance of your international shipments.',
    icon: 'FileCheck',
    link: '#services'
  },
  {
    id: 'supply-chain',
    title: 'Supply Chain Management',
    description: 'End-to-end supply chain solutions to optimize your logistics operations.',
    icon: 'Network',
    link: '#services'
  }
];

export const FEATURES: Feature[] = [
  {
    id: 'real-time-tracking',
    title: 'Real-Time Tracking',
    description: 'Track your shipments live with detailed status updates and location information.',
    icon: 'MapPin'
  },
  {
    id: 'competitive-pricing',
    title: 'Competitive Pricing',
    description: 'Transparent pricing with no hidden fees. Get instant quotes online.',
    icon: 'DollarSign'
  },
  {
    id: 'global-network',
    title: 'Global Network',
    description: 'Access to 50+ countries with extensive partnerships worldwide.',
    icon: 'Globe'
  },
  {
    id: 'secure-handling',
    title: 'Secure Handling',
    description: 'Your cargo is protected with comprehensive insurance and security measures.',
    icon: 'Shield'
  },
  {
    id: 'expert-support',
    title: 'Expert Support',
    description: '24/7 customer support from our experienced logistics team.',
    icon: 'Headphones'
  },
  {
    id: 'fast-delivery',
    title: 'Fast Delivery',
    description: 'Optimized routes and partnerships ensure the fastest possible delivery times.',
    icon: 'Zap'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'testimonial-1',
    content: 'Ceylon Cargo Transport has been instrumental in streamlining our international logistics. Their real-time tracking and responsive customer service make them our go-to partner for all shipping needs.',
    author: {
      name: 'John Anderson',
      position: 'Logistics Manager',
      company: 'Acme Corporation'
    },
    rating: 5
  },
  {
    id: 'testimonial-2',
    content: 'Excellent service from start to finish. The team handled our complex shipment with professionalism and kept us informed throughout the journey. Highly recommended!',
    author: {
      name: 'Sarah Chen',
      position: 'Supply Chain Director',
      company: 'Global Traders Ltd'
    },
    rating: 5
  },
  {
    id: 'testimonial-3',
    content: 'Fast, reliable, and cost-effective. We\'ve been shipping with CCT for over 3 years and have never been disappointed. Their expertise in customs clearance is invaluable.',
    author: {
      name: 'Michael Wong',
      position: 'Operations Manager',
      company: 'Tech Import Co'
    },
    rating: 5
  },
  {
    id: 'testimonial-4',
    content: 'The online portal makes it so easy to track our shipments and manage documentation. Ceylon Cargo Transport has truly modernized our shipping experience.',
    author: {
      name: 'Emma Schmidt',
      position: 'Procurement Lead',
      company: 'Medical Supplies Co'
    },
    rating: 5
  }
];

export const STATS: Stat[] = [
  { id: 'clients', value: 1200, label: 'Active Clients', suffix: '+' },
  { id: 'shipments', value: 400, label: 'Daily Shipments', suffix: '+' },
  { id: 'countries', value: 70, label: 'Countries Covered' },
  { id: 'on-time', value: 98, label: 'On-Time Delivery', suffix: '%' }
];

export const CONTAINERS: Container[] = [
  {
    id: '20ft-standard',
    name: '20ft Standard Container',
    type: 'Standard',
    dimensions: {
      length: 5.9,
      width: 2.35,
      height: 2.39,
      unit: 'm'
    },
    capacity: 33.2,
    maxLoad: 28180,
    features: ['Dry cargo', 'General purpose', 'Most common size']
  },
  {
    id: '40ft-standard',
    name: '40ft Standard Container',
    type: 'Standard',
    dimensions: {
      length: 12.03,
      width: 2.35,
      height: 2.39,
      unit: 'm'
    },
    capacity: 67.5,
    maxLoad: 26680,
    features: ['Dry cargo', 'Large capacity', 'Cost-effective for bulk']
  },
  {
    id: '40ft-high-cube',
    name: '40ft High Cube',
    type: 'High Cube',
    dimensions: {
      length: 12.03,
      width: 2.35,
      height: 2.69,
      unit: 'm'
    },
    capacity: 76.3,
    maxLoad: 26500,
    features: ['Extra height', 'Large volume cargo', 'Popular choice']
  },
  {
    id: '20ft-refrigerated',
    name: '20ft Refrigerated',
    type: 'Refrigerated',
    dimensions: {
      length: 5.45,
      width: 2.29,
      height: 2.27,
      unit: 'm'
    },
    capacity: 28.3,
    maxLoad: 27400,
    features: ['Temperature controlled', '-25°C to +25°C', 'Perishable goods']
  },
  {
    id: '40ft-refrigerated',
    name: '40ft Refrigerated',
    type: 'Refrigerated',
    dimensions: {
      length: 11.58,
      width: 2.29,
      height: 2.50,
      unit: 'm'
    },
    capacity: 67.3,
    maxLoad: 26780,
    features: ['Temperature controlled', '-25°C to +25°C', 'Large reefer capacity']
  }
];

export const FAQS: FAQ[] = [
  {
    id: 'faq-1',
    question: 'How do I get a shipping quote?',
    answer: 'You can request a quote by contacting our sales team or by creating an account in our client portal where you can get instant quotes based on your shipment details.'
  },
  {
    id: 'faq-2',
    question: 'What documents do I need for international shipping?',
    answer: 'Typically you\'ll need a commercial invoice, packing list, and bill of lading. Additional documents may be required depending on the destination country and cargo type. Our team will guide you through the requirements.'
  },
  {
    id: 'faq-3',
    question: 'How can I track my shipment?',
    answer: 'Once your shipment is booked, you\'ll receive a tracking number. You can track your shipment in real-time through our client portal or by using the tracking tool on our website.'
  },
  {
    id: 'faq-4',
    question: 'What are your payment terms?',
    answer: 'We offer flexible payment terms including Net 30 for established clients. Payment methods include bank transfer, credit card, and PayPal.'
  },
  {
    id: 'faq-5',
    question: 'Do you provide insurance?',
    answer: 'Yes, we offer comprehensive cargo insurance to protect your shipment against loss or damage during transit.'
  },
  {
    id: 'faq-6',
    question: 'What container types do you offer?',
    answer: 'We offer various container types including 20ft and 40ft standard containers, high cubes, and refrigerated containers. See our Container Options section for details.'
  },
  {
    id: 'faq-7',
    question: 'How long does ocean freight take?',
    answer: 'Transit times vary by route. Typical ocean freight takes 15-45 days depending on origin and destination. We provide estimated delivery dates for all bookings.'
  },
  {
    id: 'faq-8',
    question: 'Can I modify my shipment after booking?',
    answer: 'Modifications may be possible depending on the shipment status. Contact our support team immediately if you need to make changes.'
  }
];

export const HOW_IT_WORKS_STEPS: Step[] = [
  {
    id: 'step-1',
    number: 1,
    title: 'Get a Quote',
    description: 'Request a quote online or contact our team. Receive competitive pricing instantly.',
    icon: 'Calculator'
  },
  {
    id: 'step-2',
    number: 2,
    title: 'Book Your Shipment',
    description: 'Confirm your booking and provide shipment details through our client portal.',
    icon: 'Package'
  },
  {
    id: 'step-3',
    number: 3,
    title: 'We Handle Logistics',
    description: 'Our team manages pickup, documentation, customs, and transportation.',
    icon: 'Truck'
  },
  {
    id: 'step-4',
    number: 4,
    title: 'Track & Receive',
    description: 'Monitor your shipment in real-time and receive it at your destination.',
    icon: 'CheckCircle'
  }
];

export const CONTACT_INFO = {
  address: 'No. 123, Marine Drive, Colombo 03, Sri Lanka',
  phone: '+94 11 234 5678',
  email: 'info@ceyloncargo.lk',
  supportEmail: 'support@ceyloncargo.lk',
  supportPhone: '+94 77 234 5679',
  salesEmail: 'sales@ceyloncargo.lk',
  salesPhone: '+94 77 234 5678',
  hours: 'Monday - Friday: 9:00 AM - 6:00 PM',
  support247: '24/7'
};

export const SOCIAL_LINKS = {
  linkedin: 'https://linkedin.com/company/ceyloncargo',
  facebook: 'https://facebook.com/ceyloncargo',
  twitter: 'https://twitter.com/ceyloncargo',
  instagram: 'https://instagram.com/ceyloncargo'
};

// Client portal URLs
export const CLIENT_PORTAL_URL = process.env.NEXT_PUBLIC_CLIENT_PORTAL_URL || 'https://client.cct.ceylongrp.com';
export const SIGNUP_URL = `${CLIENT_PORTAL_URL}/signup`;
export const LOGIN_URL = `${CLIENT_PORTAL_URL}/login`;
export const TRACK_URL = `${CLIENT_PORTAL_URL}/track`;

export const NAV_LINKS = [
  { id: 'about', label: 'About', href: '#about' },
  { id: 'services', label: 'Services', href: '#services' },
  { id: 'how-it-works', label: 'How It Works', href: '#how-it-works' },
  { id: 'contact', label: 'Contact', href: '#contact' }
];

export const FOOTER_LINKS = {
  quickLinks: [
    { label: 'Home', href: '#hero' },
    { label: 'About Us', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Contact', href: '#contact' }
  ],
  services: [
    { label: 'Ocean Freight', href: '#services' },
    { label: 'Air Cargo', href: '#services' },
    { label: 'Ground Transport', href: '#services' },
    { label: 'Warehousing', href: '#services' },
    { label: 'Customs Clearance', href: '#services' }
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' }
  ]
};
