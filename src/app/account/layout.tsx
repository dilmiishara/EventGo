import type { ReactNode } from "react";

import { AccountShell } from "@/features/account/components/account-shell";
import { requireUser } from "@/features/auth/lib/require-user";

type AccountLayoutProps = {
  children: ReactNode;
};

export default async function AccountLayout({
  children,
}: AccountLayoutProps) {
  const { supabase, userId, claims } = await requireUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", userId)
    .maybeSingle();

  const email =
    typeof claims.email === "string"
      ? claims.email
      : "EventGo user";

  const fullName =
    profile?.full_name?.trim() ||
    email.split("@")[0] ||
    "EventGo user";

  const role = profile?.role ?? "attendee";

  return (
    <AccountShell
      fullName={fullName}
      email={email}
      role={role}
    >
      {children}
    </AccountShell>
  );
}