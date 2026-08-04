import type { Metadata } from "next";

import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata: Metadata = {
  title: "Create Account | EventGo",
  description: "Create an EventGo attendee account.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}