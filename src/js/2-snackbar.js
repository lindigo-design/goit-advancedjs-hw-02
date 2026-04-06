const STORAGE_KEY = 'feedback-form-state';

const formData = {
  email: '',
  message: '',
};

const form = document.querySelector('.feedback-form');
const emailInput = form.querySelector('input[name="email"]');
const messageInput = form.querySelector('textarea[name="message"]');

// При завантаженні сторінки — відновлюємо дані зі сховища
const savedData = localStorage.getItem(STORAGE_KEY);

if (savedData) {
  const parsedData = JSON.parse(savedData);
  formData.email = parsedData.email ?? '';
  formData.message = parsedData.message ?? '';
  emailInput.value = formData.email;
  messageInput.value = formData.message;
}

// Слухаємо input через делегування
form.addEventListener('input', event => {
  const { name, value } = event.target;

  if (name === 'email' || name === 'message') {
    formData[name] = value.trim();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }
});

// Слухаємо submit
form.addEventListener('submit', event => {
  event.preventDefault();

  if (!formData.email || !formData.message) {
    alert('Fill please all fields');
    return;
  }

  console.log(formData);

  // Очищаємо все
  localStorage.removeItem(STORAGE_KEY);
  formData.email = '';
  formData.message = '';
  form.reset();
});