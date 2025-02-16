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

export function getExamsInfo() {

    const formattedExams = exams.map(exam =>
        exam.dates.map(date => ({
            name: exam.name,
            date: new Date(date), 
            minDays: exam.minDays
        }))
    );

    return formattedExams;
}

// exams temp
let exams = [];

// add exam element
let currentExamId = 0;
const addExamButtonCooldown = 1000;

const addExamButton = document.getElementById('addExamButton');

addExamButton.addEventListener('click', function() {
    addExamButton.disabled = true;

    addExamPopup();

    setTimeout(() => {
        addExamButton.disabled = false;
    }, addExamButtonCooldown);
});

// add exam popup
let currentDateId = 1;

const examPopupBackground = document.querySelector('.exam-popup-background');
const examPopup = document.querySelector('.exam-popup');

function addExamPopup() {

    // display popup
    examPopupBackground.classList.add('show');

    // popup content
    const htmlContent = `
        <div class="close-exam-popup">✕</div>
        <h2>New Exam</h2>
        <input type="text" placeholder="Name" id="examName">
        <h4>Available Dates</h4>
        <div id="date-inputs">
            <div class="date-input">
                <input type="date" id="date-${currentDateId - 1}">
            </div>
        </div>
        <button class="alt" id="addDateButton">Add date</button>
        <h4>Minimum Days Required <span>(Optional)</span></h4>
        <div class="custom-number-picker">
            <button class="picker-decrement" id="decrementMinDays">-</button>
            <div class="picker-number" id="minDays">0</div>
            <button class="picker-increment" id="incrementMinDays">+</button>
        </div>
        <div id="alertAddExam"></div>
        <button id="saveExam">Save</button>
    `;

    examPopup.innerHTML = htmlContent;

    // close popup 
    const closeExamPopupBtn = document.querySelector(".close-exam-popup"); 

    closeExamPopupBtn.addEventListener("click", () => {
        closeExamPopup();
    });

    // date input
    const addDateButton = document.getElementById('addDateButton');

    addDateButton.addEventListener('click', () => {
        const newDateInput = document.createElement('input');
        newDateInput.type = 'date';
        newDateInput.id = `date-${currentDateId}`;

        const dateInputDelete = document.createElement('button');
        dateInputDelete.textContent = '✕';
        dateInputDelete.className = 'delete';
        dateInputDelete.addEventListener('click', () => {
            dateInputContainer.remove(); 
        });

        const dateInputContainer = document.createElement('div');
        dateInputContainer.className = "date-input";
        dateInputContainer.appendChild(newDateInput);
        dateInputContainer.appendChild(dateInputDelete);

        const dateInputsContainer = document.getElementById('date-inputs');
        dateInputsContainer.appendChild(dateInputContainer);

        currentDateId++; 
    });

    // min days picker
    const decrementButton = document.getElementById('decrementMinDays');
    const incrementButton = document.getElementById('incrementMinDays');
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
    const alertAddExam = document.getElementById('alertAddExam');
    const saveExamButton = document.getElementById('saveExam');

    saveExamButton.addEventListener('click', () => {
        const examName = document.getElementById('examName').value.trim();
        const minDays = currentNumber;

        const dateInputs = document.querySelectorAll('#date-inputs input[type="date"]');
        const dates = Array.from(dateInputs).map(input => input.value);

        if (!examName) {
            alertAddExam.textContent = 'Please enter an exam name';
            return;
        }

        if (dates.some(date => !date)) {
            alertAddExam.textContent = 'Please fill in all date fields';
            return;
        }

        const isExamNameExists = exams.some(exam => exam.name === examName);
        if (isExamNameExists) {
            alertAddExam.textContent = 'An exam with this name already exists: please use a different name';
            return;
        }

        const uniqueDates = [...new Set(dates)];

        uniqueDates.sort((a, b) => new Date(a) - new Date(b));

        const examData = {
            id: `exam-` + currentExamId, 
            name: examName,
            dates: uniqueDates,
            minDays: minDays === 0 ? -1 : minDays
        };

        exams.push(examData);
        
        console.log('Exams:', exams);

        examAdded();
    });
}

// exam added
function examAdded() {
    const latestExam = exams[exams.length - 1];

    const newExamDiv = document.createElement('div');
    newExamDiv.classList.add('exam');
    newExamDiv.id = latestExam.id;

    const examNameElement = document.createElement('h3');
    examNameElement.textContent = latestExam.name;

    const examDatesList = document.createElement('ul');
    latestExam.dates.forEach(date => {
        const listItem = document.createElement('li');
        
        const formattedDate = new Date(date).toLocaleDateString('en-GB');
        
        listItem.textContent = formattedDate;
        examDatesList.appendChild(listItem);
    });

    const minDaysElement = document.createElement('p');
    if (latestExam.minDays > 0) {
        minDaysElement.textContent = `Required Days: ${latestExam.minDays}`;
    }

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
        newExamDiv.remove();
        exams = exams.filter(exam => exam.id !== latestExam.id);
        console.log('Updated Exams:', exams);
    });

    newExamDiv.appendChild(examNameElement);
    
    const datesContainer = document.createElement('div');
    datesContainer.innerHTML = `<strong>Dates</strong>`;
    datesContainer.appendChild(examDatesList);
    newExamDiv.appendChild(datesContainer);

    if (latestExam.minDays > 0) {
        newExamDiv.appendChild(minDaysElement);
    }
    newExamDiv.appendChild(deleteButton);

    addExamButton.parentNode.insertBefore(newExamDiv, addExamButton);

    currentExamId++;

    examPopupBackground.classList.remove('show');
}

// close exam popup
function closeExamPopup() {
    examPopupBackground.classList.remove('show');
}

document.querySelector('.exam-popup').addEventListener('click', (event) => {
    event.stopPropagation();
});

examPopupBackground.addEventListener("click", () => {
    closeExamPopup();
});