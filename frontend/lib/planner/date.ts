const DATE_SEPARATOR = "/";

export function parseGbDate(value: string): Date | null {
    const trimmed = value.trim();
    if (!trimmed) {
        return null;
    }

    const parts = trimmed.split(DATE_SEPARATOR);
    if (parts.length !== 3) {
        return null;
    }

    const [day, month, year] = parts;
    const isoDate = `${year}-${month}-${day}`;
    const parsed = new Date(isoDate);

    if (Number.isNaN(parsed.getTime())) {
        return null;
    }

    return parsed;
}

export function toGbDate(value: Date): string {
    return value.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

export function normalizeDates(dateStrings: string[]): Date[] {
    const uniqueDateStrings = [
        ...new Set(
            dateStrings.map((dateString) => {
                const [day, month, year] = dateString.split(DATE_SEPARATOR);
                return `${year}-${month}-${day}`;
            }),
        ),
    ];

    const dates = uniqueDateStrings
        .map((dateString) => new Date(dateString))
        .filter((date) => !Number.isNaN(date.getTime()));

    dates.sort((a, b) => a.getTime() - b.getTime());

    return dates;
}
