let display = document.getElementById('display');
let historyDiv = document.getElementById('history');
let currentInput = '0';
let operator = null;
let previousInput = null;
let audioCtx = null;

function playClick() {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    let osc = audioCtx.createOscillator();
    let gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.value = 800;
    osc.type = 'sine';
    gain.gain.value = 0.5;
    osc.start();
    osc.stop(audioCtx.currentTime + 0.15);
  } catch (e) {}
}

function updateDisplay() {
  display.textContent = currentInput;
}

function appendToDisplay(value) {
  playClick();
  if (currentInput === '0' && value !== '.') {
    currentInput = value;
  } else {
    currentInput += value;
  }
  updateDisplay();
}

function scientific(func) {
  playClick();
  let num = parseFloat(currentInput);
  let result;
  let label = '';

  if (func === 'sin') {
    result = Math.sin(num * Math.PI / 180);
    label = 'sin(' + num + ')';
  } else if (func === 'cos') {
    result = Math.cos(num * Math.PI / 180);
    label = 'cos(' + num + ')';
  } else if (func === 'tan') {
    result = Math.tan(num * Math.PI / 180);
    label = 'tan(' + num + ')';
  } else if (func === 'sqrt') {
    result = Math.sqrt(num);
    label = '√(' + num + ')';
  } else if (func === 'square') {
    result = num * num;
    label = '(' + num + ')²';
  } else if (func === 'pi') {
    if (currentInput === '0') {
      currentInput = Math.PI.toString();
    } else {
      currentInput += Math.PI.toString();
    }
    updateDisplay();
    return;
  }

  if (historyDiv) {
    historyDiv.textContent = label + ' = ' + result;
  }
  currentInput = result.toString();
  updateDisplay();
}

function pressNumber(value) {
  playClick();
  if (currentInput === '0' && value !== '.') {
    currentInput = value;
  } else {
    currentInput += value;
  }
  updateDisplay();
}

function pressClear() {
  playClick();
  currentInput = '0';
  operator = null;
  previousInput = null;
  if (historyDiv) historyDiv.textContent = 'History will show here...';
  updateDisplay();
}

function pressDelete() {
  playClick();
  currentInput = currentInput.slice(0, -1);
  if (currentInput === '') currentInput = '0';
  updateDisplay();
}

function pressOperator(op) {
  playClick();
  if (previousInput !== null && operator !== null) {
    calculate();
  }
  previousInput = currentInput;
  operator = op;
  currentInput = '0';
}

function calculate() {
  let result;
  let prev = parseFloat(previousInput);
  let curr = parseFloat(currentInput);

  if (operator === '+') result = prev + curr;
  if (operator === '-') result = prev - curr;
  if (operator === '*') result = prev * curr;
  if (operator === '/') result = prev / curr;

  if (historyDiv) {
    historyDiv.textContent = previousInput + ' ' + operator + ' ' + currentInput + ' = ' + result;
  }
  currentInput = result.toString();
  operator = null;
  previousInput = null;
  updateDisplay();
}

document.querySelectorAll('button').forEach(button => {
  button.addEventListener('click', () => {
    let action = button.getAttribute('data-action');
    if (!action) return;

    if (action === 'number') pressNumber(button.getAttribute('data-value'));
    if (action === 'clear') pressClear();
    if (action === 'delete') pressDelete();
    if (action === 'percent') {
      playClick();
      currentInput = (parseFloat(currentInput) / 100).toString();
      updateDisplay();
    }
    if (action === 'operator') pressOperator(button.getAttribute('data-value'));
    if (action === 'equals') {
      playClick();
      if (previousInput !== null && operator !== null) calculate();
    }
  });
});

// KEYBOARD SUPPORT - THIS IS THE NEW PART!
document.addEventListener('keydown', (event) => {
  let key = event.key;
  if (key >= '0' && key <= '9' || key === '.') pressNumber(key);
  else if (key === '+' || key === '-' || key === '*' || key === '/') pressOperator(key);
  else if (key === 'Enter' || key === '=') {
    event.preventDefault();
    playClick();
    if (previousInput !== null && operator !== null) calculate();
  }
  else if (key === 'Backspace') pressDelete();
  else if (key === 'Escape' || key.toLowerCase() === 'c') pressClear();
  else if (key === '%') {
    playClick();
    currentInput = (parseFloat(currentInput) / 100).toString();
    updateDisplay();
  }
  else if (key === '(' || key === ')') appendToDisplay(key);
});

updateDisplay();
