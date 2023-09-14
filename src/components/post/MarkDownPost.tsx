'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import Image from 'next/image';

export default function MarkDownPost({ content }: { content: string }) {
  return (
    <>
      <ReactMarkdown
        className='prose max-w-none'
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                {...props}
                style={oneLight}
                language={match[1]}
                PreTag='div'
                className='bg-gray-200'
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code
                {...props}
                className={`${className} bg-gray-50 text-indigo-500  before:hidden after:hidden`}
              >
                {children}
              </code>
            );
          },
          img: (image) => (
            <Image
              className='max-height-[500px] object-cover'
              src={image.src || ''}
              alt={image.alt || ''}
              width={500}
              height={300}
            />
          ),
          a: ({ node, ...props }) => (
            <a {...props} className='text-indigo-500 no-underline' />
          ),
          input: ({ node, ...props }) => (
            <input {...props} aria-label={props.title ?? ''} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              {...props}
              className='py-2 border-indigo-500 bg-gray-50 not-italic'
            />
          ),
          pre: ({ node, ...props }) => (
            <pre {...props} className='bg-gray-50' />
          ),
          li: ({ node, ...props }) => (
            <li {...props} className='marker:text-indigo-500' />
          ),
          h1: ({ node, ...props }) => (
            <h1 {...props} className='pb-1 border-b border-gray-200 ' />
          ),
          h2: ({ node, ...props }) => (
            <h2 {...props} className='pb-1 border-b border-gray-200' />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </>
  );
}
