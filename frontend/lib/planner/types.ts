export type Exam = {
    id: string;
    name: string;
    dates: Date[];
    minDays: number;
};

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
    addExamModalTitle: string;
    examNameLabel: string;
    examNamePlaceholder: string;
    availableDates: string;
    addDate: string;
    minimumDaysLabel: string;
    optional: string;
    save: string;
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
    datePlaceholder: string;
    footerPrefix: string;
    footerAuthor: string;
    footerUrl: string;
};
