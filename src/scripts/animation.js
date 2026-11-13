
document.addEventListener("DOMContentLoaded", () => {

    // REGISTER GSAP
    gsap.registerPlugin(ScrollTrigger);

    // 1. INTRO TIMELINE
    const tl = gsap.timeline({
        paused: true,
        defaults: {
            duration: 0.8,
            ease: "power2.out"
        }
    });

    tl.from("#home .card", {
        y: 60,
        opacity: 0,
        stagger: 0.2
    })
    .from("nav a", {
        y: 25,
        opacity: 0,
        stagger: 0.15
    }, "-=0.4");

    tl.play();

    // 2. REPLAY TIMELINE
    window.addEventListener("replay-timeline", () => {
        tl.restart();
    });

    // 3. FADE IN + SCRUB
    gsap.utils.toArray("#about, #services, #contact").forEach(section => {

        gsap.fromTo(section,
            {
                opacity: 0,
                y: 50
            },
            {
                opacity: 1,
                y: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    end: "top 30%",
                    scrub: 1,
                    markers: false
                }
            }
        );

    });

    // 4. PIN SERVICES
    ScrollTrigger.create({
        trigger: "#services",
        start: "top top",
        end: "+=500",
        pin: true,
        pinSpacing: true,
        markers: false
    });

    // 5. SCROLL PROGRESS BAR
    gsap.to("#progressBar", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3
        }
    });

    
    // 6. TEXT SCRAMBLE EFFECT
    const nameTitle = document.querySelector("#nameTitle");

    const originalText = "Jory Jey Caro";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    const textAnimation = { progress: 0 };

    function scrambleText() {

        if (!nameTitle) return;

        textAnimation.progress = 0;

        gsap.killTweensOf(textAnimation);

        gsap.to(textAnimation, {
            progress: 1,
            duration: 2,
            ease: "none",

            onUpdate: function () {

                const revealCount = Math.floor(
                    originalText.length * textAnimation.progress
                );

                let result = "";

                for (let i = 0; i < originalText.length; i++) {

                    if (originalText[i] === " ") {
                        result += " ";

                    } else if (i < revealCount) {
                        result += originalText[i];

                    } else {
                        result += characters[
                            Math.floor(Math.random() * characters.length)
                        ];
                    }
                }

                nameTitle.innerHTML = result.replace(" ", "<br>");
            },

            onComplete: function () {
                nameTitle.innerHTML = "Jory<br>Jey Caro";
            }
        });
    }

    // Play scramble animation initially
    scrambleText();

    // 7. REPLAY BOTH ANIMATIONS
    window.addEventListener("replay-timeline", function () {

        // Replay intro animation
        tl.restart();

        // Replay text scramble
        scrambleText();

    });


    // 7. MOUSE FOLLOWING GLOW
    const glow = document.querySelector("#cursorGlow");

    if (glow) {
        const moveGlowX = gsap.quickTo(glow, "x", {
            duration: 0.4,
            ease: "power2.out"
        });

        const moveGlowY = gsap.quickTo(glow, "y", {
            duration: 0.4,
            ease: "power2.out"
        });

        document.addEventListener("mousemove", event => {
            moveGlowX(event.clientX - 90);
            moveGlowY(event.clientY - 90);
        });
    }

    // 8. MAGNETIC BUTTONS
    document.querySelectorAll("#themeBtn, #replayBtn, .btn-primary")
        .forEach(button => {

            button.addEventListener("mousemove", event => {
                const rect = button.getBoundingClientRect();

                const x = event.clientX - rect.left - rect.width / 2;
                const y = event.clientY - rect.top - rect.height / 2;

                gsap.to(button, {
                    x: x * 0.2,
                    y: y * 0.2,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            button.addEventListener("mouseleave", () => {
                gsap.to(button, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: "elastic.out(1, 0.4)"
                });
            });

        });

    // 9. 3D TILT SERVICE CARDS
    document.querySelectorAll("#services .card").forEach(card => {

        card.addEventListener("mousemove", event => {
            const rect = card.getBoundingClientRect();

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const rotateY = (x / rect.width - 0.5) * 15;
            const rotateX = (0.5 - y / rect.height) * 15;

            gsap.to(card, {
                rotationX: rotateX,
                rotationY: rotateY,
                scale: 1.03,
                duration: 0.3,
                ease: "power2.out",
                transformPerspective: 800
            });
        });

        card.addEventListener("mouseleave", () => {
            gsap.to(card, {
                rotationX: 0,
                rotationY: 0,
                scale: 1,
                duration: 0.5,
                ease: "power2.out"
            });
        });

    });

});

    // DARK AND LIGHT MODE
    const themeBtn = document.querySelector("#themeBtn");

    function updateTheme() {
        const isDark = document.documentElement.classList.contains("dark");

        if (themeBtn) {
            themeBtn.textContent = isDark ? "LIGHT MODE" : "DARK MODE";
        }
    }

    // Load saved theme
    const savedTheme = localStorage.getItem("portfolio-theme");

    if (savedTheme === "light") {
        document.documentElement.classList.remove("dark");
    } else {
        document.documentElement.classList.add("dark");
    }

    updateTheme();

    // Switch theme
 
themeBtn?.addEventListener("click", () => {

    // ROTATE BUTTON 360 DEGREES
    gsap.to(themeBtn, {
        rotation: "+=360",
        duration: 0.6,
        ease: "power2.inOut"
    });

    // TOGGLE DARK AND LIGHT MODE
    document.documentElement.classList.toggle("dark");

    const isDark = document.documentElement.classList.contains("dark");

    localStorage.setItem(
        "portfolio-theme",
        isDark ? "dark" : "light"
    );

    updateTheme();

});


    // REPLAY TIMELINE
    document.querySelector("#replayBtn")?.addEventListener("click", () => {
        window.dispatchEvent(new Event("replay-timeline"));
    });


