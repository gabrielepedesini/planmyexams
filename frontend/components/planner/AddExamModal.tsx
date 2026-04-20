"use client";

import { useEffect, useRef, useState } from "react";

import { normalizeDates, toGbDate } from "@/lib/planner/date";
import { parseBulkExamText } from "@/lib/planner/import";
import type { DraftExam, ExamEntryMode, PlannerMessages } from "@/lib/planner/types";

import { DatePickerInput } from "./DatePickerInput";
import { NumberPicker } from "./NumberPicker";

type DateField = {
    id: number;
    value: string;
};

type AddExamModalProps = {
    isOpen: boolean;
    existingNames: string[];
    messages: PlannerMessages;
    mode: "add" | "edit";
    initialEntryMode?: ExamEntryMode;
    initialDraft?: DraftExam | null;
    onClose: () => void;
    onSave: (draftExam: DraftExam) => void;
    onSaveBulk: (draftExams: DraftExam[]) => void;
};

const FIRST_DATE_ID = 0;

export function AddExamModal({
    isOpen,
    existingNames,
    messages,
    mode,
    initialEntryMode = "single",
    initialDraft,
    onClose,
    onSave,
    onSaveBulk,
}: AddExamModalProps): React.JSX.Element | null {
    const [examName, setExamName] = useState(() => {
        if (mode === "edit" && initialDraft) {
            return initialDraft.name;
        }

        return "";
    });
    const [dateFields, setDateFields] = useState<DateField[]>(() => {
        if (mode === "edit" && initialDraft && initialDraft.dates.length > 0) {
            return initialDraft.dates.map((date, index) => ({
                id: index,
                value: toGbDate(date),
            }));
        }

        return [{ id: FIRST_DATE_ID, value: "" }];
    });
    const [minDays, setMinDays] = useState(() => {
        if (mode === "edit" && initialDraft && initialDraft.minDays > 0) {
            return initialDraft.minDays;
        }

        return 0;
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [entryMode, setEntryMode] = useState<ExamEntryMode>(() =>
        mode === "add" ? initialEntryMode : "single",
    );
    const [bulkText, setBulkText] = useState("");
    const [isBulkAiPromptCopied, setIsBulkAiPromptCopied] = useState(false);

    const nextDateId = useRef(mode === "edit" && initialDraft ? Math.max(initialDraft.dates.length, 1) : 1);
    const nameInputRef = useRef<HTMLInputElement>(null);
    const bulkInputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const focusTimeoutId = window.setTimeout(() => {
            if (mode === "add" && entryMode === "bulk") {
                bulkInputRef.current?.focus();
                return;
            }

            nameInputRef.current?.focus();
        }, 100);

        document.body.style.overflow = "hidden";

        return () => {
            window.clearTimeout(focusTimeoutId);
            document.body.style.overflow = "auto";
        };
    }, [entryMode, isOpen, mode]);

    if (!isOpen) {
        return null;
    }

    const addDateField = (): void => {
        setDateFields((currentFields) => [...currentFields, { id: nextDateId.current, value: "" }]);
        nextDateId.current += 1;
    };

    const removeDateField = (fieldId: number): void => {
        setDateFields((currentFields) => currentFields.filter((field) => field.id !== fieldId));
    };

    const updateDateField = (fieldId: number, nextValue: string): void => {
        setDateFields((currentFields) =>
            currentFields.map((field) => (field.id === fieldId ? { ...field, value: nextValue } : field)),
        );
    };

    const getBulkErrorMessage = (bulkError: "empty" | "invalid-format"): string => {
        if (bulkError === "empty") {
            return messages.modalErrorBulkEmpty;
        }

        return messages.modalErrorBulkSyntax;
    };

    const saveBulkExams = (): void => {
        const parsed = parseBulkExamText(bulkText);

        if ("error" in parsed) {
            setErrorMessage(getBulkErrorMessage(parsed.error));
            return;
        }

        const importedNames = parsed.exams.map((exam) => exam.name);
        const uniqueImportedNames = new Set(importedNames);

        if (uniqueImportedNames.size !== importedNames.length) {
            setErrorMessage(messages.modalErrorDuplicateName);
            return;
        }

        if (importedNames.some((name) => existingNames.some((existingName) => existingName === name))) {
            setErrorMessage(messages.modalErrorDuplicateName);
            return;
        }

        setErrorMessage("");
        onSaveBulk(parsed.exams);
    };

    const copyBulkAiPrompt = async (): Promise<void> => {
        try {
            await navigator.clipboard.writeText(messages.bulkAiPromptTemplate);
            setIsBulkAiPromptCopied(true);

            window.setTimeout(() => {
                setIsBulkAiPromptCopied(false);
            }, 1700);
        } catch {
            setIsBulkAiPromptCopied(false);
        }
    };

    const saveExam = (): void => {
        const trimmedName = examName.trim();
        const dateValues = dateFields.map((field) => field.value);

        if (!trimmedName) {
            setErrorMessage(messages.modalErrorNoName);
            return;
        }

        if (dateValues.some((value) => !value)) {
            setErrorMessage(messages.modalErrorMissingDates);
            return;
        }

        if (existingNames.some((name) => name === trimmedName)) {
            setErrorMessage(messages.modalErrorDuplicateName);
            return;
        }

        const normalizedDates = normalizeDates(dateValues);

        if (normalizedDates.length === 0) {
            setErrorMessage(messages.modalErrorMissingDates);
            return;
        }

        setErrorMessage("");
        onSave({
            name: trimmedName,
            dates: normalizedDates,
            minDays: minDays === 0 ? -1 : minDays,
        });
    };

    return (
        <div className="exam-popup-background show" onClick={onClose} aria-modal="true" role="dialog">
            <div className="exam-popup" onClick={(event) => event.stopPropagation()}>
                <button className="close-exam-popup" type="button" onClick={onClose} aria-label="Close">
                    ✕
                </button>

                <h2>{mode === "edit" ? messages.editExamModalTitle : messages.addExamModalTitle}</h2>

                {mode === "add" ? (
                    <div className="entry-mode-switch" role="group" aria-label={messages.entryModeLabel}>
                        <button
                            className={`entry-mode-button ${entryMode === "single" ? "entry-mode-button-active" : ""}`}
                            type="button"
                            onClick={() => {
                                setEntryMode("single");
                                setErrorMessage("");
                            }}
                        >
                            {messages.entryModeSingle}
                        </button>

                        <button
                            className={`entry-mode-button ${entryMode === "bulk" ? "entry-mode-button-active" : ""}`}
                            type="button"
                            onClick={() => {
                                setEntryMode("bulk");
                                setErrorMessage("");
                            }}
                        >
                            {messages.entryModeBulk}
                        </button>
                    </div>
                ) : null}

                {mode === "add" && entryMode === "bulk" ? (
                    <>
                        <label className="visually-hidden" htmlFor="bulk-exams-input">
                            {messages.bulkPasteLabel}
                        </label>

                        <textarea
                            id="bulk-exams-input"
                            className="bulk-import-textarea"
                            ref={bulkInputRef}
                            value={bulkText}
                            onChange={(event) => setBulkText(event.target.value)}
                            placeholder={messages.bulkPastePlaceholder}
                            spellCheck={false}
                            rows={8}
                        />

                        <details className="bulk-help-accordion">
                            <summary>{messages.bulkSyntaxAccordionTitle}</summary>
                            <p>{messages.bulkSyntaxAccordionBody}</p>
                        </details>

                        <details className="bulk-help-accordion">
                            <summary>{messages.bulkAiAccordionTitle}</summary>
                            <p>{messages.bulkAiAccordionBody}</p>
                            <p className="bulk-ai-prompt-title">{messages.bulkAiPromptTitle}</p>

                            <textarea
                                className="bulk-ai-prompt-textarea"
                                value={messages.bulkAiPromptTemplate}
                                readOnly
                                rows={7}
                                spellCheck={false}
                            />

                            <button className="button-alt bulk-ai-copy-button" type="button" onClick={copyBulkAiPrompt}>
                                {isBulkAiPromptCopied ? messages.bulkAiPromptCopied : messages.bulkAiPromptCopy}
                            </button>
                        </details>
                    </>
                ) : (
                    <>
                        <label className="visually-hidden" htmlFor="exam-name-input">
                            {messages.examNameLabel}
                        </label>
                        <input
                            id="exam-name-input"
                            ref={nameInputRef}
                            type="text"
                            placeholder={messages.examNamePlaceholder}
                            value={examName}
                            onChange={(event) => setExamName(event.target.value)}
                        />

                        <h4>{messages.availableDates}</h4>

                        <div id="date-inputs">
                            {dateFields.map((field, index) => (
                                <div className="date-input" key={field.id}>
                                    <DatePickerInput
                                        id={`date-${field.id}`}
                                        value={field.value}
                                        placeholder={messages.datePlaceholder}
                                        onChange={(nextValue) => updateDateField(field.id, nextValue)}
                                    />
                                    {index > 0 ? (
                                        <button
                                            className="delete"
                                            type="button"
                                            onClick={() => removeDateField(field.id)}
                                            aria-label={messages.delete}
                                        >
                                            −
                                        </button>
                                    ) : null}
                                </div>
                            ))}
                        </div>

                        <button className="button-alt add-date-button" type="button" onClick={addDateField}>
                            {messages.addDate}
                        </button>

                        <h4>
                            {messages.minimumDaysLabel} <span>({messages.optional})</span>
                        </h4>

                        <NumberPicker
                            value={minDays}
                            onDecrease={() => setMinDays((current) => (current > 0 ? current - 1 : current))}
                            onIncrease={() => setMinDays((current) => current + 1)}
                            decrementLabel="Decrease minimum days"
                            incrementLabel="Increase minimum days"
                        />
                    </>
                )}

                {errorMessage ? <div id="alertAddExam">{errorMessage}</div> : <div id="alertAddExam" />}

                <button
                    className="button"
                    type="button"
                    onClick={mode === "add" && entryMode === "bulk" ? saveBulkExams : saveExam}
                >
                    {mode === "add" && entryMode === "bulk" ? messages.bulkPasteSave : messages.save}
                </button>
            </div>
        </div>
    );
}
