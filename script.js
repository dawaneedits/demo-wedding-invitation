let song = null;
let musicToggle = null;
let heartInterval = null;

function openCurtain() {
    const curtainContainer = document.getElementById('curtain-container');
    if (curtainContainer) {
        curtainContainer.classList.add('open');
    }

    if (song) {
        song.volume = 1.0; 
        song.play()
            .then(() => {
                if (musicToggle) musicToggle.classList.remove('hidden');
            })
            .catch(error => {
                console.warn("Audio playback deferred:", error);
            });
    }
    
    setTimeout(() => {
        const heroSection = document.querySelector('.section-hero');
        if (heroSection) heroSection.classList.add('visible');
        // Curtain open zalyavar hearts generator suru karne
        startHeartsGenerator();
    }, 400);
}

function toggleMusic() {
    if (!song || !musicToggle) return;
    if (song.paused) {
        song.play().then(() => { musicToggle.innerText = "🔊"; }).catch(err => console.error(err));
    } else {
        song.pause();
        musicToggle.innerText = "🔇";
    }
}

// Infinite Small Floating Hearts Generator Logic (Var jatana disnar)
function startHeartsGenerator() {
    const container = document.getElementById('heartsContainer');
    if (!container) return;

    heartInterval = setInterval(() => {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        heart.innerText = '♥';
        
        // Random alignments across phone width
        const randomLeft = Math.random() * 100;
        const randomXMove = (Math.random() * 60) - 30; 
        const randomDelay = Math.random() * 2;
        const randomSize = 8 + (Math.random() * 10);

        heart.style.left = `${randomLeft}%`;
        heart.style.fontSize = `${randomSize}px`;
        heart.style.setProperty('--random-x', `${randomXMove}px`);
        heart.style.animationDelay = `${randomDelay}s`;

        container.appendChild(heart);

        // Remove element after flight completes
        setTimeout(() => {
            heart.remove();
        }, 4000);
    }, 350); 
}

document.addEventListener('DOMContentLoaded', () => {
    song = document.getElementById('weddingSong');
    musicToggle = document.getElementById('musicToggle');

    // Canvas Logic
    const canvas = document.getElementById('scratchCanvas');
    let ctx = null;
    let isDrawing = false;
    let isScratchedOpen = false;

    if (canvas) {
        ctx = canvas.getContext('2d');
        canvas.addEventListener('mousedown', () => isDrawing = true);
        canvas.addEventListener('mouseup', () => isDrawing = false);
        canvas.addEventListener('mousemove', scratch);
        canvas.addEventListener('touchstart', (e) => { isDrawing = true; scratch(e); });
        canvas.addEventListener('touchend', () => isDrawing = false);
        canvas.addEventListener('touchmove', (e) => { e.preventDefault(); scratch(e); });
        initCanvas();
    }

    function initCanvas() {
        if (!ctx) return;
        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        grad.addColorStop(0, '#bf953f'); grad.addColorStop(0.25, '#fcf6ba');
        grad.addColorStop(0.5, '#b38728'); grad.addColorStop(0.75, '#fbf5b7');
        grad.addColorStop(1, '#aa771c');
        ctx.fillStyle = grad; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#4a2c2a'; ctx.font = 'bold 11px Montserrat, sans-serif';
        ctx.textAlign = 'center'; ctx.letterSpacing = '3px';
        ctx.fillText('✨ SCRATCH HERE ✨', canvas.width / 2, canvas.height / 2 + 4);
    }

    function scratch(e) {
    if (!isDrawing || !ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    
    // 1. Extract raw client coordinates depending on mouse or touch event
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    // 2. Map coordinates precisely onto the canvas coordinate grid space
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;
    
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath(); 
    ctx.arc(x, y, 24, 0, Math.PI * 2); 
    ctx.fill();
    
    checkScratchPercentage();
}
    function checkScratchPercentage() {
        if (isScratchedOpen || !ctx) return;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let cleared = 0;
        for (let i = 3; i < pixels.length; i += 4) { if (pixels[i] === 0) cleared++; }
        if ((cleared / (canvas.width * canvas.height)) * 100 >= 40) {
            isScratchedOpen = true;
            if (canvas) { canvas.style.opacity = '0'; setTimeout(() => canvas.remove(), 500); }
            if (typeof confetti === 'function') {
                confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0, y: 0.6 } });
                confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1, y: 0.6 } });
            }
            const countdownArea = document.getElementById('countdown-area');
            if (countdownArea) countdownArea.classList.add('countdown-revealed');
        }
    }

    // Countdown Engine
    const weddingDate = new Date("2026-11-20T19:00:00").getTime();
    function updateCountdown() {
        const now = new Date().getTime();
        const diff = weddingDate - now;
        const countdownContainer = document.querySelector(".countdown-container");
        if (!countdownContainer) return;
        if (diff < 0) {
            countdownContainer.innerHTML = "<h3 style='color:#721c24;width:100%;text-align:center;'>THE BIG DAY IS HERE! 🎉</h3>";
            clearInterval(timerInterval); return;
        }
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        
        const daysEl = document.getElementById("days");
        const hoursEl = document.getElementById("hours");
        const minsEl = document.getElementById("minutes");
        const secsEl = document.getElementById("seconds");

        if (daysEl) daysEl.innerText = String(d).padStart(3, '0');
        if (hoursEl) hoursEl.innerText = String(h).padStart(2, '0');
        if (minsEl) minsEl.innerText = String(m).padStart(2, '0');
        if (secsEl) secsEl.innerText = String(s).padStart(2, '0');
    }
    const timerInterval = setInterval(updateCountdown, 1000);
    updateCountdown();

    // --- HIGH PERFORMANCE INTERSECTION OBSERVER FOR ALL DYNAMIC MOVEMENTS ---
    const scrollContainer = document.getElementById('inviteCard');
    
    const observerOptions = {
    root: scrollContainer,
    rootMargin: "0px 0px 100px 0px", // 100px khalunach animation trigger hoil (mhanje late honar nahi)
    threshold: 0.01 // Ekdam thoda bhag disla tari lagatach fast suru hoil
};

    const entranceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible'); // Keeps resetting animations on reverse scrolling
            }
        });
    }, observerOptions);

    // Track targets
    const elementsToObserve = document.querySelectorAll('.fade-in, .entry-trigger, .side-animate-row');
    elementsToObserve.forEach(el => entranceObserver.observe(el));
});