const input = [
    [
        { name: "Ingegneria del SW", date: new Date("2025-01-13"), minDays: -1 },
        { name: "Ingegneria del SW", date: new Date("2025-01-31"), minDays: -1 }
    ],
    [
        { name: "Elettronica", date: new Date("2025-01-16"), minDays: 30 },
        { name: "Elettronica", date: new Date("2025-02-07"), minDays: 30 }
    ],
    [
        { name: "Basi Dati", date: new Date("2025-01-20"), minDays: -1 },
        { name: "Basi Dati", date: new Date("2025-02-03"), minDays: -1 }
    ],
    [
        { name: "Reti Logiche", date: new Date("2025-01-24"), minDays: -1 },
        { name: "Reti Logiche", date: new Date("2025-02-14"), minDays: -1 }
    ],
    [
        { name: "Sistemi Informativi", date: new Date("2025-01-27"), minDays: -1 },
        { name: "Sistemi Informativi", date: new Date("2025-02-11"), minDays: -1 }
    ]
];

export function getDates() {
    return input;
}

// exams temp
let exams = [];

// add exam element
let currentExamId = 0;
const addExamButtonCooldown = 1000;

const addExamButton = document.getElementById('addExamButton');

addExamButton.addEventListener('click', function() {
    addExamButton.disabled = true;

    const newExamDiv = document.createElement('div');
    newExamDiv.classList.add('exam');
    newExamDiv.id = 'exam-' + currentExamId;

    currentExamId++;

    addExamButton.parentNode.insertBefore(newExamDiv, addExamButton);

    addExamPopup(newExamDiv.id);

    setTimeout(() => {
        addExamButton.disabled = false;
    }, addExamButtonCooldown);
});

// add exam popup
let currentDateId = 1;

const examPopup = document.querySelector('.exam-popup');

function addExamPopup(examId) {
    // popup content
    const htmlContent = `
        <input type="text" placeholder="Name" id="examName">
        <div id="date-inputs">
            <input type="date" id="date-0">
        </div>
        <button id="addDateButton">Add another date</button>
        <div class="custom-number-picker">
            <button id="decrement">-</button>
            <div id="minDays">0</div>
            <button id="increment">+</button>
        </div>
        <button id="saveExam">Save</button>
    `;

    examPopup.innerHTML = htmlContent;

    // date input
    const addDateButton = document.getElementById('addDateButton');

    addDateButton.addEventListener('click', () => {
        const newDateInput = document.createElement('input');
        newDateInput.type = 'date';
        newDateInput.id = `date-${currentDateId}`;

        currentDateId++;

        const dateInputsContainer = document.getElementById('date-inputs');
        dateInputsContainer.appendChild(newDateInput);
    });

    // min days picker
    const decrementButton = document.getElementById('decrement');
    const incrementButton = document.getElementById('increment');
    const numberDisplay = document.getElementById('minDays');

    let currentNumber = 0;

    function updateNumberDisplay() {
        numberDisplay.textContent = currentNumber;
    }

    decrementButton.addEventListener('click', () => {
        if (currentNumber > 0) {
            currentNumber--;
            updateNumberDisplay();
        }
    });

    incrementButton.addEventListener('click', () => {
        currentNumber++;
        updateNumberDisplay();
    });

    // save exam input
    const saveExamButton = document.getElementById('saveExam');

    saveExamButton.addEventListener('click', () => {
        const examName = document.getElementById('examName').value.trim();
        const minDays = currentNumber;

        const dateInputs = document.querySelectorAll('#date-inputs input[type="date"]');
        const dates = Array.from(dateInputs).map(input => input.value);

        if (!examName) {
            alert('Please enter an exam name.');
            return;
        }

        if (dates.some(date => !date)) {
            alert('Please fill in all date fields.');
            return;
        }

        const isExamNameExists = exams.some(exam => exam.name === examName);
        if (isExamNameExists) {
            alert('An exam with this name already exists. Please use a different name.');
            return;
        }

        const uniqueDates = [...new Set(dates)];

        const examData = {
            name: examName,
            dates: uniqueDates,
            minDays: minDays
        };

        exams.push(examData);
        
        console.log('Exams:', exams);
    });
}