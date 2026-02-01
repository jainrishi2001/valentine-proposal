// Get DOM elements
const openingScreen = document.getElementById('openingScreen');
const bouquetContainer = document.getElementById('bouquetContainer');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const proposalBox = document.getElementById('proposalBox');
const successMessage = document.getElementById('successMessage');
const heartBackground = document.querySelector('.heart-background');

// Counter for "No" button clicks
let noClickCount = 0;
let noHoverCount = 0; // Track hover events
let hoverInterval = null; // For continuous growth
let currentYesScale = 1; // Track current Yes button scale

// Initialize floating heart particles
function createHeartParticles() {
    const particleCount = 15;
    const heartEmojis = ['💖', '💕', '💗', '💝', '💘'];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'heart-particle';
        particle.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 6) + 's';
        heartBackground.appendChild(particle);
    }
}

// Create soft pop sound using Web Audio API
function playPopSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Soft pop sound parameters
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        // Silently fail if Web Audio API is not supported
        console.log('Audio not supported');
    }
}

// Initialize particles on page load
createHeartParticles();

// Handle bouquet click - transition to proposal screen
bouquetContainer.addEventListener('click', function() {
    // Fade out opening screen
    openingScreen.classList.add('hidden');
    
    // Fade in proposal box with a slight delay
    setTimeout(() => {
        proposalBox.classList.add('show');
    }, 300);
});

// Array of messages for the "No" button
const noMessages = [
    "Are you sure? 🥺",
    "Really? 💔",
    "Please reconsider! 😢",
    "Give me a chance! 🙏",
    "Pretty please? 🥹"
];

// Handle "Yes" button click
yesBtn.addEventListener('click', function() {
    // Clear the screen - fade out proposal box
    proposalBox.style.opacity = '0';
    proposalBox.style.transform = 'scale(0.8)';
    
    // Show success message after short delay
    setTimeout(() => {
        proposalBox.style.display = 'none';
        successMessage.classList.add('show');
        
        // Start celebration mode
        startCelebration();
    }, 400);
});

// Handle "No" button click
noBtn.addEventListener('click', function(e) {
    // Prevent default and move away
    e.preventDefault();
    moveNoButton();
    
    noClickCount++;
    
    // Change button text
    if (noClickCount < noMessages.length) {
        noBtn.textContent = noMessages[noClickCount];
    } else {
        noBtn.textContent = noMessages[noMessages.length - 1];
    }
});

// Function to move "No" button to random position within viewport
function moveNoButton() {
    // Play pop sound
    playPopSound();
    
    // Increment hover count (for tracking/debugging)
    noHoverCount++;
    
    // Scale up "Yes" button when "No" is hovered
    currentYesScale += 0.15; // Increase by 15% each hover
    updateYesButtonScale();
    
    // Optional: Log for debugging
    console.log(`No button hovered ${noHoverCount} times. Yes scale: ${currentYesScale}`);
    
    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Get button dimensions (use a larger estimate to be safe)
    const btnWidth = 180;  // Approximate button width
    const btnHeight = 80;  // Approximate button height
    
    // Calculate safe boundaries with generous margins
    const margin = 30;
    const minX = margin;
    const minY = margin;
    const maxX = viewportWidth - btnWidth - margin;
    const maxY = viewportHeight - btnHeight - margin;
    
    // Ensure we have valid boundaries
    if (maxX <= minX || maxY <= minY) {
        console.log('Screen too small for button movement');
        return;
    }
    
    // Generate random position within safe boundaries
    const randomX = Math.floor(Math.random() * (maxX - minX) + minX);
    const randomY = Math.floor(Math.random() * (maxY - minY) + minY);
    
    // Clamp values to ensure they're within bounds
    const finalX = Math.max(minX, Math.min(maxX, randomX));
    const finalY = Math.max(minY, Math.min(maxY, randomY));
    
    // Apply position
    noBtn.style.position = 'fixed';
    noBtn.style.left = `${finalX}px`;
    noBtn.style.top = `${finalY}px`;
    noBtn.style.transform = 'translate(0, 0)';
    
    console.log(`Moved to: (${finalX}, ${finalY}) - Viewport: ${viewportWidth}x${viewportHeight}`);
}

// Function to update Yes button scale
function updateYesButtonScale() {
    // Check if it should go fullscreen (scale >= 8)
    if (currentYesScale >= 8) {
        expandYesButtonFullscreen();
    } else {
        yesBtn.style.transform = `scale(${currentYesScale})`;
    }
}

