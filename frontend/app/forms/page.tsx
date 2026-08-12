"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Form } from "@/types/form";
import { api } from "@/lib/api";
import { FormCard } from "@/components/forms/FormCard";
import { CreateFormModal } from "@/components/forms/CreateFormModal";
import { RenameModal } from "@/components/forms/RenameModal";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { Plus, Search, Sparkles, Loader2 } from "lucide-react";

export default function FormsDashboard() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [renameModalForm, setRenameModalForm] = useState<Form | null>(null);
  const [deleteModalForm, setDeleteModalForm] = useState<Form | null>(null);
  const [deleting, setDeleting] = useState(false);

  const router = useRouter();
  const toast = useToast();

  const loadForms = async () => {
    try {
      setLoading(true);
      const data = await api.getForms();
      setForms(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load forms.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForms();
  }, []);

  const handleCreateForm = async (title: string, description: string) => {
    try {
      const newForm = await api.createForm({ title, description });
      toast.success("Form created successfully!");
      router.push(`/forms/${newForm.id}/builder`);
    } catch (err: any) {
      toast.error(err.message || "Unable to create form.");
    }
  };

  const handleRenameForm = async (formId: number, newTitle: string, newDescription: string) => {
    try {
      const updated = await api.updateForm(formId, { title: newTitle, description: newDescription });
      setForms((prev) => prev.map((f) => (f.id === formId ? { ...f, ...updated } : f)));
      toast.success("Form renamed successfully.");
    } catch (err: any) {
      toast.error(err.message || "Failed to rename form.");
    }
  };

  const handleDuplicateForm = async (formId: number) => {
    try {
      const dup = await api.duplicateForm(formId);
      setForms((prev) => [dup, ...prev]);
      toast.success("Form duplicated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to duplicate form.");
    }
  };

  const handleDeleteForm = async () => {
    if (!deleteModalForm) return;
    try {
      setDeleting(true);
      await api.deleteForm(deleteModalForm.id);
      setForms((prev) => prev.filter((f) => f.id !== deleteModalForm.id));
      toast.success("Form deleted successfully.");
      setDeleteModalForm(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete form.");
    } finally {
      setDeleting(false);
    }
  };

  const handlePublishToggle = async (form: Form) => {
    try {
      let updated: Form;
      if (form.status === "published") {
        updated = await api.unpublishForm(form.id);
        toast.info("Form unpublished to draft status.");
      } else {
        updated = await api.publishForm(form.id);
        toast.success("Form published live!");
      }
      setForms((prev) => prev.map((f) => (f.id === form.id ? { ...f, ...updated } : f)));
    } catch (err: any) {
      toast.error(err.message || "Failed to change form publish status.");
    }
  };

  const filteredForms = forms.filter(
    (f) =>
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.description && f.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 space-y-8">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Forms</h1>
            <p className="text-sm text-slate-500 mt-1">
              Create, edit, and manage your conversational typeform forms.
            </p>
          </div>

          <Button
            onClick={() => setCreateModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
            size="lg"
          >
            Create Form
          </Button>
        </div>

        {/* Search bar */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search forms by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm shadow-sm"
          />
        </div>

        {/* Form Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-slate-400 animate-spin mb-3" />
            <p className="text-sm font-medium text-slate-500">Loading your forms...</p>
          </div>
        ) : filteredForms.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {searchQuery ? "No forms matched your search" : "No forms created yet"}
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              {searchQuery
                ? "Try searching with a different keyword."
                : "Create your first conversational form to get started."}
            </p>
            {!searchQuery && (
              <Button onClick={() => setCreateModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
                Create Form
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredForms.map((form) => (
              <FormCard
                key={form.id}
                form={form}
                onRename={(f) => setRenameModalForm(f)}
                onDuplicate={handleDuplicateForm}
                onDelete={(f) => setDeleteModalForm(f)}
                onPublishToggle={handlePublishToggle}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <CreateFormModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateForm}
      />

      <RenameModal
        isOpen={renameModalForm !== null}
        form={renameModalForm}
        onClose={() => setRenameModalForm(null)}
        onSubmit={handleRenameForm}
      />

      <Modal
        isOpen={deleteModalForm !== null}
        onClose={() => setDeleteModalForm(null)}
        title={`Delete "${deleteModalForm?.title}"?`}
        description="This action is permanent and will cascade-delete all questions, options, and submitted responses associated with this form."
      >
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => setDeleteModalForm(null)}>
            Cancel
          </Button>
          <Button variant="danger" loading={deleting} onClick={handleDeleteForm}>
            Delete Form Permanently
          </Button>
        </div>
      </Modal>
    </div>
  );
}
