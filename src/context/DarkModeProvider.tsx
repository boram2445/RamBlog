'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function DarkModeProvider({ children }: Props) {
  return <ThemeProvider attribute='class'>{children}</ThemeProvider>;
}
