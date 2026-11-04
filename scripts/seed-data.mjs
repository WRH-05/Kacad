import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { courseIds, courses as structuralCourses } from '../content/courses.ts';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const en = JSON.parse(readFileSync(path.join(root, 'messages/en.json'), 'utf8'));
export const fr = JSON.parse(readFileSync(path.join(root, 'messages/fr.json'), 'utf8'));

export const cohort = { en: '18 April 2026', fr: '18 Avril 2026' };

const schedules = {
  'robotics-kids': { en: 'Saturday 10:00–12:00', fr: 'Samedi 10h00–12h00' },
  'robotics-juniors': { en: 'Saturday 13:00–16:00', fr: 'Samedi 13h00–16h00' },
  'ai-fluency': { en: 'Sunday 10:00–13:00', fr: 'Dimanche 10h00–13h00' },
  'python-programming': { en: 'Saturday 15:00–18:00', fr: 'Samedi 15h00–18h00' },
  'technical-english': { en: 'Wednesday 17:00–19:00', fr: 'Mercredi 17h00–19h00' },
  'german-mobility': { en: 'Tuesday 17:30–19:30', fr: 'Mardi 17h30–19h30' },
  'audiovisual-training': { en: 'Saturday 14:00–17:00', fr: 'Samedi 14h00–17h00' },
  multimedia: { en: 'Sunday 14:00–17:00', fr: 'Dimanche 14h00–17h00' }
};

const seats = {
  'robotics-kids': 6,
  'robotics-juniors': 4,
  'ai-fluency': 8,
  'python-programming': 5,
  'technical-english': 9,
  'german-mobility': 7,
  'audiovisual-training': 5,
  multimedia: 6
};

const mentors = {
  'robotics-kids': {
    name: { en: 'Studio Lead — Robotics', fr: 'Responsable studio — Robotique' },
    role: { en: 'Robotics & Hardware Studio', fr: 'Studio robotique & matériel' }
  },
  'robotics-juniors': {
    name: { en: 'Studio Lead — Robotics', fr: 'Responsable studio — Robotique' },
    role: { en: 'Robotics & Hardware Studio', fr: 'Studio robotique & matériel' }
  },
  'ai-fluency': {
    name: { en: 'Studio Lead — AI & Data', fr: 'Responsable studio — IA & données' },
    role: { en: 'AI, Data & Automation', fr: 'IA, données & automatisation' }
  },
  'python-programming': {
    name: { en: 'Studio Lead — Software', fr: 'Responsable studio — Logiciel' },
    role: { en: 'Software Engineering', fr: 'Ingénierie logicielle' }
  },
  'technical-english': {
    name: { en: 'Language Mentor — Technical English', fr: 'Mentor de langue — Anglais technique' },
    role: { en: 'Technical English', fr: 'Anglais technique' }
  },
  'german-mobility': {
    name: { en: 'Language Mentor — German', fr: 'Mentor de langue — Allemand' },
    role: { en: 'German & Mobility', fr: 'Allemand & mobilité' }
  },
  'audiovisual-training': {
    name: { en: 'Studio Lead — Audiovisual', fr: 'Responsable studio — Audiovisuel' },
    role: { en: 'Film & Audiovisual Studio', fr: 'Studio cinéma & audiovisuel' }
  },
  multimedia: {
    name: { en: 'Studio Lead — Multimedia', fr: 'Responsable studio — Multimédia' },
    role: { en: 'Digital Arts & Multimedia', fr: 'Arts numériques & multimédia' }
  }
};

const deliverables = {
  'robotics-kids': {
    en: 'A working line-following robot, an engineering journal and a studio design defence.',
    fr: 'Un robot suiveur de ligne fonctionnel, un carnet d’ingénierie et une soutenance de conception en studio.'
  },
  'robotics-juniors': {
    en: 'A competition-ready robot, documented code and a design defence before the cohort.',
    fr: 'Un robot prêt pour la compétition, un code documenté et une soutenance de conception devant la cohorte.'
  },
  'ai-fluency': {
    en: 'A documented AI workflow, an evaluated prototype and a responsible-use brief.',
    fr: 'Un flux de travail IA documenté, un prototype évalué et une note sur les usages responsables.'
  },
  'python-programming': {
    en: 'A tested Python application, a clean repository and a code walkthrough.',
    fr: 'Une application Python testée, un dépôt propre et une présentation du code.'
  },
  'technical-english': {
    en: 'A five-minute pitch, a one-page technical brief and a recorded interview.',
    fr: 'Un pitch de cinq minutes, un brief technique d’une page et un entretien enregistré.'
  },
  'german-mobility': {
    en: 'A German CV, a motivation letter, a recorded presentation and a mock Goethe-style interview.',
    fr: 'Un CV allemand, une lettre de motivation, une présentation enregistrée et un entretien blanc de type Goethe.'
  },
  'audiovisual-training': {
    en: 'A short film, a production folder and a final screening.',
    fr: 'Un court-métrage, un dossier de production et une projection finale.'
  },
  multimedia: {
    en: 'A multimedia portfolio, a campaign concept and a final critique.',
    fr: 'Un portfolio multimédia, un concept de campagne et une critique finale.'
  }
};

function mentorProfile(id) {
  const mentor = mentors[id];
  const role = mentor.role;

  return {
    name: mentor.name,
    role,
    bio: {
      en: `Leads the ${role.en} at Kennedy Academy, guiding small cohorts through project-based work. The full mentor profile, credentials and portrait will be published here.`,
      fr: `Dirige le ${role.fr} à Kennedy Academy et accompagne de petites cohortes par le projet. Le profil complet, les références et le portrait du mentor seront publiés ici.`
    },
    portrait_path: null
  };
}

export function buildRecords() {
  return courseIds.map((id) => {
    const structural = structuralCourses.find((course) => course.id === id);
    const enItem = en.courses.items[id];
    const frItem = fr.courses.items[id];

    if (!structural || !enItem || !frItem) {
      throw new Error(`Missing seed data for course "${id}"`);
    }

    return {
      id,
      track: structural.track,
      age_bracket: structural.ageBracket,
      level: structural.level,
      duration_weeks: structural.durationWeeks,
      sessions_per_week: structural.sessionsPerWeek,
      featured: Boolean(structural.featured),
      title: { en: enItem.title, fr: frItem.title },
      description: { en: enItem.description, fr: frItem.description },
      lede: { en: enItem.lede, fr: frItem.lede },
      highlights: { en: enItem.highlights, fr: frItem.highlights },
      next_cohort: cohort,
      schedule: schedules[id],
      outcomes: { en: enItem.outcomes, fr: frItem.outcomes },
      tools: { en: enItem.tools, fr: frItem.tools },
      modules: { en: enItem.modules, fr: frItem.modules },
      capstone: {
        en: { ...enItem.capstone, deliverable: deliverables[id].en },
        fr: { ...frItem.capstone, deliverable: deliverables[id].fr }
      },
      mentor: mentorProfile(id),
      seats_left: seats[id],
      brochure_url: null
    };
  });
}

export { schedules, seats };
