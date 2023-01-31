import dynamic from "next/dynamic";
import Zoom from "react-medium-image-zoom";
import remarkGfm from "remark-gfm";
import Code from "@/components/theme/Code";

interface MarkdownProps {
  remarkPlugins: any;
  children: string;
  components: any;
}

const ReactMarkdown = dynamic<MarkdownProps>(
  () =>
    import("react-markdown").then((module) => module.default) as Promise<
      React.ComponentType<MarkdownProps>
    >,
  {
    ssr: false,
  },
);

export default function Markdown({ children }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      // eslint-disable-next-line react/no-children-prop
      children={children}
      components={{
        code: ({ node, inline, className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || "");
          const lang = match && match[1];

          return !inline && match ? (
            <Code
              className="my-10 mx-3"
              language={lang as string}
              code={children as string}
            />
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },

        img: ({ node, ...props }) => {
          return (
            <Zoom>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                {...props}
                alt="Changelog image"
                className="my-10 rounded-md"
              />
            </Zoom>
          );
        },

        h1: ({ ...props }) => {
          const { children } = props as any;
          return (
            <h1
              {...props}
              className="mt-10 mb-2 text-2xl tracking-tight md:text-4xl"
            >
              {children}
            </h1>
          );
        },

        h2: ({ ...props }) => {
          const { children } = props as any;
          return (
            <h1
              {...props}
              className="mt-10 mb-2 text-xl tracking-tight md:text-3xl"
            >
              {children}
            </h1>
          );
        },

        h3: ({ ...props }) => {
          const { children } = props as any;
          return (
            <h1
              {...props}
              className="mt-10 mb-2 text-lg tracking-tight md:text-2xl"
            >
              {children}
            </h1>
          );
        },

        ul: ({ ...props }) => {
          const { children } = props as any;
          return (
            <ul {...props} className="ml-3 list-inside list-disc">
              {children}
            </ul>
          );
        },

        p: ({ node, ...props }) => {
          const { children } = props as any;
          return (
            <p {...props} className="mt-5">
              {children}
            </p>
          );
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

          return (
            <a
              {...props}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-300"
            />
          );
        },
      }}
    />
  );
}
