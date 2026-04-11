"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/app/lib/supabase/client";
import { Loader2, Save, Clock } from "lucide-react";
import { showToast } from "@/app/lib/toast";
import type { WorkSchedule } from "@/app/lib/supabase/types";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const DEFAULT_SCHEDULE: WorkSchedule[] = DAY_NAMES.map((name, index) => ({
    day_of_week: index,
    is_working_day: index >= 1 && index <= 5,
    start_time: index >= 1 && index <= 5 ? "09:00" : null,
    end_time: index >= 1 && index <= 5 ? "17:00" : null,
    max_requests: index >= 1 && index <= 5 ? 10 : 0,
}));

export default function SchedulePage() {
    const [schedule, setSchedule] = useState<WorkSchedule[]>(DEFAULT_SCHEDULE);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSchedule();
    }, []);

    async function fetchSchedule() {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("work_schedules")
            .select("*")
            .order("day_of_week", { ascending: true });

        if (error) {
            console.error("Error fetching schedule:", error);
            showToast("Failed to load schedule", "error");
        } else if (data && data.length > 0) {
            setSchedule(data);
        } else {
            // Initialize 7 days if none exist
            await initializeSchedule();
        }
        setLoading(false);
    }

    async function initializeSchedule() {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("work_schedules")
            .insert(DEFAULT_SCHEDULE)
            .select();

        if (error) {
            console.error("Error initializing schedule:", error);
        } else if (data) {
            setSchedule(data);
        }
    }

    async function handleSave() {
        // Validation
        for (const day of schedule) {
            if (day.is_working_day) {
                if (!day.start_time || !day.end_time) {
                    showToast(`${DAY_NAMES[day.day_of_week]}: Start and end time are required for working days`, "error");
                    return;
                }
                if (day.max_requests <= 0) {
                    showToast(`${DAY_NAMES[day.day_of_week]}: Max requests must be greater than 0 for working days`, "error");
                    return;
                }
            }
        }

        setSaving(true);
        const supabase = createClient();

        const updates = schedule.map((day) => ({
            day_of_week: day.day_of_week,
            is_working_day: day.is_working_day,
            start_time: day.is_working_day ? day.start_time : null,
            end_time: day.is_working_day ? day.end_time : null,
            max_requests: day.is_working_day ? day.max_requests : 0,
        }));

        // Upsert all 7 days
        const { error } = await supabase
            .from("work_schedules")
            .upsert(updates, { onConflict: "day_of_week" });

        if (error) {
            console.error("Error saving schedule:", error);
            showToast("Failed to save schedule: " + error.message, "error");
        } else {
            showToast("Schedule saved successfully!", "success");
            fetchSchedule();
        }
        setSaving(false);
    }

    const updateDay = (dayOfWeek: number, updates: Partial<WorkSchedule>) => {
        setSchedule((prev) =>
            prev.map((day) =>
                day.day_of_week === dayOfWeek ? { ...day, ...updates } : day
            )
        );
    };

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#003527]" />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl">
            <div className="mb-6">
                <h2 className="text-2xl font-extrabold tracking-tight text-[#191c1d]">
                    Work Schedule
                </h2>
                <p className="mt-1 text-sm text-[#191c1d]/60">
                    Configure working days, hours, and daily capacity for booking requests
                </p>
            </div>

            <div className="space-y-4">
                {schedule.map((day) => (
                    <div
                        key={day.day_of_week}
                        className={`rounded-[24px] bg-white p-5 shadow-[0_18px_40px_rgba(25,28,29,0.05)] transition ${day.is_working_day ? "ring-2 ring-emerald-200" : "opacity-70"}`}
                    >
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            {/* Day Name + Toggle */}
                            <div className="flex items-center gap-4">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${day.is_working_day ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                                    {DAY_NAMES[day.day_of_week].slice(0, 2)}
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-[#191c1d]">{DAY_NAMES[day.day_of_week]}</h3>
                                    <p className={`text-xs ${day.is_working_day ? "text-emerald-600" : "text-gray-400"}`}>
                                        {day.is_working_day ? "Working Day" : "Not Working"}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => updateDay(day.day_of_week, { is_working_day: !day.is_working_day })}
                                    className={`relative h-6 w-11 rounded-full transition ${day.is_working_day ? "bg-emerald-500" : "bg-gray-300"}`}
                                >
                                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${day.is_working_day ? "left-[22px]" : "left-0.5"}`} />
                                </button>
                            </div>

                            {/* Time + Capacity (only for working days) */}
                            {day.is_working_day && (
                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-[#191c1d]/40" />
                                        <input
                                            type="time"
                                            value={day.start_time || "09:00"}
                                            onChange={(e) => updateDay(day.day_of_week, { start_time: e.target.value })}
                                            className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                                        />
                                        <span className="text-xs text-[#191c1d]/40">to</span>
                                        <input
                                            type="time"
                                            value={day.end_time || "17:00"}
                                            onChange={(e) => updateDay(day.day_of_week, { end_time: e.target.value })}
                                            className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-[#191c1d]/60">Max:</span>
                                        <input
                                            type="number"
                                            value={day.max_requests}
                                            onChange={(e) => updateDay(day.day_of_week, { max_requests: parseInt(e.target.value) || 0 })}
                                            min={1}
                                            className="w-16 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-center text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                                        />
                                        <span className="text-xs text-[#191c1d]/40">requests</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 flex justify-end">
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 rounded-2xl bg-[#003527] px-6 py-3 font-bold text-white shadow-lg shadow-[#003527]/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {saving ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4" />
                            Save Schedule
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
