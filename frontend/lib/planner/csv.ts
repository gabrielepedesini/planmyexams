import { toGbDate } from "./date";
import type { ExamOption } from "./types";

/**
 * Generate a CSV string for exam dates suitable for Google Calendar import
 * Format: Each exam date on a separate row with exam name and date
 */
export function generateExamCsv(combination: ExamOption[]): string {
    const headers = ["Subject", "Start date"];
    const rows = combination.map((exam) => [exam.name, toGbDate(exam.date)]);

    const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");

    return csvContent;
}

/**
 * Trigger a CSV file download with exam dates
 */
export function downloadExamCsv(combination: ExamOption[]): void {
    const csv = generateExamCsv(combination);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `exam-schedule-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
