'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface SlideInProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'top' | 'bottom';
  delay?: number;
  duration?: number;
  className?: string;
}

export const SlideIn: React.FC<SlideInProps> = ({
  children,
  direction = 'left',
  delay = 0,
  duration = 0.5,
  className
}) => {
  const directionOffset = {
    left: { x: -50, y: 0 },
    right: { x: 50, y: 0 },
    top: { x: 0, y: -50 },
    bottom: { x: 0, y: 50 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directionOffset[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration, delay }}
      viewport={{ once: true, margin: '-100px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
