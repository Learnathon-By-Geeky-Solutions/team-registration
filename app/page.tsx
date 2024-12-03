'use client'

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {

  const router = useRouter();
  useEffect(()=>{
    router.push('/register');
  },[router])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <h1 className="text-4xl font-bold text-gray-900">
          Team Registration Platform
        </h1>
        <p className="text-lg text-gray-600">
          Register your team and get matched with an expert mentor in your technology stack.
        </p>
        <div className="space-y-4">
          <Link href="/register">
            <Button className="w-full">Register Your Team</Button>
          </Link>
          <Link href="/admin">
            <Button variant="outline" className="w-full">
              Admin Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}