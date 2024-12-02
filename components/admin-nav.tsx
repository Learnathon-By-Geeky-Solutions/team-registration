'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Settings, Users, UserCheck, UserCog, UsersRound } from 'lucide-react';

const navItems = [
  { href: '/admin/mentors', label: 'Mentors', icon: Users },
  { href: '/admin/teams', label: 'Teams', icon: UsersRound },
  { href: '/admin/assignments', label: 'Assignments', icon: UserCheck },
  { href: '/admin/admins', label: 'Administrators', icon: UserCog },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'inline-flex items-center px-4 text-sm font-medium border-b-2',
                  pathname === href
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                <Icon className="h-5 w-5 mr-2" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}