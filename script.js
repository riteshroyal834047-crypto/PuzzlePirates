const TIME_LIMIT = 30;

const LIVES_DATA = {
    easy: 7,
    medium: 6,
    hard: 5
};

const WORDS = {
    easy: [
        { text: "PROXY", cat: "NETWORK", tip: "A middleman server." },
        { text: "CACHE", cat: "STORAGE", tip: "Fast temporary data." },
        { text: "LOGIN", cat: "ACCESS", tip: "The front door." },
        { text: "VIRUS", cat: "MALWARE", tip: "It makes the computer sick." },
        { text: "CLONE", cat: "DATA", tip: "A perfect digital copy." }
    ],
    medium: [
        { text: "PACKET", cat: "NETWORK", tip: "Data in an envelope." },
        { text: "SERVER", cat: "HARDWARE", tip: "It serves data." },
        { text: "VECTOR", cat: "MATH", tip: "Direction and magnitude." },
        { text: "SCRIPT", cat: "CODE", tip: "Automated instructions." }
    ],
    hard: [
        { text: "FIRMWARE", cat: "HARDWARE", tip: "Permanent software." },
        { text: "PROTOCOL", cat: "NETWORK", tip: "Rules of engagement." },
        { text: "COMPILER", cat: "DEV", tip: "Translates code to binary." }
    ]
};

const PHRASES = {
    start: ["Prepared to be boarded!", "Let's see your skills!", "Hacking time!"],
    wrong: ["Missed it!", "Is that all you got?", "System unstable!"],
    hint: ["Here's a clue...", "Cheating? Garrr!", "I'll help you out."],
    timelow: ["Hurry up!", "Time is running out!", "Panic!"],
    win: ["System Unlocked!", "You're a pro!", "Great job!"],
    lose: ["System Lockdown!", "Caught you!", "Game Over!"]
};

let level = "easy";
let wordData = {};
let secretWord = "";
let guesses = [];
let lives = 7;
let maxLives = 7;
let integrity = 100;
let hints = 0;
let time = TIME_LIMIT;
let timer = null;
let isPlaying = false;

const ui = {
    wordBox: document.getElementById("word-box"),
    keysBox: document.getElementById("keys"),
    livesBox: document.getElementById("lives-box"),
    integrityBar: document.getElementById("integrity-bar"),
    integrityText: document.getElementById("integrity-text"),
    timeBar: document.getElementById("time-bar"),
    logText: document.getElementById("log-text"),
    hintBtn: document.getElementById("hint-btn"),
    bubble: document.getElementById("bubble"),
    bubbleText: document.getElementById("bubble-text"),
    faceBox: document.querySelector(".face-box")
};

window.onload = function () {
    setupButtons();
};

function setupButtons() {
    document.getElementById("start-btn").onclick = function () {
        document.getElementById("intro-screen").classList.add("hidden");
        startGame();
    };

    document.getElementById("level-select").onchange = function (e) {
        level = e.target.value;
        startGame();
    };

    document.getElementById("reset-btn").onclick = startGame;

    document.getElementById("play-again-btn").onclick = function () {
        document.getElementById("win-screen").classList.add("hidden");
        startGame();
    };

    document.getElementById("hint-btn").onclick = useHint;

    document.getElementById("open-menu-btn").onclick = function () {
        document.getElementById("menu").classList.add("open");
    };
    document.getElementById("close-menu-btn").onclick = function () {
        document.getElementById("menu").classList.remove("open");
    };

    document.addEventListener("keydown", function (e) {
        if (isPlaying && e.key.match(/^[a-zA-Z]$/)) {
            checkGuess(e.key.toUpperCase());
        }
    });
}

function startGame() {
    isPlaying = true;
    guesses = [];
    hints = 0;
    integrity = 100;
    time = TIME_LIMIT;

    maxLives = LIVES_DATA[level];
    lives = maxLives;

    const list = WORDS[level];
    wordData = list[Math.floor(Math.random() * list.length)];
    secretWord = wordData.text;

    clearInterval(timer);
    showLives();
    showIntegrity();
    createKeyboard();
    showWord();

    ui.logText.innerHTML = "";
    addLog("SYSTEM START...");
    addLog("CATEGORY: " + wordData.cat);

    checkHintButton();
    startTimer();

    pirateSay("start");

    document.getElementById("game-over-screen").classList.add("hidden");
}

function startTimer() {
    timer = setInterval(function () {
        if (!isPlaying) return;

        time -= 0.1;

        const pct = (time / TIME_LIMIT) * 100;
        ui.timeBar.style.width = pct + "%";

        if (pct < 30) {
            ui.timeBar.className = "bar red";
            if (Math.floor(time) === 5) pirateSay("timelow");
        } else {
            ui.timeBar.className = "bar blue";
        }

        if (time <= 0) gameOver(false, "TIMEOUT");

    }, 100);
}

