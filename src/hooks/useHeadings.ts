import { useEffect, useState } from 'react';

export function useHeadings() {
  const [headings, setHeadings] = useState<{ text: string; level: string }[]>(
    []
  );

  useEffect(() => {
    const headerNodeList = document
      .querySelector('#content')
      ?.querySelectorAll('h1, h2, h3') as NodeListOf<Element>;

    const headerArray = Array.from(headerNodeList).map((node) => {
      const text = node.textContent as string;
      node.id = text;
      return {
        text,
        level: node.nodeName[1],
      };
    });
    // 외부 DOM(#content)을 1회 읽어 목차 state 초기화 — 동기화 effect의 정당한 사용
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHeadings(headerArray);
  }, []);

  return headings;
}
