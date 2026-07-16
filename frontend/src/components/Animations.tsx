'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface AnimateProps {
  children: ReactNode;
  className?: string;
  animation?: string;
  delay?: number;
  once?: boolean;
}

export function FadeIn({ children, className = '', animation = 'animate-fade-in', delay = 0, once = true }: AnimateProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && ref.current) observer.unobserve(ref.current);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      className={`${animation} ${isVisible ? 'opacity-100' : 'opacity-0'} ${className}`}
      style={{ animationDelay: `${delay}s`, animationFillMode: 'both' }}
    >
      {children}
    </div>
  );
}

export function FadeInUp({ children, className = '', delay = 0 }: AnimateProps) {
  return (
    <FadeIn animation="animate-fade-in-up" delay={delay} className={className}>
      {children}
    </FadeIn>
  );
}

export function SlideInLeft({ children, className = '', delay = 0 }: AnimateProps) {
  return (
    <FadeIn animation="animate-slide-in-left" delay={delay} className={className}>
      {children}
    </FadeIn>
  );
}

export function SlideInRight({ children, className = '', delay = 0 }: AnimateProps) {
  return (
    <FadeIn animation="animate-slide-in-right" delay={delay} className={className}>
      {children}
    </FadeIn>
  );
}

export function ScaleIn({ children, className = '', delay = 0 }: AnimateProps) {
  return (
    <FadeIn animation="animate-scale-in" delay={delay} className={className}>
      {children}
    </FadeIn>
  );
}

export function BounceIn({ children, className = '', delay = 0 }: AnimateProps) {
  return (
    <FadeIn animation="animate-bounce-in" delay={delay} className={className}>
      {children}
    </FadeIn>
  );
}

export function Float({ children, className = '' }: AnimateProps) {
  return (
    <div className={`animate-float ${className}`}>
      {children}
    </div>
  );
}

export function PulseGlow({ children, className = '' }: AnimateProps) {
  return (
    <div className={`animate-pulse-glow ${className}`}>
      {children}
    </div>
  );
}

export function CardHover({ children, className = '' }: AnimateProps) {
  return (
    <div className={`card-hover ${className}`}>
      {children}
    </div>
  );
}

export function GradientBorder({ children, className = '' }: AnimateProps) {
  return (
    <div className={`gradient-border ${className}`}>
      {children}
    </div>
  );
}

export function Counter({ target, duration = 2000, suffix = '' }: { target: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [started, target, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}
