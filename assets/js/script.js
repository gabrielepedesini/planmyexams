import { getExamsInfo } from './input.js';

// get user exams informations
let exams;

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

        if (distance < comb[i].minDays) {
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
const maxSize = 10;

// inserts the combination into the best ones, sorts those and ensures that they are less or equal than maxSize
function bestCombinationsInsert(comb, s) {
    let option = {
        score: s,
        combination: comb
    };

    bestCombinations.push(option);

    bestCombinations.sort((a, b) => (b.score - a.score));

    while (bestCombinations.length > maxSize) {
        bestCombinations.pop();
    }
}

// number of exams at the same time picker
const decrementButton = document.getElementById('decrementAtSameTime');
const incrementButton = document.getElementById('incrementAtSameTime');
const numberDisplay = document.getElementById('atSameTime');

let examPreparedAtTheSameTime = 1;

function updateNumberDisplay() {
    numberDisplay.textContent = examPreparedAtTheSameTime;
}

decrementButton.addEventListener('click', () => {
    if (examPreparedAtTheSameTime > 1) {
        examPreparedAtTheSameTime--;
        updateNumberDisplay();
    }
});

incrementButton.addEventListener('click', () => {
    examPreparedAtTheSameTime++;
    updateNumberDisplay();
});

// extract number of exams prepared at the same time
export function getExamPreparedAtTheSameTime() {
    return examPreparedAtTheSameTime;
}

// extract best combinations
export function getBestCombinations() {

    // reset best combinations
    bestCombinations = [];
    
    // get exams info
    exams = getExamsInfo();

    // less than 2 exams
    if (exams.length < 2) {
        return -1;
    }

    // less exams than num of exams prepared at the same time
    if (getExamPreparedAtTheSameTime() >= exams.length) {
        return -2;
    }

    getExamPreparedAtTheSameTime()

    // calculate all possible combinations
    const combinations = allCombinations(exams);

    // evaluate all combination
    combinations.forEach(elem => evaluateCombination(elem));

    return bestCombinations;
}