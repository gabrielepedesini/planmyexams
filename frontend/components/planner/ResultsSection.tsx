import { toGbDate } from "@/lib/planner/date";
import type { CombinationResult, PlannerMessages } from "@/lib/planner/types";

type ResultsSectionProps = {
    results: CombinationResult[];
    sameTimeCount: number;
    messages: PlannerMessages;
    isVisible: boolean;
    sectionRef: React.RefObject<HTMLDivElement | null>;
};

export function ResultsSection({
    results,
    sameTimeCount,
    messages,
    isVisible,
    sectionRef,
}: ResultsSectionProps): React.JSX.Element {
    return (
        <section className="container output-section">
            <div className={`output ${isVisible ? "show" : ""}`} ref={sectionRef}>
                <div className="output-text">
                    <h2>{messages.outputTitle}</h2>
                    <p>
                        {messages.outputDescriptionPrefix} <span className="bold">{sameTimeCount} </span>
                        <span className="bold">
                            {sameTimeCount === 1
                                ? messages.outputDescriptionExamSingular
                                : messages.outputDescriptionExamPlural}
                        </span>{" "}
                        {messages.outputDescriptionSuffix}
                    </p>
                    <p>{messages.outputScoreHint}</p>
                </div>

                <div className="combination-cards">
                    {results.map((item, index) => {
                        const rankClass = index < 3 ? `rank-${index + 1}` : "";

                        return (
                            <article className={`combination-card ${rankClass}`} key={`${item.score}-${index}`}>
                                <div className="score-badge">{item.score.toFixed(0)}</div>
                                <h3>
                                    {messages.combination} {index + 1}
                                </h3>
                                <ul className="exam-list">
                                    {item.combination.map((exam) => (
                                        <li
                                            className="exam-item"
                                            key={`${exam.name}-${exam.date.getTime()}-${index}`}
                                        >
                                            <span className="exam-name">{exam.name}</span>
                                            <span className="exam-date">{toGbDate(exam.date)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
