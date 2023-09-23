'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  oneLight,
  materialDark,
} from 'react-syntax-highlighter/dist/cjs/styles/prism';
import Image from 'next/image';
import { useTheme } from 'next-themes';

const headerStyle =
  'pb-1 border-b border-gray-200 dark:border-slate-700 dark:text-slate-200';

export default function MarkDownPost({ content }: { content: string }) {
  const { theme } = useTheme();

  return (
    <>
      <ReactMarkdown
        className='prose max-w-none dark:text-slate-400'
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                {...props}
                style={theme === 'dark' ? materialDark : oneLight}
                language={match[1]}
                PreTag='div'
                className='bg-gray-200 dark:bg-neutral-800'
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code
                {...props}
                className={`${className} bg-indigo-50 rounded-lg px-2 py-0.5 text-indigo-500 before:hidden after:hidden dark:bg-neutral-800 dark:text-slate-100 font-semibold`}
              >
                {children}
              </code>
            );
          },
          img: (image) => (
            <div className='mx-auto w-5/6 flex items-center justify-center'>
              <Image
                src={image.src || ''}
                alt={image.alt || ''}
                width={500}
                height={300}
                className='w-full max-h-[500px] object-cover'
              />
            </div>
          ),
          a: ({ node, ...props }) => (
            <a {...props} className='text-indigo-500 dark:text-yellow-400' />
          ),
          input: ({ node, ...props }) => (
            <input
              {...props}
              aria-label={props.title ?? ''}
              className='mt-0 mb-0'
            />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              {...props}
              className='py-2 border-indigo-500 bg-gray-50 not-italic dark:bg-neutral-800 dark:text-slate-300 dark:border-yellow-500'
            />
          ),
          pre: ({ node, ...props }) => (
            <pre {...props} className='bg-gray-50 dark:bg-neutral-800' />
          ),
          li: ({ node, ...props }) => (
            <li
              {...props}
              className='marker:text-indigo-500 dark:marker:text-yellow-500'
            />
          ),
          h1: ({ node, ...props }) => <h1 {...props} className={headerStyle} />,
          h2: ({ node, ...props }) => <h2 {...props} className={headerStyle} />,
          h3: ({ node, ...props }) => <h3 {...props} className={headerStyle} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </>
  );
}
