"use client";
import React from "react";
import OcrExtractor from "@/components/ocr-component";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>OCR Extractor</title>
        <meta
          name="description"
          content="OCR Extractor using Next.js, JavaScript, and Tailwind CSS"
        />
      </Head>
      <main className="flex flex-col items-center justify-center min-h-screen">
        <OcrExtractor />
      </main>
    </>
  );
}
