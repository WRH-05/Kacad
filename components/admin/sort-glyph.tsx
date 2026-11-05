import type { SortDir } from '@/lib/admin/lead-filters';

type SortGlyphProps = {
  active: boolean;
  dir: SortDir;
};

/** Subtle sort-state indicator: ↑/↓ when active, a faint ↕ otherwise. */
export function SortGlyph({ active, dir }: SortGlyphProps) {
  return (
    <span
      aria-hidden="true"
      className={active ? 'text-[10px] text-ink' : 'text-[10px] opacity-40'}
    >
      {active ? (dir === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  );
}
