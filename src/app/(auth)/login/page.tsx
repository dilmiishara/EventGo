import type { Metadata } from "next";

import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Login | EventGo",
  description: "Login to your EventGo account.",
};

export default function LoginPage() {
  return <LoginForm />;
}