// Function to expand Yes button to fullscreen
function expandYesButtonFullscreen() {
    yesBtn.classList.add('yes-fullscreen');
    
    // Clear existing content and create new structure
    yesBtn.innerHTML = '';
    
    // Create container for better control
    const container = document.createElement('div');
    container.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 30px;
        width: 100%;
        height: 100%;
    `;
    
    // Create and add GIF
    const gif = document.createElement('img');
    gif.src = 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExM25rcTVvMmE2eHg1ZXZoMnMyMGxucDRqeDhpZHNtdThpeTF0cnRqcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/lTYcvZ2GVPIZE1lArV/giphy.gif';
    gif.alt = 'Please say yes!';
    gif.className = 'fullscreen-yes-gif';
    gif.style.cssText = `
        width: 300px;
        max-width: 50%;
        max-height: 35vh;
        height: auto;
        display: block;
        border-radius: 20px;
        box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
    `;
    
    // Create text element
    const text = document.createElement('div');
    text.textContent = "Okay okay… just click YES already 💘";
    text.className = 'fullscreen-yes-text';
    text.style.cssText = `
        font-size: 3rem;
        font-weight: bold;
        color: white;
        text-shadow: 3px 3px 15px rgba(0, 0, 0, 0.3);
        padding: 0 20px;
        text-align: center;
    `;
    
    // Append to container
    container.appendChild(gif);
    container.appendChild(text);
    
    // Append container to button
    yesBtn.appendChild(container);
    
    // Hide No button
    noBtn.style.opacity = '0';
    noBtn.style.pointerEvents = 'none';
    
    // Stop the interval if running
    if (hoverInterval) {
        clearInterval(hoverInterval);
        hoverInterval = null;
    }
}

// Make "No" button run away on hover
noBtn.addEventListener('mouseenter', function() {
    moveNoButton();
    
    // Start continuous growth interval if not already running
    if (!hoverInterval && currentYesScale < 8) {
        startContinuousGrowth();
    }
});

// Detect mouse movement on proposal box to continue growth
proposalBox.addEventListener('mousemove', function(e) {
    // Check if we're not hovering over Yes or No button
    const isHoveringNo = e.target === noBtn || noBtn.contains(e.target);
    const isHoveringYes = e.target === yesBtn || yesBtn.contains(e.target);
    
    if (!isHoveringNo && !isHoveringYes && noHoverCount > 0) {
        // User is hovering on screen but not on buttons
        if (!hoverInterval && currentYesScale < 8) {
            startContinuousGrowth();
        }
    }
});

// Stop growth when mouse leaves proposal area or hovers over Yes
yesBtn.addEventListener('mouseenter', function() {
    stopContinuousGrowth();
});

proposalBox.addEventListener('mouseleave', function() {
    stopContinuousGrowth();
});

// Function to start continuous Yes button growth
function startContinuousGrowth() {
    console.log('Starting continuous growth interval');
    hoverInterval = setInterval(() => {
        if (currentYesScale < 8) {
            currentYesScale += 0.3; // Grow by 30% every second
            updateYesButtonScale();
            console.log(`Continuous growth: scale = ${currentYesScale}`);
        } else {
            stopContinuousGrowth();
        }
    }, 1000); // Every 1 second
}

// Function to stop continuous growth
function stopContinuousGrowth() {
    if (hoverInterval) {
        console.log('Stopping continuous growth interval');
        clearInterval(hoverInterval);
        hoverInterval = null;
    }
}

// Also move on touch devices (when finger gets close)
noBtn.addEventListener('touchstart', function(e) {
    e.preventDefault();
    moveNoButton();
}, { passive: false });

// ========== CELEBRATION MODE ==========

// Start celebration with confetti and animations
function startCelebration() {
    console.log('🎉 Celebration mode activated!');
    
    // Create continuous confetti bursts
    createConfettiBurst();
    
    // Additional bursts at intervals
    setTimeout(() => createConfettiBurst(), 500);
    setTimeout(() => createConfettiBurst(), 1000);
    setTimeout(() => createConfettiBurst(), 1500);
    setTimeout(() => createConfettiBurst(), 2000);
}

// Create a burst of confetti
function createConfettiBurst() {
    const confettiCount = 60;
    const emojis = ['❤️', '💕', '💖', '💗', '💝', '💘', '💞', '🌹', '💐', '✨'];
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            createConfettiPiece(emojis[Math.floor(Math.random() * emojis.length)]);
        }, i * 20);
    }
}

// Create individual confetti piece with enhanced animation
function createConfettiPiece(emoji) {
    const confetti = document.createElement('div');
    confetti.textContent = emoji;
    confetti.className = 'confetti-piece';
    
    // Random starting position across the top
    const startX = Math.random() * 100;
    
    // Random horizontal drift
    const drift = (Math.random() - 0.5) * 100;
    
    // Random rotation
    const rotation = Math.random() * 360;
    const rotationSpeed = (Math.random() - 0.5) * 720;
    
    // Random fall duration
    const duration = Math.random() * 2 + 3; // 3-5 seconds
    
    // Random size
    const size = Math.random() * 20 + 20; // 20-40px
    
    confetti.style.cssText = `
        position: fixed;
        left: ${startX}%;
        top: -50px;
        font-size: ${size}px;
        z-index: 10000;
        pointer-events: none;
        animation: confettiFall ${duration}s linear forwards;
        --drift: ${drift}px;
        --rotation: ${rotation}deg;
        --rotation-speed: ${rotationSpeed}deg;
    `;
    
    document.body.appendChild(confetti);
    
    // Remove confetti after animation
    setTimeout(() => {
        confetti.remove();
    }, duration * 1000 + 100);
}

// Add fall animation dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        0% {
            transform: translateY(0) translateX(0) rotate(var(--rotation));
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) translateX(var(--drift)) rotate(calc(var(--rotation) + var(--rotation-speed)));
            opacity: 0;
        }
    }
    
    .confetti-piece {
        user-select: none;
    }
`;
document.head.appendChild(style);
