export type TrainingAgeGroup = '7-11' | '12-17';

export type TrainingTrack = {
  name: string;
  description: string;
  ageGroups: TrainingAgeGroup[];
};

export const trainingTracks: TrainingTrack[] = [
  {
    name: 'Robotics',
    description: 'Hands-on robotics projects that move from build to code to competition-ready demos.',
    ageGroups: ['7-11', '12-17']
  },
  {
    name: 'AI',
    description: 'Age-appropriate artificial intelligence foundations, prompts, and creative applications.',
    ageGroups: ['7-11', '12-17']
  },
  {
    name: 'Sorobane',
    description: 'Mental math and structured reasoning through abacus-style practice and speed challenges.',
    ageGroups: ['7-11']
  },
  {
    name: 'Writing',
    description: 'Clear writing, idea development, and confidence-building communication workshops.',
    ageGroups: ['7-11', '12-17']
  },
  {
    name: 'Languages',
    description: 'Language learning with practical speaking, reading, and conversation practice.',
    ageGroups: ['7-11', '12-17']
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