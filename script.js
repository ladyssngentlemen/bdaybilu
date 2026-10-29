
const PIN_CODE = "270925";

/* =========================================
   ELEMEN PASSWORD
========================================= */

const passwordScreen = document.getElementById("password-screen");
const storyApp = document.getElementById("story-app");
const pinForm = document.getElementById("pin-form");
const pinContainer = document.getElementById("pin-container");
const pinMessage = document.getElementById("pin-message");

const pinInputs = Array.from(
    document.querySelectorAll(".pin-input")
);


/* =========================================
   EFEK KOTAK PIN
========================================= */

function getPinValue() {
    return pinInputs.map(input => input.value).join("");
}

function updatePinStyle() {
    pinInputs.forEach(input => {
        input.classList.toggle("filled", input.value !== "");
    });
}

function showPinMessage(message, type = "") {
    pinMessage.textContent = message;
    pinMessage.className = "pin-message";

    if (type) {
        pinMessage.classList.add(type);
    }
}

function clearPin() {
    pinInputs.forEach(input => {
        input.value = "";
        input.classList.remove("filled");
    });

    pinInputs[0].focus();
}

pinInputs.forEach((input, index) => {

    input.addEventListener("input", () => {
        input.value = input.value.replace(/\D/g, "").slice(-1);

        updatePinStyle();

        if (input.value && index < pinInputs.length - 1) {
            pinInputs[index + 1].focus();
        }

        showPinMessage("kalau salah.. tidur di luar!");
    });

    input.addEventListener("keydown", event => {
        if (
            event.key === "Backspace" &&
            input.value === "" &&
            index > 0
        ) {
            pinInputs[index - 1].focus();
        }

        if (event.key === "ArrowLeft" && index > 0) {
            pinInputs[index - 1].focus();
        }

        if (
            event.key === "ArrowRight" &&
            index < pinInputs.length - 1
        ) {
            pinInputs[index + 1].focus();
        }
    });

    input.addEventListener("paste", event => {
        event.preventDefault();

        const pastedText = (
            event.clipboardData || window.clipboardData
        ).getData("text");

        const digits = pastedText.replace(/\D/g, "").slice(0, 6);

        if (!digits) return;

        pinInputs.forEach((pinInput, pinIndex) => {
            pinInput.value = digits[pinIndex] || "";
        });

        updatePinStyle();

        const nextEmpty = pinInputs.find(pinInput => !pinInput.value);

        if (nextEmpty) {
            nextEmpty.focus();
        } else {
            pinInputs[pinInputs.length - 1].focus();
        }

        showPinMessage("cemua angka cuda macuk!");
    });
});


/* =========================================
   NAVIGASI HALAMAN
========================================= */

const pages = Array.from(
    document.querySelectorAll(".story-page")
);

const backButton = document.getElementById("back-button");
const nextButton = document.getElementById("next-button");
const restartButton = document.getElementById("restart-button");
const pageCounter = document.getElementById("page-counter");
const progressBar = document.getElementById("progress-bar");

const pageDots = Array.from(
    document.querySelectorAll(".page-dot")
);

const brandLink = document.getElementById("brand-link");

const welcomeNextButton = document.querySelector(
    ".welcome-content .next-button"
);

// PERBAIKAN: ambil tombol surat berdasarkan ID yang benar.
const closingNextButton = document.getElementById(
    "letter-next-button"
);

let currentPage = 0;

