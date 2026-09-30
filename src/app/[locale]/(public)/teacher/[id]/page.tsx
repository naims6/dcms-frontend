import { notFound } from "next/navigation";
import { teachers } from "@/components/pages/teacher/teacher-data";
import { TeacherProfile } from "@/components/pages/teacher/teacher-profile";
import { routing } from "@/i18n/routing";

interface TeacherDetailPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    teachers.map((teacher) => ({ locale, id: teacher.id }))
  );
}

export default async function TeacherDetailPage({
  params,
}: TeacherDetailPageProps) {
  const { id } = await params;
  const teacher = teachers.find((t) => t.id === id);

  if (!teacher) notFound();

  return <TeacherProfile teacher={teacher} />;
}
