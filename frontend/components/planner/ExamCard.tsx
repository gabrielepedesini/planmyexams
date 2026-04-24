import { toGbDate } from "@/lib/planner/date";
import type { Exam, PlannerMessages } from "@/lib/planner/types";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

type ExamCardProps = {
    exam: Exam;
    messages: PlannerMessages;
    onEdit: (exam: Exam) => void;
    onDelete: (id: string) => void;
};

export function ExamCard({ exam, messages, onEdit, onDelete }: ExamCardProps): React.JSX.Element {
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

            <div className="exam-actions">
                <button className="button-alt edit-exam-btn button-with-icon" type="button" onClick={() => onEdit(exam)}>
                    <FiEdit2 className="button-icon" aria-hidden="true" focusable="false" />
                    {messages.edit}
                </button>
                <button className="button-alt delete-exam-btn button-with-icon" type="button" onClick={() => onDelete(exam.id)}>
                    <FiTrash2 className="button-icon" aria-hidden="true" focusable="false" />
                    {messages.delete}
                </button>
            </div>
        </article>
    );
}