function showPage(index, direction = "next") {
    if (index < 0 || index >= pages.length) return;

    currentPage = index;

    pages.forEach((page, pageIndex) => {
        page.classList.remove("active", "from-back");

        if (pageIndex === currentPage) {
            page.classList.add("active");

            if (direction === "back") {
                page.classList.add("from-back");
            }
        }
    });

    // Nomor halaman.
    pageCounter.textContent =
        `${String(currentPage + 1).padStart(2, "0")} / ` +
        `${String(pages.length).padStart(2, "0")}`;

    // Progress bar.
    progressBar.style.width =
        `${((currentPage + 1) / pages.length) * 100}%`;

    // Indikator titik.
    pageDots.forEach((dot, dotIndex) => {
        dot.classList.toggle("active", dotIndex === currentPage);
    });

    // Tombol back.
    backButton.disabled = currentPage === 0;

    // Tombol next di navigasi bawah.
    if (currentPage === pages.length - 1) {
        nextButton.textContent = "the end";
        nextButton.disabled = true;
    } else {
        nextButton.textContent = "next";
        nextButton.disabled = false;
    }

    // Sembunyikan next bawah pada halaman pertama dan halaman surat.
    const hideNextButton = currentPage === 0 || currentPage === 3;

    nextButton.style.visibility = hideNextButton ? "hidden" : "visible";

    nextButton.disabled =
        hideNextButton || currentPage === pages.length - 1;

    // Sembunyikan back di halaman pertama.
    backButton.style.visibility =
        currentPage === 0 ? "hidden" : "visible";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================
   EVENT TOMBOL NAVIGASI
========================================= */

// Next di navigasi bawah.
nextButton.addEventListener("click", () => {
    showPage(currentPage + 1, "next");
});

// Tombol di halaman pembuka.
if (welcomeNextButton) {
    welcomeNextButton.addEventListener("click", event => {
        event.preventDefault();
        showPage(1, "next");
    });
}

// PERBAIKAN: tombol "next kaka cantik" menuju halaman terakhir.
if (closingNextButton) {
    closingNextButton.addEventListener("click", event => {
        event.preventDefault();
        showPage(4, "next");
    });
}

// Tombol back.
backButton.addEventListener("click", () => {
    showPage(currentPage - 1, "back");
});

// Logo kembali ke halaman pertama.
if (brandLink) {
    brandLink.addEventListener("click", event => {
        event.preventDefault();
        showPage(0, "back");
    });
}

// Restart cerita.
restartButton.addEventListener("click", () => {
    showPage(0, "back");
});


/* =========================================
   VERIFIKASI PASSWORD
========================================= */

pinForm.addEventListener("submit", event => {
    event.preventDefault();

    const enteredPin = getPinValue();

    if (enteredPin.length !== 6) {
        showPinMessage(
            "ehh, astaga ada angka yang kosong, sayang!",
            "error"
        );

        pinContainer.classList.remove("shake");
        void pinContainer.offsetWidth;
        pinContainer.classList.add("shake");

        const firstEmpty = pinInputs.find(input => !input.value);

        if (firstEmpty) firstEmpty.focus();

        return;
    }

    if (enteredPin === PIN_CODE) {
        showPinMessage("yay, berhacil!", "success");

        passwordScreen.classList.add("hidden");
        storyApp.classList.remove("hidden");

        showPage(0, "next");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } else {
        const wrongPinMessages = [
            "haa bebee.. kamu serius ga ingat? :<",
            "hmm... sayang ini.. :<",
            "ck, gilang dharma pranata ayub.",
            "IH YANG BENER AJAA, KOK SALAH??!?!",
            "please bilang kamu cuman salah ketik..",
            "nope! coba ingat-ingat lagi!",
            "well well well",
            "gilang dharma pranata ayub. tidur di luar!"
        ];

        const randomMessage = wrongPinMessages[
            Math.floor(Math.random() * wrongPinMessages.length)
        ];

        showPinMessage(randomMessage, "error");

        pinContainer.classList.remove("shake");
        void pinContainer.offsetWidth;
        pinContainer.classList.add("shake");

        clearPin();
    }
});


/* =========================================
   MUSIK OPSIONAL
========================================= */

const musicButton = document.getElementById("music-button");
const backgroundMusic = document.getElementById("background-music");

let isMusicPlaying = false;

musicButton.addEventListener("click", async () => {
    if (!isMusicPlaying) {
        try {
            await backgroundMusic.play();

            isMusicPlaying = true;
            musicButton.classList.add("playing");
            musicButton.textContent = "♫";
            musicButton.title = "Pause music";

        } catch (error) {
            showMusicMessage();
        }

    } else {
        backgroundMusic.pause();

        isMusicPlaying = false;
        musicButton.classList.remove("playing");
        musicButton.textContent = "♫";
        musicButton.title = "Play music";
    }
});

function showMusicMessage() {
    musicButton.title = "Tambahkan file assets/music.mp3 terlebih dahulu";
    musicButton.classList.remove("playing");
}

backgroundMusic.addEventListener("error", () => {
    isMusicPlaying = false;
    musicButton.classList.remove("playing");
});


/* =========================================
   BILU'S LITTLE MAGIC ♡
========================================= */

const magicStyle = document.createElement("style");

magicStyle.textContent = `
    .bilu-confetti {
        position: fixed;
        top: -25px;
        z-index: 9999;
        pointer-events: none;
        animation: biluFall var(--duration) linear forwards;
    }

    @keyframes biluFall {
        0% {
            transform: translate3d(0, -5vh, 0) rotate(0deg);
            opacity: 0;
        }
        10% { opacity: 1; }
        100% {
            transform: translate3d(var(--drift), 110vh, 0)
                       rotate(var(--rotation));
            opacity: 0;
        }
    }

    .bilu-float {
        position: fixed;
        bottom: -35px;
        z-index: 2;
        pointer-events: none;
        animation: biluFloat var(--duration) ease-in forwards;
    }

    @keyframes biluFloat {
        0% {
            transform: translateY(0) rotate(0deg) scale(.7);
            opacity: 0;
        }
        15% { opacity: .8; }
        80% { opacity: .65; }
        100% {
            transform: translateY(-110vh) rotate(35deg) scale(1.3);
            opacity: 0;
        }
    }

    .bilu-sparkle {
        position: fixed;
        z-index: 10000;
        pointer-events: none;
        animation: biluTwinkle .9s ease-out forwards;
    }

    @keyframes biluTwinkle {
        0% {
            opacity: 0;
            transform: scale(.2) rotate(0deg);
        }
        35% {
            opacity: 1;
            transform: scale(1.2) rotate(35deg);
        }
        100% {
            opacity: 0;
            transform: translateY(-25px) scale(.5) rotate(80deg);
        }
    }

    .magic-click {
        animation: biluClick .35s ease;
    }

    @keyframes biluClick {
        50% { transform: scale(1.08); }
    }

    @media (prefers-reduced-motion: reduce) {
        .bilu-confetti,
        .bilu-float,
        .bilu-sparkle {
            animation-duration: 1ms !important;
        }
    }
`;

document.head.appendChild(magicStyle);


/* 1. CONFETTI HATI */

function biluConfetti(amount = 85) {
    const colors = [
        "#83abc9", "#b9dced", "#f3a6b8",
        "#f5d58b", "#e8c5d4", "#fffaf3"
    ];

    for (let i = 0; i < amount; i++) {
        const piece = document.createElement("span");

        piece.className = "bilu-confetti";
        piece.textContent = Math.random() > .55 ? "♡" : "✦";

        piece.style.left = Math.random() * 100 + "vw";
        piece.style.color =
            colors[Math.floor(Math.random() * colors.length)];

        piece.style.fontSize = Math.random() * 13 + 9 + "px";

        piece.style.setProperty(
            "--duration",
            Math.random() * 2 + 2 + "s"
        );

        piece.style.setProperty(
            "--drift",
            (Math.random() - .5) * 180 + "px"
        );

        piece.style.setProperty(
            "--rotation",
            Math.random() * 600 + "deg"
        );

        document.body.appendChild(piece);

        piece.addEventListener("animationend", () => {
            piece.remove();
        }, { once: true });
    }
}


/* 2. HATI KECIL MELAYANG */

function biluFloatingHearts(amount = 12) {
    const hearts = ["♡", "♥", "୨୧", "✧"];
    const colors = ["#e8a6b9", "#83abc9", "#d5b46b"];

    for (let i = 0; i < amount; i++) {
        const heart = document.createElement("span");

        heart.className = "bilu-float";
        heart.textContent =
            hearts[Math.floor(Math.random() * hearts.length)];

        heart.style.left = Math.random() * 100 + "vw";
        heart.style.color =
            colors[Math.floor(Math.random() * colors.length)];

        heart.style.fontSize = Math.random() * 17 + 12 + "px";

        heart.style.setProperty(
            "--duration",
            Math.random() * 5 + 6 + "s"
        );

        document.body.appendChild(heart);

        heart.addEventListener("animationend", () => {
            heart.remove();
        }, { once: true });
    }
}


/* 3. SPARKLE SAAT MOUSE BERGERAK */

let lastSparkle = 0;

document.addEventListener("pointermove", event => {
    if (event.pointerType === "touch") return;
    if (Date.now() - lastSparkle < 110) return;

    lastSparkle = Date.now();

    if (Math.random() > .55) return;

    const sparkle = document.createElement("span");
    const symbols = ["✦", "✧", "⋆", "♡"];

    sparkle.className = "bilu-sparkle";
    sparkle.textContent =
        symbols[Math.floor(Math.random() * symbols.length)];

    sparkle.style.left = event.clientX + "px";
    sparkle.style.top = event.clientY + "px";

    sparkle.style.color = ["#83abc9", "#e8a6b9", "#d5b46b"][
        Math.floor(Math.random() * 3)
    ];

    sparkle.style.fontSize = Math.random() * 9 + 12 + "px";

    document.body.appendChild(sparkle);

    sparkle.addEventListener("animationend", () => {
        sparkle.remove();
    }, { once: true });
});


/* 4. EFEK SAAT KLIK TOMBOL */

document.addEventListener("click", event => {
    const button = event.target.closest(
        "button, .brand, .page-dot"
    );

    if (!button) return;

    button.classList.remove("magic-click");
    void button.offsetWidth;
    button.classList.add("magic-click");

    setTimeout(() => {
        button.classList.remove("magic-click");
    }, 400);
});


/* 5. KEJUTAN KONFETI SAAT PIN BENAR */

const magicStoryObserver = new MutationObserver(() => {
    if (!storyApp.classList.contains("hidden")) {
        biluConfetti(110);
        magicStoryObserver.disconnect();
    }
});

magicStoryObserver.observe(storyApp, {
    attributes: true,
    attributeFilter: ["class"]
});


/* 6. HATI MELAYANG PERLAHAN */

let heartInterval = null;

function startBiluHearts() {
    if (heartInterval) return;

    heartInterval = setInterval(() => {
        if (!storyApp.classList.contains("hidden")) {
            biluFloatingHearts(2);
        }
    }, 4500);
}

function stopBiluHearts() {
    if (heartInterval) {
        clearInterval(heartInterval);
        heartInterval = null;
    }
}

startBiluHearts();

document.querySelectorAll(".story-page img").forEach(photo => {
    photo.addEventListener("click", event => {
        const heart = document.createElement("span");

        heart.textContent = ["♡", "♥", "୨୧", "✧"][
            Math.floor(Math.random() * 4)
        ];

        heart.style.cssText = `
            position: fixed;
            left: ${event.clientX}px;
            top: ${event.clientY}px;
            z-index: 9999;
            pointer-events: none;
            color: #d889a7;
            font-size: 24px;
            animation: heartPop 900ms ease-out forwards;
        `;

        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 950);
    });
});

