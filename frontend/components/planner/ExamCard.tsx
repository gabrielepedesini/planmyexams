import { toGbDate } from "@/lib/planner/date";
import type { Exam, PlannerMessages } from "@/lib/planner/types";

type ExamCardProps = {
    exam: Exam;
    messages: PlannerMessages;
    onDelete: (id: string) => void;
};

export function ExamCard({ exam, messages, onDelete }: ExamCardProps): React.JSX.Element {
    return (
        <article className="exam">
            <h3>{exam.name}</h3>

            <div className="exam-dates">
                <h4>{messages.datesLabel}</h4>
                <ul>
                    {exam.dates.map((date) => (
                        <li key={`${exam.id}-${date.getTime()}`}>{toGbDate(date)}</li>
                    ))}
                </ul>
            </div>

            {exam.minDays > 0 ? (
                <div className="required-days">
                    <h4>{messages.requiredDays}</h4>
                    <div className="required-days-number">{exam.minDays}</div>
                </div>
            ) : null}

            <button className="button-alt delete-exam-btn" type="button" onClick={() => onDelete(exam.id)}>
                {messages.delete}
            </button>
        </article>
    );
}