function checkGuess(letter) {
    if (!isPlaying || guesses.includes(letter)) return;

    guesses.push(letter);

    const btn = document.querySelector(`.key-btn[data-letter="${letter}"]`);
    if (btn) btn.disabled = true;

    if (secretWord.includes(letter)) {
        if (btn) btn.classList.add("correct");
        addLog("DECRYPTED: " + letter, "green");
        showWord();

        const won = secretWord.split("").every(l => guesses.includes(l));
        if (won) gameOver(true);

    } else {
        lives--;
        integrity -= 15;

        if (btn) btn.classList.add("wrong");
        addLog("ERROR: " + letter + " FAILED", "red");

        showLives();
        showIntegrity();
        pirateSay("wrong");

        if (lives <= 0 || integrity <= 0) gameOver(false, "SYSTEM FAILURE");
    }

    checkHintButton();
}

function useHint() {
    if (hints >= 2) return;

    integrity -= 5;
    hints++;
    showIntegrity();

    const left = secretWord.split("").filter(l => !guesses.includes(l));

    if (left.length > 0) {
        const random = left[Math.floor(Math.random() * left.length)];
        checkGuess(random);
        addLog("HINT: REVEALED " + random);
    }

    addLog("DATA: " + wordData.tip, "green");
    pirateSay("hint");
}

function gameOver(win, reason) {
    isPlaying = false;
    clearInterval(timer);

    if (win) {
        pirateSay("win");
        addLog("ACCESS GRANTED", "green");

        document.getElementById("final-word").innerText = secretWord;
        document.getElementById("final-score").innerText = (lives * 100) + Math.floor(integrity);
        document.getElementById("win-screen").classList.remove("hidden");

        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });

    } else {
        pirateSay("lose");
        addLog("FAILURE: " + reason, "red");

        document.getElementById("game-over-screen").classList.remove("hidden");

        setTimeout(function () {
            document.getElementById("game-over-screen").classList.add("hidden");
            document.getElementById("final-word").innerText = secretWord;
            document.getElementById("final-score").innerText = "0";

            const modal = document.getElementById("win-screen");
            modal.querySelector("h2").innerText = "SYSTEM FAILED";
            modal.querySelector("h2").style.color = "red";
            modal.classList.remove("hidden");
        }, 2000);
    }
}

function showWord() {
    ui.wordBox.innerHTML = "";
    for (let i = 0; i < secretWord.length; i++) {
        const letter = secretWord[i];
        const div = document.createElement("div");
        div.className = "letter";

        if (guesses.includes(letter)) {
            div.innerText = letter;
            div.classList.add("show");
        } else {
            div.innerText = "";
        }
        ui.wordBox.appendChild(div);
    }
}

function createKeyboard() {
    ui.keysBox.innerHTML = "";
    for (let i = 65; i <= 90; i++) {
        const char = String.fromCharCode(i);
        const btn = document.createElement("button");
        btn.className = "key-btn";
        btn.innerText = char;
        btn.dataset.letter = char;
        btn.onclick = function () { checkGuess(char); };
        ui.keysBox.appendChild(btn);
    }
}

function showLives() {
    ui.livesBox.innerHTML = "";
    for (let i = 0; i < maxLives; i++) {
        const icon = (i < lives) ? "#heart" : "#heart-broken";
        const div = document.createElement("div");
        div.innerHTML = `<svg class="heart ${i >= lives ? 'broken' : ''}"><use href="${icon}"></use></svg>`;
        ui.livesBox.appendChild(div);
    }
}

function showIntegrity() {
    if (integrity < 0) integrity = 0;
    ui.integrityBar.style.width = integrity + "%";
    ui.integrityText.innerText = integrity + "%";

    if (integrity < 30) ui.integrityBar.className = "bar red";
    else if (integrity < 60) ui.integrityBar.className = "bar blue";
    else ui.integrityBar.className = "bar green";
}

function checkHintButton() {
    const wrongs = maxLives - lives;
    let canUse = (hints < 2) && (lives <= 2 || wrongs >= 2);
    ui.hintBtn.disabled = !canUse;
}

function addLog(msg, color) {
    const p = document.createElement("p");
    p.innerText = "> " + msg;
    if (color === "red") p.style.color = "var(--red)";
    if (color === "green") p.style.color = "var(--green)";
    ui.logText.appendChild(p);
    ui.logText.scrollTop = ui.logText.scrollHeight;
}

function pirateSay(type) {
    const list = PHRASES[type];
    const text = list[Math.floor(Math.random() * list.length)];

    ui.bubbleText.innerText = text;
    ui.bubble.classList.remove("hidden");
    ui.faceBox.classList.add("glitch");

    setTimeout(function () {
        ui.bubble.classList.add("hidden");
        ui.faceBox.classList.remove("glitch");
    }, 4000);

    addLog("PIRATE: " + text);
}