const heartStyle = document.createElement("style");

heartStyle.textContent = `
    @keyframes heartPop {
        0% {
            opacity: 0;
            transform: translate(-50%, 0) scale(0.5) rotate(-10deg);
        }
        30% {
            opacity: 1;
            transform: translate(-50%, -15px) scale(1.2) rotate(10deg);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -65px) scale(0.8) rotate(-15deg);
        }
    }
`;

document.head.appendChild(heartStyle);


/* ♡ ROMANTIC WORDS ON CLICK */

const clickMessages = [
    "mwaah",
    "i love you sayang",
    "aku jatuh suka~",
    "cayang bebecuu"
];

document.addEventListener("click", event => {
    if (event.target.closest("input, textarea, select")) return;

    const note = document.createElement("span");

    note.className = "click-love-note";
    note.textContent =
        clickMessages[Math.floor(Math.random() * clickMessages.length)];

    note.style.left = `${event.clientX}px`;
    note.style.top = `${event.clientY - 10}px`;

    document.body.appendChild(note);

    setTimeout(() => note.remove(), 2400);
});


/* STYLE TULISAN KLIK */

const clickMessageStyle = document.createElement("style");

clickMessageStyle.textContent = `
    .click-love-note {
        position: fixed;
        z-index: 100000;
        pointer-events: none;
        color: #527f98;
        font-family: 'Playfair Display', serif;
        font-size: 16px;
        font-style: italic;
        text-align: center;
        white-space: nowrap;
        text-shadow: 0 1px 8px rgba(255, 255, 255, 0.8);
        animation: clickLoveFloat 2.4s ease forwards;
    }

    @keyframes clickLoveFloat {
        0% {
            opacity: 0;
            transform: translate(-50%, 8px) scale(0.85);
        }
        15% {
            opacity: 1;
            transform: translate(-50%, 0) scale(1);
        }
        75% {
            opacity: 1;
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -35px) scale(0.95);
        }
    }

    @media (max-width: 600px) {
        .click-love-note {
            font-size: 13px;
            white-space: normal;
            width: 80%;
        }
    }
`;

