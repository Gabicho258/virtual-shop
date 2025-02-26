import { monserrat } from "@/config/fonts";
import Link from "next/link";
import React from "react";

export const Footer = () => {
  return (
    <div className="flex w-full justify-center text-xs mb-10">
      <Link href={"/"}>
        <span className={`${monserrat.className} antialiased font-bold`}>
          Virtual
        </span>
        <span>| Shop </span>
        <span> © {new Date().getFullYear()}</span>
      </Link>
      <Link href={"/"} className="mx-3">
        Privacy
      </Link>
      <Link href={"/"} className="mx-3">
        Contact us
      </Link>
    </div>
  );
};
