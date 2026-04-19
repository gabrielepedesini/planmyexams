import type { CombinationResult, ExamGroups, ExamOption } from "./types";

const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;
const MAX_RESULTS = 10;

export function allCombinations(groups: ExamGroups): ExamOption[][] {
    const result = groups.reduce<ExamOption[][]>((accumulator, group) => {
        const temp: ExamOption[][] = [];

        accumulator.forEach((accumulatedItem) => {
            group.forEach((groupItem) => {
                temp.push([...accumulatedItem, groupItem]);
            });
        });

        return temp;
    }, [[]]);

    result.forEach((combination) => {
        combination.sort((a, b) => a.date.getTime() - b.date.getTime());
    });

    return result;
}

function calcTotalDays(combination: ExamOption[]): number {
    return (
        (combination[combination.length - 1].date.getTime() - combination[0].date.getTime()) /
        MILLISECONDS_IN_A_DAY
    );
}

function calcBalance(combination: ExamOption[], sameTimeCount: number): number {
    const distances: number[] = [];
    let sum = 0;

    for (let index = sameTimeCount; index < combination.length; index += 1) {
        const distance =
            (combination[index].date.getTime() - combination[index - sameTimeCount].date.getTime()) /
            MILLISECONDS_IN_A_DAY;

        distances.push(distance);
        sum += distance;

        if (distance < combination[index].minDays) {
            return -1;
        }
    }

    const avgDistance = sum / (combination.length - 1);
    const variance =
        distances.reduce((accumulator, distance) => accumulator + Math.pow(distance - avgDistance, 2), 0) /
        distances.length;

    return Math.sqrt(variance);
}

function calcSameDay(combination: ExamOption[]): number {
    let penalty = 0;
    let index = 0;

    while (index < combination.length) {
        let sameDayCount = 1;
        let nextIndex = index + 1;

        while (
            nextIndex < combination.length &&
            combination[index].date.getTime() === combination[nextIndex].date.getTime()
        ) {
            sameDayCount += 1;
            nextIndex += 1;
        }

        if (sameDayCount > 1) {
            penalty += Math.pow(sameDayCount, 2);
        }

        index = nextIndex;
    }

    return penalty;
}

function evaluateCombination(
    combination: ExamOption[],
    sameTimeCount: number,
    bestCombinations: CombinationResult[],
): void {
    const totalDays = calcTotalDays(combination);
    const balance = calcBalance(combination, sameTimeCount);
    const sameDay = calcSameDay(combination);

    if (balance === -1) {
        return;
    }

    const weight1 = 1 * sameTimeCount;
    const weight2 = 2;
    const weight3 = 5.5;
    const score = weight1 * totalDays - weight2 * balance - weight3 * sameDay;

    const option: CombinationResult = {
        score,
        combination,
    };

    bestCombinations.push(option);
    bestCombinations.sort((a, b) => b.score - a.score);

    while (bestCombinations.length > MAX_RESULTS) {
        bestCombinations.pop();
    }
}

export function getBestCombinations(
    examGroups: ExamGroups,
    sameTimeCount: number,
): CombinationResult[] | -1 | -2 {
    if (examGroups.length < 2) {
        return -1;
    }

    if (sameTimeCount >= examGroups.length) {
        return -2;
    }

    const combinations = allCombinations(examGroups);
    const bestCombinations: CombinationResult[] = [];

    combinations.forEach((combination) => {
        evaluateCombination(combination, sameTimeCount, bestCombinations);
    });

    return bestCombinations;
}
