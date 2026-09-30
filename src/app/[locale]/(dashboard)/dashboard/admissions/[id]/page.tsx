import { AdmissionDetailView } from "@/components/dashboard/admissions/admission-detail-view";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdmissionDetailPage({ params }: Props) {
  const { id } = await params;
  return <AdmissionDetailView applicationId={id} />;
}
