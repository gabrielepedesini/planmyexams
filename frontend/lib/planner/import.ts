import { parseGbDate } from "@/lib/planner/date";
import type { DraftExam } from "@/lib/planner/types";

export type BulkImportParseError = "empty" | "invalid-format";

export type BulkImportParseResult =
    | {
          exams: DraftExam[];
      }
    | {
          error: BulkImportParseError;
      };

const EXAM_BLOCK_SEPARATOR = /\n\s*\n(?=Exam:\s*)/;
const EXAM_BLOCK_REGEX = /^Exam:\s*(.+)\s*\nDates:\s*\n([\s\S]+)$/;
const DATE_LINE_REGEX = /^-\s*(\d{2}\/\d{2}\/\d{4})\s*$/;

export function parseBulkExamText(value: string): BulkImportParseResult {
    const normalizedInput = value
        .replace(/\r\n/g, "\n")
        .replace(/\u00A0/g, " ")
        .trim();

    if (!normalizedInput) {
        return { error: "empty" };
    }

    const blocks = normalizedInput.split(EXAM_BLOCK_SEPARATOR).filter((block) => block.trim().length > 0);

    if (blocks.length === 0) {
        return { error: "invalid-format" };
    }

    const parsedExams: DraftExam[] = [];

    for (const rawBlock of blocks) {
        const block = rawBlock.trim();
        const blockMatch = block.match(EXAM_BLOCK_REGEX);

        if (!blockMatch) {
            return { error: "invalid-format" };
        }

        const examName = blockMatch[1].trim();
        const dateLines = blockMatch[2]
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0);

        if (!examName || dateLines.length === 0) {
            return { error: "invalid-format" };
        }

        const parsedDates: Date[] = [];

        for (const dateLine of dateLines) {
            const dateMatch = dateLine.match(DATE_LINE_REGEX);
            if (!dateMatch) {
                return { error: "invalid-format" };
            }

            const parsedDate = parseGbDate(dateMatch[1]);
            if (!parsedDate) {
                return { error: "invalid-format" };
            }

            parsedDates.push(parsedDate);
        }

        const normalizedDates = [...new Map(parsedDates.map((date) => [date.getTime(), date])).values()].sort(
            (left, right) => left.getTime() - right.getTime(),
        );

        parsedExams.push({
            name: examName,
            dates: normalizedDates,
            minDays: -1,
        });
    }

    return {
        exams: parsedExams,
    };
}
