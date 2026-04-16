import { Metadata } from "next";
import NoticeIntro from "@/components/pages/notice/notice-intro";
import { NoticeBoardSection } from "@/components/pages/landing/notice-board-section";

export const metadata: Metadata = {
  title: "Notice Board",
  description: "Stay up-to-date with the latest notices, events, and circulars from Dhanbari Collegiate Model School.",
};

export default function NoticePage() {
  return (
    <main className="flex-1 overflow-hidden bg-background">
      <NoticeIntro />
      <NoticeBoardSection hideTitle={true} />
    </main>
  );
}
