/* =====================================================
   INTRO HEART PARTICLES
===================================================== */

const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

let width = window.innerWidth;
let height = window.innerHeight;

canvas.width = width;
canvas.height = height;

let angle = 0;

const PARTICLES = 220;

const particles = [];

let introTime = 0;


/* =====================================================
   HEART FORMULA
===================================================== */

function heartX(t) {
    return 16 * Math.pow(Math.sin(t), 3);
}

function heartY(t) {
    return (
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t)
    );
}


/* =====================================================
   PARTICLE CLASS
===================================================== */

class Particle {

    constructor(index) {

        this.index = index;

        this.t =
            (index / PARTICLES) *
            Math.PI *
            2;

        this.offset =
            Math.random() * Math.PI * 2;

        this.randomX =
            (Math.random() - 0.5) * 80;

        this.randomY =
            (Math.random() - 0.5) * 80;

        this.size =
            Math.random() * 1.8 + 0.5;

        this.alpha =
            Math.random() * 0.7 + 0.3;

        this.speed =
            Math.random() * 0.004 + 0.002;
    }


    update(time) {

        this.t += this.speed;

        const pulse =
            1 +
            Math.sin(time * 0.002 + this.offset) *
            0.035;

        const scale =
            Math.min(width, height) / 48;

        const targetX =
            heartX(this.t) *
            scale *
            pulse;

        const targetY =
            -heartY(this.t) *
            scale *
            pulse;


        /*
          At the beginning the particles
          are scattered.
          They slowly gather into the heart.
        */

        const formation =
            Math.min(
                1,
                Math.max(
                    0,
                    (time - 500) / 2500
                )
            );

        const drift =
            1 - formation;


        this.x =
            width / 2 +
            targetX * formation +
            this.randomX * drift;

        this.y =
            height / 2 +
            targetY * formation +
            this.randomY * drift;
    }


    draw() {

        ctx.save();

        ctx.globalAlpha = this.alpha;

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI * 2
        );


        const gradient =
            ctx.createRadialGradient(
                this.x,
                this.y,
                0,
                this.x,
                this.y,
                7
            );

        gradient.addColorStop(
            0,
            "rgba(255,230,239,0.95)"
        );

        gradient.addColorStop(
            0.25,
            "rgba(255,150,191,0.9)"
        );

        gradient.addColorStop(
            1,
            "rgba(174,42,94,0)"
        );

        ctx.fillStyle = gradient;

        ctx.shadowColor =
            "rgba(239,80,137,0.8)";

        ctx.shadowBlur = 8;

        ctx.fill();

        ctx.restore();
    }
}


/* =====================================================
   CREATE PARTICLES
===================================================== */

for (let i = 0; i < PARTICLES; i++) {
    particles.push(
        new Particle(i)
    );
}


/* =====================================================
   EXTRA FLOATING PARTICLES
===================================================== */

const floatingParticles = [];

for (let i = 0; i < 70; i++) {

    floatingParticles.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 1.5 + 0.3,
        speed: Math.random() * 0.00025 + 0.00008,
        alpha: Math.random() * 0.5 + 0.1,
        phase: Math.random() * Math.PI * 2
    });
}


function drawFloatingParticles(time) {

    floatingParticles.forEach(p => {

        const x =
            p.x * width +
            Math.sin(
                time * 0.001 +
                p.phase
            ) * 15;

        const y =
            (
                p.y +
                time * p.speed
            ) % 1 * height;


        ctx.save();

        ctx.globalAlpha =
            p.alpha *
            (
                0.7 +
                Math.sin(
                    time * 0.002 +
                    p.phase
                ) * 0.3
            );

        ctx.fillStyle =
            "#f5a8c2";

        ctx.shadowColor =
            "#d83f78";

        ctx.shadowBlur = 7;

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            p.size,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.restore();
    });
}


/* =====================================================
   DRAW
===================================================== */

function draw(time) {

    introTime = time;

    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    /*
      Very subtle dark gradient
      behind the particles.
    */

    const background =
        ctx.createRadialGradient(
            width / 2,
            height / 2,
            20,
            width / 2,
            height / 2,
            Math.max(width, height) * 0.65
        );

    background.addColorStop(
        0,
        "rgba(55,13,31,0.28)"
    );

    background.addColorStop(
        0.5,
        "rgba(20,5,12,0.12)"
    );

    background.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );

    ctx.fillStyle = background;

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    drawFloatingParticles(time);


    particles.forEach(particle => {

        particle.update(time);

        particle.draw();

    });


    angle += 0.0015;

    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);


/* =====================================================
   RESIZE
===================================================== */

window.addEventListener(
    "resize",
    () => {

        width = window.innerWidth;

        height = window.innerHeight;

        canvas.width = width;

        canvas.height = height;
    }
);


/* =====================================================
   MAIN WEBSITE ELEMENTS
===================================================== */

