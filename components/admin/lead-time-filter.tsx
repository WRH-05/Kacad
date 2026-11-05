'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  buildAdminQuery,
  hrefFor,
  leadTimeLabel,
  leadTimePresets,
  type LeadFilters,
  type LeadTimePreset
} from '@/lib/admin/lead-filters';

type LeadTimeFilterProps = {
  filters: LeadFilters;
};

export function LeadTimeFilter({ filters }: LeadTimeFilterProps) {
  const router = useRouter();
  const { time } = filters;
  const [draft, setDraft] = useState({
    from: time.from ?? '',
    to: time.to ?? ''
  });

  useEffect(() => {
    setDraft({ from: time.from ?? '', to: time.to ?? '' });
  }, [time.from, time.to]);

  const invalid = Boolean(draft.from && draft.to && draft.from > draft.to);

  function selectPreset(preset: LeadTimePreset) {
    router.push(
      hrefFor(
        buildAdminQuery({ ...filters, time: { preset, from: null, to: null } }, 1)
      )
    );
  }

  function applyRange(next: { from: string; to: string }) {
    if (next.from && next.to && next.from > next.to) return;

    const from = next.from || null;
    const to = next.to || null;

    router.push(
      hrefFor(
        buildAdminQuery(
          {
            ...filters,
            time: { preset: from || to ? 'custom' : 'all', from, to }
          },
          1
        )
      )
    );
  }

  function changeDate(field: 'from' | 'to', value: string) {
    const next = { ...draft, [field]: value };
    setDraft(next);
    applyRange(next);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            type="button"
            className="inline-flex items-center gap-2 border border-line/40 bg-surface px-2 py-1.5 font-mono text-xs uppercase tracking-wider text-ink transition hover:border-ink focus:border-accent focus:outline-none data-[state=open]:border-ink"
          >
            <span className="text-ink-muted">Time</span>
            <span aria-hidden="true" className="text-ink-muted">
              |
            </span>
            <span>{leadTimeLabel(time.preset)}</span>
            <span aria-hidden="true" className="text-ink-muted">
              ▾
            </span>
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="start"
            sideOffset={6}
            className="z-50 min-w-[12rem] border border-line/40 bg-surface py-1 shadow-soft"
          >
            <DropdownMenu.RadioGroup
              value={time.preset}
              onValueChange={(value) => selectPreset(value as LeadTimePreset)}
            >
              {leadTimePresets.map((preset) => (
                <DropdownMenu.RadioItem
                  key={preset}
                  value={preset}
                  className="flex cursor-pointer items-center justify-between gap-4 px-3 py-2 font-mono text-xs uppercase tracking-wider text-ink outline-none transition data-[highlighted]:bg-surface-sunken data-[state=checked]:text-accent"
                >
                  {leadTimeLabel(preset)}
                  <DropdownMenu.ItemIndicator>
                    <span aria-hidden="true">●</span>
                  </DropdownMenu.ItemIndicator>
                </DropdownMenu.RadioItem>
              ))}
            </DropdownMenu.RadioGroup>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      {time.preset === 'custom' ? (
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
            From
            <input
              type="date"
              value={draft.from}
              max={draft.to || undefined}
              onChange={(event) => changeDate('from', event.target.value)}
              className="border border-line/40 bg-surface px-2 py-1 font-mono text-xs tabular-nums text-ink focus:border-accent focus:outline-none"
            />
          </label>
          <label className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
            To
            <input
              type="date"
              value={draft.to}
              min={draft.from || undefined}
              onChange={(event) => changeDate('to', event.target.value)}
              className="border border-line/40 bg-surface px-2 py-1 font-mono text-xs tabular-nums text-ink focus:border-accent focus:outline-none"
            />
          </label>
        </div>
      ) : null}

      {invalid ? (
        <p
          role="alert"
          className="basis-full font-mono text-[10px] uppercase tracking-wider text-rubric"
        >
          From must be before To
        </p>
      ) : null}
    </div>
  );
}
