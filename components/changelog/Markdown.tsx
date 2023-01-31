import dynamic from "next/dynamic";
import remarkGfm from 'remark-gfm';
import Link from 'next/link';

const ReactMarkdown = dynamic(() => import('react-markdown'), {
  ssr: false,
  loading: () => 'Loading...',
})

export default function Markdown({ children }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      children={children}
      components={{
        li: ({ node, ...props }) => {
          const { children } = props as any;
          debugger
        },

        a: ({ node, ...props }) => {
          const { href } = props as any;

          const pullRequestRegex = /^https:\/\/github.com\/(.*?)\/pull\/(\d+)/;
          const pullRequestMatch = pullRequestRegex.exec(href);

          if (pullRequestMatch) {
            const [, repo, pr] = pullRequestMatch;
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-300"
              >
                #{pr}
              </a>
            );
          }

          if (href.startsWith("/")) {
            return <a {...props} className="text-teal-300" />;
          }

          if(href.startsWith(""))

          return <a {...props} target="_blank" rel="noopener noreferrer" className="text-teal-300" />;
        },
      }}
    />
  );
}
