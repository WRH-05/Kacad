export type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type Schedule = {
  days: readonly DayIndex[];
  /** 24-hour "HH:mm". */
  open: string;
  /** 24-hour "HH:mm". A close earlier than open is treated as overnight. */
  close: string;
};

export type OpenState = {
  isOpen: boolean;
  nextChange: {
    /** 0 = today, 1 = tomorrow, … */
    dayOffset: number;
    at: string;
    kind: 'opens' | 'closes';
  } | null;
};

const WEEKDAYS: Record<string, DayIndex> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6
};

const MINUTES_PER_DAY = 24 * 60;

function toMinutes(value: string): number {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
}

function toTime(minutes: number): string {
  const normalized = ((minutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const hours = Math.floor(normalized / 60);
  const mins = normalized % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

function localDayAndMinutes(now: Date, timeZone: string): { day: DayIndex; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(now);

  const weekday = parts.find((part) => part.type === 'weekday')?.value ?? 'Mon';
  const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? '0');
  const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? '0');

  return { day: WEEKDAYS[weekday] ?? 1, minutes: hour * 60 + minute };
}

function isOpenAt(day: DayIndex, minutes: number, schedules: readonly Schedule[]): boolean {
  return schedules.some((schedule) => {
    const open = toMinutes(schedule.open);
    const close = toMinutes(schedule.close);

    return schedule.days.some((scheduledDay) => {
      if (close > open) {
        return day === scheduledDay && minutes >= open && minutes < close;
      }

      // Overnight schedule: opens on `scheduledDay`, closes the following day.
      if (close === open) {
        return day === scheduledDay;
      }

      const nextDay = ((scheduledDay + 1) % 7) as DayIndex;
      return (
        (day === scheduledDay && minutes >= open) ||
        (day === nextDay && minutes < close)
      );
    });
  });
}

/**
 * Compute whether the space is open in the given time zone, plus the next
 * transition. Iterates forward minute-by-minute for at most 7 days, which is
 * cheap (≈10k checks) and handles overnight and multi-window schedules.
 */
export function getOpenState(
  now: Date,
  schedules: readonly Schedule[],
  timeZone = 'Africa/Algiers'
): OpenState {
  const { day, minutes } = localDayAndMinutes(now, timeZone);
  const isOpen = isOpenAt(day, minutes, schedules);

  for (let delta = 1; delta <= 7 * MINUTES_PER_DAY; delta += 1) {
    const total = minutes + delta;
    const dayOffset = Math.floor(total / MINUTES_PER_DAY);
    const nextMinutes = total % MINUTES_PER_DAY;
    const nextDay = ((day + dayOffset) % 7) as DayIndex;
    const nextOpen = isOpenAt(nextDay, nextMinutes, schedules);

    if (nextOpen !== isOpen) {
      return {
        isOpen,
        nextChange: {
          dayOffset,
          at: toTime(nextMinutes),
          kind: nextOpen ? 'opens' : 'closes'
        }
      };
    }
  }

  return { isOpen, nextChange: null };
}
