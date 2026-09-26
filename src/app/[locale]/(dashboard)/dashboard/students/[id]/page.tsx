import { StudentDetailView } from "@/components/dashboard/students/student-detail-view";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function StudentDetailPage({ params }: Props) {
  const { id } = await params;
  return <StudentDetailView studentId={id} />;
}