import type { UseFormRegisterReturn } from "react-hook-form";

type AuthFormFieldProps = {
  id: string;
  label: string;
  type: "text" | "email" | "password";
  placeholder: string;
  autoComplete: string;
  error?: string;
  registration: UseFormRegisterReturn;
};

export function AuthFormField({
  id,
  label,
  type,
  placeholder,
  autoComplete,
  error,
  registration,
}: AuthFormFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-gray-800"
      >
        {label}
      </label>

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
        {...registration}
      />

      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-2 text-sm text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}