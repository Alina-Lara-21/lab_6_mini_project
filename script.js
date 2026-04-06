const display = document.getElementById("display");
const buttons = document.querySelector(".buttons");

let expression = "";

function refreshDisplay() {
  display.value = expression || "0";
}

buttons.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const value = button.dataset.value;
  const action = button.dataset.action;

  if (value !== undefined) {
    if (value === "**2") {
      expression += "**2";
    } else {
      expression += value;
    }
    refreshDisplay();
    return;
  }

  if (action === "clear") {
    expression = "";
    refreshDisplay();
    return;
  }

  if (action === "toggle-sign") {
    if (!expression) return;

    if (expression.startsWith("-")) {
      expression = expression.slice(1);
    } else {
      expression = "-" + expression;
    }
    refreshDisplay();
    return;
  }

  if (action === "equals") {
    if (!expression.trim()) return;

    try {
      const result = eval(expression);
      expression = String(result);
      refreshDisplay();
    } catch (error) {
      expression = "";
      display.value = "Error";
    }
  }
});

refreshDisplay();