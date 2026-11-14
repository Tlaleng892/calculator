const display = document.getElementById('display');
const historyBox = document.getElementById('history');
let firstNumber = '';
let operator = '';
let secondNumber = '';
let justCalculated = false;
let history = [];

function playClick() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const beep = ctx.createOscillator();
    beep.frequency.value = 600;
    beep.connect(ctx.destination);
    beep.start();
    beep.stop(ctx.currentTime + 0.05);
  } catch(e) {}
}

function updateDisplay() {
  if (operator === '') {
    display.textContent = firstNumber || '0';
  } else {
    let pretty = operator === '*' ? '×' : operator === '/' ? '÷' : operator;
    display.textContent = firstNumber + ' ' + pretty + ' ' + secondNumber;
  }
}

function updateHistory() {
  if (history.length === 0) {
    historyBox.textContent = 'History will show here...';
  } else {
    historyBox.innerHTML = history.slice(-3).reverse().join('<br>');
  }
}

function calculate() {
  const a = parseFloat(firstNumber);
  const b = parseFloat(secondNumber);
  if (isNaN(a) || isNaN(b)) return;
  let result = 0;
  if (operator === '+') result = a + b;
  if (operator === '-') result = a - b;
  if (operator === '*') result = a * b;
  if (operator === '/') {
    if (b === 0) {
      display.textContent = 'Nope! Cant divide by 0 😅';
      firstNumber = '';
      secondNumber = '';
      operator = '';
      return;
    }
    result = a / b;
  }
  result = Math.round(result * 100000) / 100000;
  let pretty = operator === '*' ? '×' : operator === '/' ? '÷' : operator;
  history.push(firstNumber + ' ' + pretty + ' ' + secondNumber + ' = ' + result);
  updateHistory();
  display.textContent = result;
  firstNumber = String(result);
  secondNumber = '';
  operator = '';
  justCalculated = true;
}

function pressNumber(value) {
  if (justCalculated && operator === '') {
    firstNumber = '';
    justCalculated = false;
  }
  if (value === '.' && (operator === '' ? firstNumber : secondNumber).includes('.')) return;
  if (operator === '') {
    if (firstNumber.length < 12) firstNumber += value;
  } else {
    if (secondNumber.length < 12) secondNumber += value;
  }
  updateDisplay();
}

function pressOperator(value) {
  if (firstNumber === '') return;
  if (secondNumber !== '') calculate();
  operator = value;
  justCalculated = false;
  updateDisplay();
}

function pressClear() {
  firstNumber = '';
  secondNumber = '';
  operator = '';
  justCalculated = false;
  updateDisplay();
}

function pressDelete() {
  if (operator === '') {
    firstNumber = firstNumber.slice(0, -1);
  } else if (secondNumber === '') {
    operator = '';
  } else {
    secondNumber = secondNumber.slice(0, -1);
  }
  updateDisplay();
}

function pressPercent() {
  if (operator === '' && firstNumber !== '') {
    firstNumber = String(parseFloat(firstNumber) / 100);
  } else if (secondNumber !== '') {
    secondNumber = String(parseFloat(secondNumber) / 100);
  }
  updateDisplay();
}

document.querySelectorAll('button').forEach(button => {
  button.addEventListener('click', () => {
    playClick();
    const action = button.dataset.action;
    const value = button.dataset.value;
    if (action === 'number') pressNumber(value);
    if (action === 'operator') pressOperator(value);
    if (action === 'equals') calculate();
    if (action === 'clear') pressClear();
    if (action === 'delete') pressDelete();
    if (action === 'percent') pressPercent();
  });
});

// KEYBOARD POWER! ⌨️
document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') { playClick(); pressNumber(e.key); }
  if (e.key === '.') { playClick(); pressNumber('.'); }
  if (e.key === '+') { playClick(); pressOperator('+'); }
  if (e.key === '-') { playClick(); pressOperator('-'); }
  if (e.key === '*') { playClick(); pressOperator('*'); }
  if (e.key === '/') { e.preventDefault(); playClick(); pressOperator('/'); }
  if (e.key === 'Enter' || e.key === '=') { playClick(); calculate(); }
  if (e.key === 'Backspace') { playClick(); pressDelete(); }
  if (e.key === 'Escape') { playClick(); pressClear(); }
  if (e.key === '%') { playClick(); pressPercent(); }
});

updateDisplay();
updateHistory();
