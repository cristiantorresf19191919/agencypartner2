'use client';

import { motion } from 'framer-motion';

interface ShapeMorphLoaderProps {
  size?: number;
}

// All shapes use 1 M + 11 C cubics + Z for smooth Framer Motion interpolation
const shapes = {
  circle:
    'M 50,5 C 61,5 72,9 80,15 C 88,21 94,30 97,40 C 100,50 100,61 97,71 C 94,81 88,89 80,95 C 72,101 61,105 50,105 C 39,105 28,101 20,95 C 12,89 6,81 3,71 C 0,61 0,50 3,40 C 6,30 12,21 20,15 C 28,9 39,5 50,5 C 50,5 50,5 50,5 Z',
  hexagon:
    'M 50,5 C 55,5 75,15 82,18 C 89,21 98,35 100,42 C 102,49 102,61 100,68 C 98,75 89,89 82,92 C 75,95 55,105 50,105 C 45,105 25,95 18,92 C 11,89 2,75 0,68 C -2,61 -2,49 0,42 C 2,35 11,21 18,18 C 25,15 45,5 50,5 C 50,5 50,5 50,5 Z',
  square:
    'M 50,5 C 60,5 80,5 88,8 C 96,11 100,15 100,25 C 100,35 100,45 100,55 C 100,65 100,75 100,85 C 100,95 96,99 88,102 C 80,105 60,105 50,105 C 40,105 20,105 12,102 C 4,99 0,95 0,85 C 0,75 0,65 0,55 C 0,45 0,35 0,25 C 0,15 4,11 12,8 C 20,5 40,5 50,5 Z',
  triangle:
    'M 50,5 C 53,5 58,10 64,18 C 70,26 77,38 82,47 C 87,56 92,66 95,74 C 98,82 100,90 100,95 C 100,100 98,105 92,105 C 86,105 75,105 65,105 C 55,105 45,105 35,105 C 25,105 14,105 8,105 C 2,105 0,100 0,95 C 0,90 2,82 5,74 C 8,66 13,56 18,47 C 23,38 30,26 36,18 C 42,10 47,5 50,5 Z',
};

const shapeKeys = Object.keys(shapes) as (keyof typeof shapes)[];
const dValues = shapeKeys.map((k) => shapes[k]);

const colors = ['#a06af9', '#f357a8', '#35e4b2', '#7b2ff2'];

const ShapeMorphLoader = ({ size = 100 }: ShapeMorphLoaderProps) => {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="-5 0 110 110"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="shape-glow">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Pulsing fill behind the stroke to sync with shimmer */}
        <motion.path
          d={shapes.circle}
          stroke="none"
          animate={{
            d: [...dValues, dValues[0]],
            fill: [
              'rgba(160,106,249,0.06)',
              'rgba(160,106,249,0.12)',
              'rgba(160,106,249,0.06)',
            ],
          }}
          transition={{
            d: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
            fill: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' },
          }}
        />
        <motion.path
          d={shapes.circle}
          fill="none"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#shape-glow)"
          animate={{
            d: [...dValues, dValues[0]],
            stroke: [...colors, colors[0]],
            opacity: [1, 0.7, 1],
          }}
          transition={{
            d: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
            stroke: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
            opacity: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' },
          }}
        />
      </svg>
    </motion.div>
  );
};

export default ShapeMorphLoader;
