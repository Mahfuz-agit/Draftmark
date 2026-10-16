import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { MermaidRenderer } from './MermaidRenderer';

interface LivePreviewProps {
  content: string;
}

export const LivePreview: React.FC<LivePreviewProps> = ({ content }) => {
  return (
    <div className="h-full overflow-y-auto p-6 md:p-8 prose dark:prose-invert max-w-none transition-colors duration-200">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';

            if (!inline && language === 'mermaid') {
              return <MermaidRenderer chart={String(children).replace(/\n$/, '')} />;
            }

            return !inline ? (
              <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 overflow-x-auto text-sm font-mono border border-slate-800">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            ) : (
              <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-rose-500 font-mono text-sm" {...props}>
                {children}
              </code>
            );
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full divide-y divide-slate-300 dark:divide-slate-700 border border-slate-200 dark:border-slate-800 rounded-lg">
                  {children}
                </table>
              </div>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};