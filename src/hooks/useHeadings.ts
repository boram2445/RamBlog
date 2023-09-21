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
    setHeadings(headerArray);
  }, []);

  return headings;
}
