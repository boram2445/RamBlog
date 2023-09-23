'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { BiSun, BiSolidMoon } from 'react-icons/bi';

const iconStyle = 'w-6 h-6';

export default function DarkMode() {
  const [mounted, setMounted] = useState(false);
  const { systemTheme, theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTheme = theme === 'system' ? systemTheme : theme;

  return (
    <div className='cursor-pointer rounded-full p-2 hover:bg-gray-100 dark:hover:dark:bg-neutral-800'>
      {currentTheme === 'dark' ? (
        <BiSolidMoon
          onClick={() => setTheme('light')}
          className={`${iconStyle} text-yellow-400`}
        />
      ) : (
        <BiSun
          onClick={() => setTheme('dark')}
          className={`${iconStyle} text-gray-700`}
        />
      )}
    </div>
  );
}