const intro =
    document.getElementById("intro");

const website =
    document.getElementById("website");

const enterButton =
    document.getElementById("enterButton");

const music =
    document.getElementById("backgroundMusic");

const musicButton =
    document.getElementById("musicButton");


/* =====================================================
   ENTER WEBSITE
===================================================== */

enterButton.addEventListener(
    "click",
    async () => {

        /*
          IMPORTANT:
          Audio is started inside the click event.
          This is much more reliable because browsers
          usually block autoplay without user interaction.
        */

        try {

            music.volume = 0.55;

            await music.play();

            musicButton.textContent = "♫";

        } catch (error) {

            musicButton.textContent = "♫";

            console.log(
                "Music could not start:",
                error
            );
        }


        intro.classList.add("hide");

        setTimeout(
            () => {

                website.classList.add("show");

                document.body.style.overflowX =
                    "hidden";

                window.scrollTo({
                    top: 0,
                    behavior: "instant"
                });

            },
            650
        );
    }
);


/* =====================================================
   MUSIC BUTTON
===================================================== */

musicButton.addEventListener(
    "click",
    async () => {

        if (music.paused) {

            try {

                await music.play();

                musicButton.textContent =
                    "♫";

            } catch (error) {

                console.log(
                    "Music could not play:",
                    error
                );
            }

        } else {

            music.pause();

            musicButton.textContent =
                "♩";
        }
    }
);


/* =====================================================
   MUSIC ERROR
===================================================== */

music.addEventListener(
    "error",
    () => {

        console.log(
            "Music file could not be loaded."
        );

        musicButton.textContent = "♫";
    }
);


/* =====================================================
   CANDLE
===================================================== */

const blowButton =
    document.getElementById("blowButton");

const flame =
    document.getElementById("flame");

const wishResult =
    document.getElementById("wishResult");

const cakeMessage =
    document.getElementById("cakeMessage");


blowButton.addEventListener(
    "click",
    () => {

        /*
          Turn off flame.
        */

        flame.classList.add("off");


        /*
          Prevent repeated clicks.
        */

        blowButton.disabled = true;

        blowButton.textContent =
            "✨ آرزو کن ✨";


        /*
          Change message.
        */

        cakeMessage.textContent =
            "آرزو کن، شاید برآورده بشه ✨";


        wishResult.textContent =
            "امیدوارم قشنگ‌ترین آرزوت برآورده بشه ❤️";


        /*
          Small particle burst.
        */

        createWishParticles();
    }
);


/* =====================================================
   WISH PARTICLES
===================================================== */

function createWishParticles() {

    const cakeArea =
        document.querySelector(
            ".cake-area"
        );

    if (!cakeArea) return;


    for (let i = 0; i < 22; i++) {

        const particle =
            document.createElement("span");

        particle.textContent =
            Math.random() > 0.5
                ? "✦"
                : "♡";


        particle.style.position =
            "absolute";

        particle.style.left =
            "50%";

        particle.style.top =
            "45%";

        particle.style.color =
            Math.random() > 0.5
                ? "#f4a4bf"
                : "#fff";

        particle.style.fontSize =
            `${Math.random() * 12 + 8}px`;

        particle.style.pointerEvents =
            "none";

        particle.style.zIndex =
            "20";

        cakeArea.appendChild(
            particle
        );


        const angle =
            Math.random() *
            Math.PI *
            2;

        const distance =
            Math.random() *
            150 +
            70;

        const x =
            Math.cos(angle) *
            distance;

        const y =
            Math.sin(angle) *
            distance;


        particle.animate(
            [
                {
                    transform:
                        "translate(-50%, -50%) scale(0)",
                    opacity: 0
                },

                {
                    transform:
                        "translate(-50%, -50%) scale(1)",
                    opacity: 1,
                    offset: 0.2
                },

                {
                    transform:
                        `translate(
                            calc(-50% + ${x}px),
                            calc(-50% + ${y}px)
                        )
                        scale(0.3)`,
                    opacity: 0
                }
            ],
            {
                duration:
                    1100 +
                    Math.random() * 700,

                easing:
                    "cubic-bezier(.2,.7,.2,1)"
            }
        );


        setTimeout(
            () => {
                particle.remove();
            },
            2000
        );
    }
}


/* =====================================================
   SCROLL REVEAL
===================================================== */

const revealItems =
    document.querySelectorAll(
        ".surprise-card, .letter-wrapper, .memory-content, .bouquet, .cake-area"
    );


const revealObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (
                    entry.isIntersecting
                ) {

                    entry.target.classList.add(
                        "revealed"
                    );
                }

            });

        },
        {
            threshold: 0.12
        }
    );


revealItems.forEach(
    item => {

        item.classList.add(
            "reveal-item"
        );

        revealObserver.observe(item);

    }
);