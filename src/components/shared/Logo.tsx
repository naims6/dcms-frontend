import { GraduationCap } from "lucide-react";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary/20">
        <GraduationCap className="h-5 w-5" strokeWidth={2.5} />
      </div>
      <span className="font-extrabold text-xl md:text-2xl tracking-tight bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/60 dark:from-primary dark:to-primary/70 transition-colors">
        DCMS
      </span>
    </Link>
  );
};

export default Logo;
