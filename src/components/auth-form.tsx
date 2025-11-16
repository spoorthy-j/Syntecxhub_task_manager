'use client';

import { useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { login } from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogIn } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Signing In...' : 'Sign In'}
      <LogIn className="ml-2 h-4 w-4" />
    </Button>
  );
}

export function AuthForm() {
  const [isRegister, setIsRegister] = useState(false);
  const [state, formAction] = useActionState(login, null);

  const title = isRegister ? 'Create an Account' : 'Sign In';
  const description = isRegister
    ? 'Enter your details to create a new account.'
    : 'Enter your credentials to access your tasks.';

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          {state?.message && (
            <Alert variant="destructive">
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>
          {isRegister && (
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <SubmitButton />
          <p className="text-sm text-muted-foreground">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}
            <Button
              type="button"
              variant="link"
              className="px-1"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? 'Sign In' : 'Sign Up'}
            </Button>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}