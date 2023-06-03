import React from "react";
import {
  Document,
  Font,
  PDFViewer,
  Page,
  Path,
  StyleSheet,
  Svg,
  Text,
  View,
} from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";

const tw = createTw({
  theme: {
    fontFamily: {
      sans: ["Comic Sans"],
      monospace: ["Monospace"],
    },
    extend: {
      colors: {
        custom: "#bada55",
      },
    },
  },
});

export default function EncryptionPdf() {
  return (
    <PDFViewer style={tw("h-screen bg-white")} width={"100%"} height={"100%"}>
      <Document>
        <Page size="A4" style={tw("flex ")}>
          <View style={tw("w-full bg-[#000] px-10 py-24")}>
            <Logo />
          </View>

          <View style={tw("p-10")}>
            <View style={tw("rounded-md bg-red-50 p-5")}>
              <View style={tw("text")}>
                <View style={tw("mt-2 text-base text-red-500")}>
                  <Text>
                    This is your PGP encryption private key. Encryption keys are
                    generated on the client side and never saved on our
                    database, encrypted or otherwise. We recommend you further
                    encrypt and store this private key to your most trusted
                    password manager (eg. BitWarden) or on a safe place. Secrets
                    cannot be decrypted without this key and you will need this
                    key every-time you login.
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={tw("px-10 rounded-md  ")}>
            <View style={tw("p-10 bg-teal-100")}>
              <Text style={tw("text-base font-bold")}>
                PGP encryption private key
              </Text>
              <View
                style={tw("text-sm border rounded border-teal-400 p-5 mt-3")}
              >
                <Text style={tw("font-mono")}>
                  -----BEGIN PGP PRIVATE KEY BLOCK-----
                </Text>

                <Text style={tw("font-mono")}>
                  xVgEZHgOZBYJKwYBBAHaRw8BAQdAY6O3cPcXwUSdiQVtJpl2NXir5btTPR7U
                  eTug3y3Y3ywAAP0Qs550sJMXGmwEPdnLKGvvI9fEyaWkOXMDutibMLCThBC8
                  zSJEYXJyZWwgWXVuZHQgPGVudmxlc3NAZXhhbXBsZS5jb20+wowEEBYKAD4F
                  gmR4DmQECwkHCAmQVlX2QkvSJIwDFQgKBBYAAgECGQECmwMCHgEWIQRTcHmR
                  UBHxceQbw55WVfZCS9IkjAAArEkBANPmyex8kewS3tUCjjjWNGXSmPfljUNv
                  wzQx8Nucz2G6AP9x+olaWSjricszdYc2EFZwcBoLnTYjDmkwAiBVEipiA8dd
                  BGR4DmQSCisGAQQBl1UBBQEBB0AVD5L8SPiv/ve/w9mUB811ndTGqBTDaFPr
                  xPrGLP7FWwMBCAcAAP9cAMENk8EJaw+HQfXDAYNzug4M1kUj9P/OiTsLTY7W
                  QA8KwngEGBYIACoFgmR4DmQJkFZV9kJL0iSMApsMFiEEU3B5kVAR8XHkG8Oe
                  VlX2QkvSJIwAAEyGAP9sYfc6VlYrrzDu7p8mHkhd89Ku87guD+Vsj82T5hrA
                  XgD/QW4vZLuMziTpb3tfhqbNtItwNteucHIZL4hyl4YHRQI= =88Id
                </Text>
                <Text style={tw("font-mono")}>
                  -----END PGP PRIVATE KEY BLOCK-----
                </Text>
                <textarea cols={5}>test</textarea>
              </View>
            </View>
          </View>
          <View style={tw("px-5")}>
            <View style={tw("p-5 text-sm text-gray-500")}>
              <Text>Generated by Puru Dahal on Jan 01, 2023, at 12:30 AM</Text>
              <Text>Need help? Contact: support@envless.dev</Text>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}

const Logo = () => (
  <Svg style={{ width: 150, height: 50 }} viewBox="0 0 1279 411">
    <Path
      style={{
        stroke: "none",
        fillRule: "nonzero",
        fill: "#fff",
        fillOpacity: 1,
      }}
      d="M184.145 28.809c101.703 0 184.144 82.472 184.144 184.207 0 101.734-82.441 184.207-184.144 184.207C82.445 397.223 0 314.75 0 213.016 0 111.28 82.445 28.809 184.145 28.809Zm0 0"
    ></Path>
    <Path
      style={{
        fill: "none",
        strokeWidth: 302,
        stroke: "#000",
        strokeOpacity: 1,
      }}
      d="M3824.997 2905.526c0-347.352-137.936-680.39-383.528-926.008-245.592-245.565-578.687-383.509-925.995-383.509-347.254 0-680.35 137.944-925.941 383.509-245.592 245.617-383.529 578.656-383.529 926.008ZM1373.904 3558.032c117.201 197.745 284.411 361.136 484.767 473.793 200.355 112.656 426.856 170.548 656.697 167.95 229.841-2.65 454.963-65.738 652.667-182.953 197.757-117.163 361.149-284.371 473.79-484.714"
      transform="scale(.07366 .07368)"
    ></Path>
    <Path
      style={{
        stroke: "none",
        fillRule: "nonzero",
        fill: "#fff",
        fillOpacity: 1,
      }}
      d="M471.992 216.477c-12.402 0-23.074-2.512-32.02-7.536-8.89-5.078-15.745-12.246-20.558-21.511-4.812-9.313-7.219-20.328-7.219-33.043 0-12.407 2.407-23.29 7.22-32.657 4.812-9.367 11.585-16.668 20.323-21.902 8.79-5.23 19.094-7.848 30.918-7.848 7.953 0 15.356 1.282 22.207 3.844 6.907 2.516 12.922 6.309 18.047 11.383 5.18 5.078 9.211 11.461 12.086 19.156 2.879 7.637 4.317 16.586 4.317 26.844v9.184H425.534v-20.723h70.309c0-4.813-1.043-9.078-3.137-12.793-2.094-3.719-4.996-6.621-8.71-8.715-3.661-2.144-7.927-3.219-12.79-3.219-5.078 0-9.574 1.18-13.5 3.532-3.871 2.304-6.906 5.418-9.102 9.343-2.195 3.871-3.32 8.188-3.375 12.954v19.699c0 5.969 1.098 11.12 3.297 15.465 2.25 4.343 5.414 7.691 9.496 10.046 4.079 2.356 8.918 3.532 14.516 3.532 3.715 0 7.113-.52 10.203-1.567 3.086-1.047 5.727-2.617 7.926-4.71 2.195-2.094 3.867-4.657 5.02-7.692l30.917 2.039c-1.57 7.43-4.785 13.922-9.652 19.469-4.812 5.492-11.039 9.785-18.676 12.87-7.586 3.036-16.347 4.556-26.285 4.556Zm110.563-72.063v69.707h-33.426V93.551h31.86v21.27h1.41c2.667-7.012 7.14-12.56 13.417-16.641 6.278-4.133 13.891-6.2 22.836-6.2 8.371 0 15.668 1.832 21.895 5.493 6.226 3.664 11.062 8.898 14.515 15.703 3.454 6.75 5.18 14.808 5.18 24.176v76.77h-33.43v-70.806c.055-7.379-1.828-13.132-5.648-17.27-3.82-4.187-9.078-6.276-15.773-6.276-4.5 0-8.473.964-11.926 2.902-3.403 1.937-6.07 4.762-8.004 8.476-1.887 3.665-2.852 8.086-2.906 13.266Zm212.09-50.863-42.137 120.57H714.84L672.7 93.551h35.312l25.031 86.265h1.254l24.957-86.265Zm50.53-40.192v160.762H811.75V53.36Zm81.708 163.118c-12.395 0-23.067-2.512-32.012-7.536-8.894-5.078-15.746-12.246-20.562-21.511-4.813-9.313-7.22-20.328-7.22-33.043 0-12.407 2.407-23.29 7.22-32.657 4.816-9.367 11.593-16.668 20.328-21.902 8.789-5.23 19.093-7.848 30.914-7.848 7.957 0 15.36 1.282 22.207 3.844 6.91 2.516 12.922 6.309 18.047 11.383 5.18 5.078 9.207 11.461 12.09 19.156 2.878 7.637 4.316 16.586 4.316 26.844v9.184H880.43v-20.723h70.312c0-4.813-1.047-9.078-3.137-12.793-2.093-3.719-4.996-6.621-8.714-8.715-3.66-2.144-7.926-3.219-12.786-3.219-5.078 0-9.578 1.18-13.503 3.532-3.868 2.304-6.903 5.418-9.098 9.343-2.2 3.871-3.32 8.188-3.379 12.954v19.699c0 5.969 1.105 11.12 3.3 15.465 2.247 4.343 5.415 7.691 9.493 10.046 4.082 2.356 8.922 3.532 14.52 3.532 3.71 0 7.113-.52 10.203-1.567 3.086-1.047 5.722-2.617 7.922-4.71 2.195-2.094 3.867-4.657 5.023-7.692l30.918 2.039c-1.57 7.43-4.79 13.922-9.652 19.469-4.817 5.492-11.04 9.785-18.68 12.87-7.586 3.036-16.344 4.556-26.29 4.556Zm177.43-88.543-30.606 1.882c-.523-2.617-1.648-4.972-3.375-7.066-1.73-2.145-4.004-3.848-6.828-5.102-2.774-1.308-6.098-1.96-9.965-1.96-5.176 0-9.547 1.097-13.101 3.296-3.56 2.145-5.34 5.024-5.34 8.633 0 2.88 1.156 5.313 3.453 7.301 2.304 1.988 6.254 3.586 11.851 4.789l21.809 4.395c11.719 2.406 20.457 6.28 26.215 11.617 5.754 5.34 8.633 12.351 8.633 21.039 0 7.902-2.332 14.836-6.989 20.8-4.605 5.965-10.93 10.622-18.988 13.973-8 3.297-17.238 4.946-27.695 4.946-15.965 0-28.668-3.325-38.14-9.97-9.415-6.698-14.938-15.804-16.56-27.316l32.88-1.726c.995 4.863 3.402 8.578 7.218 11.144 3.824 2.512 8.715 3.77 14.672 3.77 5.863 0 10.57-1.125 14.129-3.379 3.61-2.3 5.437-5.258 5.496-8.867-.059-3.035-1.34-5.524-3.844-7.457-2.515-1.988-6.386-3.508-11.617-4.555l-20.875-4.16c-11.77-2.356-20.535-6.438-26.289-12.246-5.7-5.809-8.55-13.211-8.55-22.215 0-7.742 2.09-14.418 6.273-20.016 4.238-5.597 10.18-9.918 17.82-12.953 7.688-3.035 16.684-4.55 26.988-4.55 15.223 0 27.2 3.218 35.946 9.656 8.785 6.433 13.914 15.199 15.379 26.297Zm124.078 0-30.598 1.882a15.89 15.89 0 0 0-3.383-7.066c-1.723-2.145-4-3.848-6.82-5.102-2.777-1.308-6.098-1.96-9.965-1.96-5.188 0-9.555 1.097-13.113 3.296-3.551 2.145-5.332 5.024-5.332 8.633 0 2.88 1.148 5.313 3.457 7.301 2.297 1.988 6.25 3.586 11.843 4.789l21.817 4.395c11.719 2.406 20.453 6.28 26.207 11.617 5.762 5.34 8.633 12.351 8.633 21.039 0 7.902-2.328 14.836-6.985 20.8-4.601 5.965-10.93 10.622-18.988 13.973-8.004 3.297-17.234 4.946-27.703 4.946-15.953 0-28.668-3.325-38.133-9.97-9.418-6.698-14.937-15.804-16.558-27.316l32.882-1.726c.993 4.863 3.395 8.578 7.22 11.144 3.815 2.512 8.706 3.77 14.671 3.77 5.855 0 10.57-1.125 14.129-3.379 3.61-2.3 5.433-5.258 5.488-8.867-.055-3.035-1.336-5.524-3.848-7.457-2.511-1.988-6.378-3.508-11.609-4.555l-20.871-4.16c-11.773-2.356-20.539-6.438-26.289-12.246-5.703-5.809-8.555-13.211-8.555-22.215 0-7.742 2.094-14.418 6.278-20.016 4.234-5.597 10.171-9.918 17.808-12.953 7.692-3.035 16.692-4.55 26.996-4.55 15.227 0 27.203 3.218 35.938 9.656 8.789 6.433 13.914 15.199 15.383 26.297ZM437.465 349.109c-5.809 0-10.817-1.28-15.031-3.847-4.184-2.59-7.414-6.2-9.688-10.832-2.25-4.657-3.375-10.07-3.375-16.246 0-6.176 1.125-11.618 3.375-16.329 2.274-4.738 5.438-8.425 9.492-11.066 4.082-2.672 8.844-4.004 14.282-4.004 3.14 0 6.242.524 9.3 1.57 3.059 1.047 5.844 2.747 8.356 5.102 2.512 2.328 4.512 5.414 6.004 9.262 1.492 3.847 2.238 8.582 2.238 14.207v3.926h-46.457v-8.008H453c0-3.403-.68-6.438-2.04-9.106-1.335-2.668-3.245-4.773-5.73-6.316-2.457-1.547-5.359-2.317-8.71-2.317-3.688 0-6.88.915-9.57 2.747-2.669 1.804-4.723 4.16-6.16 7.066-1.442 2.902-2.161 6.016-2.161 9.34v5.336c0 4.554.785 8.414 2.355 11.582 1.594 3.137 3.805 5.531 6.63 7.18 2.827 1.62 6.109 2.433 9.85 2.433 2.43 0 4.63-.34 6.59-1.02 1.989-.707 3.7-1.753 5.141-3.14 1.438-1.414 2.551-3.164 3.332-5.258l8.95 2.512a19.832 19.832 0 0 1-4.75 8.004c-2.223 2.277-4.97 4.058-8.239 5.34-3.27 1.253-6.945 1.882-11.023 1.882Zm48.297-37.52v36.266H476.5V287.57h8.95v9.418h.784c1.41-3.062 3.555-5.52 6.434-7.379 2.875-1.882 6.59-2.824 11.14-2.824 4.083 0 7.653.836 10.712 2.512 3.062 1.648 5.44 4.16 7.144 7.535 1.7 3.348 2.547 7.586 2.547 12.715v38.308h-9.258v-37.68c0-4.734-1.23-8.425-3.687-11.066-2.461-2.671-5.832-4.004-10.125-4.004-2.954 0-5.598.641-7.926 1.922-2.3 1.282-4.117 3.153-5.453 5.614-1.332 2.457-2 5.441-2 8.949Zm79.855 37.52c-5.652 0-10.515-1.332-14.597-4.004-4.079-2.668-7.22-6.343-9.415-11.027-2.199-4.683-3.296-10.035-3.296-16.05 0-6.126 1.125-11.528 3.375-16.212 2.273-4.71 5.441-8.386 9.492-11.027 4.082-2.672 8.844-4.004 14.281-4.004 4.238 0 8.059.785 11.457 2.352 3.402 1.57 6.188 3.77 8.36 6.593 2.171 2.829 3.515 6.125 4.038 9.895h-9.257c-.707-2.75-2.278-5.184-4.707-7.3-2.407-2.15-5.653-3.22-9.73-3.22-3.61 0-6.778.942-9.497 2.825-2.695 1.86-4.8 4.488-6.316 7.89-1.492 3.375-2.239 7.34-2.239 11.89 0 4.657.735 8.716 2.2 12.169 1.488 3.453 3.582 6.137 6.277 8.047 2.719 1.91 5.91 2.863 9.574 2.863 2.406 0 4.59-.418 6.551-1.254 1.96-.84 3.621-2.043 4.984-3.613 1.36-1.57 2.328-3.453 2.903-5.652h9.258c-.524 3.558-1.817 6.765-3.883 9.617-2.04 2.824-4.746 5.078-8.121 6.75-3.348 1.648-7.246 2.472-11.692 2.472Zm37.235-1.254V287.57h8.945v9.106h.629c1.097-2.985 3.086-5.406 5.96-7.262 2.88-1.86 6.122-2.789 9.731-2.789.68 0 1.531.016 2.551.043 1.02.023 1.793.062 2.316.117v9.418c-.316-.078-1.035-.195-2.16-.351a21.16 21.16 0 0 0-3.492-.278c-2.93 0-5.543.617-7.844 1.848-2.277 1.203-4.082 2.875-5.418 5.023-1.308 2.118-1.96 4.54-1.96 7.258v38.152Zm48.906 22.606c-1.57 0-2.969-.129-4.2-.39-1.23-.239-2.078-.473-2.55-.708l2.355-8.164c2.25.574 4.239.785 5.965.63 1.727-.161 3.254-.93 4.59-2.317 1.36-1.36 2.602-3.575 3.727-6.633l1.726-4.711-22.285-60.598h10.043l16.637 48.04h.629l16.632-48.04h10.047l-25.582 69.075c-1.152 3.117-2.578 5.69-4.277 7.734-1.7 2.066-3.676 3.598-5.926 4.59-2.223.996-4.734 1.492-7.531 1.492Zm55.539 0v-82.89h8.945v9.574h1.098c.68-1.047 1.62-2.38 2.824-4.004 1.23-1.649 2.98-3.114 5.258-4.395 2.3-1.308 5.414-1.96 9.34-1.96 5.074 0 9.547 1.269 13.414 3.804 3.875 2.539 6.894 6.137 9.066 10.793 2.172 4.66 3.258 10.152 3.258 16.484 0 6.387-1.086 11.918-3.258 16.602-2.172 4.66-5.18 8.27-9.023 10.836-3.844 2.535-8.278 3.804-13.301 3.804-3.871 0-6.973-.64-9.3-1.921-2.329-1.31-4.118-2.79-5.376-4.438-1.254-1.672-2.222-3.059-2.902-4.16h-.785v31.87Zm9.101-52.75c0 4.555.668 8.57 2 12.05 1.336 3.454 3.286 6.16 5.848 8.126 2.563 1.933 5.7 2.902 9.414 2.902 3.871 0 7.106-1.02 9.692-3.062 2.613-2.067 4.582-4.84 5.882-8.32 1.336-3.505 2.004-7.403 2.004-11.696 0-4.238-.656-8.059-1.957-11.461-1.281-3.426-3.234-6.133-5.851-8.125-2.59-2.012-5.848-3.02-9.77-3.02-3.765 0-6.93.954-9.492 2.864-2.566 1.883-4.5 4.527-5.809 7.93-1.308 3.374-1.96 7.312-1.96 11.812Zm84.434-30.14v7.847h-31.23v-7.848Zm-22.125-14.446h9.258v57.46c0 2.618.375 4.58 1.137 5.888.785 1.28 1.78 2.144 2.98 2.59 1.23.417 2.527.628 3.883.628 1.023 0 1.863-.054 2.512-.156l1.57-.316 1.883 8.32c-.625.238-1.5.473-2.63.707-1.124.262-2.546.395-4.273.395-2.62 0-5.183-.563-7.687-1.688-2.488-1.125-4.55-2.84-6.203-5.144-1.621-2.301-2.43-5.207-2.43-8.711Zm36.055 74.73V287.57h9.258v60.285Zm4.707-70.335c-1.805 0-3.36-.614-4.668-1.844-1.285-1.23-1.926-2.707-1.926-4.434 0-1.726.64-3.207 1.926-4.437 1.308-1.227 2.863-1.844 4.668-1.844 1.804 0 3.351.617 4.633 1.844 1.304 1.23 1.96 2.71 1.96 4.437 0 1.727-.656 3.203-1.96 4.434-1.282 1.23-2.829 1.844-4.633 1.844Zm45.992 71.59c-5.438 0-10.207-1.294-14.32-3.887-4.078-2.59-7.27-6.211-9.575-10.871-2.277-4.657-3.41-10.098-3.41-16.325 0-6.28 1.133-11.761 3.41-16.445 2.305-4.684 5.496-8.32 9.575-10.914 4.113-2.59 8.882-3.883 14.32-3.883 5.445 0 10.203 1.293 14.281 3.883 4.113 2.594 7.301 6.23 9.578 10.914 2.297 4.684 3.453 10.164 3.453 16.445 0 6.227-1.156 11.668-3.453 16.325-2.277 4.66-5.465 8.28-9.578 10.87-4.078 2.594-8.836 3.887-14.281 3.887Zm0-8.32c4.133 0 7.535-1.06 10.203-3.18 2.664-2.118 4.649-4.907 5.93-8.36 1.281-3.453 1.922-7.195 1.922-11.223 0-4.03-.641-7.785-1.922-11.265-1.282-3.48-3.266-6.293-5.93-8.438-2.668-2.148-6.07-3.219-10.203-3.219-4.133 0-7.527 1.07-10.203 3.22-2.664 2.144-4.64 4.956-5.922 8.437-1.281 3.48-1.922 7.234-1.922 11.265 0 4.028.64 7.77 1.922 11.223 1.281 3.453 3.258 6.242 5.922 8.36 2.676 2.12 6.07 3.18 10.203 3.18Zm50.707-29.2v36.265h-9.258V287.57h8.942v9.418h.789c1.406-3.062 3.554-5.52 6.43-7.379 2.878-1.882 6.59-2.824 11.144-2.824 4.078 0 7.652.836 10.707 2.512 3.066 1.648 5.445 4.16 7.144 7.535 1.704 3.348 2.551 7.586 2.551 12.715v38.308h-9.258v-37.68c0-4.734-1.23-8.425-3.691-11.066-2.461-2.671-5.832-4.004-10.121-4.004-2.953 0-5.598.641-7.926 1.922-2.305 1.282-4.117 3.153-5.457 5.614-1.332 2.457-1.996 5.441-1.996 8.949Zm95.078 14.285-.164-11.46h1.887l26.37-26.845h11.454l-28.094 28.414h-.781Zm-8.633 21.98v-80.382h9.258v80.382Zm38.293 0-23.539-29.828 6.59-6.437 28.723 36.265Zm44.586 1.254c-5.804 0-10.812-1.28-15.027-3.847-4.184-2.59-7.41-6.2-9.684-10.832-2.254-4.657-3.375-10.07-3.375-16.246 0-6.176 1.121-11.618 3.375-16.329 2.274-4.738 5.434-8.425 9.492-11.066 4.082-2.672 8.84-4.004 14.286-4.004 3.136 0 6.238.524 9.293 1.57 3.066 1.047 5.851 2.747 8.363 5.102 2.512 2.328 4.508 5.414 6 9.262 1.488 3.847 2.234 8.582 2.234 14.207v3.926h-46.457v-8.008h37.043c0-3.403-.68-6.438-2.039-9.106-1.336-2.668-3.242-4.773-5.734-6.316-2.457-1.547-5.36-2.317-8.703-2.317-3.692 0-6.883.915-9.579 2.747-2.664 1.804-4.718 4.16-6.156 7.066-1.445 2.902-2.16 6.016-2.16 9.34v5.336c0 4.554.781 8.414 2.352 11.582 1.597 3.137 3.808 5.531 6.629 7.18 2.828 1.62 6.113 2.433 9.847 2.433 2.438 0 4.633-.34 6.594-1.02 1.988-.707 3.703-1.753 5.14-3.14 1.438-1.414 2.547-3.164 3.336-5.258l8.942 2.512c-.934 3.035-2.52 5.703-4.742 8.004-2.223 2.277-4.973 4.058-8.242 5.34-3.27 1.253-6.946 1.882-11.028 1.882Zm43.172 21.352c-1.57 0-2.969-.129-4.2-.39-1.23-.239-2.077-.473-2.546-.708l2.355-8.164c2.247.574 4.235.785 5.961.63 1.73-.161 3.254-.93 4.586-2.317 1.364-1.36 2.61-3.575 3.735-6.633l1.726-4.711-22.289-60.598h10.047l16.629 48.04h.637l16.629-48.04h10.046l-25.578 69.075c-1.152 3.117-2.578 5.69-4.28 7.734-1.704 2.066-3.677 3.598-5.923 4.59-2.226.996-4.738 1.492-7.535 1.492Zm98.23-69.39-8.324 2.355c-.523-1.387-1.289-2.735-2.312-4.043-.996-1.336-2.356-2.434-4.082-3.297-1.723-.863-3.934-1.297-6.63-1.297-3.687 0-6.76.852-9.222 2.55-2.43 1.677-3.644 3.81-3.644 6.4 0 2.304.832 4.12 2.511 5.456 1.672 1.332 4.29 2.446 7.844 3.336l8.942 2.2c5.394 1.304 9.406 3.308 12.05 6.003 2.637 2.668 3.965 6.11 3.965 10.32 0 3.454-.996 6.544-2.984 9.266-1.957 2.72-4.707 4.864-8.242 6.434-3.528 1.57-7.637 2.355-12.317 2.355-6.148 0-11.23-1.332-15.262-4.004-4.027-2.668-6.578-6.566-7.652-11.695l8.79-2.195c.84 3.242 2.421 5.676 4.75 7.297 2.347 1.625 5.421 2.433 9.214 2.433 4.316 0 7.75-.914 10.281-2.746 2.563-1.86 3.848-4.082 3.848-6.672 0-2.093-.73-3.847-2.195-5.261-1.47-1.438-3.723-2.512-6.75-3.215l-10.047-2.356c-5.516-1.308-9.574-3.336-12.16-6.086-2.563-2.773-3.844-6.238-3.844-10.398 0-3.402.95-6.41 2.855-9.027 1.938-2.618 4.57-4.672 7.891-6.164 3.352-1.489 7.145-2.235 11.379-2.235 5.969 0 10.644 1.309 14.047 3.922 3.426 2.617 5.855 6.07 7.3 10.363Zm0 0"
    ></Path>
  </Svg>
);
