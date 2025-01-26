const input = [
    [
        { name: "Ingegneria del SW", date: new Date("2025-01-13"), reqDays: -1 },
        { name: "Ingegneria del SW", date: new Date("2025-01-31"), reqDays: -1 }
    ],
    [
        { name: "Elettronica", date: new Date("2025-01-16"), reqDays: 30 },
        { name: "Elettronica", date: new Date("2025-02-07"), reqDays: 30 }
    ],
    [
        { name: "Basi Dati", date: new Date("2025-01-20"), reqDays: -1 },
        { name: "Basi Dati", date: new Date("2025-02-03"), reqDays: -1 }
    ],
    [
        { name: "Reti Logiche", date: new Date("2025-01-24"), reqDays: -1 },
        { name: "Reti Logiche", date: new Date("2025-02-14"), reqDays: -1 }
    ],
    [
        { name: "Sistemi Informativi", date: new Date("2025-01-27"), reqDays: -1 },
        { name: "Sistemi Informativi", date: new Date("2025-02-11"), reqDays: -1 }
    ]
];

export function getDates() {
    return input;
}