# ☠️ Puzzle Pirates: System Decrypt

> **Version:** 3.1.4  
> **Difficulty:** Student / Beginner Friendly  
> **Tech Stack:** HTML5, CSS3, Vanilla JavaScript

## �� Overview

**Puzzle Pirates** is a cyberpunk-themed word guessing game (like Hangman) where you play as a "Decoder" trying to hack into a secure system. You must guess the password before your **Integrity** reaches 0% or your **Time** runs out!

A digital Pirate AI watches your every move, taunting you when you fail and cheering when you succeed.

---

## ��️ How to Play

1.  **Start the Game**: Click "START GAME" on the intro screen.
2.  **Guess Letters**: Click the on-screen keyboard or type on your physical keyboard.
3.  **Watch Your Stats**:
    *   **❤️ Lives**: You lose a life for every wrong guess.
    *   **��️ Integrity**: Wrong guesses drop integrity by 15%. Hints cost 5%.
    *   **⏳ Time**: You have 30 seconds to crack the code!
4.  **Use Hints**: If you are stuck (and have low lives), the **HINT** button unlocks. It reveals a letter but damages your system integrity.
5.  **Win Condition**: Guess the word completely.
6.  **Lose Condition**: Run out of lives, reach 0% integrity, or run out of time.

---

## �� Project Structure

The project is built with 3 main files to keep things simple and organized.

### 1. `index.html` (The Skeleton)
Contains the structure of the game.
*   **Simple Names**: Uses classes like `.box`, `.card`, `.btn`.
*   **Sections**:
    *   `#intro-screen`: The starting overlay.
    *   `#menu`: The left sidebar with the Pirate and Logs.
    *   `.main-panel`: The right side with the game board.
    *   `#drawing`: The SVG area where the hangman is drawn.

### 2. `style.css` (The Look)
Handles all colors, layout, and animations.
*   **Variables**: Colors are defined at the top (`--cyan`, `--pink`, etc.) so you can change the theme easily.
*   **Grid Animation**: A 3D moving background effect using `perspective` and `linear-gradient`.
*   **Glass Effect**: Uses `backdrop-filter: blur()` to make panels look like glass.

### 3. `script.js` (The Brains)
Controls the game logic.
*   **Global Variables**: `lives`, `time`, `level` are easy to find and change.
*   **Lists**: `WORDS` and `PHRASES` store the content.
*   **Functions**: Simple logic like `startGame()`, `checkGuess()`, and `gameOver()`.

---

## ��️ How to Customize

Want to make the game your own? Here are some easy changes you can make in `script.js`:

### 1. Add New Words
Find the `WORDS` object at the top of the file. You can add more words to "easy", "medium", or "hard".
```javascript
// Example: Adding a new word to easy mode
easy: [
    { text: "JAVA", cat: "LANGUAGE", tip: "A popular coding language." },
    // ... existing words
]
```

### 2. Change the Pirate's Lines
Find the `PHRASES` object. You can add your own funny insults or cheers!
```javascript
win: ["You are a legend!", "Hacking complete!", "Too easy for you!"],
```

### 3. Adjust Game Balance
Change the constants at the top of the file:
```javascript
const TIME_LIMIT = 60; // Give players 60 seconds instead of 30
```

---

## �� Setup & Running

1.  Download the project folder.
2.  Open `index.html` in any modern web browser (Chrome, Firefox, Edge).
3.  Enjoy! No installation or servers required.

---

## �� Credits

*   **Fonts**: *Orbitron* and *Rajdhani* from Google Fonts.
*   **Effects**: *Canvas Confetti* library for the win explosion.
*   **Design**: Custom Neon Cyberpunk aesthetic.

Happy Hacking! 🏴‍☠️