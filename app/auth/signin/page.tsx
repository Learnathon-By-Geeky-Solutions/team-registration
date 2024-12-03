'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useState, Suspense } from 'react';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';

// Separate component to handle search params logic
function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [callbackUrl, setCallbackUrl] = useState<string>('/admin');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const callback = searchParams.get('callbackUrl') || '/admin';
    setCallbackUrl(callback);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (!result?.ok) {
        toast.error(result?.error || 'Failed to sign in');
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      toast.error('An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
}

// Main component with Suspense boundary
export default function SignIn() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Admin Sign In</h1>
        <Suspense fallback={
          <div className="space-y-4">
            <div>Loading...</div>
          </div>
        }>
          <SignInForm />
        </Suspense>
      </div>
    </div>
  );
}