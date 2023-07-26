'use client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import Image from 'next/image';

export default function MarkDownPost({ content }: { content: string }) {
  return (
    <ReactMarkdown
      className='prose max-w-none'
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              {...props}
              style={materialDark}
              language={match[1]}
              PreTag='div'
              showLineNumbers={true}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code {...props} className={className}>
              {children}
            </code>
          );
        },
        img: (image) => (
          <Image
            className='w-full max-h-96 object-cover'
            src={image.src || ''}
            alt={image.alt || ''}
            width={500}
            height={320}
          />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
