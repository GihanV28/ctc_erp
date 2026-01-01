export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name
  link?: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  id: string;
  content: string;
  author: {
    name: string;
    position: string;
    company: string;
    avatar?: string;
  };
  rating: number;
}

export interface Stat {
  id: string;
  value: string | number;
  label: string;
  suffix?: string;
  prefix?: string;
}

export interface Container {
  id: string;
  name: string;
  type: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: 'ft' | 'm';
  };
  capacity: number; // m³
  maxLoad: number; // kg
  features?: string[];
  image?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  message: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface Step {
  id: string;
  number: number;
  title: string;
  description: string;
  icon: string;
}
