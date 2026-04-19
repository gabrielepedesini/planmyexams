import { getBestCombinations, getExamPreparedAtTheSameTime } from './script.js';

const alertCalculate = document.getElementById('alertCalculate');
const calculateBtn = document.getElementById('calculateButton');

// calulate combination event listener
calculateBtn.addEventListener('click', () => {
    bestCombinations = getBestCombinations();
    examPreparedAtTheSameTime = getExamPreparedAtTheSameTime();

    if (bestCombinations === -1) {
        alertCalculate.style.display = "block";
        alertCalculate.textContent = 'Insert at least two exams';
        
        setTimeout(() => {
            alertCalculate.style.display = "none";
        }, 5000);
        return;
    }

    if (bestCombinations === -2) {
        alertCalculate.style.display = "block";
        alertCalculate.textContent = "The number of exams prepared at the same time must be less than the total number of exams";

        setTimeout(() => {
            alertCalculate.style.display = "none";
        }, 5000);
        return;
    }

    if (alertCalculate.style.display === "block") {
        alertCalculate.style.display = "none";
    }

    renderResults();

    // scroll to output section
    setTimeout(() => {
        const container = document.querySelector('.output');
        const offset = 50; 
        const targetPosition = container.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }, 100);
});

let bestCombinations;
let examPreparedAtTheSameTime;

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-GB');
}
  
// renders results
function renderResults() {
    const output = document.querySelector('.output');
    const outputText = document.querySelector('.output-text');
    const outputComb = document.querySelector('.combination-cards');

    output.style.display = 'block';

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