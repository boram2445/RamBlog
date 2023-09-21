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

      const navIndex = findfirstIntersecting(visibleHeaders);
      console.log(visibleHeaders, navIndex, ids[navIndex]);
      setActiveId(ids[navIndex]);
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

function findfirstIntersecting(visibleHeaders: boolean[]) {
  const index = visibleHeaders.indexOf(true);
  return index >= 0 ? index : visibleHeaders.length - 1;
}
