"use client";

import { useEffect, useRef } from "react";

import { parseGbDate, toGbDate } from "@/lib/planner/date";

type DatePickerInputProps = {
    id: string;
    value: string;
    placeholder: string;
    onChange: (nextValue: string) => void;
};

export function DatePickerInput({ id, value, placeholder, onChange }: DatePickerInputProps): React.JSX.Element {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        let isActive = true;
        let datepicker: { destroy: () => void } | null = null;

        const setup = async () => {
            const input = inputRef.current;
            if (!input) {
                return;
            }

            const [{ default: AirDatepicker }, { default: localeEn }] = await Promise.all([
                import("air-datepicker"),
                import("air-datepicker/locale/en"),
            ]);

            if (!isActive || !inputRef.current) {
                return;
            }

            datepicker = new AirDatepicker(input, {
                locale: {
                    ...localeEn,
                    firstDay: 1,
                },
                autoClose: true,
                dateFormat(date: Date): string {
                    return toGbDate(date);
                },
                onSelect({ date }: { date: Date | Date[] | undefined }) {
                    if (!date) {
                        onChange("");
                        return;
                    }

                    if (Array.isArray(date)) {
                        if (date[0]) {
                            onChange(toGbDate(date[0]));
                        }
                        return;
                    }

                    onChange(toGbDate(date));
                },
            });

            const parsedDate = parseGbDate(value);
            if (parsedDate) {
                input.value = toGbDate(parsedDate);
            } else {
                input.value = value;
            }
        };

        setup();

        return () => {
            isActive = false;
            if (datepicker) {
                datepicker.destroy();
            }
        };
    }, [onChange, value]);

    return (
        <input
            id={id}
            ref={inputRef}
            className="datepicker"
            type="text"
            readOnly
            placeholder={placeholder}
            value={value}
            onChange={() => {
                // Input is readonly; date changes come from AirDatepicker callback.
            }}
        />
    );
}
