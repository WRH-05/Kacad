export type CourseCategory = 'STEM' | 'Languages' | 'Creative';

export type CourseId =
  | 'robotics-kids'
  | 'robotics-juniors'
  | 'ai-fluency'
  | 'python-programming'
  | 'languages'
  | 'audiovisual-training'
  | 'multimedia';

export type Course = {
  id: CourseId;
  category: CourseCategory;
  ageRangeKey: 'kids' | 'juniors' | 'teens' | 'all';
  tags?: string[];
};

export const courses: Course[] = [
  {
    id: 'robotics-kids',
    category: 'STEM',
    ageRangeKey: 'kids',
    tags: ['Build', 'Code', 'Projects']
  },
  {
    id: 'robotics-juniors',
    category: 'STEM',
    ageRangeKey: 'juniors',
    tags: ['Competition', 'Engineering', 'Teamwork']
  },
  {
    id: 'ai-fluency',
    category: 'STEM',
    ageRangeKey: 'all',
    tags: ['Prompts', 'Ethics', 'Creativity']
  },
  {
    id: 'python-programming',
    category: 'STEM',
    ageRangeKey: 'teens',
    tags: ['Logic', 'Projects', 'Problem-solving']
  },
  {
    id: 'languages',
    category: 'Languages',
    ageRangeKey: 'all',
    tags: ['French', 'English', 'German', 'Spanish']
  },
  {
    id: 'audiovisual-training',
    category: 'Creative',
    ageRangeKey: 'teens',
    tags: ['Film', 'Sound', 'Storytelling']
  },
  {
    id: 'multimedia',
    category: 'Creative',
    ageRangeKey: 'all',
    tags: ['Design', 'Digital', 'Portfolio']
  }
];

export const whyUsHighlights = [
  'Proprietary curriculum designed and owned by the school, not by rotating tutors.',
  'Hands-on STEM bootcamps focused on real projects, including robotics and IoT systems.',
  'Curriculum delivered by technically strong instructors, aligned with the USTHB-engineer positioning.',
  'Compact 3-day rhythm that reduces fatigue and family logistics pressure.',
  'Strict cohort system that protects learning continuity and prevents late-stage disruption.',
  'Premium positioning with a practical, parent-friendly delivery model.'
];
