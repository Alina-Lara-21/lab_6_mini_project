const display = document.getElementById("display");
const buttons = document.querySelector(".buttons");

let expression = "";

function updateDisplay() {
  display.value = expression || "0";
}

function calculate() {
  try {
    expression = String(eval(expression));
  } catch {
    expression = "";
    display.value = "Error";
  }
}

function applyFunction(action) {
  try {
    let value = eval(expression);

    switch (action) {
      case "sin":
        value = Math.sin(value);
        break;
      case "cos":
        value = Math.cos(value);
        break;
      case "tan":
        value = Math.tan(value);
        break;
      case "sqrt":
        value = Math.sqrt(value);
        break;
      case "square":
        value = value ** 2;
        break;
      case "log":
        value = Math.log10(value);
        break;
      case "ln":
        value = Math.log(value);
        break;
      case "percent":
        value = value / 100;
        break;
    }

    expression = String(value);
  } catch {
    expression = "";
    display.value = "Error";
  }
}

function toggleSign() {
  if (expression.startsWith("-")) {
    expression = expression.slice(1);
  } else {
    expression = "-" + expression;
  }
}

function handleInput(value, action) {
  // Numbers/operators
  if (value !== undefined) {
    expression += value;
    updateDisplay();
    return;
  }

  if (action === "clear") {
    expression = "";
    updateDisplay();
    return;
  }

  if (action === "delete") {
    expression = expression.slice(0, -1);
    updateDisplay();
    return;
  }

  if (action === "toggle-sign") {
    toggleSign();
    updateDisplay();
    return;
  }

  if (action === "const-pi") {
    expression += Math.PI;
    updateDisplay();
    return;
  }

  if (action === "const-e") {
    expression += Math.E;
    updateDisplay();
    return;
  }

  if (action === "equals") {
    calculate();
    updateDisplay();
    return;
  }

  applyFunction(action);
  updateDisplay();
}

// Button clicks
buttons.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  handleInput(button.dataset.value, button.dataset.action);
});

// Keyboard support
document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (/^[0-9]$/.test(key) || ["+", "-", "*", "/"].includes(key)) {
    expression += key;
    updateDisplay();
    return;
  }

  if (key === ".") {
    expression += ".";
    updateDisplay();
    return;
  }

  if (key === "Enter" || key === "=") {
    calculate();
    updateDisplay();
    return;
  }

  if (key === "Backspace") {
    expression = expression.slice(0, -1);
    updateDisplay();
    return;
  }

  if (key === "Escape") {
    expression = "";
    updateDisplay();
    return;
  }

  if (key === "%") {
    applyFunction("percent");
    updateDisplay();
    return;
  }

  if (key.toLowerCase() === "p") {
    expression += Math.PI;
    updateDisplay();
    return;
  }

  if (key.toLowerCase() === "e") {
    expression += Math.E;
    updateDisplay();
    return;
  }
});

updateDisplay();