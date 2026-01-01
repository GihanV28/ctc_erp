'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export const FadeIn: React.FC<FadeInProps> = ({ children, delay = 0, duration = 0.5, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration, delay }}
      viewport={{ once: true, margin: '-100px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
