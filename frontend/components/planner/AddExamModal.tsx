"use client";

import { useEffect, useRef, useState } from "react";

import { normalizeDates, toGbDate } from "@/lib/planner/date";
import type { PlannerMessages } from "@/lib/planner/types";

import { DatePickerInput } from "./DatePickerInput";
import { NumberPicker } from "./NumberPicker";

type DraftExam = {
    name: string;
    dates: Date[];
    minDays: number;
};

type DateField = {
    id: number;
    value: string;
};

type AddExamModalProps = {
    isOpen: boolean;
    existingNames: string[];
    messages: PlannerMessages;
    mode: "add" | "edit";
    initialDraft?: DraftExam | null;
    onClose: () => void;
    onSave: (draftExam: DraftExam) => void;
};

const FIRST_DATE_ID = 0;

export function AddExamModal({
    isOpen,
    existingNames,
    messages,
    mode,
    initialDraft,
    onClose,
    onSave,
}: AddExamModalProps): React.JSX.Element | null {
    const [examName, setExamName] = useState("");
    const [dateFields, setDateFields] = useState<DateField[]>([{ id: FIRST_DATE_ID, value: "" }]);
    const [minDays, setMinDays] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");

    const nextDateId = useRef(1);
    const nameInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const focusTimeoutId = window.setTimeout(() => {
            nameInputRef.current?.focus();
        }, 100);

        document.body.style.overflow = "hidden";

        return () => {
            window.clearTimeout(focusTimeoutId);
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        if (!initialDraft) {
            setExamName("");
            setDateFields([{ id: FIRST_DATE_ID, value: "" }]);
            setMinDays(0);
            setErrorMessage("");
            nextDateId.current = 1;
            return;
        }

        if (initialDraft.dates.length === 0) {
            setExamName(initialDraft.name);
            setDateFields([{ id: FIRST_DATE_ID, value: "" }]);
            setMinDays(initialDraft.minDays > 0 ? initialDraft.minDays : 0);
            setErrorMessage("");
            nextDateId.current = 1;
            return;
        }

        setExamName(initialDraft.name);
        setDateFields(
            initialDraft.dates.map((date, index) => ({
                id: index,
                value: toGbDate(date),
            })),
        );
        setMinDays(initialDraft.minDays > 0 ? initialDraft.minDays : 0);
        setErrorMessage("");
        nextDateId.current = initialDraft.dates.length;
    }, [initialDraft, isOpen]);

    useEffect(() => {
        if (!isOpen) {
            setExamName("");
            setDateFields([{ id: FIRST_DATE_ID, value: "" }]);
            setMinDays(0);
            setErrorMessage("");
            nextDateId.current = 1;
        }
    }, [isOpen]);

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

                {errorMessage ? <div id="alertAddExam">{errorMessage}</div> : <div id="alertAddExam" />}

                <button className="button" type="button" onClick={saveExam}>
                    {messages.save}
                </button>
            </div>
        </div>
    );
}
