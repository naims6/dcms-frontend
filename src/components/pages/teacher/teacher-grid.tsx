"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { SearchX } from "lucide-react";
import { teachers } from "./teacher-data";
import { TeacherCard } from "./teacher-card";
import { TeacherSearch } from "./teacher-search";

export function TeacherGrid() {
  const t = useTranslations("TeacherPage");
  const locale = useLocale();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return teachers;
    return teachers.filter((teacher) => {
      const name = locale === "bn" ? teacher.nameBn : teacher.name;
      const subject = locale === "bn" ? teacher.subjectBn : teacher.subject;
      const department =
        locale === "bn" ? teacher.departmentBn : teacher.department;
      return (
        name.toLowerCase().includes(q) ||
        subject.toLowerCase().includes(q) ||
        department.toLowerCase().includes(q) ||
        teacher.name.toLowerCase().includes(q) ||
        teacher.subject.toLowerCase().includes(q) ||
        teacher.department.toLowerCase().includes(q)
      );
    });
  }, [query, locale]);

  return (
    <>
      <div className="mb-10">
        <TeacherSearch value={query} onChange={setQuery} />
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-muted/60 text-muted-foreground mb-4">
            <SearchX className="h-7 w-7" />
          </div>
          <p className="text-lg font-semibold text-foreground">
            {t("noResults")}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {t("noResultsHint")}
          </p>
        </div>
      )}
    </>
  );
}
