import Image from 'next/image';
import type { CourseMentorView } from '@/lib/courses/types';
import type { Dictionary } from '@/lib/dictionaries';

type CourseMentorProps = {
  mentor: CourseMentorView | null;
  detail: Dictionary['courses']['detail'];
};

function initials(name: string): string {
  return name
    .split(/[\s—–-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

export function CourseMentor({ mentor, detail }: CourseMentorProps) {
  if (!mentor) return null;

  return (
    <section className="border-t border-line/70 pt-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
          {detail.mentorTitle}
        </h2>
        <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-ink-muted">
          {detail.mentorLabel}
        </span>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-12 sm:items-start">
        <div className="sm:col-span-4 lg:col-span-3">
          {mentor.portraitPath ? (
            <Image
              src={mentor.portraitPath}
              alt={mentor.name}
              width={320}
              height={400}
              unoptimized
              className="aspect-[4/5] w-full border border-line/70 object-cover grayscale"
            />
          ) : (
            <div className="flex aspect-[4/5] w-full items-center justify-center border border-line/70 bg-surface-sunken">
              <span
                className="font-serif text-5xl font-light tracking-[0.08em] text-ink/25"
                aria-hidden="true"
              >
                {initials(mentor.name)}
              </span>
            </div>
          )}
        </div>

        <div className="sm:col-span-8 lg:col-span-9">
          <p className="font-serif text-2xl leading-snug text-ink sm:text-3xl">{mentor.name}</p>
          <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-accent">
            {mentor.role}
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-muted">{mentor.bio}</p>

          {!mentor.portraitPath ? (
            <p className="mt-5 max-w-xl border-l-2 border-highlight pl-3 font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-ink-muted">
              {detail.mentorPending}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
