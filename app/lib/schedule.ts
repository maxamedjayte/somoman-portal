import type { WorkSchedule } from "./supabase/types";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function getLocalDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export type ScheduleAssignment = {
  scheduled_date: string;
  scheduled_day_of_week: number;
  scheduled_start_time: string;
  scheduled_end_time: string;
  schedule_status: "today" | "next_working_day" | "today_full_assigned_next";
  schedule_note: string;
  day_name: string;
};

export function getNextAvailableDay(
  schedule: WorkSchedule[],
  requestCounts: Record<string, number>,
  startDate?: Date,
): ScheduleAssignment | null {
  const start = startDate || new Date();
  const today = new Date(start);
  today.setHours(0, 0, 0, 0);

  const todayDow = today.getDay();
  const todaySchedule = schedule.find((s) => s.day_of_week === todayDow);
  const todayKey = getLocalDateString(today);
  const todayCount = requestCounts[todayKey] || 0;

  // Case A: Today is not a working day
  if (!todaySchedule || !todaySchedule.is_working_day) {
    const next = findNextWorkingDay(schedule, requestCounts, today);
    if (!next) return null;
    return {
      ...next,
      schedule_status: "next_working_day",
      schedule_note:
        "Today is not a working day. Your request will be processed on the next available scheduled day.",
    };
  }

  // Case B: Today is a working day and capacity is available
  if (todayCount < todaySchedule.max_requests) {
    return {
      scheduled_date: todayKey,
      scheduled_day_of_week: todayDow,
      scheduled_start_time: todaySchedule.start_time || "09:00",
      scheduled_end_time: todaySchedule.end_time || "17:00",
      schedule_status: "today",
      schedule_note: "Your request will be processed today.",
      day_name: DAY_NAMES[todayDow],
    };
  }

  // Case C: Today is a working day but full
  const next = findNextWorkingDay(schedule, requestCounts, today);
  if (!next) return null;
  return {
    ...next,
    schedule_status: "today_full_assigned_next",
    schedule_note:
      "The maximum booking requests for today are full. We will move your request to the next available day.",
  };
}

function findNextWorkingDay(
  schedule: WorkSchedule[],
  requestCounts: Record<string, number>,
  afterDate: Date,
): Omit<ScheduleAssignment, "schedule_status" | "schedule_note"> | null {
  // Check up to 14 days ahead
  for (let i = 1; i <= 14; i++) {
    const date = new Date(afterDate);
    date.setDate(date.getDate() + i);
    const dow = date.getDay();
    const daySchedule = schedule.find((s) => s.day_of_week === dow);

    if (daySchedule && daySchedule.is_working_day) {
      const dateKey = getLocalDateString(date);
      const count = requestCounts[dateKey] || 0;

      if (count < daySchedule.max_requests) {
        return {
          scheduled_date: dateKey,
          scheduled_day_of_week: dow,
          scheduled_start_time: daySchedule.start_time || "09:00",
          scheduled_end_time: daySchedule.end_time || "17:00",
          day_name: DAY_NAMES[dow],
        };
      }
    }
  }
  return null;
}

export function formatScheduleInfo(assignment: ScheduleAssignment): string {
  const dateLabel =
    assignment.schedule_status === "today"
      ? `Today (${assignment.day_name})`
      : `${new Date(assignment.scheduled_date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}`;

  return `Processing day: ${dateLabel}, ${assignment.scheduled_start_time} - ${assignment.scheduled_end_time}`;
}

export function getScheduleBadgeColor(status: string): string {
  switch (status) {
    case "today":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "next_working_day":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "today_full_assigned_next":
      return "bg-amber-100 text-amber-700 border-amber-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}
