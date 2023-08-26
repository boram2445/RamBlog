'use client';

import { useEffect, useState } from 'react';

export default function Toc() {
  // 목차 리스트
  const [indexList, setIndexList] = useState<{ index: string; size: string }[]>(
    []
  );
  //현재 보이는 목차
  const [currentIndex, setCurrentIndex] = useState<string>('');

  useEffect(() => {
    // toastui-editor-contents에서 h1, h2, h3 찾기
    const headerNodeList = document
      .querySelector('.toastui-editor-contents')
      ?.querySelectorAll('h1, h2, h3') as NodeListOf<Element>;

    // IntersectionObserver들이 들어갈 배열 ( 이벤트 해제를 위해 )
    const IOList: IntersectionObserver[] = [];
    let IO: IntersectionObserver;

    [...headerNodeList].forEach((node) => {
      //header에 id로 컨텐츠내용 등록
      const index = node.textContent as string;

      const size = node.nodeName[1];
      node.id = index;

      //이렇게 처리해주지 않으면 반복됨
      setIndexList((prev) => {
        if (prev.map((item) => item.index).includes(index)) return prev;
        return [...prev, { index, size }];
      });

      IO = new IntersectionObserver(
        ([
          {
            isIntersecting,
            target: { textContent },
          },
        ]) => {
          if (!isIntersecting) return;
          setCurrentIndex(textContent!);
        },
        { threshold: 0.6 }
      );

      IO.observe(node);

      // 이벤트 해제를 위해 등록
      IOList.push(IO);
    });

    // 이벤트 해제
    return () => IOList.forEach((IO) => IO.disconnect());
  }, []);

  return (
    <aside className='pl-2 border-l border-gray-200'>
      <ul>
        {indexList?.map(({ index: text, size }, index) => (
          <li
            key={index}
            className={`${
              currentIndex === text && 'text-blue-500 font-semibold'
            } pl-${size} hover:text-blue-300`}
          >
            <a href={`#${text}`}>{text}</a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
