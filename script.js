const display = document.getElementById('display');
let firstNumber = '';
let operator = '';
let secondNumber = '';
let justCalculated = false;

function updateDisplay() {
  if (operator === '') {
    display.textContent = firstNumber || '0';
  } else {
    display.textContent = firstNumber + ' ' + operator + ' ' + secondNumber;
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
  // Round to stop long decimals like 0.30000000004
  result = Math.round(result * 100000) / 100000;
  display.textContent = result;
  firstNumber = String(result);
  secondNumber = '';
  operator = '';
  justCalculated = true;
}

document.querySelectorAll('button').forEach(button => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;
    const value = button.dataset.value;

    if (action === 'number') {
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

    if (action === 'operator') {
      if (firstNumber === '') return;
      if (secondNumber !== '') calculate();
      operator = value;
      // Show pretty symbols
      if (value === '*') operator = '*';
      if (value === '/') operator = '/';
      justCalculated = false;
      updateDisplay();
      // Show pretty ÷ and × on screen
      let pretty = operator === '*' ? '×' : operator === '/' ? '÷' : operator;
      display.textContent = firstNumber + ' ' + pretty + ' ' + secondNumber;
    }

    if (action === 'equals') {
      calculate();
    }

    if (action === 'clear') {
      firstNumber = '';
      secondNumber = '';
      operator = '';
      justCalculated = false;
      updateDisplay();
    }

    if (action === 'delete') {
      if (operator === '') {
        firstNumber = firstNumber.slice(0, -1);
      } else if (secondNumber === '') {
        operator = '';
      } else {
        secondNumber = secondNumber.slice(0, -1);
      }
      updateDisplay();
    }

    if (action === 'percent') {
      if (operator === '' && firstNumber !== '') {
        firstNumber = String(parseFloat(firstNumber) / 100);
      } else if (secondNumber !== '') {
        secondNumber = String(parseFloat(secondNumber) / 100);
      }
      updateDisplay();
    }
  });
});

updateDisplay();
