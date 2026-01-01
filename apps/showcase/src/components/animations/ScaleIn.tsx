'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface ScaleInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export const ScaleIn: React.FC<ScaleInProps> = ({ children, delay = 0, duration = 0.5, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration, delay }}
      viewport={{ once: true, margin: '-100px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
