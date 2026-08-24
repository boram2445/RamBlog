import Link from 'next/link';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';

// 현재 페이지 좌우로 몇 개까지 번호를 노출할지
const SIBLINGS = 1;

type Props = {
  currentPage: number;
  totalPages: number;
  basePath: string;
  /** page 외에 보존할 쿼리 (예: { tag }) */
  query?: Record<string, string>;
};

const itemStyle =
  'w-8 h-8 flex items-center justify-center rounded-full text-sm';
const inactiveStyle =
  'text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:text-slate-500 dark:hover:bg-neutral-700 dark:hover:text-slate-300';
const disabledStyle = 'text-gray-200 dark:text-neutral-700';

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  query,
}: Props) {
  if (totalPages <= 1) return null;

  // 1페이지는 ?page=1 없이 canonical URL을 유지한다
  const hrefFor = (page: number) => {
    const params = new URLSearchParams(query);
    if (page > 1) params.set('page', String(page));
    const queryString = params.toString();
    return queryString ? `${basePath}?${queryString}` : basePath;
  };

  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;

  return (
    <nav
      aria-label='포스트 목록 페이지네이션'
      className='my-8 flex justify-center'
    >
      <ul className='flex items-center gap-1'>
        <li>
          {isFirst ? (
            <span
              aria-hidden='true'
              className={`${itemStyle} ${disabledStyle}`}
            >
              <AiOutlineLeft className='w-3 h-3' />
            </span>
          ) : (
            <Link
              href={hrefFor(currentPage - 1)}
              aria-label='이전 페이지'
              className={`${itemStyle} ${inactiveStyle}`}
            >
              <AiOutlineLeft className='w-3 h-3' />
            </Link>
          )}
        </li>

        {getPageItems(currentPage, totalPages).map((item, index) =>
          item === 'ellipsis' ? (
            <li key={`ellipsis-${index}`}>
              <span
                aria-hidden='true'
                className={`${itemStyle} text-gray-400 dark:text-slate-500`}
              >
                …
              </span>
            </li>
          ) : (
            <li key={item}>
              <Link
                href={hrefFor(item)}
                aria-current={item === currentPage ? 'page' : undefined}
                className={`${itemStyle} ${
                  item === currentPage
                    ? 'text-indigo-500 font-semibold'
                    : inactiveStyle
                }`}
              >
                {item}
              </Link>
            </li>
          )
        )}

        <li>
          {isLast ? (
            <span
              aria-hidden='true'
              className={`${itemStyle} ${disabledStyle}`}
            >
              <AiOutlineRight className='w-3 h-3' />
            </span>
          ) : (
            <Link
              href={hrefFor(currentPage + 1)}
              aria-label='다음 페이지'
              className={`${itemStyle} ${inactiveStyle}`}
            >
              <AiOutlineRight className='w-3 h-3' />
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}

// 1 … cur-1 cur cur+1 … last — 인접하지 않은 구간에만 생략표를 끼운다
function getPageItems(
  current: number,
  total: number
): (number | 'ellipsis')[] {
  const pages = new Set<number>([1, total]);
  for (let page = current - SIBLINGS; page <= current + SIBLINGS; page++) {
    if (page >= 1 && page <= total) pages.add(page);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const items: (number | 'ellipsis')[] = [];
  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) items.push('ellipsis');
    items.push(page);
  });

  return items;
}
