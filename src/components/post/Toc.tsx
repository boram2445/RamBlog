'use client';

import { useEffect, useState } from 'react';
import PostIcons from './PostIcons';

export default function Toc() {
  const [indexList, setIndexList] = useState<
    { id: number; text: string; size: string }[]
  >([]);
  const [currentIndex, setCurrentIndex] = useState<string>('');

  useEffect(() => {
    //header 파싱
    const headerNodeList = document
      .querySelector('#content')
      ?.querySelectorAll('h1, h2, h3') as NodeListOf<Element>;
    const observer = new IntersectionObserver(observerCallback);

    headerNodeList.forEach((node, index) => {
      const text = node.textContent as string;
      const size = node.nodeName[1];
      node.id = text;

      setIndexList((prev) => {
        if (prev.map((item) => item.text).includes(text)) return prev;
        return [...prev, { id: index, text, size }];
      });

      observer.observe(node);
    });

    function observerCallback(entries: IntersectionObserverEntry[]) {
      entries?.forEach((entry) => {
        if (!entry.isIntersecting) return;
        setCurrentIndex(entry.target.textContent!);
      });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <aside className='sticky top-[120px] hidden min-w-[230px] max-w-[250px] self-start laptop:block border border-gray-200 rounded-xl overflow-hidden'>
      {indexList.length > 0 && (
        <div className='p-4 pr-2'>
          <p className='font-semibold'>On this Page</p>
          <ul className='mt-2'>
            {indexList?.map(({ text, size }, index) => (
              <li
                key={index}
                className={`text-gray-500 ${
                  currentIndex === text && 'text-indigo-500 font-semibold'
                } pl-${size} hover:text-blue-300 mt-0.5`}
              >
                <a href={`#${text}`} className=' break-all'>
                  {text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <PostIcons />
    </aside>
  );
}
