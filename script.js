const display = document.getElementById("display");
const buttons = document.querySelector(".buttons");

const OPERATORS = new Set(["+", "-", "*", "/"]);
const CONSTANTS = {
  "const-pi": String(Math.PI),
  "const-e": String(Math.E),
};

let expression = "";
let justEvaluated = false;
let errorState = false;
let lastOperator = null;
let lastOperand = null;

function isOperator(char) {
  return OPERATORS.has(char);
}

function updateDisplay() {
  display.value = errorState ? "Error" : expression || "0";
}

function clearAll() {
  expression = "";
  justEvaluated = false;
  errorState = false;
  lastOperator = null;
  lastOperand = null;
  updateDisplay();
}

function setError() {
  errorState = true;
  expression = "";
  justEvaluated = false;
  lastOperator = null;
  lastOperand = null;
  updateDisplay();
}

function clearErrorIfNeeded() {
  if (errorState) {
    errorState = false;
    expression = "";
  }
}

function formatNumber(value) {
  const rounded = Math.round((value + Number.EPSILON) * 1e12) / 1e12;
  return String(rounded);
}

function stripTrailingInvalid(value) {
  let cleaned = value.trim();
  while (cleaned && (isOperator(cleaned.at(-1)) || cleaned.at(-1) === ".")) {
    cleaned = cleaned.slice(0, -1);
  }
  return cleaned;
}

function getLastNumberStart(value) {
  let index = value.length - 1;

  while (index >= 0 && /[0-9.]/.test(value[index])) {
    index -= 1;
  }

  if (
    index >= 0 &&
    value[index] === "-" &&
    (index === 0 || isOperator(value[index - 1]))
  ) {
    index -= 1;
  }

  return index + 1;
}

function evaluateExpression(rawExpression = expression) {
  const cleaned = stripTrailingInvalid(rawExpression);
  if (!cleaned || cleaned === "-") return null;

  if (!/^[0-9+\-*/().\s]+$/.test(cleaned)) {
    throw new Error("Invalid characters in expression.");
  }

  const result = Function(`"use strict"; return (${cleaned});`)();
  if (!Number.isFinite(result)) {
    throw new Error("Expression did not produce a finite number.");
  }

  return result;
}

function extractLastBinaryOperation(value) {
  const cleaned = stripTrailingInvalid(value);
  const operandMatch = cleaned.match(/(-?\d*\.?\d+)$/);
  if (!operandMatch) return null;

  const operand = operandMatch[1];
  const operandStart = operandMatch.index;
  const operatorIndex = operandStart - 1;
  if (operatorIndex < 0) return null;

  const operator = cleaned[operatorIndex];
  if (!isOperator(operator)) return null;
  if (operator === "-" && (operatorIndex === 0 || isOperator(cleaned[operatorIndex - 1]))) {
    return null;
  }

  return { operator, operand };
}

function appendDigit(digit) {
  clearErrorIfNeeded();

  if (justEvaluated) {
    expression = "";
    justEvaluated = false;
  }

  const numberStart = getLastNumberStart(expression);
  const currentNumber = expression.slice(numberStart);

  if (currentNumber === "0") {
    if (digit === "0") return;
    expression = expression.slice(0, numberStart) + digit;
    updateDisplay();
    return;
  }

  if (currentNumber === "-0") {
    if (digit === "0") return;
    expression = expression.slice(0, numberStart) + `-${digit}`;
    updateDisplay();
    return;
  }

  expression += digit;
  updateDisplay();
}

function appendDecimal() {
  clearErrorIfNeeded();

  if (justEvaluated) {
    expression = "";
    justEvaluated = false;
  }

  const numberStart = getLastNumberStart(expression);
  const currentNumber = expression.slice(numberStart);
  if (currentNumber.includes(".")) return;

  if (currentNumber === "" || currentNumber === "-") {
    expression += "0.";
  } else {
    expression += ".";
  }

  updateDisplay();
}

function appendOperator(operator) {
  clearErrorIfNeeded();

  if (!expression) {
    if (operator === "-") {
      expression = "-";
      updateDisplay();
    }
    return;
  }

  if (justEvaluated) {
    justEvaluated = false;
  }

  if (expression.endsWith(".")) {
    expression += "0";
  }

  const trailingOperators = expression.match(/[+\-*/]+$/)?.[0];
  if (trailingOperators) {
    // Allow patterns like "5*-" so the next number can be negative.
    if (operator === "-" && trailingOperators.length === 1 && trailingOperators !== "-") {
      expression += "-";
    } else {
      const withoutTrailing = expression.slice(0, -trailingOperators.length);
      expression = withoutTrailing ? withoutTrailing + operator : operator === "-" ? "-" : "";
    }
    updateDisplay();
    return;
  }

  expression += operator;
  updateDisplay();
}

function deleteLast() {
  if (errorState) {
    clearAll();
    return;
  }

  justEvaluated = false;
  expression = expression.slice(0, -1);
  updateDisplay();
}

