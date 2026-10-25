// ===== script.js =====

// ---------- 1. THINGS YOU CAN EDIT ----------
// Your letter. Edit the text between the backticks. A blank line starts a new paragraph.
const LETTER_TEXT = `Dear babi,

I've been trying to find the right words for a while now, and I'm still not sure I have them. So, I'll just be honest with you.

I originally planned to give you this letter on November 1, but honestly, I don't think I can wait that long anymore. I've been trying to wait for the right moment, but a part of me just wants you to know already.

Somewhere along the way, what I feel for you grew into something bigger than a crush. I like you. So much more than I can properly put into words. And I don't want to keep pretending that I'm satisfied with our current situation. Because honestly, it's not enough for me.

I just wanted to be honest about how I feel, because you mean that much to me.

So, with all the courage I can gather, I want to ask you something I've been wanting to ask for a while now...

Will you be my boyfriend? 💛

With all my heart,
Cunton 💛`;

// The three answer buttons and the reaction each one shows. Keep them kind and pressure-free.
const RESPONSES = [
    {
        label: "I love you too, babi:))💛", title: "You just made my whole day 💛",
        text: "I'm smiling so much right now. I love you, babi! Let's spend our future together - babi's side.", hearts: 28
    },
    {
        label: "I need some time to think 🌼", title: "Take all the time you need 🌼",
        text: "Thank you for being honest with me. There's no rush and no pressure at all. Whatever you decide, I'm grateful for you, and nothing has to change.", hearts: 6
    },
    {
        label: "Can we talk about this? 💌", title: "Of course 💌",
        text: "I'd really like that. Whenever you're ready, I'm here to listen, and you can be completely honest with me. Just us, no pressure.", hearts: 10
    },
];

// ---------- 2. PIXEL ART ----------
// Each picture is a grid of letters. Every letter is a colored square; "." is empty.
const COLORS = {
    Y: "#FFD23F", O: "#F4B942", D: "#D98E2F", B: "#4A3524", P: "#FF9DB0", W: "#FFFFFF",
    G: "#7DB07A", R: "#E5484D", A: "#F4A259", U: "#5B9BD5", C: "#D9693F", S: "#F4C95D"
};
const ART = {
    sun: ["...O.O.O...", "...........", "O.YYYYYYY.O", "..YYYYYYY..", "O.YBYYYBY.O", "..YPYYYPY..", "O.YYBBBYY.O",
        "..YYYYYYY..", "O.YYYYYYY.O", "...........", "...O.O.O..."],
    cloud: ["......WWWW......", "....WWWWWWWW....", "..WWWWWWWWWWWW..", ".WWWWWWWWWWWWWW.", "WWWWWWWWWWWWWWWW", "WWWWWWWWWWWWWWWW"],
    sparkle: ["..S..", "..S..", "SSSSS", "..S..", "..S.."],
    cat: [".O...O..........", ".OOOOOO.........", "OBOOBOOODOODOOOO", "OOOPOOOODOODOOOO", "OOOOOOOOOOOOOOOO", ".OOOOOOOOOOOOOO."],
    books: ["...AAA......", "...AAA...UUU", "...AAAGGGUUU", "RRRAAAGGGUUU", "RRRAAAGGGUUU", "RRRAAAGGGUUU", "RRRAAAGGGUUU",
        "RRRAAAGGGUUU", "RRRAAAGGGUUU", "RRRAAAGGGUUU", "BBBBBBBBBBBB"],
    heart: [".RR.RR.", "RRRRRRR", "RRRRRRR", ".RRRRR.", "..RRR..", "...R..."],
    flower: ["..PPP..", ".PPYPP.", "..PPP..", "...G...", ".GGG...", "...G...", "...G...", ".CCCCC.", "..CCC.."],
};

// Turns a grid into an <svg> made of small rectangles.
function drawPixelArt(grid, size) {
    let rects = "";
    grid.forEach(function (row, y) {
        [...row].forEach(function (letter, x) {
            if (letter !== ".") rects += `<rect x="${x * size}" y="${y * size}" width="${size}" height="${size}" fill="${COLORS[letter]}"/>`;
        });
    });
    return `<svg width="${grid[0].length * size}" height="${grid.length * size}" shape-rendering="crispEdges">${rects}</svg>`;
}
document.querySelectorAll("[data-art]").forEach(function (el) {
    el.innerHTML = drawPixelArt(ART[el.dataset.art], Number(el.dataset.size) || 6);
});

// ---------- 3. SCREENS (used by every step) ----------
const letterTimers = { type: null, hearts: null };

