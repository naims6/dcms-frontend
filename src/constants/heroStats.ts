import { Users, BookOpen, Trophy } from "lucide-react";

export const HERO_STATS = [
  { icon: Users, value: "1200+", labelKey: "students" },
  { icon: BookOpen, value: "30+", labelKey: "teachers" },
  { icon: Trophy, value: "98%", labelKey: "passRate" },
] as const;

export const HERO_FOUNDED_YEAR = "1985" as const;
