const exams = [
    [
        { name: "Ingegneria del SW", date: new Date("2025-01-13") },
        { name: "Ingegneria del SW", date: new Date("2025-01-31") }
    ],
    [
        { name: "Elettronica", date: new Date("2025-01-16") }
        // { name: "Elettronica", date: new Date("2025-02-07") }
    ],
    [
        { name: "Basi Dati", date: new Date("2025-01-20") },
        { name: "Basi Dati", date: new Date("2025-02-03") }
    ],
    [
        { name: "Reti Logiche", date: new Date("2025-01-24") },
        { name: "Reti Logiche", date: new Date("2025-02-14") }
    ],
    [
        { name: "Sistemi Informativi", date: new Date("2025-01-27") },
        { name: "Sistemi Informativi", date: new Date("2025-02-11") }
    ]
];

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

    for (let i = 1; i < comb.length; i++) {
        const distance = (comb[i].date - comb[i - 1].date) / millisecondsInADay;
        distances.push(distance);
        sum += distance;
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

combinations.forEach(elem => evaluateCombination(elem));

console.log(bestCombinations);