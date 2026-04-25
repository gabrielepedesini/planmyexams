"use client";

import { useRef, useState } from "react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { FiClipboard, FiPlusCircle, FiZap } from "react-icons/fi";

import { ToggleTheme } from "@/components/ToggleTheme";
import { useToast } from "@/components/ToastProvider";
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

export function PlannerApp({ messages }: PlannerAppProps): React.JSX.Element {
    const [exams, setExams] = useState<Exam[]>([]);
    const [sameTimeCount, setSameTimeCount] = useState(1);
    const [results, setResults] = useState<CombinationResult[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExamId, setEditingExamId] = useState<string | null>(null);
    const [addEntryMode, setAddEntryMode] = useState<ExamEntryMode>("single");
    const [isAddExamButtonLocked, setIsAddExamButtonLocked] = useState(false);
    const [hasCalculated, setHasCalculated] = useState(false);

    const { showToast } = useToast();

    const outputRef = useRef<HTMLDivElement>(null);
    const nextExamId = useRef(0);

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

            setResults([]);
            setHasCalculated(false);

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

        setResults([]);
        setHasCalculated(false);

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

        setResults([]);
        setHasCalculated(false);

        closeModal();
    };

    const deleteExam = (examId: string): void => {
        setExams((currentExams) => currentExams.filter((exam) => exam.id !== examId));
        setResults([]);
        setHasCalculated(false);
    };

    const hasExams = exams.length > 0;

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
            showToast(messages.calculateErrorMinExams, { variant: "error" });
            return;
        }

        if (nextResults === -2) {
            showToast(messages.calculateErrorSameTime, { variant: "error" });
            return;
        }

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
                    <div className={`planner-layout${hasExams ? "" : " planner-layout-empty"}`}>
                        <div className="planner-layout-main">
                            <div className="exams">
                                {!hasExams ? (
                                    <div className="empty-add-actions" aria-label={messages.addExam}>
                                        <div className="empty-add-actions-links">
                                            <button
                                                type="button"
                                                className="link-action-button button-with-icon"
                                                onClick={() => openAddModal("single")}
                                                disabled={isAddExamButtonLocked}
                                            >
                                                <FiPlusCircle className="button-icon" aria-hidden="true" focusable="false" />
                                                {messages.emptyStateAddManually}
                                            </button>

                                            <span className="empty-add-actions-or">{messages.emptyStateOr}</span>

                                            <button
                                                type="button"
                                                className="link-action-button button-with-icon"
                                                onClick={() => openAddModal("bulk")}
                                                disabled={isAddExamButtonLocked}
                                            >
                                                <FiClipboard className="button-icon" aria-hidden="true" focusable="false" />
                                                {messages.emptyStateAddByPasting}
                                            </button>
                                        </div>
                                    </div>
                                ) : null}

                                {exams.map((exam) => (
                                    <ExamCard
                                        key={exam.id}
                                        exam={exam}
                                        messages={messages}
                                        onEdit={openEditModal}
                                        onDelete={deleteExam}
                                    />
                                ))}

                                {hasExams ? (
                                    <button
                                        id="addExamButton"
                                        type="button"
                                        className="add-exam-button button-with-icon"
                                        onClick={() => openAddModal("single")}
                                        disabled={isAddExamButtonLocked}
                                    >
                                        <FiPlusCircle className="button-icon" aria-hidden="true" focusable="false" />
                                        {messages.addExam}
                                    </button>
                                ) : null}
                            </div>
                        </div>

                        {hasExams ? (
                            <>
                                <div className="divider"></div>

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
                                        <button
                                            id="calculateButton"
                                            className="button-with-icon"
                                            type="button"
                                            onClick={calculate}
                                        >
                                            <FiZap className="button-icon" aria-hidden="true" focusable="false" />
                                            {messages.calculate}
                                        </button>
                                    </div>
                                </aside>
                            </>
                        ) : null}
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

            <footer className="page-footer">
                <div className="container site-footer-inner">
                    <p className="site-footer-copy">
                        © {new Date().getFullYear()} {messages.heroTitle}
                    </p>

                    <div className="site-footer-links">
                        <a
                            className="site-footer-link"
                            href="https://github.com/gabrielepedesini/"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Open GitHub repository"
                            title="GitHub"
                        >
                            <FaGithub className="site-footer-icon" aria-hidden="true" focusable="false" />
                        </a>

                        <a
                            className="site-footer-link"
                            href="https://www.linkedin.com/in/gabrielepedesini/"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Open LinkedIn profile"
                            title="LinkedIn"
                        >
                            <FaLinkedinIn className="site-footer-icon" aria-hidden="true" focusable="false" />
                        </a>
                    </div>
                </div>
            </footer>
        </>
    );
}
