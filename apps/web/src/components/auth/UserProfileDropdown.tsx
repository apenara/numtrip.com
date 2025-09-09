'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { User, LogOut, Settings, Building, ChevronDown } from 'lucide-react';

export default function UserProfileDropdown() {
  const router = useRouter();
  const params = useParams();
  const { user, signOut } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      const locale = (params as any)?.locale ?? '';
      const res = await fetch(`/${locale}/auth/logout?next=/${locale}`, {
        method: 'POST',
      });
      if (res.redirected) {
        router.push(res.url);
      } else {
        router.push(`/${locale}`);
      }
      router.refresh();
    } catch (e) {
      router.push('/');
      router.refresh();
    }
  };

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link href={`/${(params as any)?.locale ?? ''}/auth/login`} className="text-gray-600 hover:text-gray-900">
          Sign In
        </Link>
        <Link href={`/${(params as any)?.locale ?? ''}/auth/register`} className="btn-primary py-2 px-4">
          Get Started
        </Link>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-gray-700 hover:text-gray-900 focus:outline-none"
      >
        <div className="h-8 w-8 bg-primary-blue-light rounded-full flex items-center justify-center">
          <User className="h-5 w-5 text-primary-blue" />
        </div>
        <span className="hidden md:block text-sm font-medium">
          {user.email}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">
              {user.user_metadata?.name || 'User'}
            </p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>

          <Link
            href={`/${(params as any)?.locale ?? ''}/dashboard`}
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            <Building className="h-4 w-4" />
            Dashboard
          </Link>

          <Link
            href={`/${(params as any)?.locale ?? ''}/profile`}
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            <User className="h-4 w-4" />
            Profile
          </Link>

          <Link
            href={`/${(params as any)?.locale ?? ''}/settings`}
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>

          <div className="border-t border-gray-100 mt-2 pt-2">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}