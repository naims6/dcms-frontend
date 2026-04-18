"use client";

import Image from "next/image";
import { ChevronRight, BookOpen, Building2 } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Teacher } from "./teacher-data";

interface TeacherCardProps {
  teacher: Teacher;
}

export function TeacherCard({ teacher }: TeacherCardProps) {
  const t = useTranslations("TeacherPage");
  const locale = useLocale();

  const name = locale === "bn" ? teacher.nameBn : teacher.name;
  const subject = locale === "bn" ? teacher.subjectBn : teacher.subject;
  const department =
    locale === "bn" ? teacher.departmentBn : teacher.department;
  const level = locale === "bn" ? teacher.levelBn : teacher.level;

  return (
    <div className="group flex flex-col rounded-3xl border border-border/60 bg-card/80 overflow-hidden shadow-sm shadow-primary/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30">
      {/* Image area */}
      <div className="relative h-52 bg-linear-to-br from-primary/10 via-transparent to-secondary/5 overflow-hidden">
        <div className="absolute inset-0 bg-[#0d505a] translate-x-2 translate-y-2 transition-transform group-hover:translate-x-3 group-hover:translate-y-3" />
        <div className="absolute inset-0 z-10 overflow-hidden">
          <Image
            src={teacher.image}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        {/* Department badge */}
        <div className="absolute top-3 left-3 z-20 inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-background/90 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-primary">
          <Building2 className="h-3 w-3" />
          {department}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-4">
        <div>
          <h3 className="text-lg font-bold text-foreground leading-tight">
            {name}
          </h3>
          <p className="text-sm text-primary font-medium mt-0.5">{level}</p>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="h-3.5 w-3.5 shrink-0 text-primary/70" />
          <span>{subject}</span>
        </div>

        <div className="mt-auto">
          <Link
            href={`/teacher/${teacher.id}`}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-primary/30 bg-primary/8 hover:bg-primary hover:text-primary-foreground px-4 py-2.5 text-sm font-semibold text-primary transition-all duration-200 group/btn"
          >
            {t("viewProfile")}
            <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
