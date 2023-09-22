'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { BsSun, BsMoonStars } from 'react-icons/bs';

const iconStyle = 'w-6 h-6 text-gray-700';

export default function DarkMode() {
  const [mounted, setMounted] = useState(false);
  const { systemTheme, theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTheme = theme === 'system' ? systemTheme : theme;

  return (
    <div className=' cursor-pointer rounded-full p-2 hover:bg-gray-100'>
      {currentTheme === 'dark' ? (
        <BsMoonStars onClick={() => setTheme('light')} className={iconStyle} />
      ) : (
        <BsSun onClick={() => setTheme('dark')} className={iconStyle} />
      )}
    </div>
  );
}
