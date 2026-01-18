import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  variant?: 'default' | 'subtle' | 'strong' | 'blue';
  hover?: boolean;
  className?: string;
}

const variants = {
  default: 'glass-card',
  subtle: 'glass-subtle',
  strong: 'glass-strong',
  blue: 'glass-blue',
};

export default function GlassCard({
  children,
  variant = 'default',
  hover = true,
  className = '',
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      className={`rounded-2xl ${variants[variant]} ${
        hover ? '' : '!transform-none hover:!transform-none'
      } ${className}`}
      whileHover={hover ? { y: -4 } : undefined}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
