"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { AuthFormField } from "@/features/auth/components/auth-form-field";
import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/auth-schema";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setServerError(null);

    const supabase = createClient();

    const normalizedEmail = values.email.trim().toLowerCase();

    const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: values.password,
    });

    if (error) {
        console.error("Supabase login error:", {
        message: error.message,
        status: error.status,
        code: error.code,
        });

        switch (error.code) {
        case "email_not_confirmed":
            setServerError(
            "Your email address has not been confirmed. Check your email first.",
            );
            return;

        case "invalid_credentials":
            setServerError("The email or password is incorrect.");
            return;

        default:
            setServerError(error.message);
            return;
        }
    }

    if (!data.session || !data.user) {
        setServerError(
        "Login completed, but no session was created. Please try again.",
        );
        return;
    }

    router.replace("/");
    router.refresh();
    }

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-600">
          Welcome back
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
          Login to EventGo
        </h1>

        <p className="mt-3 text-sm leading-7 text-gray-600">
          Access your bookings, digital tickets, and upcoming musical events.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-5"
      >
        <AuthFormField
          id="email"
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          registration={register("email")}
        />

        <AuthFormField
          id="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          error={errors.password?.message}
          registration={register("password")}
        />

        {serverError && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {serverError}
          </div>
        )}

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm font-semibold text-violet-600 transition hover:text-violet-800"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center rounded-xl bg-gray-950 px-5 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-violet-600 transition hover:text-violet-800"
          >
            Create account
          </Link>
        </p>
      </form>
    </div>
  );
}