"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ShieldAlert, X } from "lucide-react";

interface Toast {
  id: string;
  severity: "critical" | "high";
  title: string;
}

export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timerRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const addToast = useCallback((severity: "critical" | "high", title: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, severity, title }]);

    const timer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      timerRefs.current.delete(id);
    }, 3000);

    timerRefs.current.set(id, timer);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timerRefs.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timerRefs.current.delete(id);
    }
  }, []);

  return { toasts, addToast, dismissToast };
}

const severityStyles = {
  critical: {
    bg: "bg-red-500/10 border-red-500/25",
    icon: ShieldAlert,
    iconColor: "text-red-400",
    badge: "bg-red-500/20 text-red-400",
  },
  high: {
    bg: "bg-orange-500/10 border-orange-500/25",
    icon: AlertTriangle,
    iconColor: "text-orange-400",
    badge: "bg-orange-500/20 text-orange-400",
  },
};

export function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => {
          const style = severityStyles[toast.severity];
          const Icon = style.icon;

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm shadow-lg shadow-black/30 ${style.bg}`}
            >
              <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${style.iconColor}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${style.badge}`}>
                    {toast.severity}
                  </span>
                </div>
                <p className="text-[12px] text-text leading-tight truncate">{toast.title}</p>
              </div>
              <button
                onClick={() => onDismiss(toast.id)}
                className="text-text-dim hover:text-text transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