document.head.appendChild(clickMessageStyle);


/* =========================================
   SMOOTH SWEET 17 LOADING CONTROLLER
========================================= */

(function () {
    const loader = document.getElementById("cute-loader");

    if (!loader) return;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    function startLoadingAnimation() {
        loader.classList.add("is-animating");

        const totalDuration = reducedMotion ? 700 : 3900;

        window.setTimeout(() => {
            loader.classList.add("loader-done");

            window.setTimeout(() => {
                loader.remove();
            }, 700);
        }, totalDuration);
    }

    if (document.readyState === "complete") {
        startLoadingAnimation();
    } else {
        window.addEventListener("load", startLoadingAnimation, {
            once: true
        });
    }
})();


/* =========================================
   ANOTHER LOVE LETTER — TYPEWRITER EFFECT
========================================= */

(function initLoveLetter() {
    const letterPage = document.querySelector(
        '.story-page[data-page="3"]'
    );

    const letterText = document.getElementById("letter-text");
    const signature = document.getElementById("letter-signature");
    const letterNextButton = document.getElementById("letter-next-button");

    if (!letterPage || !letterText || !signature || !letterNextButton) {
        return;
    }

    const fullText = letterText.textContent
        .replace(/\s+/g, " ")
        .trim();

    let started = false;
    let index = 0;
    let typingTimer = null;
    let signatureTimer = null;
    let buttonTimer = null;

    letterText.textContent = "";
    letterText.classList.add("typing");

    signature.classList.remove("visible");
    letterNextButton.classList.remove("visible");

    function typeLetter() {
        if (!letterPage.classList.contains("active")) {
            clearTimeout(typingTimer);
            return;
        }

        if (index < fullText.length) {
            const character = fullText.charAt(index);

            letterText.textContent += character;
            index++;

            let delay = 23;

            if (character === ",") {
                delay = 230;
            } else if (character === ".") {
                delay = 420;
            } else if (character === ":") {
                delay = 280;
            }

            typingTimer = setTimeout(typeLetter, delay);

        } else {
            letterText.classList.remove("typing");

            signatureTimer = setTimeout(() => {
                signature.classList.add("visible");
            }, 350);

            buttonTimer = setTimeout(() => {
                letterNextButton.classList.add("visible");
            }, 850);
        }
    }

    function startTyping() {
        if (started || !letterPage.classList.contains("active")) {
            return;
        }

        started = true;
        typingTimer = setTimeout(typeLetter, 650);
    }

    const observer = new MutationObserver(() => {
        if (letterPage.classList.contains("active")) {
            startTyping();
        } else {
            clearTimeout(typingTimer);
        }
    });

    observer.observe(letterPage, {
        attributes: true,
        attributeFilter: ["class"]
    });

    startTyping();
})();

