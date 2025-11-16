import { AuthForm } from '@/components/auth-form';
import { Logo } from '@/components/icons';

export default function AuthenticationPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Logo className="h-12 w-12 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome to TaskMaster Pro
          </h1>
          <p className="text-muted-foreground">
            Sign in or create an account to manage your tasks
          </p>
        </div>
        <AuthForm />
      </div>
    </main>
  );
}