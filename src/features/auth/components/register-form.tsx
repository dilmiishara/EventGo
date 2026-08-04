"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { AuthFormField } from "@/features/auth/components/auth-form-field";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/features/auth/schemas/auth-schema";
import { createClient } from "@/lib/supabase/client";

export function RegisterForm() {
  const router = useRouter();

  const [serverError, setServerError] = useState<string | null>(null);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    setServerError(null);

    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          full_name: values.fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/`,
      },
    });

    if (error) {
      setServerError(error.message);
      return;
    }

    if (data.session) {
      router.push("/");
      router.refresh();
      return;
    }

    setRegisteredEmail(values.email);
  }

  if (registeredEmail) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl shadow-gray-200/50 sm:p-10">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-2xl text-emerald-700">
          ✓
        </div>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-950">
          Check your email
        </h1>

        <p className="mt-4 text-sm leading-7 text-gray-600">
          We sent a confirmation link to:
        </p>

        <p className="mt-2 break-all font-semibold text-gray-950">
          {registeredEmail}
        </p>

        <p className="mt-4 text-sm leading-7 text-gray-600">
          Open the confirmation link to activate your EventGo account.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-600"
        >
          Return to homepage
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-600">
          Join EventGo
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
          Create your account
        </h1>

        <p className="mt-3 text-sm leading-7 text-gray-600">
          Register as an attendee to discover events and manage your digital
          tickets.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-5"
      >
        <AuthFormField
          id="fullName"
          label="Full name"
          type="text"
          placeholder="Enter your full name"
          autoComplete="name"
          error={errors.fullName?.message}
          registration={register("fullName")}
        />

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
          placeholder="Create a secure password"
          autoComplete="new-password"
          error={errors.password?.message}
          registration={register("password")}
        />

        <AuthFormField
          id="confirmPassword"
          label="Confirm password"
          type="password"
          placeholder="Enter your password again"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          registration={register("confirmPassword")}
        />

        {serverError && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {serverError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center rounded-xl bg-gray-950 px-5 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-violet-600 transition hover:text-violet-800"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}