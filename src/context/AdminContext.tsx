'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface AdminContextType {
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: admin } = await supabase
          .from('admins')
          .select('email')
          .eq('email', session.user.email)
          .single();
        
        setIsAdmin(!!admin);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  }

  const login = async (email: string) => {
    // In a real app, this would trigger an OTP or password login
    // For this demo/setup, we'll assume the user is signed in via Supabase Auth
    const { data: admin } = await supabase
      .from('admins')
      .select('email')
      .eq('email', email)
      .single();

    if (admin) {
      setIsAdmin(true);
      router.push('/admin/dashboard');
    } else {
      throw new Error('Unauthorized');
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    router.push('/admin/login');
  };

  return (
    <AdminContext.Provider value={{ isAdmin, isLoading, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
