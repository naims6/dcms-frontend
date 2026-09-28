import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getNoticeFeedByIdApi } from "@/services/notice.service";
import { NoticeViewPage } from "@/components/pages/notice/notice-view-page";

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const notice = await getNoticeFeedByIdApi(id);
    return {
      title: `${notice.subject} — Notice`,
      description: `Official notice published by DCMS. Category: ${notice.category}.`,
    };
  } catch {
    return { title: "Notice Not Found" };
  }
}

export default async function NoticePage({ params }: Props) {
  const { id } = await params;

  let notice;
  try {
    notice = await getNoticeFeedByIdApi(id);
  } catch {
    notFound();
  }

  return <NoticeViewPage notice={notice} />;
}