// showScreen("letter") shows the screen with data-screen="letter" and hides the rest.
function showScreen(name) {
    document.querySelectorAll(".screen").forEach(function (screen) {
        screen.classList.toggle("is-active", screen.dataset.screen === name);
    });
    if (name !== "letter") { clearTimeout(letterTimers.type); clearInterval(letterTimers.hearts); }
    // Move keyboard focus to the new screen's heading so keyboard users don't get lost
    const heading = document.querySelector(`[data-screen="${name}"] h1, [data-screen="${name}"] h2`);
    if (heading) { heading.setAttribute("tabindex", "-1"); heading.focus({ preventScroll: true }); }
}

// ---------- 4. HELPERS ----------
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Floating hearts / sparkles that rise and remove themselves.
function floatHearts(count, symbols) {
    if (prefersReducedMotion) return;
    const layer = document.getElementById("hearts-layer");
    const set = symbols || ["♥", "♥", "✦"];
    for (let i = 0; i < count; i++) {
        const heart = document.createElement("span");
        heart.className = "float-heart";
        heart.textContent = set[i % set.length];
        heart.style.left = Math.random() * 95 + "%";
        heart.style.fontSize = 14 + Math.random() * 20 + "px";
        heart.style.animationDelay = Math.random() * 0.8 + "s";
        layer.appendChild(heart);
        heart.addEventListener("animationend", function () { heart.remove(); });
    }
}

// Optional sound effect. If the file is missing, nothing happens.
function playSound(path) {
    try { new Audio(path).play().catch(function () { }); } catch (e) { }
}

// ---------- 5. WELCOME: envelope ----------
const envelope = document.getElementById("envelope");
const openButton = document.getElementById("open-btn");
let isOpening = false; // sto  repeated clicks from restarting the animation

function openEnvelope() {
    if (isOpening) return;
    isOpening = true;
    openButton.disabled = true;
    playSound("assets/envelope-open.mp3"); // optional file
    envelope.classList.add("is-open");
    envelope.setAttribute("aria-label", "Envelope opened");
    floatHearts(18);
    setTimeout(function () { showScreen("letter"); startLetter(); }, prefersReducedMotion ? 300 : 1900);
}
envelope.addEventListener("click", openEnvelope);
openButton.addEventListener("click", openEnvelope);

// ---------- 6. LETTER: typewriter effect ----------
const typedEl = document.getElementById("letter-typed");
const ghostEl = document.getElementById("letter-ghost");
const skipButton = document.getElementById("skip-btn");
const continueButton = document.getElementById("continue-btn");
document.getElementById("letter-sr").textContent = LETTER_TEXT;
let typedCount = 0;

function renderTyped() {
    typedEl.textContent = LETTER_TEXT.slice(0, typedCount);
    ghostEl.textContent = LETTER_TEXT.slice(typedCount); // invisible, just holds the space
}
function startLetter() {
    typedCount = 0;
    renderTyped();
    skipButton.hidden = false;
    continueButton.hidden = true;
    if (prefersReducedMotion) { finishLetter(false); return; }
    letterTimers.hearts = setInterval(function () { floatHearts(1); }, 2500); // gentle, not distracting
    typeNext();
}
function typeNext() {
    if (typedCount >= LETTER_TEXT.length) { finishLetter(false); return; }
    const ch = LETTER_TEXT[typedCount++];
    renderTyped();
    const pause = ".!?".includes(ch) ? 350 : ch === "," ? 160 : ch === "\n" ? 120 : 35;
    letterTimers.type = setTimeout(typeNext, pause);
}
function finishLetter(focusContinue) {
    clearTimeout(letterTimers.type);
    clearInterval(letterTimers.hearts);
    typedCount = LETTER_TEXT.length;
    renderTyped();
    skipButton.hidden = true;
    continueButton.hidden = false;
    if (focusContinue) continueButton.focus();
}
skipButton.addEventListener("click", function () { finishLetter(true); });
continueButton.addEventListener("click", function () { floatHearts(8); showScreen("question"); });

// ---------- 7. QUESTION + REACTIONS + REPLAY ----------
const questionBlock = document.getElementById("question-block");
const reactionBlock = document.getElementById("reaction-block");

RESPONSES.forEach(function (response) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn";
    button.textContent = response.label;
    button.addEventListener("click", function () {
        document.getElementById("reaction-title").textContent = response.title;
        document.getElementById("reaction-text").textContent = response.text;
        questionBlock.hidden = true;
        reactionBlock.hidden = false;
        floatHearts(response.hearts, response.hearts < 8 ? ["✿", "✦"] : undefined);
        document.getElementById("reaction-title").setAttribute("tabindex", "-1");
        document.getElementById("reaction-title").focus({ preventScroll: true });
    });
    document.getElementById("choices").appendChild(button);
});

// Replay: put everything back the way it started
document.getElementById("replay-btn").addEventListener("click", function () {
    envelope.classList.remove("is-open");
    envelope.setAttribute("aria-label", "Open the envelope");
    isOpening = false;
    openButton.disabled = false;
    questionBlock.hidden = false;
    reactionBlock.hidden = true;
    showScreen("welcome");
});