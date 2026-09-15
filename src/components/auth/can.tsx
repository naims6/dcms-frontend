"use client";

import React from "react";
import { useAuth } from "@/hooks/use-auth";

interface CanProps {
  perform: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const Can: React.FC<CanProps> = ({ perform, children, fallback = null }) => {
  const { hasPermission } = useAuth();
  return hasPermission(perform) ? <>{children}</> : <>{fallback}</>;
};
