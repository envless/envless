import Link from "next/link";
import Zoom from "react-medium-image-zoom";
import Embedable from "@/components/Embedable";
import Code from "@/components/theme/Code";

export const RenderBlocks = ({ blocks }) => {
  return blocks.map((block) => {
    const { type, id } = block;
    const value = block[type];

    switch (type) {
      case "divider":
        return (
          <div className="pt-3" key={id}>
            <hr className="w-full border" />
          </div>
        );

      case "paragraph":
        return (
          <div className="pt-3 text-lg" key={id}>
            <Text text={value.rich_text} id={id} />
          </div>
        );

      case "heading_1":
        return (
          <div className="pt-3" key={id}>
            <Heading text={value.rich_text} id={id} level={type} />
          </div>
        );

      case "heading_2":
        return (
          <div className="pt-3" key={id}>
            <Heading text={value.rich_text} id={id} level={type} />
          </div>
        );

      case "heading_3":
        return (
          <div className="pt-3">
            <Heading text={value.rich_text} id={id} level={type} key={id} />
          </div>
        );

      case "quote":
        return (
          <div className="pt-3" key={id}>
            <blockquote className="border-l-2 border-l-black pl-4">
              <SpanText id={id} text={value.rich_text} />
            </blockquote>
          </div>
        );

      case "bulleted_list_item":
      case "numbered_list_item":
        return <ListItem key={id} value={value} id={id} />;

      case "to_do":
        return <ToDo key={id} value={value} />;

      case "toggle":
        return <Toggle key={id} value={value} />;

      case "image":
        const imageSrc =
          value.type === "external" ? value.external.url : value.file.url;
        const caption = value.caption.length ? value.caption[0].plain_text : "";
        return (
          <figure key={id}>
            <Zoom>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt={caption} src={imageSrc} />
            </Zoom>
            {caption && <figcaption className="mt-2">{caption}</figcaption>}
          </figure>
        );

      case "code":
        const language = value.language;
        const code = value.rich_text[0].plain_text;
        return (
          <div key={id}>
            <Code language={language} code={code} />
          </div>
        );

      case "video":
        return (
          <div key={id}>
            <Embedable url={value.external.url} />
          </div>
        );

      case "embed":
        return (
          <div key={id}>
            <Embedable url={value.url} />
          </div>
        );

      default:
        return `Unsupported block (${
          type === "unsupported" ? "unsupported by Notion API" : type
        })`;
    }
  });
};

const SpanText = ({ text, id }) => {
  if (!text) return null;

  return text.map((value, i) => {
    const {
      annotations: { bold, code, color, italic, strikethrough, underline },
      text,
    } = value;

    return (
      <span
        key={id + i}
        className={[
          "leading-relaxed text-lighter",
          bold ? "font-bold" : "",
          code
            ? "rounded bg-dark py-1 px-3 font-mono text-sm text-red-500"
            : "",
          italic ? "italic" : "",
          strikethrough ? "line-through" : "",
          underline ? "underline" : "",
        ].join(" ")}
        style={color !== "default" ? { color } : {}}
      >
        {text.link ? (
          <Link
            href={text.link.url}
            className="break-all text-teal-300 hover:underline"
          >
            {text.content}
          </Link>
        ) : (
          text.content
        )}
      </span>
    );
  });
};

const Text = ({ text, id }) => {
  return (
    <p className="mb-4">
      <SpanText text={text} id={id} />
    </p>
  );
};

const ListItem = ({ value, id }) => {
  return (
    <li>
      <SpanText text={value.rich_text} id={id} />
    </li>
  );
};

const Heading = ({ text, level }) => {
  switch (level) {
    case "heading_1":
      return (
        <h1 className="my-2 text-3xl font-semibold tracking-tight md:text-5xl">
          <SpanText text={text} />
        </h1>
      );
    case "heading_2":
      return (
        <h2 className="my-2 text-2xl font-semibold tracking-tight md:text-3xl">
          <SpanText text={text} />
        </h2>
      );
    case "heading_3":
      return (
        <h3 className="my-2 text-xl font-semibold tracking-tight md:text-2xl">
          <SpanText text={text} />
        </h3>
      );
    default:
      return null;
  }
};

const ToDo = ({ id, value }) => {
  return (
    <div>
      <label htmlFor={id}>
        <input type="checkbox" id={id} defaultChecked={value.checked} />{" "}
        <SpanText text={value.rich_text} />
      </label>
    </div>
  );
};

const Toggle = ({ value }) => {
  return (
    <details>
      <summary className="cursor-pointer">
        {value.rich_text[0].text.content}
      </summary>
      {value.children?.map((block) => {
        if (block.type === "paragraph") {
          return (
            <Text
              key={block.id}
              text={block.paragraph.rich_text}
              id={block.id}
            />
          );
        }
      })}
    </details>
  );
};
