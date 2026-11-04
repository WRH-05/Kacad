export type TestimonialId = 'marcus' | 'amine' | 'lyna' | 'yasmine';

export type Testimonial = {
  id: TestimonialId;
};

export const testimonials: Testimonial[] = [
  { id: 'marcus' },
  { id: 'amine' },
  { id: 'lyna' },
  { id: 'yasmine' }
];
