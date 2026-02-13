"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { mockReviewQuestions } from "@/features/customers/mock-data";
import { ReviewSettings } from "@/features/customers/components/review-settings";
import { ReviewQuestion } from "@/features/customers/types";

export default function ReviewSettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = (questions: ReviewQuestion[]) => {
    // In real app, this would call an API
    console.log('Saving questions:', questions);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pengaturan Ulasan"
        description="Atur pertanyaan yang tampil saat pelanggan memberi ulasan"
        breadcrumbs={[
          { label: "Home", href: "/dashboard" },
          { label: "Pelanggan", href: "/customers" },
          { label: "Ulasan", href: "/customers/reviews" },
          { label: "Pengaturan" },
        ]}
      />

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
          <span className="font-medium">✓</span> Perubahan berhasil disimpan
        </div>
      )}

      <div className="bg-white rounded-xl border border-border p-6">
        <ReviewSettings
          questions={mockReviewQuestions}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
