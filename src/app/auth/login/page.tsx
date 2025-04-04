import { monserrat } from "@/config/fonts";
import { LoginForm } from "./ui/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex flex-col min-h-screen pt-32 sm:pt-52">
      <h1 className={`${monserrat.className} text-4xl mb-5`}>Login In</h1>

      <LoginForm />
    </main>
  );
}
