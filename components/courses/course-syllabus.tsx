import { TrackEmblem } from '@/components/brand/track-emblem';
import type { CourseId, CourseTrack } from '@/content/courses';
import type { Dictionary } from '@/lib/dictionaries';

type CourseSyllabusProps = {
  track: CourseTrack;
  item: Dictionary['courses']['items'][CourseId];
  courses: Dictionary['courses'];
};

export function CourseSyllabus({ track, item, courses }: CourseSyllabusProps) {
  const detail = courses.detail;

  return (
    <div>
      <section className="border-t border-line/70 pt-8">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
          {detail.outcomesTitle}
        </h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {item.outcomes.map((outcome) => (
            <li key={outcome} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
              <span className="mt-2 h-px w-4 shrink-0 bg-accent" aria-hidden="true" />
              {outcome}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 border-t border-line/70 pt-8">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
          {detail.toolsTitle}
        </h2>
        <ul className="mt-5 flex flex-wrap gap-2">
          {item.tools.map((tool) => (
            <li
              key={tool}
              className="border border-line/70 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted"
            >
              [{tool}]
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 border-t border-line/70 pt-8">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
          {detail.syllabusTitle}
        </h2>
        <ol className="mt-6 border-l border-line/70">
          {item.modules.map((module, index) => (
            <li key={module.title} className="relative pb-8 pl-8 last:pb-0">
              <span className="absolute -left-4 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface font-mono text-[9px] tracking-[0.06em] text-accent">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="font-serif text-xl leading-snug text-ink">{module.title}</h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted">
                {module.description}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10 border-t border-line/70 pt-8">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
          {detail.capstoneTitle}
        </h2>
        <div className="mt-5 flex flex-col gap-6 border border-line/70 bg-surface-sunken/60 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-serif text-2xl leading-snug text-ink">{item.capstone.title}</h3>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted">
              {item.capstone.description}
            </p>
          </div>
          <div className="flex shrink-0 items-center justify-center rounded-full border border-rubric/40 p-1.5">
            <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full border border-rubric/60 px-2 text-center text-rubric">
              <TrackEmblem track={track} className="h-3.5 w-3.5" />
              <span className="mt-1.5 font-mono text-[7px] uppercase leading-tight tracking-[0.12em]">
                {detail.certificateSeal}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
