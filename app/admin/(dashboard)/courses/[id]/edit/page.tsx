import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CourseForm } from '@/components/admin/course-form';
import { isCourseSlug } from '@/content/courses';
import { mapAdminCourse } from '@/lib/courses/admin';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Edit programme'
};

export default async function EditCoursePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!isCourseSlug(id)) {
    notFound();
  }

  const supabase = await createClient();
  const { data } = await supabase.from('courses').select('*').eq('id', id).maybeSingle();
  const course = mapAdminCourse(data);

  if (!course) {
    notFound();
  }

  return <CourseForm mode="edit" course={course} />;
}
