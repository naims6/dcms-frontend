import { useState, useCallback } from "react";

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

  const toast = useCallback(
    (type: ToastType, message: string) => {
      setToastState({ type, message });
      setTimeout(() => setToastState(null), duration);
    },
    [duration],
  );

  const dismiss = useCallback(() => setToastState(null), []);

  return { toast, toastState, dismiss };
}
