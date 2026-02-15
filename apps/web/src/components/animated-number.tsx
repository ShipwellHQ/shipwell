"use client";

import { useEffect, useRef } from "react";
import { useSpring, useTransform, motion } from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  className?: string;
}

export function AnimatedNumber({ value, className }: AnimatedNumberProps) {
  const spring = useSpring(0, { stiffness: 80, damping: 20 });
  const display = useTransform(spring, (v) => Math.round(v));
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  useEffect(() => {
    const unsubscribe = display.on("change", (v) => {
      if (ref.current) ref.current.textContent = String(v);
    });
    return unsubscribe;
  }, [display]);

  return <motion.span ref={ref} className={className}>{Math.round(value)}</motion.span>;
}