function toggleSign() {
  clearErrorIfNeeded();

  if (!expression) {
    expression = "-";
    updateDisplay();
    return;
  }

  if (justEvaluated) {
    expression = expression.startsWith("-") ? expression.slice(1) : `-${expression}`;
    justEvaluated = false;
    updateDisplay();
    return;
  }

  const numberStart = getLastNumberStart(expression);
  const currentNumber = expression.slice(numberStart);

  if (!currentNumber) {
    if (isOperator(expression.at(-1))) {
      expression += "-";
    } else {
      expression = expression.startsWith("-") ? expression.slice(1) : `-${expression}`;
    }
    updateDisplay();
    return;
  }

  if (currentNumber === "-") {
    expression = expression.slice(0, numberStart);
  } else if (currentNumber.startsWith("-")) {
    expression = expression.slice(0, numberStart) + currentNumber.slice(1);
  } else {
    expression = expression.slice(0, numberStart) + `-${currentNumber}`;
  }

  updateDisplay();
}

function appendConstant(action) {
  clearErrorIfNeeded();

  if (justEvaluated) {
    expression = "";
    justEvaluated = false;
  }

  const constantValue = CONSTANTS[action];
  const previous = expression.at(-1);
  const shouldMultiply = previous && /[0-9.]/.test(previous);

  expression += shouldMultiply ? `*${constantValue}` : constantValue;
  updateDisplay();
}

function applyUnaryOperation(action) {
  clearErrorIfNeeded();

  try {
    const value = evaluateExpression();
    if (value === null) return;

    let result;
    switch (action) {
      case "sin":
        result = Math.sin(value);
        break;
      case "cos":
        result = Math.cos(value);
        break;
      case "tan":
        result = Math.tan(value);
        break;
      case "sqrt":
        if (value < 0) throw new Error("Square root domain error.");
        result = Math.sqrt(value);
        break;
      case "square":
        result = value ** 2;
        break;
      case "log":
        if (value <= 0) throw new Error("Log domain error.");
        result = Math.log10(value);
        break;
      case "ln":
        if (value <= 0) throw new Error("Natural log domain error.");
        result = Math.log(value);
        break;
      case "percent":
        result = value / 100;
        break;
      default:
        return;
    }

    expression = formatNumber(result);
    justEvaluated = true;
    lastOperator = null;
    lastOperand = null;
    updateDisplay();
  } catch (error) {
    setError();
  }
}

function handleEquals() {
  if (errorState) return;

  try {
    if (justEvaluated && lastOperator && lastOperand !== null) {
      const repeatedResult = evaluateExpression(`${expression}${lastOperator}${lastOperand}`);
      if (repeatedResult === null) return;
      expression = formatNumber(repeatedResult);
      updateDisplay();
      return;
    }

    const cleaned = stripTrailingInvalid(expression);
    if (!cleaned || cleaned === "-") return;

    const operation = extractLastBinaryOperation(cleaned);
    const result = evaluateExpression(cleaned);
    if (result === null) return;

    expression = formatNumber(result);
    justEvaluated = true;
    lastOperator = operation?.operator ?? null;
    lastOperand = operation?.operand ?? null;
    updateDisplay();
  } catch (error) {
    setError();
  }
}

function handleButtonPress(button) {
  const value = button.dataset.value;
  const action = button.dataset.action;

  if (value !== undefined) {
    if (/[0-9]/.test(value)) {
      appendDigit(value);
      return;
    }
    if (value === ".") {
      appendDecimal();
      return;
    }
    if (isOperator(value)) {
      appendOperator(value);
    }
    return;
  }

  if (action === "clear") {
    clearAll();
    return;
  }

  if (action === "delete") {
    deleteLast();
    return;
  }

  if (action === "toggle-sign") {
    toggleSign();
    return;
  }

  if (action === "equals") {
    handleEquals();
    return;
  }

  if (action in CONSTANTS) {
    appendConstant(action);
    return;
  }

  applyUnaryOperation(action);
}

function handleKeyboardInput(event) {
  const { key } = event;
  const lowerKey = key.toLowerCase();

  if (/^[0-9]$/.test(key)) {
    event.preventDefault();
    appendDigit(key);
    return;
  }

  if (key === ".") {
    event.preventDefault();
    appendDecimal();
    return;
  }

  if (isOperator(key)) {
    event.preventDefault();
    appendOperator(key);
    return;
  }

  if (key === "=" || key === "Enter") {
    event.preventDefault();
    handleEquals();
    return;
  }

  if (key === "Backspace") {
    event.preventDefault();
    deleteLast();
    return;
  }

  if (key === "Escape") {
    event.preventDefault();
    clearAll();
    return;
  }

  if (key === "%") {
    event.preventDefault();
    applyUnaryOperation("percent");
    return;
  }

  if (lowerKey === "p") {
    event.preventDefault();
    appendConstant("const-pi");
    return;
  }

  if (lowerKey === "e") {
    event.preventDefault();
    appendConstant("const-e");
    return;
  }

  const scientificShortcuts = {
    s: "sin",
    c: "cos",
    t: "tan",
    r: "sqrt",
    l: "log",
    n: "ln",
  };

  if (scientificShortcuts[lowerKey]) {
    event.preventDefault();
    applyUnaryOperation(scientificShortcuts[lowerKey]);
  }
}

buttons.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  handleButtonPress(button);
});

document.addEventListener("keydown", handleKeyboardInput);

updateDisplay();