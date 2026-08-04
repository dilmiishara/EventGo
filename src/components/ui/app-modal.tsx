"use client";

import {
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";

type ModalSize = "sm" | "md" | "lg";

type AppModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  icon?: ReactNode;
  children?: ReactNode;
  size?: ModalSize;
  closeLabel?: string;
};

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

const focusableElementsSelector = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function subscribeToClientState() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export function AppModal({
  isOpen,
  onClose,
  title,
  description,
  icon,
  children,
  size = "md",
  closeLabel = "Close dialog",
}: AppModalProps) {
  const isClient = useSyncExternalStore(
    subscribeToClientState,
    getClientSnapshot,
    getServerSnapshot,
  );

  const dialogRef = useRef<HTMLDivElement>(null);

  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previouslyFocusedElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const focusFrame = window.requestAnimationFrame(() => {
      dialogRef.current?.focus();
    });

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) {
        return;
      }

      const focusableElements =
        dialogRef.current.querySelectorAll<HTMLElement>(
          focusableElementsSelector,
        );

      if (focusableElements.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement =
        focusableElements[focusableElements.length - 1];

      if (
        event.shiftKey &&
        document.activeElement === firstElement
      ) {
        event.preventDefault();
        lastElement.focus();
        return;
      }

      if (
        !event.shiftKey &&
        document.activeElement === lastElement
      ) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", handleKeyDown);

      document.body.style.overflow = originalOverflow;
      previouslyFocusedElement?.focus();
    };
  }, [isOpen, onClose]);

  if (!isClient || !isOpen) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <button
        type="button"
        onClick={onClose}
        aria-label={closeLabel}
        className="fixed inset-0 bg-gray-950/65 backdrop-blur-md"
      />

      <div className="pointer-events-none relative flex min-h-full items-center justify-center p-4 sm:p-6">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={
            description ? descriptionId : undefined
          }
          tabIndex={-1}
          className={`pointer-events-auto relative my-8 max-h-[calc(100dvh-2rem)] w-full overflow-y-auto rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl outline-none sm:p-8 ${sizeClasses[size]}`}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
          >
            <CloseIcon />
          </button>

          {icon && <div className="pr-12">{icon}</div>}

          <div className={icon ? "mt-6" : "pr-12"}>
            <h2
              id={titleId}
              className="text-2xl font-bold tracking-tight text-gray-950"
            >
              {title}
            </h2>

            {description && (
              <p
                id={descriptionId}
                className="mt-3 text-sm leading-7 text-gray-600"
              >
                {description}
              </p>
            )}
          </div>

          {children && <div className="mt-7">{children}</div>}
        </div>
      </div>
    </div>,
    document.body,
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 6l12 12M18 6 6 18"
      />
    </svg>
  );
}