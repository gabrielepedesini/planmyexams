const exams = [
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

// const exams = [
//     [
//         { name: "Biochimica Applicata", date: new Date("2025-02-05"), reqDays: -1 },
//         { name: "Biochimica Applicata", date: new Date("2025-02-19"), reqDays: -1 },
//         { name: "Biochimica Applicata", date: new Date("2025-05-07"), reqDays: -1 }
//     ],
//     [
//         { name: "Farmacologia", date: new Date("2025-01-28"), reqDays: -1 },
//         { name: "Farmacologia", date: new Date("2025-02-11"), reqDays: -1 },
//         { name: "Farmacologia", date: new Date("2025-02-25"), reqDays: -1 },
//         { name: "Farmacologia", date: new Date("2025-05-06"), reqDays: -1 }
//     ],
//     [
//         { name: "Chimica Organica II", date: new Date("2025-01-29"), reqDays: -1 },
//         { name: "Chimica Organica II", date: new Date("2025-02-24"), reqDays: -1 },
//         { name: "Chimica Organica II", date: new Date("2025-05-05"), reqDays: -1 }
//     ],
//     [
//         { name: "Chimica Farmaceutica", date: new Date("2025-02-13"), reqDays: -1 }
//     ]
// ];

// const exams = [
//     [
//         { name: "Ingegneria del SW", date: new Date("2025-01-13"), reqDays: -1 },
//         { name: "Ingegneria del SW", date: new Date("2025-01-31"), reqDays: -1 },
//         { name: "Ingegneria del SW", date: new Date("2025-02-15"), reqDays: -1 }
//     ],
//     [
//         { name: "Elettronica", date: new Date("2025-01-16"), reqDays: -1 },
//         { name: "Elettronica", date: new Date("2025-02-07"), reqDays: -1 },
//         { name: "Elettronica", date: new Date("2025-02-25"), reqDays: -1 }
//     ],
//     [
//         { name: "Basi Dati", date: new Date("2025-01-20"), reqDays: -1 },
//         { name: "Basi Dati", date: new Date("2025-02-03"), reqDays: -1 },
//         { name: "Basi Dati", date: new Date("2025-02-20"), reqDays: -1 },
//         { name: "Basi Dati", date: new Date("2025-03-01"), reqDays: -1 }
//     ],
//     [
//         { name: "Reti Logiche", date: new Date("2025-01-24"), reqDays: -1 },
//         { name: "Reti Logiche", date: new Date("2025-02-14"), reqDays: -1 },
//         { name: "Reti Logiche", date: new Date("2025-03-01"), reqDays: -1 },
//         { name: "Reti Logiche", date: new Date("2025-03-20"), reqDays: -1 }
//     ],
//     [
//         { name: "Sistemi Informativi", date: new Date("2025-01-27"), reqDays: -1 },
//         { name: "Sistemi Informativi", date: new Date("2025-02-11"), reqDays: -1 },
//         { name: "Sistemi Informativi", date: new Date("2025-02-25"), reqDays: -1 },
//         { name: "Sistemi Informativi", date: new Date("2025-03-10"), reqDays: -1 }
//     ],
//     [
//         { name: "Matematica", date: new Date("2025-01-18"), reqDays: -1 },
//         { name: "Matematica", date: new Date("2025-02-01"), reqDays: -1 },
//         { name: "Matematica", date: new Date("2025-02-20"), reqDays: -1 },
//         { name: "Matematica", date: new Date("2025-03-05"), reqDays: -1 }
//     ],
//     [
//         { name: "Fisica", date: new Date("2025-01-22"), reqDays: -1 },
//         { name: "Fisica", date: new Date("2025-02-15"), reqDays: -1 },
//         { name: "Fisica", date: new Date("2025-03-01"), reqDays: -1 },
//         { name: "Fisica", date: new Date("2025-03-18"), reqDays: -1 }
//     ],
//     [
//         { name: "Programmazione", date: new Date("2025-01-25"), reqDays: -1 },
//         { name: "Programmazione", date: new Date("2025-02-08"), reqDays: -1 },
//         { name: "Programmazione", date: new Date("2025-02-28"), reqDays: -1 },
//         { name: "Programmazione", date: new Date("2025-03-15"), reqDays: -1 }
//     ],
//     [
//         { name: "Chimica", date: new Date("2025-01-30"), reqDays: -1 },
//         { name: "Chimica", date: new Date("2025-02-18"), reqDays: -1 },
//         { name: "Chimica", date: new Date("2025-03-05"), reqDays: -1 },
//         { name: "Chimica", date: new Date("2025-03-25"), reqDays: -1 }
//     ],
//     [
//         { name: "Statistica", date: new Date("2025-02-03"), reqDays: -1 },
//         { name: "Statistica", date: new Date("2025-02-20"), reqDays: -1 },
//         { name: "Statistica", date: new Date("2025-03-08"), reqDays: -1 },
//         { name: "Statistica", date: new Date("2025-03-22"), reqDays: -1 }
//     ]
// ];

let examPreparedAtTheSameTime = 1;

// generates all the possible combinations
function allCombinations(groups) {
    let result = groups.reduce((acc, group) => {
        let temp = [];
        acc.forEach(a => {
            group.forEach(b => {
                temp.push([...a, b]);
            });
        });
        return temp;
    }, [[]]);

    result.forEach(elem => {
        elem.sort((a, b) => a.date - b.date);
    });

    return result;
}

// calculates the number of days between first date and last
function calcTotalDays(comb) {
    let millisecondsInADay = 1000 * 60 * 60 * 24;

    return (comb[comb.length - 1].date - comb[0].date) / millisecondsInADay;
}

// calculates the balance of adjacent exam distances (max distance - min distance)
function calcBalance(comb) {
    const distances = [];
    let sum = 0;
    let millisecondsInADay = 1000 * 60 * 60 * 24;
    let num = examPreparedAtTheSameTime;

    for (let i = num; i < comb.length; i++) {
        const distance = (comb[i].date - comb[i - num].date) / millisecondsInADay;
        distances.push(distance);
        sum += distance;

        if (distance < comb[i].reqDays) {
            return -1;
        }
     }

    const avgDistance = sum / (comb.length - 1);
    const variance = distances.reduce((acc, dist) => 
        acc + Math.pow(dist - avgDistance, 2), 0) / distances.length;
    
    return Math.sqrt(variance);
}

// calculates the penalty in case of exams on the same day
function calcSameDay(comb) {
    let penalty = 0;
    let i = 0;
    
    while (i < comb.length) {
        let sameDayCount = 1;
        let j = i + 1;
        
        while (j < comb.length && comb[i].date.getTime() === comb[j].date.getTime()) {
            sameDayCount++;
            j++;
        }
        
        if (sameDayCount > 1) {
            penalty += Math.pow(sameDayCount, 2);
        }
        
        i = j;
    }
    
    return penalty;
}

// evaluates the combination giving it a score
function evaluateCombination(combination) {
    const totalDays = calcTotalDays(combination);
    const balance = calcBalance(combination);
    const sameDay = calcSameDay(combination);

    if (balance == -1) {  // in case of insufficient time before an exam
        return;
    }
   
    const weight1 = 1;
    const weight2 = 2;
    const weight3 = 5;
    let score = (weight1 * totalDays) - (weight2 * balance) - (weight3 * sameDay);

    bestCombinationsInsert(combination, score);
}

// best combinations
let bestCombinations = [];
const maxSize = 5;

// inserts the combination into the best ones, sorts those and ensures that they are less or equal than maxSize
function bestCombinationsInsert(comb, s) {
    option = {
        score: s,
        combination: comb
    };

    bestCombinations.push(option);

    bestCombinations.sort((a, b) => (b.score - a.score));

    while (bestCombinations.length > maxSize) {
        bestCombinations.pop();
    }
}

// main
const combinations = allCombinations(exams);

console.log(combinations.length);

combinations.forEach(elem => evaluateCombination(elem));

document.querySelector('.exam').innerHTML = `Exams prepared at the same time: ${examPreparedAtTheSameTime}`;

const renderContainer = document.querySelector('.render');

let content = ''; 

for (let i = 0; i < bestCombinations.length; i++) {
    let comb = bestCombinations[i];
    content += `
        <li>
            <h3>Combination ${i + 1}</h3>
            <p>Score: ${comb.score.toFixed(2)}</p>
            <table border="1" border-collapse: collapse;">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Data</th>
                    </tr>
                </thead>
                <tbody>
    `;

    comb.combination.forEach(elem => {
        let date = new Date(elem.date);
        let formattedDate = date.toLocaleDateString('it-IT'); 
        content += `
                <tr>
                    <td>${elem.name}</td>
                    <td>${formattedDate}</td>
                </tr>
        `;
    });

    content += `
                </tbody>
            </table>
        </li>
    `;
}

if (bestCombinations.length === 0) {
    content = `<p>No combination meets the requirments...</p>`;
}

renderContainer.innerHTML = content;