let display = document.getElementById('display');
let historyDiv = document.getElementById('history');
let currentInput = '0';
let operator = null;
let previousInput = null;

function updateDisplay() {
  display.textContent = currentInput;
}

function appendToDisplay(value) {
  if (currentInput === '0' && value !== '.') {
    currentInput = value;
  } else {
    currentInput += value;
  }
  updateDisplay();
}

function scientific(func) {
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

    if (action === 'number') {
      let value = button.getAttribute('data-value');
      if (currentInput === '0' && value !== '.') {
        currentInput = value;
      } else {
        currentInput += value;
      }
      updateDisplay();
    }

    if (action === 'clear') {
      currentInput = '0';
      operator = null;
      previousInput = null;
      if (historyDiv) historyDiv.textContent = 'History will show here...';
      updateDisplay();
    }

    if (action === 'delete') {
      currentInput = currentInput.slice(0, -1);
      if (currentInput === '') currentInput = '0';
      updateDisplay();
    }

    if (action === 'percent') {
      currentInput = (parseFloat(currentInput) / 100).toString();
      updateDisplay();
    }

    if (action === 'operator') {
      if (previousInput !== null && operator !== null) {
        calculate();
      }
      previousInput = currentInput;
      operator = button.getAttribute('data-value');
      currentInput = '0';
    }

    if (action === 'equals') {
      if (previousInput !== null && operator !== null) {
        calculate();
      }
    }
  });
});

updateDisplay();
