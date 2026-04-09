# Calculator Web App
A responsive calculator built using **HTML, CSS, and JavaScript**.  
This calculator supports basic arithmetic operations as well as scientific functions like trigonometry, logarithms, square roots, and constants (π and e).

## Features
### Basic Calculator Functions
- Addition (+)
- Subtraction (−)
- Multiplication (×)
- Division (÷)
- Decimal input
- Delete last character (backspace)
- Clear all input (C)
- Toggle positive/negative (+/-)
- Percent (%)

### Scientific Functions
- sin(x)
- cos(x)
- tan(x)
- √x (square root)
- x² (square)
- log(x) (base 10 logarithm)
- ln(x) (natural logarithm)

### Constants
- π (Pi)
- e (Euler’s Number)

### Smart Behavior
- Prevents invalid expressions like multiple decimals in one number
- Automatically handles repeated equals (ex: `5 + 2 = =` keeps adding 2)
- Shows `"Error"` when invalid calculations occur (like dividing by 0 or sqrt of negative)

---

## Project Structure
calculator-app/
- index.html #main HTML layout 
- styles.css #styling 
- script.js #logic and keyboard handling 

## How to Run

1. Download or clone the project.
2. Make sure all files are in the same folder:
   - `index.html`
   - `style.css`
   - `script.js`
3. Open `index.html` in any modern web browser.

No installation required.

---

## Keyboard Controls

The calculator supports full keyboard input:

### Numbers and Operators
- `0–9` → number input
- `+ - * /` → operators
- `.` → decimal

### Actions
- `Enter` or `=` → calculate result
- `Backspace` → delete last character
- `Escape` → clear all

### Constants
- `p` → π
- `e` → e

### Scientific Shortcuts
- `s` → sin
- `c` → cos
- `t` → tan
- `r` → sqrt
- `l` → log
- `n` → ln
- `%` → percent

---

## UI Design

This calculator uses a pastel color theme with:
- Rounded edges
- Button shadow effects
- Responsive layout for smaller screens
- Grid-based button alignment

---

## Technologies Used

- **HTML**
- **CSS**
- **JavaScript**

---

## Notes

- Trigonometric functions use radians.
- Invalid expressions display `"Error"` until cleared.

---

## Future Improvements

- Add degree/radian toggle
- Add parentheses buttons
- Add history display of calculations

---

## Authors
Calculator Project - Yareth and Alina
