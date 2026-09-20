"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useChangePasswordMutation } from "@/hooks/queries/use-auth-queries";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  User as UserIcon,
  ShieldCheck,
  KeyRound,
  Lock,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Mail,
  Fingerprint,
} from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/shared/DashboardPageHeader";

export function ProfileSettings() {
  const { user } = useAuth();
  const changePasswordMutation = useChangePasswordMutation();

  // Change Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!currentPassword) {
      setFeedback({ type: "error", text: "Please enter your current password." });
      return;
    }

    if (newPassword.length < 8) {
      setFeedback({ type: "error", text: "New password must be at least 8 characters long." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setFeedback({ type: "error", text: "New password and confirmation do not match." });
      return;
    }

    try {
      const res = await changePasswordMutation.mutateAsync({
        currentPassword,
        newPassword,
      });
      setFeedback({ type: "success", text: res.message || "Password changed successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to change password.";
      setFeedback({ type: "error", text: msg });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in-0 duration-300">
      {/* Header */}
      <DashboardPageHeader
        title="Account Profile & Security Settings"
        description="Manage your personal credentials, assigned system roles, and security authentication"
        icon={UserIcon}
      />

      <div className="grid gap-6 md:grid-cols-3">
        {/* User Identity Overview Card */}
        <Card className="md:col-span-1 border border-border/80 shadow-xs">
          <CardHeader className="text-center pb-4 border-b border-border/60">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xl shadow-inner">
              {user?.firstName?.[0]}
              {user?.lastName?.[0] || ""}
            </div>
            <CardTitle className="text-lg font-bold mt-3">
              {user?.firstName} {user?.lastName || ""}
            </CardTitle>
            <CardDescription className="text-xs flex items-center justify-center gap-1">
              <Mail className="h-3 w-3 text-muted-foreground" />
              {user?.email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4 text-xs">
            <div>
              <span className="text-muted-foreground font-semibold flex items-center gap-1 mb-1">
                <Fingerprint className="h-3.5 w-3.5" /> Account ID
              </span>
              <p className="font-mono text-[11px] bg-muted/40 p-2 rounded border border-border/60 select-all">
                {user?.id}
              </p>
            </div>

            <div>
              <span className="text-muted-foreground font-semibold flex items-center gap-1 mb-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Assigned Roles
              </span>
              <div className="flex flex-wrap gap-1.5">
                {user?.roles?.map((role) => (
                  <Badge key={role} className="bg-primary/10 text-primary border-primary/20 font-semibold text-[10px]">
                    {role}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <span className="text-muted-foreground font-semibold flex items-center gap-1 mb-1.5">
                <KeyRound className="h-3.5 w-3.5 text-indigo-500" /> Granted Permissions ({user?.permissions?.length || 0})
              </span>
              <div className="flex flex-wrap gap-1 max-h-36 overflow-y-auto p-2 bg-muted/20 rounded border border-border/40">
                {user?.permissions?.map((perm) => (
                  <Badge key={perm} variant="secondary" className="text-[10px] py-0 px-1 font-mono">
                    {perm}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Change Password Security Form Card */}
        <Card className="md:col-span-2 border border-border/80 shadow-xs">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Security & Password Updates
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Endpoint: POST /auth/change-password. Update your authentication password securely.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {feedback && (
              <div
                className={`mb-4 p-3 rounded-md text-xs flex items-center gap-2 ${
                  feedback.type === "success"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                    : "bg-destructive/10 text-destructive border border-destructive/20"
                }`}
              >
                {feedback.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                {feedback.text}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="currentPassword" className="text-xs font-semibold">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="h-10 text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="newPassword" className="text-xs font-semibold">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="At least 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-10 text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-xs font-semibold">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-10 text-xs"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button type="submit" disabled={changePasswordMutation.isPending} className="gap-2">
                  {changePasswordMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Update Password
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
