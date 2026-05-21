import { LoginForm } from "@/components/auth/LoginForm";
import { PublicOnlyGuard } from "@/components/auth/RouteGuard";

export default function LoginPage() {
  return (
    <PublicOnlyGuard>
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <LoginForm />
      </div>
    </PublicOnlyGuard>
  );
}
