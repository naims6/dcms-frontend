import Image from "next/image";
import {
  Mail,
  Phone,
  BookOpen,
  GraduationCap,
  Briefcase,
  Building2,
  ArrowLeft,
  Quote,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Teacher } from "./teacher-data";

interface TeacherProfileProps {
  teacher: Teacher;
}

export function TeacherProfile({ teacher }: TeacherProfileProps) {
  const t = useTranslations("TeacherPage");
  const locale = useLocale();

  const name = locale === "bn" ? teacher.nameBn : teacher.name;
  const subject = locale === "bn" ? teacher.subjectBn : teacher.subject;
  const department =
    locale === "bn" ? teacher.departmentBn : teacher.department;
  const level = locale === "bn" ? teacher.levelBn : teacher.level;
  const education = locale === "bn" ? teacher.educationBn : teacher.education;
  const bio = locale === "bn" ? teacher.bioBn : teacher.bio;

  return (
    <main className="flex-1">
      {/* ── Hero ── */}
      <section className="relative w-full overflow-hidden bg-background border-b border-border/40">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/4 -top-24 h-80 w-80 rounded-full bg-primary/8 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-secondary/8 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 md:px-6 py-10 md:py-14 relative z-10">
          {/* Back */}
          <Link
            href="/teacher"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            {t("backToTeachers")}
          </Link>

          {/* Photo + Identity + Contact — all in one row */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-start">
            {/* Photo */}
            <div className="relative shrink-0 mx-auto md:mx-0">
              <div className="absolute inset-0 bg-primary/15 rounded-3xl translate-x-2.5 translate-y-2.5" />
              <div className="relative h-60 w-48 md:h-72 md:w-56 rounded-3xl overflow-hidden border border-border/60 shadow-lg shadow-primary/10 z-10">
                <Image
                  src={teacher.image}
                  alt={name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute -bottom-3 -right-3 z-20 flex flex-col items-center justify-center h-16 w-16 rounded-2xl bg-primary text-primary-foreground shadow-md border-4 border-background">
                <span className="text-xl font-extrabold leading-none">
                  {teacher.experience}
                </span>
                <span className="text-[9px] font-semibold uppercase tracking-wide leading-tight text-center">
                  {t("yearsExp")}
                </span>
              </div>
            </div>

            {/* Identity */}
            <div className="flex-1 space-y-3 pt-1">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Building2 className="h-3 w-3" />
                {department}
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
                {name}
              </h1>
              <p className="text-base font-semibold text-primary">{level}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-border/60 bg-muted/50 px-3 py-1.5 text-sm text-foreground">
                  <BookOpen className="h-3.5 w-3.5 text-primary/70" />
                  {subject}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-border/60 bg-muted/50 px-3 py-1.5 text-sm text-foreground">
                  <GraduationCap className="h-3.5 w-3.5 text-primary/70" />
                  {education}
                </span>
              </div>
            </div>

            {/* Contact card — beside the teacher */}
            <div className="w-full md:w-72 shrink-0 rounded-3xl border border-border/60 bg-card/90 p-5 shadow-sm shadow-primary/5 space-y-4">
              <p className="text-xs uppercase tracking-[0.26em] text-primary font-semibold">
                {t("contactTeacher")}
              </p>

              <div className="space-y-2.5">
                <div className="flex items-center gap-3 rounded-2xl bg-muted/40 px-3.5 py-3">
                  <Mail className="h-4 w-4 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-muted-foreground">
                      {t("detailEmail")}
                    </p>
                    <p className="text-sm font-medium text-foreground truncate">
                      {teacher.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-muted/40 px-3.5 py-3">
                  <Phone className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <p className="text-[10px] text-muted-foreground">
                      {t("detailPhone")}
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {teacher.phone}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <a
                  href={`mailto:${teacher.email}`}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  {t("sendEmail")}
                </a>
                <a
                  href={`tel:${teacher.phone}`}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-border/60 bg-background px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted/50 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  {t("callNow")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      <section className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {/* About */}
          <div className="md:col-span-2 rounded-3xl border border-border/60 bg-card/80 p-7 shadow-sm shadow-primary/5">
            <p className="text-xs uppercase tracking-[0.28em] text-primary font-semibold mb-4">
              {t("detailBio")}
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              {bio}
            </p>
          </div>

          {/* Quick stats */}
          <div className="rounded-3xl border border-border/60 bg-card/80 p-7 shadow-sm shadow-primary/5">
            <p className="text-xs uppercase tracking-[0.28em] text-primary font-semibold mb-5">
              {t("quickStats")}
            </p>
            <div className="space-y-3">
              <StatRow
                icon={<Briefcase className="h-4 w-4" />}
                label={t("detailExperience")}
                value={`${teacher.experience} ${t("yearsExp")}`}
              />
              <StatRow
                icon={<BookOpen className="h-4 w-4" />}
                label={t("detailSubject")}
                value={subject}
              />
              <StatRow
                icon={<Building2 className="h-4 w-4" />}
                label={t("detailDepartment")}
                value={department}
              />
              <StatRow
                icon={<GraduationCap className="h-4 w-4" />}
                label={t("detailEducation")}
                value={education}
              />
            </div>
          </div>

          {/* Teaching philosophy — full width */}
          <div className="md:col-span-3 rounded-3xl border border-primary/20 bg-primary/5 p-7 shadow-sm relative overflow-hidden">
            <Quote className="absolute top-4 right-6 h-14 w-14 text-primary/10" />
            <p className="text-xs uppercase tracking-[0.28em] text-primary font-semibold mb-3">
              {t("teachingPhilosophy")}
            </p>
            <p className="text-base text-foreground font-medium leading-relaxed max-w-3xl relative z-10">
              {t("philosophyText")}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function StatRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border/40 bg-muted/30 px-4 py-3">
      <span className="text-primary shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm font-semibold text-foreground truncate">
          {value}
        </p>
      </div>
    </div>
  );
}
