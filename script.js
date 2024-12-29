const input = [
    [ {name: "Math", date: new Date("2024-12-29")}, {name: "Math", date: new Date("2024-12-01")} ],
    [ {name: "Phisics", date: new Date("2024-11-20")} ],
    [ {name: "Electronics", date: new Date("2024-10-29")}, {name: "Electronics", date: new Date("2024-03-01")}, {name: "Electronics", date: new Date("2024-05-01")} ]
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

const combinations = allCombinations(input);

bestCombinations = [];
maxSize = 5;

combinations.forEach(elem => evaluateCombination(elem));

// evaluates the combination giving it a score
function evaluateCombination(combination) {
    totalDays = (combination[combination.length - 1].date - combination[0].date) / (1000 * 60 * 60 * 24);
    
    // rest of the evaluation logic...
}

// score = weight1 * totalDays - weight2 * balance