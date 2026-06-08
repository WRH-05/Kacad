export type TestimonialId = 'nadia' | 'karim' | 'sofia' | 'yasmine';

export type Testimonial = {
  id: TestimonialId;
};

export const testimonials: Testimonial[] = [
  { id: 'nadia' },
  { id: 'karim' },
  { id: 'sofia' },
  { id: 'yasmine' }
];
