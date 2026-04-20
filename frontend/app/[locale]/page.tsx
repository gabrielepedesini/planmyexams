import { PlannerApp } from "@/components/planner/PlannerApp";
import type { PlannerMessages } from "@/lib/planner/types";
import { getMessages } from "next-intl/server";

const defaultPlannerMessages: PlannerMessages = {
	heroTitle: "PlanMyExams",
	beta: "Beta",
	heroDescription: "Effortlessly plan your exam schedule and find the most optimal dates in seconds.",
	addExam: "Add Exam",
	emptyStateAddManually: "Add One Exam Manually",
	emptyStateOr: "or",
	emptyStateAddByPasting: "Paste Multiple Exams",
	emptyStateAddByPastingHint: "You can also use an external AI chatbot to convert an image to this text format.",
	entryModeLabel: "Exam entry mode",
	entryModeSingle: "Single Exam",
	entryModeBulk: "Paste Multiple",
	addExamModalTitle: "New Exam",
	editExamModalTitle: "Edit Exam",
	examNameLabel: "Exam Name",
	examNamePlaceholder: "Name",
	availableDates: "Available Dates",
	bulkPasteLabel: "Paste exams",
	bulkPastePlaceholder: "Insert your exams here using the required format...",
	bulkPasteSave: "Import Exams",
	bulkSyntaxAccordionTitle: "Required Syntax",
	bulkSyntaxAccordionBody:
		"Use blocks with this format: Exam: <EXAM NAME>, then Dates:, then one or more lines starting with - dd/mm/yyyy.",
	bulkAiAccordionTitle: "Use AI From Image",
	bulkAiAccordionBody:
		"Copy the prompt below, paste it into your AI chatbot, attach an image with your exam list, and paste back the generated result here.",
	bulkAiPromptTitle: "Prompt to copy",
	bulkAiPromptTemplate:
		"I will send you an image containing exam names and possible dates.\nExtract all exams and return ONLY this format:\n\nExam: <EXAM NAME>\nDates:\n- dd/mm/yyyy\n- dd/mm/yyyy\n\nRules:\n- Keep one block per exam.\n- Separate different exam blocks with exactly one empty line.\n- Use date format dd/mm/yyyy.\n- Keep the exact labels 'Exam:' and 'Dates:'.\n- Return the result as markdown plain text in a single copyable code block.\n- Do not add explanations or extra text outside the code block.",
	bulkAiPromptCopy: "Copy Prompt",
	bulkAiPromptCopied: "Prompt Copied",
	addDate: "Add Date",
	minimumDaysLabel: "Minimum Days Required",
	optional: "Optional",
	save: "Save",
	edit: "Edit",
	delete: "Delete",
	requiredDays: "Required Days",
	datesLabel: "Dates",
	sameTimeQuestion: "How many exams do you prepare for at the same time?",
	calculate: "Find Best Combinations",
	calculateErrorMinExams: "Insert at least two exams",
	calculateErrorSameTime:
		"The number of exams prepared at the same time must be less than the total number of exams",
	outputTitle: "Best Combinations",
	outputDescriptionPrefix: "These combinations have been evaluated considering the preparation of",
	outputDescriptionSuffix: "at the same time.",
	outputDescriptionExamSingular: "exam",
	outputDescriptionExamPlural: "exams",
	outputScoreHint: "Each combination has a score in the top right corner showing how optimal it is.",
	combination: "Combination",
	modalErrorNoName: "Please enter an exam name",
	modalErrorMissingDates: "Please fill in all date fields",
	modalErrorDuplicateName: "An exam with this name already exists: please use a different name",
	modalErrorBulkEmpty: "Paste your exam text before importing",
	modalErrorBulkSyntax: "Invalid format. Use: Exam: <name>, Dates:, and one or more lines with - dd/mm/yyyy",
	datePlaceholder: "Select a date",
	footerPrefix: "Designed and developed by",
	footerAuthor: "Gabriele Pedesini",
	footerUrl: "https://www.gabrielepedesini.com",
};

function resolvePlannerMessages(messages: unknown): PlannerMessages {
	const planner =
		(messages as { planner?: Partial<PlannerMessages> } | undefined)?.planner ?? {};

	return {
		...defaultPlannerMessages,
		...planner,
	};
}

export default async function Home({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<React.JSX.Element> {
	const { locale } = await params;
	const messages = await getMessages({ locale });

	return <PlannerApp messages={resolvePlannerMessages(messages)} />;
}
