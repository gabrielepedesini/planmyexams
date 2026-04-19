import { PlannerApp } from "@/components/planner/PlannerApp";
import type { PlannerMessages } from "@/lib/planner/types";
import { getMessages } from "next-intl/server";

const defaultPlannerMessages: PlannerMessages = {
	heroTitle: "PlanMyExams",
	beta: "Beta",
	heroDescription: "Effortlessly plan your exam schedule and find the most optimal dates in seconds.",
	addExam: "Add Exam",
	addExamModalTitle: "New Exam",
	examNameLabel: "Exam Name",
	examNamePlaceholder: "Name",
	availableDates: "Available Dates",
	addDate: "Add Date",
	minimumDaysLabel: "Minimum Days Required",
	optional: "Optional",
	save: "Save",
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
