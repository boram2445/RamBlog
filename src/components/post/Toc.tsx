'use client';

import { useHeadings } from '@/hooks/useHeadings';
import { useScrollSpy } from '@/hooks/useScrollSpy';

export default function Toc() {
  const headings = useHeadings();
  const activeId = useScrollSpy(headings.map((head) => head.text));

  return (
    <>
      {headings.length > 0 && (
        <div className='p-4 pr-2'>
          <p className='font-semibold'>On this Page</p>
          <ul className='mt-2'>
            {headings?.map(({ text, level }, index) => (
              <li
                key={index}
                className={`text-gray-500 ${
                  activeId === text &&
                  'text-indigo-500 font-semibold dark:text-yellow-400'
                } pl-${level} hover:text-blue-300 mt-0.5 dark:text-slate-400 dark:hover:text-slate-300`}
              >
                <a href={`#${text}`} className=' break-all'>
                  {text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
