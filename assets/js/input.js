// test input
const input = [
    [
        { name: "Ingegneria del SW", date: new Date("2025-01-13"), minDays: -1 },
        { name: "Ingegneria del SW", date: new Date("2025-01-31"), minDays: -1 }
    ],
    [
        { name: "Elettronica", date: new Date("2025-01-16"), minDays: -1 },
        { name: "Elettronica", date: new Date("2025-02-07"), minDays: -1 }
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

// retrieves user input
export function getExamsInfo() {

    const formattedExams = exams.map(exam =>
        exam.dates.map(date => ({
            name: exam.name,
            date: new Date(date), 
            minDays: exam.minDays
        }))
    );

    // return input;

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

    // prevent from scrolling
    document.body.style.overflow = 'hidden';

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
                <input type="text" class="datepicker" id="date-${currentDateId - 1}" readonly placeholder="Select a date">
            </div>
        </div>
        <button class="alt" id="addDateButton">
            <svg  xmlns="http://www.w3.org/2000/svg"  width="18"  height="18"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>
            Add Date
        </button>
        <h4>Minimum Days Required <span>(Optional)</span></h4>
        <div class="custom-number-picker">
            <button class="picker-decrement" id="decrementMinDays">-</button>
            <div class="picker-number" id="minDays">0</div>
            <button class="picker-increment" id="incrementMinDays">+</button>
        </div>
        <div id="alertAddExam"></div>
        <button id="saveExam">
            <svg  xmlns="http://www.w3.org/2000/svg"  width="18"  height="18"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-device-floppy"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" /><path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M14 4l0 4l-6 0l0 -4" /></svg>
            Save
        </button>
    `;

    examPopup.innerHTML = htmlContent;

    // initialize date picker
    new AirDatepicker(document.getElementById(`date-${currentDateId - 1}`), {
        locale: {
            days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            daysMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            months: ['January','February','March','April','May','June', 'July','August','September','October','November','December'],
            monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            today: 'Today',
            clear: 'Clear',
            dateFormat: 'mm/dd/yyyy',
            timeFormat: 'hh:ii aa',
            firstDay: 1
        },
        dateFormat(date) {
            return date.toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        },
        autoClose: true,
    });

    // target exam name input
    setTimeout(() => {
        const examInput = document.getElementById('examName');
        if (examInput) {
            examInput.focus();
        }
    }, 100);

    // close popup 
    const closeExamPopupBtn = document.querySelector(".close-exam-popup"); 

    closeExamPopupBtn.addEventListener("click", () => {
        closeExamPopup();
    });

    // date input
    const addDateButton = document.getElementById('addDateButton');

    addDateButton.addEventListener('click', () => {
        const newDateInput = document.createElement('input');
        newDateInput.type = 'text';
        newDateInput.className = 'datepicker';
        newDateInput.id = `date-${currentDateId}`;
        newDateInput.readOnly = true;
        newDateInput.placeholder = "Select a date";

        const dateInputDelete = document.createElement('button');
        dateInputDelete.innerHTML = '<svg  xmlns="http://www.w3.org/2000/svg"  width="18"  height="18"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-circle-minus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M9 12l6 0" /></svg>';
        dateInputDelete.className = 'delete';
        dateInputDelete.addEventListener('click', () => {
            dateInputContainer.remove();
        });

        const dateInputContainer = document.createElement('div');
        dateInputContainer.className = "date-input";
        dateInputContainer.appendChild(newDateInput);
        dateInputContainer.appendChild(dateInputDelete);

        document.getElementById('date-inputs').appendChild(dateInputContainer);

        new AirDatepicker(newDateInput, {
            locale: {
                days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
                months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], today: "Today",
                clear: "Clear",
                firstDay: 1
            },
            dateFormat(date) {
                return date.toLocaleString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });
            },
            autoClose: true,
        });

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

        const dateInputs = document.querySelectorAll('#date-inputs input[type="text"]');
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

        const uniqueDateStrings = [...new Set(dates.map(dateStr => {
            const [day, month, year] = dateStr.split('/');
            return `${year}-${month}-${day}`; // format to a unique string
        }))];
        
        const uniqueDates = uniqueDateStrings.map(dateStr => new Date(dateStr));

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

    const examDatesDiv = document.createElement('div');
    examDatesDiv.classList.add('exam-dates');
    
    const datesHeader = document.createElement('h4');
    datesHeader.textContent = 'Dates';
    
    const examDatesList = document.createElement('ul');
    latestExam.dates.forEach(date => {
        const listItem = document.createElement('li');
        listItem.textContent = new Date(date).toLocaleDateString('en-GB');
        examDatesList.appendChild(listItem);
    });

    examDatesDiv.appendChild(datesHeader);
    examDatesDiv.appendChild(examDatesList);

    const requiredDaysDiv = document.createElement('div');
    requiredDaysDiv.classList.add('required-days');
    
    if (latestExam.minDays > 0) {
        const requiredDaysHeader = document.createElement('h4');
        requiredDaysHeader.textContent = 'Required Days';

        const requiredDays = document.createElement('div');
        requiredDays.className = 'required-days-number';
        requiredDays.textContent = latestExam.minDays;

        requiredDaysDiv.appendChild(requiredDaysHeader);
        requiredDaysDiv.appendChild(requiredDays);
    }

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-exam-btn');
    deleteButton.classList.add('alt');
    deleteButton.addEventListener('click', () => {
        newExamDiv.remove();
        exams = exams.filter(exam => exam.id !== latestExam.id);
        console.log('Updated Exams:', exams);
    });

    newExamDiv.appendChild(examNameElement);
    newExamDiv.appendChild(examDatesDiv);
    if (latestExam.minDays > 0) newExamDiv.appendChild(requiredDaysDiv);
    newExamDiv.appendChild(deleteButton);

    addExamButton.parentNode.insertBefore(newExamDiv, addExamButton);

    currentExamId++;

    closeExamPopup();
}

// close exam popup
function closeExamPopup() {
    
    // re-enable scrolling
    document.body.style.overflow = 'auto';

    examPopupBackground.classList.remove('show');
}

document.querySelector('.exam-popup').addEventListener('click', (event) => {
    event.stopPropagation();
});

examPopupBackground.addEventListener("click", () => {
    closeExamPopup();
});