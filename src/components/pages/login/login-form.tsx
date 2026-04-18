"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, GraduationCap, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LoginFormValues, loginSchema } from "@/schemas/login";
import Link from "next/link";

export function LoginForm() {
  const t = useTranslations("Login");
  const [showPin, setShowPin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<LoginFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(loginSchema as any),
    defaultValues: { rememberMe: false },
  });

  const rememberMe = useWatch({
    control,
    name: "rememberMe",
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    // TODO: connect to backend
    console.log(data);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
  };

  return (
    <Card className="w-full shadow-xl border-border/60 bg-card animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <CardHeader className="space-y-1 pb-6">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <GraduationCap className="h-5 w-5" strokeWidth={2.5} />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/60">
            DCMS
          </span>
        </div>
        <CardTitle className="text-2xl font-bold text-foreground">
          {t("title")}
        </CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          {t("subtitle")}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-5"
        >
          {/* Registered ID */}
          <div className="space-y-1.5">
            <Label htmlFor="registeredId" className="text-sm font-medium">
              {t("registeredId")}
            </Label>
            <Input
              id="registeredId"
              type="text"
              placeholder={t("registeredIdPlaceholder")}
              autoComplete="username"
              aria-describedby={errors.registeredId ? "id-error" : undefined}
              className={cn(
                "h-11 transition-all duration-200",
                errors.registeredId &&
                  "border-destructive focus-visible:ring-destructive/30",
              )}
              {...register("registeredId")}
            />
            {errors.registeredId && (
              <p
                id="id-error"
                role="alert"
                className="text-xs text-destructive mt-1"
              >
                {errors.registeredId.message}
              </p>
            )}
          </div>

          {/* PIN */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="pin" className="text-sm font-medium">
                {t("pin")}
              </Label>
              <button
                type="button"
                className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
                onClick={() => {
                  /* TODO: forgot pin flow */
                }}
              >
                {t("forgotPin")}
              </button>
            </div>
            <div className="relative">
              <Input
                id="pin"
                type={showPin ? "text" : "password"}
                placeholder={t("pinPlaceholder")}
                autoComplete="current-password"
                aria-describedby={errors.pin ? "pin-error" : undefined}
                className={cn(
                  "h-11 pr-11 transition-all duration-200",
                  errors.pin &&
                    "border-destructive focus-visible:ring-destructive/30",
                )}
                {...register("pin")}
              />
              <button
                type="button"
                aria-label={showPin ? t("hidePin") : t("showPin")}
                onClick={() => setShowPin((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPin ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.pin && (
              <p
                id="pin-error"
                role="alert"
                className="text-xs text-destructive mt-1"
              >
                {errors.pin.message}
              </p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2.5">
            <Checkbox
              id="rememberMe"
              checked={!!rememberMe}
              onCheckedChange={(checked) => setValue("rememberMe", !!checked)}
              aria-label={t("rememberMe")}
            />
            <Label
              htmlFor="rememberMe"
              className="text-sm text-muted-foreground cursor-pointer select-none"
            >
              {t("rememberMe")}
            </Label>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 font-semibold shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0 rounded-xl"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("loggingIn")}
              </>
            ) : (
              t("loginButton")
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground pt-1">
            {t("admissionNote")}{" "}
            <Link
              href="/admissions"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              {t("admissionLink")}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
