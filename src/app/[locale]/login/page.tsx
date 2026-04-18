import { ReactNode } from "react";
import { LoginForm } from "@/components/pages/login";

export const metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function LoginPage(): ReactNode {
  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
