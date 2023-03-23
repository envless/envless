/* eslint-env node */
// https://envless.dev/api/og?page=<page>&title=<title>
import { ImageResponse } from "@vercel/og";
import { truncate } from "lodash";

export const config = {
  runtime: "edge",
};

const font = fetch(new URL("./Inter-SemiBold.otf", import.meta.url)).then(
  (res) => res.arrayBuffer(),
);

export default async function (req) {
  const inter = await font;
  const { searchParams } = new URL(req.url);
  const hasTitle = searchParams.has("title");
  const hasPage = searchParams.has("page");
  const page = hasPage ? searchParams.get("page") : "envless.dev";

  const title = hasTitle
    ? searchParams.get("title")
    : "The most secure, open source & frictionless SecretOps platform";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: "#030303",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, #333 2%, transparent 0%), radial-gradient(circle at 75px 75px, #333 2%, transparent 0%)",
          backgroundSize: "100px 100px",
          backgroundPosition: "-30px -10px",
          fontWeight: 600,
          color: "white",
        }}
      >
        <svg
          style={{ position: "absolute", top: 70, left: 80 }}
          width="50"
          height="50"
          viewBox="0 0 2600 2600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2225 1311C2225 1068.33 2128.6 835.592 1957 663.997C1785.41 492.401 1552.67 395.999 1310 395.999C1067.33 395.999 834.593 492.401 662.997 663.996C491.402 835.592 395 1068.33 395 1311L1310 1311H2225Z"
            stroke="white"
            stroke-width="302"
          />
          <path
            d="M512.287 1766.95C594.182 1905.12 711.004 2019.3 851.011 2098.01C991.019 2176.72 1149.28 2217.19 1309.88 2215.35C1470.49 2213.51 1627.78 2169.43 1765.95 2087.54C1904.12 2005.64 2018.3 1888.82 2097.01 1748.81"
            stroke="white"
            stroke-width="302"
          />
        </svg>
        <p
          style={{
            position: "absolute",
            bottom: 70,
            left: 80,
            margin: 0,
            fontSize: 30,
            letterSpacing: -1,
          }}
        >
          {page}
        </p>
        <h1
          style={{
            fontSize: 60,
            padding: "0 80px 0 80px",
            lineHeight: 1.1,
            textShadow: "0 2px 30px #000",
            backgroundImage: "linear-gradient(90deg, #fff 40%, #aaa)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {truncate(title as string, { length: 65 })}
        </h1>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "inter",
          data: inter,
          style: "normal",
        },
      ],
    },
  );
}
