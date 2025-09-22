'use client';

import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react';
import { ClerkProvider } from '@clerk/nextjs';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { NotificationContainer } from '@/components/NotificationContainer';

const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: '#e6f3ff' },
          100: { value: '#b3d9ff' },
          200: { value: '#80bfff' },
          300: { value: '#4da6ff' },
          400: { value: '#1a8cff' },
          500: { value: '#0066cc' },
          600: { value: '#0052a3' },
          700: { value: '#003d7a' },
          800: { value: '#002952' },
          900: { value: '#001429' },
        },
      },
      fonts: {
        heading: { value: 'var(--font-geist-sans)' },
        body: { value: 'var(--font-geist-sans)' },
      },
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ChakraProvider value={system}>
        <NotificationProvider>
          {children}
          <NotificationContainer />
        </NotificationProvider>
      </ChakraProvider>
    </ClerkProvider>
  );
}
