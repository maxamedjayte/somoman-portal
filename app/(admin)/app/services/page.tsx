"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/app/lib/supabase/client";
import { Plus, X, Loader2, Upload, Check, Edit2, Save, Trash2 } from "lucide-react";
import { showToast } from "@/app/lib/toast";
import Image from "next/image";

type Service = {
    id: string;
    title: string;
    description: string;
    image: string;
    checklist: string[];
    is_active: boolean;
};

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editFormData, setEditFormData] = useState<Service | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        image: "",
        checklist: [""],
        is_active: true,
    });
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        fetchServices();
    }, []);

    async function fetchServices() {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("services")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching services:", error);
        } else {
            setServices(data || []);
        }
        setLoading(false);
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const supabase = createClient();

        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from("som-omaan")
            .upload(filePath, file);

        if (uploadError) {
            console.error("Error uploading image:", uploadError);
            showToast("Failed to upload image", "error");
        } else {
            const { data } = supabase.storage.from("som-omaan").getPublicUrl(filePath);
            setFormData((prev) => ({ ...prev, image: data.publicUrl }));
            showToast("Image uploaded successfully", "success");
        }
        setUploading(false);
    };

    const handleChecklistChange = (index: number, value: string) => {
        const newChecklist = [...formData.checklist];
        newChecklist[index] = value;
        setFormData((prev) => ({ ...prev, checklist: newChecklist }));
    };

    const addChecklistItem = () => {
        setFormData((prev) => ({ ...prev, checklist: [...prev.checklist, ""] }));
    };

    const removeChecklistItem = (index: number) => {
        const newChecklist = formData.checklist.filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, checklist: newChecklist }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);

        const supabase = createClient();
        const { error } = await supabase.from("services").insert([
            {
                title: formData.title,
                description: formData.description,
                image: formData.image,
                checklist: formData.checklist.filter((item) => item.trim() !== ""),
                is_active: formData.is_active,
            },
        ]);

        if (error) {
            console.error("Error creating service:", error);
            showToast("Failed to create service: " + error.message, "error");
        } else {
            setShowModal(false);
            setFormData({
                title: "",
                description: "",
                image: "",
                checklist: [""],
                is_active: true,
            });
            fetchServices();
            showToast("Service created successfully", "success");
        }
        setCreating(false);
    };

    const startEdit = (service: Service) => {
        setEditingId(service.id);
        setEditFormData({ ...service });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditFormData(null);
    };

    const saveEdit = async (id: string) => {
        if (!editFormData) return;

        const supabase = createClient();
        const { error } = await supabase
            .from("services")
            .update({
                title: editFormData.title,
                description: editFormData.description,
                is_active: editFormData.is_active,
            })
            .eq("id", id);

        if (error) {
            console.error("Error updating service:", error);
            showToast("Failed to update service", "error");
        } else {
            setEditingId(null);
            setEditFormData(null);
            fetchServices();
            showToast("Service updated successfully", "success");
        }
    };

    const deleteService = async (service: Service) => {
        if (!confirm(`Are you sure you want to delete "${service.title}"?`)) return;

        setDeleting(service.id);
        const supabase = createClient();

        // Delete image from storage if exists
        if (service.image) {
            const imagePath = service.image.split("/").pop();
            if (imagePath) {
                await supabase.storage.from("som-omaan").remove([imagePath]);
            }
        }

        // Delete service from database
        const { error } = await supabase.from("services").delete().eq("id", service.id);

        if (error) {
            console.error("Error deleting service:", error);
            showToast("Failed to delete service", "error");
        } else {
            fetchServices();
            showToast("Service deleted successfully", "success");
        }
        setDeleting(null);
    };

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#003527]" />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-extrabold tracking-tight text-[#191c1d]">
                        Services Management
                    </h2>
                    <p className="mt-1 text-sm text-[#191c1d]/60">
                        Manage your service offerings
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 rounded-2xl bg-[#003527] px-5 py-3 font-bold text-white shadow-lg shadow-[#003527]/20 transition hover:-translate-y-0.5"
                >
                    <Plus className="h-4 w-4" />
                    Add Service
                </button>
            </div>

            <div className="overflow-hidden rounded-[30px] bg-white shadow-[0_22px_50px_rgba(25,28,29,0.05)]">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead>
                            <tr className="border-b border-[#eef1f2] bg-[#f8f9fa] text-left">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] text-[#191c1d]/45">
                                    Image
                                </th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] text-[#191c1d]/45">
                                    Title
                                </th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] text-[#191c1d]/45">
                                    Description
                                </th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] text-[#191c1d]/45">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] text-[#191c1d]/45">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map((service) => {
                                const isEditing = editingId === service.id;
                                const displayData = isEditing && editFormData ? editFormData : service;

                                return (
                                    <tr
                                        key={service.id}
                                        className="border-t border-[#f1f3f5] transition hover:bg-[#fafbfb]"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="relative h-16 w-24 overflow-hidden rounded-lg bg-gray-100">
                                                <Image
                                                    src={service.image}
                                                    alt={service.title}
                                                    fill
                                                    sizes="96px"
                                                    className="object-cover"
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={displayData.title}
                                                    onChange={(e) =>
                                                        setEditFormData((prev) =>
                                                            prev ? { ...prev, title: e.target.value } : null
                                                        )
                                                    }
                                                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                                                />
                                            ) : (
                                                <span className="text-sm font-semibold text-[#191c1d]">
                                                    {service.title}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {isEditing ? (
                                                <textarea
                                                    value={displayData.description}
                                                    onChange={(e) =>
                                                        setEditFormData((prev) =>
                                                            prev ? { ...prev, description: e.target.value } : null
                                                        )
                                                    }
                                                    rows={2}
                                                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                                                />
                                            ) : (
                                                <span className="text-sm text-[#191c1d]/70 line-clamp-2">
                                                    {service.description}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {isEditing ? (
                                                <select
                                                    value={displayData.is_active ? "active" : "inactive"}
                                                    onChange={(e) =>
                                                        setEditFormData((prev) =>
                                                            prev
                                                                ? { ...prev, is_active: e.target.value === "active" }
                                                                : null
                                                        )
                                                    }
                                                    className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                </select>
                                            ) : (
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${service.is_active
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : "bg-gray-100 text-gray-700"
                                                        }`}
                                                >
                                                    {service.is_active ? "Active" : "Inactive"}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {isEditing ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => saveEdit(service.id)}
                                                        className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
                                                    >
                                                        <Save className="h-3 w-3" />
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-200"
                                                    >
                                                        <X className="h-3 w-3" />
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => startEdit(service)}
                                                        className="flex items-center gap-1 rounded-lg bg-[#4059aa] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#4059aa]/90"
                                                    >
                                                        <Edit2 className="h-3 w-3" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => deleteService(service)}
                                                        disabled={deleting === service.id}
                                                        className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                                    >
                                                        {deleting === service.id ? (
                                                            <Loader2 className="h-3 w-3 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="h-3 w-3" />
                                                        )}
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {services.length === 0 && (
                <div className="rounded-[30px] bg-white p-12 text-center shadow-[0_20px_45px_rgba(25,28,29,0.05)]">
                    <p className="text-sm text-[#191c1d]/55">
                        No services yet. Click "Add Service" to create one.
                    </p>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[30px] bg-white p-6 shadow-2xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-2xl font-extrabold text-[#191c1d]">
                                Create New Service
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#191c1d]">
                                    Service Title
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, title: e.target.value }))
                                    }
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#191c1d]">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, description: e.target.value }))
                                    }
                                    rows={3}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#191c1d]">
                                    Service Image
                                </label>
                                <div className="space-y-3">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label
                                        htmlFor="image-upload"
                                        className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-sm font-medium text-gray-600 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
                                    >
                                        {uploading ? (
                                            <>
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="h-5 w-5" />
                                                Click to upload image
                                            </>
                                        )}
                                    </label>
                                    {formData.image && (
                                        <div className="relative h-32 w-full overflow-hidden rounded-xl">
                                            <Image
                                                src={formData.image}
                                                alt="Preview"
                                                fill
                                                sizes="100vw"
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#191c1d]">
                                    Checklist Items
                                </label>
                                <div className="space-y-3">
                                    {formData.checklist.map((item, index) => (
                                        <div key={index} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={item}
                                                onChange={(e) => handleChecklistChange(index, e.target.value)}
                                                placeholder={`Item ${index + 1}`}
                                                className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                            />
                                            {formData.checklist.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeChecklistItem(index)}
                                                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 transition hover:bg-red-100"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addChecklistItem}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add Item
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="is-active"
                                    checked={formData.is_active}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, is_active: e.target.checked }))
                                    }
                                    className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500"
                                />
                                <label htmlFor="is-active" className="text-sm font-semibold text-[#191c1d]">
                                    Set as Active
                                </label>
                            </div>

                            <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="rounded-xl bg-gray-100 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={creating || !formData.image}
                                    className="flex items-center gap-2 rounded-xl bg-[#003527] px-5 py-3 font-bold text-white shadow-lg shadow-[#003527]/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {creating ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="h-4 w-4" />
                                            Create Service
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
