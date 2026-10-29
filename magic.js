
/* ==========================================
   ILY, BILU — STORYBOOK MAGIC 2.0
   Additional interactive effects
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    const giftPhotos = document.querySelectorAll(
        ".gift-image-wrap"
    );

    const finalPhoto = document.querySelector(
        ".final-photo-frame"
    );

    const storyPages = document.querySelectorAll(
        ".story-page"
    );

    const colors = [
        "#A9CFE7",
        "#F1D786",
        "#D9EAF4",
        "#FFF0BC",
        "#8CB6D0"
    ];

    /* ======================================
       CONFETTI — SMALL PAPER PIECES
    ====================================== */

    function paperConfetti(x, y, amount = 18) {

        if (reduceMotion.matches) return;

        const total = Math.min(amount, 35);

        for (let i = 0; i < total; i++) {

            const piece = document.createElement("span");

            piece.className = "magic-confetti";

            const driftX = (Math.random() - .5) * 230;
            const driftY = 80 + Math.random() * 180;
            const spin = (Math.random() - .5) * 720;
            const duration = 1 + Math.random() * .8;

            piece.style.left = `${x}px`;
            piece.style.top = `${y}px`;

            piece.style.backgroundColor =
                colors[Math.floor(Math.random() * colors.length)];

            piece.style.setProperty(
                "--drift-x",
                `${driftX}px`
            );

            piece.style.setProperty(
                "--drift-y",
                `${driftY}px`
            );

            piece.style.setProperty(
                "--spin",
                `${spin}deg`
            );

            piece.style.setProperty(
                "--fall-duration",
                `${duration}s`
            );

            piece.style.width =
                `${5 + Math.random() * 5}px`;

            piece.style.height =
                `${8 + Math.random() * 7}px`;

            document.body.appendChild(piece);

            piece.addEventListener(
                "animationend",
                () => piece.remove(),
                { once: true }
            );

            // Fallback cleanup
            setTimeout(() => piece.remove(), 2200);
        }
    }

    /* ======================================
       SECRET MESSAGE FOR PHOTOS
    ====================================== */

    const photoMessages = [
        "aku suka dimo karena mirip kamu..",
        "nanti bisa nda ngerakitnya?"
    ];

    function addPhotoInteraction(photo, message) {

        if (!photo) return;

        photo.setAttribute("role", "button");
        photo.setAttribute("tabindex", "0");
        photo.setAttribute(
            "aria-label",
            "Open a little secret about this gift"
        );

        const hint = document.createElement("span");
        hint.className = "magic-hint";
        hint.textContent = "tap me!";
        hint.setAttribute("aria-hidden", "true");

        const secret = document.createElement("div");
        secret.className = "magic-secret";
        secret.textContent = message;
        secret.setAttribute("role", "status");
        secret.setAttribute("aria-live", "polite");

        photo.appendChild(hint);
        photo.appendChild(secret);

        let hideTimeout;

        function activate() {

            clearTimeout(hideTimeout);

            photo.classList.remove("magic-tapped");
            void photo.offsetWidth;
            photo.classList.add("magic-tapped");

            secret.classList.add("show");

            const rect = photo.getBoundingClientRect();

            paperConfetti(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2,
                16
            );

            hideTimeout = setTimeout(() => {
                secret.classList.remove("show");
            }, 2900);
        }

        photo.addEventListener("click", activate);

        photo.addEventListener("keydown", event => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {
                event.preventDefault();
                activate();
            }

        });
    }

    giftPhotos.forEach((photo, index) => {

        const message =
            photoMessages[index] ||
            "a little something, made with love.";

        addPhotoInteraction(photo, message);
    });

    /* ======================================
       FINAL PHOTO SURPRISE
    ====================================== */

    if (finalPhoto) {

        finalPhoto.setAttribute("role", "button");
        finalPhoto.setAttribute("tabindex", "0");
        finalPhoto.setAttribute(
            "aria-label",
            "Reveal a little birthday surprise"
        );

        const hint = document.createElement("span");
        hint.className = "magic-hint";
        hint.textContent = "01-09-26";

        finalPhoto.appendChild(hint);

        function finalSurprise() {

            finalPhoto.classList.remove("magic-tapped");
            void finalPhoto.offsetWidth;
            finalPhoto.classList.add("magic-tapped");

            const rect = finalPhoto.getBoundingClientRect();

            paperConfetti(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2,
                30
            );
        }

        finalPhoto.addEventListener(
            "click",
            finalSurprise
        );

        finalPhoto.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {
                    event.preventDefault();
                    finalSurprise();
                }

            }
        );
    }

    /* ======================================
       PLAYFUL BUTTONS
    ====================================== */

    const buttons = document.querySelectorAll(
        ".primary-button, .nav-button, .restart-button"
    );

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            button.classList.remove("magic-clicked");

            void button.offsetWidth;

            button.classList.add("magic-clicked");

        });

        button.addEventListener(
            "animationend",
            event => {

                if (
                    event.animationName ===
                    "magic-button-bounce"
                ) {
                    button.classList.remove("magic-clicked");
                }

            }
        );
    });

    /* ======================================
       WELCOME CORNER DECORATIONS
    ====================================== */

    const welcome = document.querySelector(
        ".welcome-content"
    );

    if (welcome) {

        for (let i = 0; i < 2; i++) {

            const corner = document.createElement("span");

            corner.className = "magic-corner";
            corner.setAttribute("aria-hidden", "true");

            welcome.appendChild(corner);
        }
    }

    /* ======================================
       DETECT STORY PAGE CHANGES
    ====================================== */

    let previousPage = -1;
    let initialPageSeen = false;

    function checkActivePage() {

        const activePage = document.querySelector(
            ".story-page.active"
        );

        if (!activePage) return;

        const currentPage = Array.from(
            storyPages
        ).indexOf(activePage);

        if (currentPage < 0) return;
        if (currentPage === previousPage) return;

        previousPage = currentPage;

        // Do not celebrate the initial hidden page.
        if (!initialPageSeen) {
            initialPageSeen = true;
            return;
        }

        // Special celebration on the final chapter.
        if (currentPage === storyPages.length - 1) {

            setTimeout(() => {

                if (!activePage.classList.contains("active")) {
                    return;
                }

                const photo = activePage.querySelector(
                    ".final-photo-frame"
                );

                if (!photo) return;

                const rect = photo.getBoundingClientRect();

                paperConfetti(
                    rect.left + rect.width / 2,
                    rect.top + rect.height / 3,
                    24
                );

            }, 650);
        }
    }

    const observer = new MutationObserver(
        checkActivePage
    );

    storyPages.forEach(page => {

        observer.observe(page, {
            attributes: true,
            attributeFilter: ["class"]
        });

    });

    checkActivePage();

});
