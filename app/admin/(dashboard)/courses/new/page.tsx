import type { Metadata } from 'next';
import { CourseForm } from '@/components/admin/course-form';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'New programme'
};

export default function NewCoursePage() {
  return <CourseForm mode="create" />;
}
