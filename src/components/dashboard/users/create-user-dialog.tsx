"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  UserPlus,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckSquare,
  Square,
} from "lucide-react";
import { useState } from "react";
import { useRolesQuery } from "@/hooks/queries/use-rbac-queries";
import { useCreateUserMutation } from "@/hooks/queries/use-users-queries";
import { RegisterCredentials } from "@/services/auth.service";

// ── Zod schema ────────────────────────────────────────────────────────────────
const createUserSchema = z.object({
  firstName: z.string().min(1, "First name is required.").trim(),
  lastName: z.string().optional(),
  email: z
    .string()
    .min(1, "Email address is required.")
    .email("Please provide a valid email address."),
  password: z
    .string()
    .min(1, "Password is required.")
    .min(8, "Password must be at least 8 characters."),
  phone: z.string().optional(),
  roleNames: z.array(z.string()),
});

type CreateUserFormValues = z.infer<typeof createUserSchema>;

// ── Props ─────────────────────────────────────────────────────────────────────
interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (createdUser: RegisterCredentials) => void;
}

export function CreateUserDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateUserDialogProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Roles loaded dynamically from the roles API (same source as RoleService)
  const { data: roles = [], isLoading: isRolesLoading } = useRolesQuery();
  const createUserMutation = useCreateUserMutation();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      roleNames: [],
    },
  });

  const selectedRoleNames = watch("roleNames");

  // Reset form every time the dialog opens
  useEffect(() => {
    if (open) {
      reset({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        roleNames: [],
      });
      setShowPassword(false);
      setServerError(null);
    }
  }, [open, reset]);

  // ── Role toggle helpers ───────────────────────────────────────────────────
  const toggleRole = (roleName: string) => {
    const current = selectedRoleNames ?? [];
    setValue(
      "roleNames",
      current.includes(roleName)
        ? current.filter((n) => n !== roleName)
        : [...current, roleName],
      { shouldDirty: true },
    );
  };

  const selectAllRoles = () =>
    setValue(
      "roleNames",
      roles.map((r) => r.name),
      { shouldDirty: true },
    );

  const clearRoles = () => setValue("roleNames", [], { shouldDirty: true });

  // ── Submit handler ────────────────────────────────────────────────────────
  const onSubmit = async (values: CreateUserFormValues) => {
    setServerError(null);

    const payload: RegisterCredentials = {
      firstName: values.firstName.trim(),
      lastName: values.lastName?.trim() || undefined,
      email: values.email.trim().toLowerCase(),
      password: values.password,
      phone: values.phone?.trim() || undefined,
      roleNames:
        values.roleNames && values.roleNames.length > 0
          ? values.roleNames
          : undefined,
    };

    try {
      await createUserMutation.mutateAsync(payload);
      onSuccess?.(payload);
      onOpenChange(false);
    } catch (err: unknown) {
      setServerError(
        err instanceof Error ? err.message : "Failed to create user.",
      );
    }
  };

  const isPending = isSubmitting || createUserMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[92vh] flex flex-col gap-0 p-0 overflow-hidden">
        {/* ── Header ─────────────────────────────────────────── */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/60">
          <DialogTitle className="flex items-center gap-2 text-base font-bold">
            <UserPlus className="h-5 w-5 text-primary" />
            Create New User
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Register a user account and assign RBAC roles loaded from the
            system.
          </DialogDescription>
        </DialogHeader>

        {/* ── Scrollable Form Body ────────────────────────────── */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {/* Server Error Banner */}
            {serverError && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span className="flex-1">{serverError}</span>
              </div>
            )}

            {/* First Name + Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-xs font-semibold">
                  First Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="firstName"
                  placeholder="e.g. Naim"
                  disabled={isPending}
                  className="h-9 text-xs sm:text-sm"
                  autoFocus
                  {...register("firstName")}
                />
                {errors.firstName && (
                  <p className="text-[11px] text-destructive">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-xs font-semibold">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  placeholder="e.g. Sorker"
                  disabled={isPending}
                  className="h-9 text-xs sm:text-sm"
                  {...register("lastName")}
                />
              </div>
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold">
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g. naim@example.com"
                  disabled={isPending}
                  className="h-9 text-xs sm:text-sm"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-[11px] text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-semibold">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  placeholder="e.g. 01908390036"
                  disabled={isPending}
                  className="h-9 text-xs sm:text-sm"
                  {...register("phone")}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold">
                Password <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 8 characters"
                  disabled={isPending}
                  className="pr-10 h-9 text-xs sm:text-sm"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password ? (
                <p className="text-[11px] text-destructive">
                  {errors.password.message}
                </p>
              ) : (
                <p className="text-[11px] text-muted-foreground">
                  Must be at least 8 characters long.
                </p>
              )}
            </div>

            {/* Dynamic Role Selection — loaded from useRolesQuery (roleservice) */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  Assign Roles
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0 font-mono ml-1"
                  >
                    {(selectedRoleNames ?? []).length} selected
                  </Badge>
                </Label>
                {roles.length > 0 && (
                  <div className="flex gap-1.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={selectAllRoles}
                      disabled={isPending}
                      className="h-6 px-2 text-[11px] gap-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                    >
                      <CheckSquare className="h-3 w-3" /> All
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearRoles}
                      disabled={isPending}
                      className="h-6 px-2 text-[11px] gap-1 text-muted-foreground hover:text-foreground"
                    >
                      <Square className="h-3 w-3" /> Clear
                    </Button>
                  </div>
                )}
              </div>

              {isRolesLoading ? (
                <div className="flex items-center justify-center p-6 border rounded-lg bg-muted/20">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span className="text-xs text-muted-foreground ml-2">
                    Loading system roles…
                  </span>
                </div>
              ) : roles.length === 0 ? (
                <div className="p-4 border rounded-lg bg-muted/20 text-center text-xs text-muted-foreground">
                  No roles found in the system.
                </div>
              ) : (
                <Controller
                  control={control}
                  name="roleNames"
                  render={() => (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border rounded-lg p-2.5 bg-muted/10 max-h-48 overflow-y-auto">
                      {roles.map((role) => {
                        const isSelected = (selectedRoleNames ?? []).includes(
                          role.name,
                        );
                        return (
                          <label
                            key={role.id}
                            className={`flex items-start gap-2.5 p-2 rounded-md border cursor-pointer transition-all ${
                              isSelected
                                ? "bg-primary/10 border-primary/40 text-foreground"
                                : "bg-background border-border hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => toggleRole(role.name)}
                              disabled={isPending}
                              className="mt-0.5 shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold tracking-wide uppercase font-mono">
                                {role.name}
                              </p>
                              {role.description && (
                                <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                                  {role.description}
                                </p>
                              )}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  )}
                />
              )}
            </div>
          </div>

          {/* ── Footer ─────────────────────────────────────────── */}
          <DialogFooter className="px-6 py-4 border-t border-border/60 bg-muted/20">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isPending}
              className="gap-1.5 min-w-[110px]"
            >
              {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Create User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
