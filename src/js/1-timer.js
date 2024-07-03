import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const dateTimePickerInput = document.querySelector("#datetime-picker");
const startButton = document.querySelector("button[data-start]");

const countdownDays = document.querySelector("span[data-days]");
const countdownHours = document.querySelector("span[data-hours]");
const countdownMinutes = document.querySelector("span[data-minutes]");
const countdownSeconds = document.querySelector("span[data-seconds]");
let userSelectedDate;

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        // console.log(selectedDates[0]);
        userSelectedDate = selectedDates[0];

        if (userSelectedDate <= new Date()) {
            iziToast.error({
                title: "Error",
                message: "Please choose a date in the future",
            });
            startButton.disabled = true;
        } else {
            startButton.disabled = false;
        }
    },
};

flatpickr("#datetime-picker", options);

function convertMs(ms) {
  // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

  // Remaining days
    const days = Math.floor(ms / day);
  // Remaining hours
    const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
    const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
    return String(value).padStart(2, "0");
}

function updateTimerInterface({ days, hours, minutes, seconds }) {
    countdownDays.textContent = addLeadingZero(days);
    countdownHours.textContent = addLeadingZero(hours);
    countdownMinutes.textContent = addLeadingZero(minutes);
    countdownSeconds.textContent = addLeadingZero(seconds);
}

let timerInterval;

startButton.addEventListener("click", () => {
    startButton.disabled = true;
    dateTimePickerInput.disabled = true;

    timerInterval = setInterval(() => {
        const currentTime = new Date();
        const remainingTime = userSelectedDate - currentTime;

        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            updateTimerInterface({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            dateTimePickerInput.disabled = false;
            return;
        }

        const timeComponents = convertMs(remainingTime);
        updateTimerInterface(timeComponents);
    }, 1000);
});
