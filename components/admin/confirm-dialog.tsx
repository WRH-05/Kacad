'use client';

import * as Dialog from '@radix-ui/react-dialog';
import type { ReactNode } from 'react';

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
  pending?: boolean;
  error?: string | null;
  destructive?: boolean;
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  children,
  confirmLabel,
  onConfirm,
  pending = false,
  error = null,
  destructive = false
}: ConfirmDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-ink/45 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[61] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 border border-line/80 bg-surface p-6 shadow-soft focus:outline-none sm:p-8">
          <Dialog.Title className="font-serif text-2xl leading-tight text-ink">
            {title}
          </Dialog.Title>
          <Dialog.Description className="mt-3 text-sm leading-relaxed text-ink-muted">
            {children}
          </Dialog.Description>

          {error ? (
            <p
              role="alert"
              className="mt-4 border border-rubric/40 bg-rubric/5 px-3 py-2 text-xs leading-relaxed text-rubric"
            >
              {error}
            </p>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Dialog.Close asChild>
              <button
                type="button"
                disabled={pending}
                className="border border-line/80 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink transition hover:border-ink disabled:opacity-60"
              >
                Cancel
              </button>
            </Dialog.Close>
            <button
              type="button"
              onClick={onConfirm}
              disabled={pending}
              className={
                destructive
                  ? 'bg-rubric px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white transition hover:bg-rubric/90 disabled:cursor-not-allowed disabled:opacity-60'
                  : 'bg-ink px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-surface transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-60'
              }
            >
              {pending ? 'Deleting…' : confirmLabel}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
