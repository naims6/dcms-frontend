"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { teachers } from "@/components/pages/teacher/teacher-data";

const CARD_BACKDROP_CLASSES = [
  "translate-x-3 translate-y-3 group-hover:translate-x-4 group-hover:translate-y-4",
  "-translate-x-3 translate-y-3 group-hover:-translate-x-4 group-hover:translate-y-4",
  "-translate-x-3 -translate-y-3 group-hover:-translate-x-4 group-hover:-translate-y-4",
] as const;

const CARD_ACCENT_CLASSES = [
  "text-primary",
  "text-destructive",
  "text-destructive",
] as const;

interface LeadershipCardItemProps {
  teacherId: string;
  name: string;
  role: string;
  image: string;
  index: number;
}

function LeadershipCardItem({
  teacherId,
  name,
  role,
  image,
  index,
}: LeadershipCardItemProps) {
  const t = useTranslations("Leadership");
  const backdropClass = CARD_BACKDROP_CLASSES[index] ?? CARD_BACKDROP_CLASSES[0];
  const accentClass = CARD_ACCENT_CLASSES[index] ?? CARD_ACCENT_CLASSES[0];

  return (
    <div className="flex flex-col space-y-4 group">
      <div className="relative aspect-3/4 w-full rounded-2xl overflow-hidden transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl group-hover:shadow-primary/20">
        <div
          className={`absolute inset-0 bg-[#0d505a] rounded-2xl transition-transform ${backdropClass}`}
        />
        <div className="absolute inset-0 bg-muted border border-border z-10 rounded-2xl overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
      <div className="pt-2">
        <h3 className="font-bold text-xl text-foreground mb-1">{name}</h3>
        <p className="text-sm font-medium text-muted-foreground mb-3">{role}</p>
        <Link
          href={`/teacher/${teacherId}`}
          className={`text-sm font-semibold hover:underline flex items-center gap-1 group/btn ${accentClass}`}
        >
          {t("profileDekhunBtn")}
          <ChevronRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}

export function LeadershipCards() {
  const locale = useLocale();

  const leadershipTeachers = teachers.slice(0, 3).map((teacher) => ({
    teacherId: teacher.id,
    name: locale === "bn" ? teacher.nameBn : teacher.name,
    role: locale === "bn" ? teacher.levelBn : teacher.level,
    image: teacher.image,
  }));

  return (
    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
      {leadershipTeachers.map((teacher, index) => (
        <LeadershipCardItem key={teacher.teacherId} index={index} {...teacher} />
      ))}
    </div>
  );
}
