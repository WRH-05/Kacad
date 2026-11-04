'use client';

import * as Dialog from '@radix-ui/react-dialog';
import type { ReactNode } from 'react';

type SideDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
};

export function SideDrawer({
  open,
  onOpenChange,
  title,
  description,
  children
}: SideDrawerProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/50 data-[state=open]:animate-[overlay-in_180ms_ease-out]" />
        <Dialog.Content className="fixed right-0 top-0 z-50 h-full w-full max-w-2xl overflow-y-auto border-l-2 border-ink bg-surface p-6 data-[state=open]:animate-[drawer-in_220ms_ease-out] sm:p-8">
          <div className="flex items-start justify-between gap-4 border-b border-line/70 pb-5">
            <div>
              <Dialog.Title className="font-serif text-2xl leading-tight text-ink">
                {title}
              </Dialog.Title>
              {description ? (
                <Dialog.Description className="mt-1 font-mono text-[8px] uppercase tracking-[0.16em] text-ink-muted">
                  {description}
                </Dialog.Description>
              ) : (
                <Dialog.Description className="sr-only">Details panel</Dialog.Description>
              )}
            </div>
            <Dialog.Close className="border border-line/80 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-ink transition hover:border-ink">
              Close ×
            </Dialog.Close>
          </div>

          <div className="mt-6">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
