import { NextApiRequest, NextApiResponse } from "next";
// import { env } from "@/env/index.mjs";
import { generateGradient } from "@/utils/generateGradient";
import { renderToPipeableStream, renderToStaticMarkup } from "react-dom/server";
import svg2img from "svg2img";

// This code is part of the Vercel Avatar service, which is built on Next.js.
// It generates a gradient based on the given string, using a hash function to derive
// a set of random colors that are used to create the gradient.

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { name, text, size } = req.query;
  const sizeNum = Number(size) || 120;
  const [username, type] = (name as string)?.split(".") || [];
  const fileType = type?.includes("svg") ? "svg" : "png";

  // Check if the request comes from our server
  /*   const origin = req.headers.origin;
  const expectedOrigin = env.BASE_URL; // And gravatar host :(

  if (origin !== expectedOrigin) {
    res.status(403).send("Forbidden");
    return;
  }
 */
  const gradient = generateGradient(username || Math.random() + "");

  const avatar = (
    <svg
      width={sizeNum}
      height={sizeNum}
      viewBox={`0 0 ${sizeNum} ${sizeNum}`}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={gradient.fromColor} />
            <stop offset="100%" stopColor={gradient.toColor} />
          </linearGradient>
        </defs>
        <rect
          fill="url(#gradient)"
          x="0"
          y="0"
          width={sizeNum}
          height={sizeNum}
        />
        {text && (
          <text
            x="50%"
            y="50%"
            alignmentBaseline="central"
            dominantBaseline="central"
            textAnchor="middle"
            fill="#fff"
            fontFamily="sans-serif"
            fontSize={(sizeNum * 0.9) / text.length}
          >
            {text}
          </text>
        )}
      </g>
    </svg>
  );

  if (fileType === "svg") {
    const stream = renderToPipeableStream(avatar);
    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=604800, immutable");

    return stream.pipe(res);
  } else {
    const pngBuffer = await new Promise<Buffer>((resolve, reject) => {
      svg2img(
        renderToStaticMarkup(avatar),
        {
          resvg: {
            fitTo: { mode: "width", value: sizeNum },
          },
        },
        (error, buffer) => {
          if (error) {
            reject(error);
          } else {
            resolve(buffer);
          }
        },
      );
    });
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=604800, immutable");
    res.send(pngBuffer);
  }
}
