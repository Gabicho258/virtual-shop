"use client";

import { authenticate } from "@/actions";
import Link from "next/link";
import { useActionState } from "react";
// import { useFormState } from "react-dom";

export const LoginForm = () => {
  const [state, dispath] = useActionState(authenticate, undefined);

  console.log(state);
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

      <button className="btn-primary" type="submit">
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
