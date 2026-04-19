"use client";

import { useEffect, useRef, useState } from "react";

import { ToggleTheme } from "@/components/ToggleTheme";
import { getBestCombinations } from "@/lib/planner/optimizer";
import type { CombinationResult, Exam, PlannerMessages } from "@/lib/planner/types";

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
    const [nextExamId, setNextExamId] = useState(0);
    const [sameTimeCount, setSameTimeCount] = useState(1);
    const [results, setResults] = useState<CombinationResult[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddExamButtonLocked, setIsAddExamButtonLocked] = useState(false);
    const [calculateError, setCalculateError] = useState("");
    const [hasCalculated, setHasCalculated] = useState(false);

    const outputRef = useRef<HTMLDivElement>(null);

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

    const openModal = (): void => {
        if (isAddExamButtonLocked) {
            return;
        }

        setIsAddExamButtonLocked(true);
        setIsModalOpen(true);

        window.setTimeout(() => {
            setIsAddExamButtonLocked(false);
        }, ADD_EXAM_BUTTON_COOLDOWN);
    };

    const saveExam = ({ name, dates, minDays }: { name: string; dates: Date[]; minDays: number }): void => {
        setExams((currentExams) => [
            ...currentExams,
            {
                id: `exam-${nextExamId}`,
                name,
                dates,
                minDays,
            },
        ]);

        setNextExamId((currentId) => currentId + 1);
        setIsModalOpen(false);
    };

    const deleteExam = (examId: string): void => {
        setExams((currentExams) => currentExams.filter((exam) => exam.id !== examId));
    };

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
            <AddExamModal
                isOpen={isModalOpen}
                existingNames={exams.map((exam) => exam.name)}
                messages={messages}
                onClose={() => setIsModalOpen(false)}
                onSave={saveExam}
            />

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
                                <button
                                    id="addExamButton"
                                    type="button"
                                    className="add-exam-button"
                                    onClick={openModal}
                                    disabled={isAddExamButtonLocked}
                                >
                                    {messages.addExam}
                                </button>

                                {exams.map((exam) => (
                                    <ExamCard key={exam.id} exam={exam} messages={messages} onDelete={deleteExam} />
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
