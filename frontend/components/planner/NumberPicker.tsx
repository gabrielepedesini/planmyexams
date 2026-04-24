import { FiMinus, FiPlus } from "react-icons/fi";

type NumberPickerProps = {
    value: number;
    onDecrease: () => void;
    onIncrease: () => void;
    decrementLabel: string;
    incrementLabel: string;
};

export function NumberPicker({
    value,
    onDecrease,
    onIncrease,
    decrementLabel,
    incrementLabel,
}: NumberPickerProps): React.JSX.Element {
    return (
        <div className="custom-number-picker">
            <button className="picker-decrement" onClick={onDecrease} type="button" aria-label={decrementLabel}>
                <FiMinus aria-hidden="true" focusable="false" />
            </button>
            <div className="picker-number">{value}</div>
            <button className="picker-increment" onClick={onIncrease} type="button" aria-label={incrementLabel}>
                <FiPlus aria-hidden="true" focusable="false" />
            </button>
        </div>
    );
}
