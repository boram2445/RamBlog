import { useEffect, useRef, useState } from 'react';

export function useScrollSpy(ids: string[], options?: { rootMargin: string }) {
  const [activeId, setActiveId] = useState<string>();
  const observer = useRef() as any;

  useEffect(() => {
    const elements = ids.map((id) => document.getElementById(id));
    observer.current?.disconnect();

    const visibleHeaders = elements.map(() => false);

    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const index = ids.indexOf(entry.target.id);
        visibleHeaders[index] = entry.isIntersecting;
      });

      const navIndex = visibleHeaders.indexOf(true); //첫번째 header 찾기
      navIndex !== -1 && setActiveId(ids[navIndex]); //header 발견시 변경, 없으면 이전값 유지
    }, options);

    elements.forEach((el) => {
      if (el) {
        observer.current?.observe(el);
      }
    });

    return () => observer.current?.disconnect();
  }, [ids, options]);

  return activeId;
}
