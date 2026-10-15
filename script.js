
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

    // Hanya menerima satu angka dalam setiap kotak.
    input.addEventListener("input", () => {
        input.value = input.value.replace(/\D/g, "").slice(-1);

        updatePinStyle();

        if (input.value && index < pinInputs.length - 1) {
            pinInputs[index + 1].focus();
        }

        showPinMessage("kalau salah.. tidur di luar!");
    });

    // Backspace kembali ke kotak sebelumnya.
    input.addEventListener("keydown", event => {
        if (
            event.key === "Backspace" &&
            input.value === "" &&
            index > 0
        ) {
            pinInputs[index - 1].focus();
        }

        // Berpindah kotak menggunakan tombol panah.
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

    // Bisa paste enam angka sekaligus.
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

const closingNextButton = document.querySelector(
    ".closing-content .next-button"
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

    // Nomor halaman konten: 01 / 05 sampai 05 / 05.
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

    // Tombol back tidak bisa dipakai di halaman pertama.
    backButton.disabled = currentPage === 0;

    // Tombol navigasi next tanpa tanda panah.
    if (currentPage === pages.length - 1) {
        nextButton.textContent = "the end ♡";
        nextButton.disabled = true;
    } else {
        nextButton.textContent = "next";
        nextButton.disabled = false;
    }

    // Sembunyikan navigasi bawah pada halaman 01 dan 04.
    const hideNextButton = currentPage === 0 || currentPage === 3;

    nextButton.style.visibility = hideNextButton ? "hidden" : "visible";

    nextButton.disabled =
        hideNextButton || currentPage === pages.length - 1;

    // Tombol back juga disembunyikan pada halaman pertama.
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

// Tombol next di navigasi bawah.
nextButton.addEventListener("click", () => {
    showPage(currentPage + 1, "next");
});

// Tombol "saya siap kak" di halaman 01.
if (welcomeNextButton) {
    welcomeNextButton.addEventListener("click", () => {
        showPage(1, "next");
    });
}

// Tombol "next kaka cantik" di halaman 04.
if (closingNextButton) {
    closingNextButton.addEventListener("click", () => {
        showPage(4, "next");
    });
}

// Tombol back.
backButton.addEventListener("click", () => {
    showPage(currentPage - 1, "back");
});

// Klik logo membawa kembali ke halaman cerita pertama.
brandLink.addEventListener("click", event => {
    event.preventDefault();
    showPage(0, "back");
});

// Tombol untuk membaca ulang dari awal.
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
            "gilang dharma pranata ayub. tidur di luar!",
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
