'use client';

import { useHeadings } from '@/hooks/useHeadings';
import { useScrollSpy } from '@/hooks/useScrollSpy';

// Tailwind는 소스를 정적으로 스캔하므로 `ml-${level}` 같은 동적 클래스는
// 생성되지 않는다. 레벨별 들여쓰기는 반드시 리터럴로 나열할 것.
const indentByLevel: Record<string, string> = {
  '1': 'ml-0',
  '2': 'ml-2',
  '3': 'ml-4',
};

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
                className={`mt-1 text-gray-500 text-sm ${
                  activeId === text &&
                  'text-indigo-500 font-semibold dark:text-yellow-400'
                } ${indentByLevel[level] ?? 'ml-0'} hover:text-blue-300 mt-0.5 dark:text-slate-400 dark:hover:text-slate-300`}
              >
                <a href={`#${text}`} className='break-all'>
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
