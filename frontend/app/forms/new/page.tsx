"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function NewFormPage() {
  const router = useRouter();

  useEffect(() => {
    async function initForm() {
      try {
        const newForm = await api.createForm({ title: "Untitled form" });
        router.replace(`/forms/${newForm.id}/builder`);
      } catch (e) {
        router.replace("/forms");
      }
    }
    initForm();
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
      <Loader2 className="w-8 h-8 text-slate-900 animate-spin mb-3" />
      <p className="text-sm font-semibold text-slate-700">Creating new form...</p>
    </div>
  );
}
