"use client";

import { authenticate } from "@/actions";
import clsx from "clsx";
import Link from "next/link";
import { useActionState } from "react";
import { IoInformationOutline } from "react-icons/io5";
// import { useFormState } from "react-dom";

export const LoginForm = () => {
  const [state, dispath, isPending] = useActionState(authenticate, undefined);

  return (
    <form action={dispath} className="flex flex-col">
      <label htmlFor="email">E-mail</label>
      <input
        className="px-5 py-2 border bg-gray-200 rounded mb-5"
        type="email"
        name="email"
      />

      <label htmlFor="email">Password</label>
      <input
        className="px-5 py-2 border bg-gray-200 rounded mb-5"
        type="password"
        name="password"
      />
      {state && (
        <div className="flex flex-row mb-2">
          <IoInformationOutline className="h-5 w-5 text-red-500" />
          <p className="text-sm text-red-500">{state}</p>
        </div>
      )}

      <button
        className={clsx({
          "btn-primary": !isPending,
          "btn-disabled": isPending,
        })}
        type="submit"
        disabled={isPending}
      >
        Log In
      </button>

      {/* divisor l ine */}
      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-gray-500"></div>
        <div className="px-2 text-gray-800">O</div>
        <div className="flex-1 border-t border-gray-500"></div>
      </div>

      <Link href="/auth/new-account" className="btn-secondary text-center">
        Create new account
      </Link>
    </form>
  );
};
