'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export type RowMenuItem = {
  label: string;
  onSelect: () => void;
  destructive?: boolean;
  disabled?: boolean;
};

function MoreVerticalIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <circle cx="12" cy="5" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="12" cy="19" r="1.6" />
    </svg>
  );
}

export function RowMenu({
  label,
  items,
  onOpenChange
}: {
  label: string;
  items: RowMenuItem[];
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <DropdownMenu.Root onOpenChange={onOpenChange}>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={label}
          className="inline-flex h-8 w-8 items-center justify-center border border-line/80 text-ink-muted transition hover:border-ink hover:text-ink data-[state=open]:border-ink data-[state=open]:text-ink"
        >
          <MoreVerticalIcon />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className="z-50 min-w-[11rem] border border-line/80 bg-surface py-1 shadow-soft"
        >
          {items.map((item) => (
            <DropdownMenu.Item
              key={item.label}
              disabled={item.disabled}
              onSelect={item.onSelect}
              className={
                item.destructive
                  ? 'cursor-pointer px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-rubric outline-none transition data-[highlighted]:bg-rubric/5 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40'
                  : 'cursor-pointer px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-ink outline-none transition data-[highlighted]:bg-surface-sunken data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40'
              }
            >
              {item.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
