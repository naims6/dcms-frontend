"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Megaphone, GraduationCap, Briefcase, FileText, Download, ChevronLeft, ChevronRight, Search } from "lucide-react";

type TabId = "general" | "scholarship" | "jobs" | "tender";

interface Notice {
  id: string;
  date: string;
  title: string;
  category: TabId;
}

// Sample dummy data. In actual app, fetch from API.
const mockNotices: Notice[] = [
  { id: "1", date: "13-04-2026", title: "এতদ্বারা সকলের অবগতির জন্য জানানো যাচ্ছে যে, আগামী ১৪.০৪.২০২৬ ইং পহেলা বৈশাখ ১৪৩৩ উদযাপন উপলক্ষে আয়োজিত কেন্দ্রীয় সমন্বয় সভার সিদ্ধান্ত মোতাবেক বাস চলাচল করবে।", category: "general" },
  { id: "2", date: "09-04-2026", title: "ক্লাস ও অফিস ছুটির বিজ্ঞপ্তি (পহেলা বৈশাখ ১৪৩৩)", category: "general" },
  { id: "3", date: "08-04-2026", title: "বার্ষিক ক্রীড়া প্রতিযোগিতার ফলাফল প্রকাশ প্রসঙ্গে", category: "general" },
  { id: "4", date: "08-04-2026", title: "পহেলা বৈশাখ ১৪৩৩ উদযাপন উপলক্ষে স্টল বরাদ্দের বিজ্ঞপ্তি", category: "general" },
  { id: "5", date: "02-04-2026", title: "২০২৫-২০২৬ শিক্ষাবর্ষে ১ম বর্ষ ক্লাস ও ওরিয়েন্টেশন প্রোগ্রাম শুরুর বিজ্ঞপ্তি", category: "general" },
  { id: "6", date: "01-04-2026", title: "প্রাইম ব্যাংক স্কলারশিপ ২০২৬-এর জন্য মেধাবী শিক্ষার্থীদের আবেদন আহ্বান", category: "scholarship" },
  { id: "7", date: "25-03-2026", title: "সহকারী শিক্ষক (গণিত) পদে নিয়োগ বিজ্ঞপ্তি", category: "jobs" },
  { id: "8", date: "15-03-2026", title: "স্কুলের নতুন একাডেমিক ভবন নির্মাণের জন্য উন্মুক্ত ই-টেন্ডার আহ্বান", category: "tender" },
];

export function NoticeBoardSection() {
  const t = useTranslations("NoticeBoard");
  const [activeTab, setActiveTab] = useState<TabId>("general");
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("5");

  const filteredNotices = mockNotices
    .filter((n) => n.category === activeTab)
    .filter((n) => n.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const tabs: { id: TabId; labelKey: "general" | "scholarship" | "jobs" | "tender"; icon: any }[] = [
    { id: "general", labelKey: "general", icon: Megaphone },
    { id: "scholarship", labelKey: "scholarship", icon: GraduationCap },
    { id: "jobs", labelKey: "jobs", icon: Briefcase },
    { id: "tender", labelKey: "tender", icon: FileText },
  ];

  return (
    <section className="w-full py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        
        {/* Title */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-primary uppercase">
            {t("sectionTitle")}
          </h2>
          <div className="w-16 h-1 bg-destructive mx-auto mt-4 rounded-full" />
        </div>

        {/* Notices Board Container */}
        <div className="border border-border/60 bg-card rounded-xl shadow-md overflow-hidden flex flex-col">
          
          {/* Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-1 p-2 bg-muted/60">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSearchQuery("");
                  }}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm sm:text-base font-semibold transition-all duration-300
                    ${isActive 
                      ? "bg-primary text-primary-foreground shadow-sm scale-[1.02]" 
                      : "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                    }
                  `}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="truncate">{t(`tabs.${tab.labelKey}`)}</span>
                </button>
              );
            })}
          </div>

          {/* Controls: entries per page & search */}
          <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-background border-b border-border/50 gap-4">
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <select
                className="bg-transparent border border-border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(e.target.value)}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
              </select>
              <span>{t("entriesPerPage")}</span>
            </div>

            <div className="relative w-full sm:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input 
                type="text" 
                placeholder={t("search")} 
                className="pl-9 w-full sm:w-64 h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

          </div>

          {/* Table */}
          <div className="w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0A4250] dark:bg-primary/90 text-white">
                  <th className="py-3 px-2 sm:px-4 font-semibold text-xs sm:text-sm w-[20%] sm:w-[15%]">{t("table.date")}</th>
                  <th className="py-3 px-2 sm:px-4 font-semibold text-xs sm:text-sm w-[55%] sm:w-[70%] border-l border-white/20">{t("table.title")}</th>
                  <th className="py-3 px-2 sm:px-4 font-semibold text-xs sm:text-sm w-[25%] sm:w-[15%] text-center border-l border-white/20">{t("table.attachment")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-foreground">
                {filteredNotices.length > 0 ? (
                  filteredNotices.map((notice) => (
                    <tr key={notice.id} className="hover:bg-muted/50 transition-colors">
                      <td className="py-4 px-2 sm:px-4 text-xs sm:text-sm font-medium align-top">
                        {notice.date}
                      </td>
                      <td className="py-4 px-2 sm:px-4 text-xs sm:text-sm leading-relaxed border-l border-border/40 align-top">
                        {notice.title}
                      </td>
                      <td className="py-2 px-1 sm:px-4 text-center border-l border-border/40 align-top">
                        <button className="inline-flex flex-col items-center justify-center text-primary hover:text-primary/70 transition-colors group mt-1 sm:mt-2">
                           <span className="text-[10px] sm:text-xs font-semibold uppercase text-center leading-tight">{t("table.viewDetails")}</span>
                          <div className="bg-primary/10 p-1 sm:p-1.5 rounded-full mt-1 sm:mt-1 group-hover:bg-primary/20">
                            <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </div>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-muted-foreground">
                      No notices found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-muted/20 border-t border-border/50 gap-4">
            <p className="text-sm text-muted-foreground">
              {t("pagination.showing")} 1 {t("pagination.to")} {filteredNotices.length} {t("pagination.of")} {mockNotices.filter((n) => n.category === activeTab).length} {t("pagination.entries")}
            </p>
            <div className="flex bg-background border border-border rounded-md overflow-hidden">
              <button className="px-3 py-1 border-r border-border hover:bg-muted text-muted-foreground">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="px-3 py-1 border-r border-border bg-primary/10 text-primary font-semibold">1</button>
              <button className="px-3 py-1 border-r border-border hover:bg-muted text-foreground">2</button>
              <button className="px-3 py-1 hover:bg-muted text-muted-foreground">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
