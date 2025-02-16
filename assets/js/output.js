import { getBestCombinations, getExamPreparedAtTheSameTime } from './script.js';

const alertCalculate = document.getElementById('alertCalculate');
const calculateBtn = document.getElementById('calculateButton');

calculateBtn.addEventListener('click', () => {
    bestCombinations = getBestCombinations();
    examPreparedAtTheSameTime = getExamPreparedAtTheSameTime();

    if (bestCombinations === -1) {
        alertCalculate.style.display = "block";
        alertCalculate.textContent = 'Insert at least two exams';
        return;
    }

    if (bestCombinations === -2) {
        alertCalculate.style.display = "block";
        alertCalculate.textContent = 'The exams prepared at the same time must be less than total number of exams';
        return;
    }

    if (alertCalculate.style.display === "block") {
        alertCalculate.style.display = "none";
    }

    renderResults();
});

let bestCombinations;
let examPreparedAtTheSameTime;

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-GB');
}
  
function renderResults() {
    const outputText = document.querySelector('.output-text');
    const outputComb = document.querySelector('.combination-cards');

    outputText.innerHTML = `
        <h2>Best Combinations</h2>
        <p>These combinations have been evaluated considering the preparation of <span class="bold">${examPreparedAtTheSameTime} ${examPreparedAtTheSameTime === 1 ? 'exam' : 'exams'}</span> at the same time.</p>
        <p>Each combination has a score in the top right corner showing how optimal it is.</p>
    `;

    outputComb.innerHTML = bestCombinations.map((item, index) => {
        const rankClass = index < 3 ? `rank-${index + 1}` : '';
        return `
            <div class="combination-card ${rankClass}">
                <div class="score-badge">${item.score.toFixed(0)}</div>
                <h3>Combination ${index + 1}</h3>
                <ul class="exam-list">
                ${item.combination.map(exam => `
                    <li class="exam-item">
                        <span class="exam-name">${exam.name}</span>
                        <span class="exam-date">${formatDate(exam.date)}</span>
                    </li>
                `).join('')}
                </ul>
            </div>
        `;
    }).join('');
}