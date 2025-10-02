'use client';

import { useAuth } from './useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const useRoleProtection = (allowedRoles: string[]) => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user && !allowedRoles.includes(user.role)) {
      // Redirect based on user role
      if (user.role === 'customer') {
        router.push('/buy-package');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, user, allowedRoles, router]);

  return {
    hasAccess: user ? allowedRoles.includes(user.role) : false,
    user,
    isAuthenticated,
  };
};