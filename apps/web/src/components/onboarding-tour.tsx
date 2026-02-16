"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Tour step definitions                                              */
/* ------------------------------------------------------------------ */

interface TourStep {
  id: string;
  target: string | null; // data-tour value, null = centered modal
  title: string;
  description: string;
}

const STEPS: TourStep[] = [
  {
    id: "welcome",
    target: null,
    title: "Welcome to Shipwell!",
    description: "Let's walk you through the dashboard so you can get started quickly.",
  },
  {
    id: "repo-input",
    target: "repo-input",
    title: "Repository Input",
    description: "Paste a GitHub repository URL here to analyze.",
  },
  {
    id: "operations",
    target: "operations",
    title: "Operations",
    description:
      "Pick an analysis type: audit, migrate, refactor, docs, or upgrade.",
  },
  {
    id: "start-btn",
    target: "start-btn",
    title: "Start Analysis",
    description: "Once connected, hit Start to run a deep analysis.",
  },
  {
    id: "results",
    target: "results",
    title: "Results Area",
    description: "Findings, metrics, and raw output appear here in real-time.",
  },
];

const STORAGE_KEY = "shipwell_onboarding_done";

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

interface TourContextValue {
  active: boolean;
  currentStep: number;
  startTour: () => void;
  next: () => void;
  skip: () => void;
}

const TourContext = createContext<TourContextValue>({
  active: false,
  currentStep: 0,
  startTour: () => {},
  next: () => {},
  skip: () => {},
});

export const useTour = () => useContext(TourContext);

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export function TourProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Auto-start on mount for first-time users
  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setActive(true);
      setCurrentStep(0);
    }
  }, []);

  const finish = useCallback(() => {
    setActive(false);
    localStorage.setItem(STORAGE_KEY, "1");
  }, []);

  const next = useCallback(() => {
    if (currentStep >= STEPS.length - 1) {
      finish();
    } else {
      setCurrentStep((s) => s + 1);
    }
  }, [currentStep, finish]);

  const skip = useCallback(() => {
    finish();
  }, [finish]);

  const startTour = useCallback(() => {
    setCurrentStep(0);
    setActive(true);
  }, []);

  return (
    <TourContext.Provider value={{ active, currentStep, startTour, next, skip }}>
      {children}
      {active && <TourOverlay />}
    </TourContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  Overlay                                                            */
/* ------------------------------------------------------------------ */

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

function TourOverlay() {
  const { currentStep, next, skip } = useTour();
  const step = STEPS[currentStep];
  const [targetRect, setTargetRect] = useState<Rect | null>(null);
  const rafRef = useRef<number>(0);

  // Track the target element's position
  useEffect(() => {
    const update = () => {
      if (!step.target) {
        setTargetRect(null);
        return;
      }
      const el = document.querySelector(`[data-tour="${step.target}"]`);
      if (el) {
        const r = el.getBoundingClientRect();
        setTargetRect({
          top: r.top,
          left: r.left,
          width: r.width,
          height: r.height,
        });
      } else {
        setTargetRect(null);
      }
    };

    update();

    // Keep tracking in case of layout shifts
    const tick = () => {
      update();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafRef.current);
  }, [step.target]);

  const isLast = currentStep === STEPS.length - 1;
  const isCentered = !step.target || !targetRect;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[9999]"
        style={{ pointerEvents: "auto" }}
      >
        {/* Backdrop */}
        {isCentered ? (
          <div className="absolute inset-0 bg-black/60" />
        ) : (
          <div className="absolute inset-0">
            {/* Full-screen dark overlay with a spotlight cutout */}
            <div
              className="absolute rounded-xl"
              style={{
                top: targetRect!.top - 6,
                left: targetRect!.left - 6,
                width: targetRect!.width + 12,
                height: targetRect!.height + 12,
                boxShadow: "0 0 0 9999px rgba(0,0,0,0.6)",
                zIndex: 1,
                pointerEvents: "none",
              }}
            />
            {/* Glow ring around spotlight */}
            <div
              className="absolute rounded-xl border-2 border-accent/40"
              style={{
                top: targetRect!.top - 6,
                left: targetRect!.left - 6,
                width: targetRect!.width + 12,
                height: targetRect!.height + 12,
                zIndex: 2,
                pointerEvents: "none",
              }}
            />
          </div>
        )}

        {/* Tooltip / Card */}
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.96 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="absolute z-10"
          style={
            isCentered
              ? {
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }
              : tooltipPosition(targetRect!)
          }
        >
          <div className="bg-bg-card border border-border rounded-2xl shadow-2xl p-5 w-[320px]">
            {/* Step counter */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex gap-1">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i === currentStep
                        ? "w-5 bg-accent"
                        : i < currentStep
                          ? "w-2 bg-accent/40"
                          : "w-2 bg-border"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] text-text-dim ml-auto">
                {currentStep + 1} of {STEPS.length}
              </span>
            </div>

            {/* Content */}
            <h3 className="text-[15px] font-semibold text-text mb-1.5">
              {step.title}
            </h3>
            <p className="text-[13px] text-text-muted leading-relaxed mb-4">
              {step.description}
            </p>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <button
                onClick={skip}
                className="text-[12px] text-text-dim hover:text-text transition-colors font-medium"
              >
                Skip
              </button>
              <button
                onClick={next}
                className="px-4 py-2 bg-accent hover:bg-accent-hover text-white text-[13px] font-semibold rounded-lg transition-colors"
              >
                {isLast ? "Get Started" : "Next"}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Click shield — prevent clicking through backdrop */}
        <div
          className="absolute inset-0"
          style={{ zIndex: 0 }}
          onClick={(e) => e.stopPropagation()}
        />
      </motion.div>
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function tooltipPosition(rect: Rect): React.CSSProperties {
  const pad = 16;
  const tooltipW = 320;

  // Default: position to the right of the target
  let left = rect.left + rect.width + pad;
  let top = rect.top;

  // If it would overflow the right edge, place it to the left
  if (left + tooltipW > window.innerWidth - pad) {
    left = rect.left - tooltipW - pad;
  }

  // If it would overflow the left edge, center below
  if (left < pad) {
    left = Math.max(pad, rect.left + rect.width / 2 - tooltipW / 2);
    top = rect.top + rect.height + pad;
  }

  // Clamp vertical position
  if (top < pad) top = pad;
  if (top > window.innerHeight - 200) top = window.innerHeight - 200;

  return { top, left };
}
