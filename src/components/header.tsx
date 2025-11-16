import { logout } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';
import { LogOut } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-2">
        <Logo className="h-6 w-6 text-primary" />
        <span className="text-lg font-semibold text-foreground">
          TaskMaster Pro
        </span>
      </div>
      <div className="ml-auto">
        <form action={logout}>
          <Button variant="ghost" size="sm">
            Logout
            <LogOut className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </div>
    </header>
  );
}