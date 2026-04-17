import { notFound } from "next/navigation";
import { teachers } from "@/components/pages/teacher/teacher-data";
import { TeacherProfile } from "@/components/pages/teacher/teacher-profile";

interface TeacherDetailPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export function generateStaticParams() {
  return teachers.map((teacher) => ({ id: teacher.id }));
}

export default async function TeacherDetailPage({
  params,
}: TeacherDetailPageProps) {
  const { id } = await params;
  const teacher = teachers.find((t) => t.id === id);

  if (!teacher) notFound();

  return <TeacherProfile teacher={teacher} />;
}
