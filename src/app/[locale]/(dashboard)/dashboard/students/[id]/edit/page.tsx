import { EditStudentPage } from "@/components/dashboard/students/edit-student-page";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditStudentPageRoute({ params }: Props) {
  const { id } = await params;
  return <EditStudentPage id={id} />;
}