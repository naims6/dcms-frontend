"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Eye, EyeOff, GraduationCap, Loader2 } from "lucide-react";
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
import { LoginInput, loginSchema } from "@/schemas/auth.schema";
import { useAuth } from "@/hooks/use-auth";
import { useFormError } from "@/hooks/use-form-error";

export function LoginForm() {
  const t = useTranslations("Login");
  const getErrorMessage = useFormError("Login");
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const rememberMe = useWatch({
    control,
    name: "rememberMe",
  });

  const onSubmit = async (data: LoginInput) => {
    setIsSubmitting(true);
    setApiError(null);

    try {
      await login(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setApiError(err.message);
      } else {
        setApiError(t("error") || "An error occurred during login.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full shadow-xl border-border/60 bg-card animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <CardHeader className="space-y-1 pb-6">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <GraduationCap className="h-6 w-6" strokeWidth={2.5} />
          </div>
          <span className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
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
        {apiError && (
          <div className="mb-5 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-2.5">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">{apiError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-medium">
              {t("email") || "Email Address"}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder={t("emailPlaceholder") || "admin@dcms.com"}
              autoComplete="email"
              aria-describedby={errors.email ? "email-error" : undefined}
              className={cn(
                "h-11 transition-all duration-200",
                errors.email && "border-destructive focus-visible:ring-destructive/30"
              )}
              {...register("email")}
            />
            {errors.email && (
              <p id="email-error" role="alert" className="text-xs text-destructive mt-1">
                {getErrorMessage(errors.email.message)}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium">
                {t("password") || "Password"}
              </Label>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={t("passwordPlaceholder") || "••••••••"}
                autoComplete="current-password"
                aria-describedby={errors.password ? "password-error" : undefined}
                className={cn(
                  "h-11 pr-11 transition-all duration-200",
                  errors.password && "border-destructive focus-visible:ring-destructive/30"
                )}
                {...register("password")}
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" role="alert" className="text-xs text-destructive mt-1">
                {getErrorMessage(errors.password.message)}
              </p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2.5">
            <Checkbox
              id="rememberMe"
              checked={!!rememberMe}
              onCheckedChange={(checked) => setValue("rememberMe", !!checked)}
            />
            <Label htmlFor="rememberMe" className="text-sm text-muted-foreground cursor-pointer select-none">
              {t("rememberMe")}
            </Label>
          </div>

          {/* Submit Button */}
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
        </form>
      </CardContent>
    </Card>
  );
}
