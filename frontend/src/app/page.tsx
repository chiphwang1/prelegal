"use client";

import { useState } from "react";
import { NdaFormData, defaultFormData } from "@/types/nda";
import NdaForm from "@/components/NdaForm";
import NdaPreview from "@/components/NdaPreview";
import DownloadButton from "@/components/DownloadButton";

export default function Home() {
  const [formData, setFormData] = useState<NdaFormData>(defaultFormData);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Mutual NDA Creator
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Fill in the details below to generate your Mutual Non-Disclosure
            Agreement based on the Common Paper standard template.
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-10">
        <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            NDA Details
          </h2>
          <NdaForm data={formData} onChange={setFormData} />
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Document Preview
            </h2>
            <DownloadButton data={formData} />
          </div>
          <NdaPreview data={formData} />
        </section>
      </main>

      <footer className="border-t border-gray-200 bg-white mt-12">
        <div className="max-w-4xl mx-auto px-6 py-4 text-center text-xs text-gray-400">
          Based on Common Paper Mutual NDA (Version 1.0) &middot; CC BY 4.0
        </div>
      </footer>
    </div>
  );
}
