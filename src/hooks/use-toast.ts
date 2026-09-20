import { useState, useCallback, useRef, useEffect } from "react";

export type ToastType = "success" | "error";

export interface ToastState {
  type: ToastType;
  message: string;
}

/**
 * Lightweight self-dismissing toast hook. No external library required.
 *
 * @example
 * const { toast, toastState } = useToast();
 * toast("success", "Saved!");          // auto-dismisses after `duration` ms
 * toast("error", "Something failed.");
 *
 * // In JSX:
 * {toastState && <Toast state={toastState} />}
 */
export function useToast(duration = 3500) {
  const [toastState, setToastState] = useState<ToastState | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setToastState(null);
  }, []);

  const toast = useCallback(
    (type: ToastType, message: string) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      setToastState({ type, message });
      timerRef.current = setTimeout(() => setToastState(null), duration);
    },
    [duration],
  );

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { toast, toastState, dismiss };
}