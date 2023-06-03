"use client";

import dynamic from "next/dynamic";

const PdfDocument = dynamic(() => import("@/components/auth/EncryptionPdf"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export default function EncryptionPage() {
  return <PdfDocument />;
}

export async function getServerSideProps(context) {
  return {
    props: {},
  };
}
