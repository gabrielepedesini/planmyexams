import { getBestCombinations, getExamPreparedAtTheSameTime } from './script.js';

const bestCombinations = getBestCombinations();

const examPreparedAtTheSameTime = getExamPreparedAtTheSameTime();

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