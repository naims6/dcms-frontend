import { UserDetailView } from "@/components/dashboard/users/user-detail-view";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: Props) {
  const { id } = await params;
  return <UserDetailView userId={id} />;
}
