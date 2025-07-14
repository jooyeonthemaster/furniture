'use client';

import { ReactNode } from 'react';
import { CartProvider } from '@/hooks/useCart';

interface ClientProvidersProps {
  children: ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
} 