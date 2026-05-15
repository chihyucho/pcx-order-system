import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 font-sans dark:bg-slate-950">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Sign-in will be wired here.
      </p>
      <Link
        href="/"
        className="mt-4 text-sm font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
      >
        ← Back to home
      </Link>
    </div>
  );
}
