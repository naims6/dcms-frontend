import { CheckCircle2, AlertCircle, X } from "lucide-react";
import { ToastState } from "@/hooks/use-toast";

interface ToastProps {
  state: ToastState;
  onDismiss?: () => void;
}

/**
 * Renders a fixed bottom-right toast notification.
 * Pair with `useToast` hook.
 */
export function Toast({ state, onDismiss }: ToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl px-4 py-3 shadow-lg text-sm font-medium animate-in slide-in-from-bottom-4 duration-300 ${
        state.type === "success"
          ? "bg-emerald-600 text-white"
          : "bg-destructive text-destructive-foreground"
      }`}
    >
      {state.type === "success" ? (
        <CheckCircle2 className="h-4 w-4 shrink-0" />
      ) : (
        <AlertCircle className="h-4 w-4 shrink-0" />
      )}
      <span>{state.message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-1 opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Dismiss"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
