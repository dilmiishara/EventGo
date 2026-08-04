"use client";

import { useState } from "react";

import { AppModal } from "@/components/ui/app-modal";
import { signOutAction } from "@/features/auth/actions/sign-out";

type LogoutButtonProps = {
  fullWidth?: boolean;
};

export function LogoutButton({
  fullWidth = false,
}: LogoutButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  function openDialog() {
    setIsDialogOpen(true);
  }

  function closeDialog() {
    setIsDialogOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        className={
            fullWidth
            ? "flex w-full items-center justify-center rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-red-950/20 transition hover:bg-red-700"
            : "rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-red-50 hover:text-red-700"
        }
      >
        Logout
      </button>

      <AppModal
        isOpen={isDialogOpen}
        onClose={closeDialog}
        title="Logout from EventGo?"
        description="You will need to enter your email and password again to access your bookings and digital tickets."
        size="md"
        icon={
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600">
            <LogoutIcon />
          </div>
        }
      >
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={closeDialog}
            className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            Stay logged in
          </button>

          <form action={signOutAction}>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 sm:w-auto"
            >
              Yes, logout
            </button>
          </form>
        </div>
      </AppModal>
    </>
  );
}

function LogoutIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      className="h-6 w-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14 8l4 4m0 0-4 4m4-4H9m3-7H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h6"
      />
    </svg>
  );
}