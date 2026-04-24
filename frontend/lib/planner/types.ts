export type Exam = {
    id: string;
    name: string;
    dates: Date[];
    minDays: number;
};

export type DraftExam = {
    name: string;
    dates: Date[];
    minDays: number;
};

export type ExamEntryMode = "single" | "bulk";

export type ExamOption = {
    name: string;
    date: Date;
    minDays: number;
};

export type ExamGroups = ExamOption[][];

export type CombinationResult = {
    score: number;
    combination: ExamOption[];
};

export type PlannerMessages = {
    heroTitle: string;
    beta: string;
    heroDescription: string;
    addExam: string;
    emptyStateAddManually: string;
    emptyStateOr: string;
    emptyStateAddByPasting: string;
    emptyStateAddByPastingHint: string;
    entryModeLabel: string;
    entryModeSingle: string;
    entryModeBulk: string;
    addExamModalTitle: string;
    editExamModalTitle: string;
    examNameLabel: string;
    examNamePlaceholder: string;
    availableDates: string;
    bulkPasteLabel: string;
    bulkPastePlaceholder: string;
    bulkPasteSave: string;
    bulkSyntaxAccordionTitle: string;
    bulkSyntaxAccordionBody: string;
    bulkSyntaxExample: string;
    bulkAiAccordionTitle: string;
    bulkAiAccordionBody: string;
    bulkAiPromptTitle: string;
    bulkAiPromptTemplate: string;
    bulkAiPromptCopy: string;
    bulkAiPromptCopied: string;
    addDate: string;
    minimumDaysLabel: string;
    optional: string;
    save: string;
    edit: string;
    delete: string;
    requiredDays: string;
    datesLabel: string;
    sameTimeQuestion: string;
    calculate: string;
    calculateErrorMinExams: string;
    calculateErrorSameTime: string;
    outputTitle: string;
    outputDescriptionPrefix: string;
    outputDescriptionSuffix: string;
    outputDescriptionExamSingular: string;
    outputDescriptionExamPlural: string;
    outputScoreHint: string;
    combination: string;
    modalErrorNoName: string;
    modalErrorMissingDates: string;
    modalErrorDuplicateName: string;
    modalErrorBulkEmpty: string;
    modalErrorBulkSyntax: string;
    datePlaceholder: string;
    footerPrefix: string;
    footerAuthor: string;
    footerUrl: string;
};
