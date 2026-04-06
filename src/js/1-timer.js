import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import './1-timer.css'; // ← ВАЖлИВО: свій CSS теж тут

// ── DOM refs ──────────────────────────────────────────────
const startBtn = document.querySelector('[data-start]');
const input = document.querySelector('#datetime-picker');
const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

// ── State ─────────────────────────────────────────────────
let userSelectedDate = null;
let timerId = null;

// ── Helpers ───────────────────────────────────────────────
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateUI({ days, hours, minutes, seconds }) {
  daysEl.textContent = addLeadingZero(days);
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

// ── flatpickr ─────────────────────────────────────────────
flatpickr('#datetime-picker', {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const chosen = selectedDates[0];

    if (chosen <= new Date()) {
      iziToast.error({
        message: 'Please choose a date in the future',
        position: 'topRight',
        timeout: 4000,
      });
      startBtn.disabled = true;
      userSelectedDate = null;
      return;
    }

    userSelectedDate = chosen;
    startBtn.disabled = false;
  },
});

// ── Start ─────────────────────────────────────────────────
startBtn.addEventListener('click', () => {
  if (!userSelectedDate) return;

  startBtn.disabled = true;
  input.disabled = true;

  timerId = setInterval(() => {
    const msLeft = userSelectedDate - Date.now();

    if (msLeft <= 0) {
      clearInterval(timerId);
      updateUI({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      input.disabled = false;
      return;
    }

    updateUI(convertMs(msLeft));
  }, 1000);
});