"use client";

import { useEffect, useRef, useState } from "react";

import { ToggleTheme } from "@/components/ToggleTheme";
import { getBestCombinations } from "@/lib/planner/optimizer";
import type { CombinationResult, DraftExam, Exam, ExamEntryMode, PlannerMessages } from "@/lib/planner/types";

import { AddExamModal } from "./AddExamModal";
import { ExamCard } from "./ExamCard";
import { NumberPicker } from "./NumberPicker";
import { ResultsSection } from "./ResultsSection";

type PlannerAppProps = {
    messages: PlannerMessages;
};

const ADD_EXAM_BUTTON_COOLDOWN = 1000;
const CALCULATE_ALERT_TIMEOUT = 5000;

export function PlannerApp({ messages }: PlannerAppProps): React.JSX.Element {
    const [exams, setExams] = useState<Exam[]>([]);
    const [sameTimeCount, setSameTimeCount] = useState(1);
    const [results, setResults] = useState<CombinationResult[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExamId, setEditingExamId] = useState<string | null>(null);
    const [addEntryMode, setAddEntryMode] = useState<ExamEntryMode>("single");
    const [isAddExamButtonLocked, setIsAddExamButtonLocked] = useState(false);
    const [calculateError, setCalculateError] = useState("");
    const [hasCalculated, setHasCalculated] = useState(false);

    const outputRef = useRef<HTMLDivElement>(null);
    const nextExamId = useRef(0);

    useEffect(() => {
        if (!calculateError) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            setCalculateError("");
        }, CALCULATE_ALERT_TIMEOUT);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [calculateError]);

    const closeModal = (): void => {
        setIsModalOpen(false);
        setEditingExamId(null);
        setAddEntryMode("single");
    };

    const openAddModal = (entryMode: ExamEntryMode = "single"): void => {
        if (isAddExamButtonLocked) {
            return;
        }

        setEditingExamId(null);
        setAddEntryMode(entryMode);
        setIsAddExamButtonLocked(true);
        setIsModalOpen(true);

        window.setTimeout(() => {
            setIsAddExamButtonLocked(false);
        }, ADD_EXAM_BUTTON_COOLDOWN);
    };

    const openEditModal = (exam: Exam): void => {
        setEditingExamId(exam.id);
        setIsModalOpen(true);
    };

    const saveExam = ({ name, dates, minDays }: DraftExam): void => {
        if (editingExamId) {
            setExams((currentExams) =>
                currentExams.map((exam) =>
                    exam.id === editingExamId
                        ? {
                              ...exam,
                              name,
                              dates,
                              minDays,
                          }
                        : exam,
                ),
            );

            closeModal();
            return;
        }

        setExams((currentExams) => [
            ...currentExams,
            {
                id: `exam-${nextExamId.current}`,
                name,
                dates,
                minDays,
            },
        ]);

        nextExamId.current += 1;
        closeModal();
    };

    const saveBulkExams = (draftExams: DraftExam[]): void => {
        setExams((currentExams) => [
            ...currentExams,
            ...draftExams.map((exam) => {
                const id = `exam-${nextExamId.current}`;
                nextExamId.current += 1;

                return {
                    id,
                    name: exam.name,
                    dates: exam.dates,
                    minDays: exam.minDays,
                };
            }),
        ]);

        closeModal();
    };

    const deleteExam = (examId: string): void => {
        setExams((currentExams) => currentExams.filter((exam) => exam.id !== examId));
    };

    const editingExam = editingExamId ? exams.find((exam) => exam.id === editingExamId) ?? null : null;

    const calculate = (): void => {
        const formattedExams = exams.map((exam) =>
            exam.dates.map((date) => ({
                name: exam.name,
                date: new Date(date),
                minDays: exam.minDays,
            })),
        );

        const nextResults = getBestCombinations(formattedExams, sameTimeCount);

        if (nextResults === -1) {
            setCalculateError(messages.calculateErrorMinExams);
            return;
        }

        if (nextResults === -2) {
            setCalculateError(messages.calculateErrorSameTime);
            return;
        }

        setCalculateError("");
        setResults(nextResults);
        setHasCalculated(true);

        window.setTimeout(() => {
            const output = outputRef.current;
            if (!output) {
                return;
            }

            const offset = 50;
            const targetPosition = output.getBoundingClientRect().top + window.scrollY - offset;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth",
            });
        }, 100);
    };

    return (
        <>
            {isModalOpen ? (
                <AddExamModal
                    key={editingExamId ?? `add-${addEntryMode}`}
                    isOpen={isModalOpen}
                    mode={editingExam ? "edit" : "add"}
                    initialEntryMode={addEntryMode}
                    initialDraft={
                        editingExam
                            ? {
                                  name: editingExam.name,
                                  dates: editingExam.dates,
                                  minDays: editingExam.minDays,
                              }
                            : null
                    }
                    existingNames={
                        exams
                            .filter((exam) => exam.id !== editingExamId)
                            .map((exam) => exam.name)
                    }
                    messages={messages}
                    onClose={closeModal}
                    onSave={saveExam}
                    onSaveBulk={saveBulkExams}
                />
            ) : null}

            <section className="container app-header">
                <div className="top-controls">
                    <ToggleTheme />
                </div>

                <div className="intro">
                    <h1>
                        {messages.heroTitle} <span>{messages.beta}</span>
                    </h1>
                    <p>{messages.heroDescription}</p>
                </div>
            </section>

            <section className="container workspace-section">
                <div className="input planner-input">
                    <div className="planner-layout">
                        <div className="planner-layout-main">
                            <div className="exams">
                                {exams.length === 0 ? (
                                    <div className="empty-add-actions" aria-label={messages.addExam}>
                                        <div className="empty-add-actions-links">
                                            <button
                                                type="button"
                                                className="link-action-button"
                                                onClick={() => openAddModal("single")}
                                                disabled={isAddExamButtonLocked}
                                            >
                                                {messages.emptyStateAddManually}
                                            </button>

                                            <span className="empty-add-actions-or">{messages.emptyStateOr}</span>

                                            <button
                                                type="button"
                                                className="link-action-button"
                                                onClick={() => openAddModal("bulk")}
                                                disabled={isAddExamButtonLocked}
                                            >
                                                {messages.emptyStateAddByPasting}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        id="addExamButton"
                                        type="button"
                                        className="add-exam-button"
                                        onClick={() => openAddModal("single")}
                                        disabled={isAddExamButtonLocked}
                                    >
                                        {messages.addExam}
                                    </button>
                                )}

                                {exams.map((exam) => (
                                    <ExamCard
                                        key={exam.id}
                                        exam={exam}
                                        messages={messages}
                                        onEdit={openEditModal}
                                        onDelete={deleteExam}
                                    />
                                ))}
                            </div>
                        </div>

                        <aside className="planner-layout-side" aria-label={messages.sameTimeQuestion}>
                            <div className="planner-side-block exams-at-the-same-time">
                                <p>{messages.sameTimeQuestion}</p>
                                <NumberPicker
                                    value={sameTimeCount}
                                    onDecrease={() =>
                                        setSameTimeCount((current) => (current > 1 ? current - 1 : current))
                                    }
                                    onIncrease={() => setSameTimeCount((current) => current + 1)}
                                    decrementLabel="Decrease exams prepared at the same time"
                                    incrementLabel="Increase exams prepared at the same time"
                                />
                            </div>

                            <div className="planner-side-block calculate">
                                {calculateError ? (
                                    <div id="alertCalculate">{calculateError}</div>
                                ) : (
                                    <div id="alertCalculate" />
                                )}
                                <button id="calculateButton" type="button" onClick={calculate}>
                                    {messages.calculate}
                                </button>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            <ResultsSection
                results={results}
                sameTimeCount={sameTimeCount}
                messages={messages}
                isVisible={hasCalculated}
                sectionRef={outputRef}
            />

            <footer className="container page-footer">
                <p>
                    {messages.footerPrefix}{" "}
                    <a href={messages.footerUrl} target="_blank" rel="noreferrer">
                        {messages.footerAuthor}
                    </a>
                </p>
            </footer>
        </>
    );
}
