        // Mouse tracking for shine and cursor
        let mouseX = 50;
        let mouseY = 50;
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 100;
            mouseY = (e.clientY / window.innerHeight) * 100;
            document.getElementById('shine').style.setProperty('--mouse-x', mouseX + '%');
            document.getElementById('shine').style.setProperty('--mouse-y', mouseY + '%');

            const cursor = document.getElementById('cursor');
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
        });

        // Starfield initialization with parallax layers
        function initStars() {
            const canvas = document.getElementById('stars');
            const ctx = canvas.getContext('2d');
            let stars = [];
            let fallingStars = [];
            let parallaxOffsetX = 0;
            let parallaxOffsetY = 0;

            function resizeCanvas() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);

            // Create multiple layers of twinkling stars
            for (let layer = 0; layer < 3; layer++) {
                const layerStars = 70;
                const speed = layer * 0.5 + 0.5; // Different parallax speeds
                for (let i = 0; i < layerStars; i++) {
                    stars.push({
                        x: Math.random() * canvas.width,
                        y: Math.random() * canvas.height,
                        radius: Math.random() * 1.5 + 0.5,
                        opacity: Math.random(),
                        twinkleSpeed: (Math.random() * 0.02 + 0.01) * (Math.random() > 0.5 ? 1 : -1),
                        layer: layer,
                        color: layer === 0 ? 'rgba(255, 255, 255, ' : layer === 1 ? 'rgba(173, 216, 230, ' : 'rgba(255, 182, 193, '
                    });
                }
            }

            function createFallingStar() {
                const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
                const color = colors[Math.floor(Math.random() * colors.length)];
                fallingStars.push({
                    x: Math.random() * canvas.width * 0.4 + canvas.width * 0.1,
                    y: Math.random() * canvas.height * 0.2,
                    vx: Math.random() * 4 + 2,
                    vy: Math.random() * 4 + 2,
                    length: Math.random() * 100 + 50,
                    opacity: 1,
                    color: color,
                    trail: []
                });
            }

            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Parallax calculation
                const parallaxX = (mouseX - 50) * 0.02;
                const parallaxY = (mouseY - 50) * 0.02;
                parallaxOffsetX += (parallaxX - parallaxOffsetX) * 0.1;
                parallaxOffsetY += (parallaxY - parallaxOffsetY) * 0.1;

                // Twinkling stars with parallax
                stars.forEach(star => {
                    star.opacity += star.twinkleSpeed;
                    if (star.opacity > 1) star.opacity = 1;
                    if (star.opacity < 0) star.opacity = 0;

                    const adjustedX = star.x + parallaxOffsetX * (star.layer + 1) * 10;
                    const adjustedY = star.y + parallaxOffsetY * (star.layer + 1) * 10;

                    ctx.beginPath();
                    ctx.arc(adjustedX, adjustedY, star.radius, 0, Math.PI * 2);
                    ctx.fillStyle = star.color + star.opacity + ')';
                    ctx.fill();

                    // Add shine effect with glow
                    ctx.shadowBlur = 15 * star.opacity;
                    ctx.shadowColor = star.color + star.opacity * 0.3 + ')';
                    ctx.fill();
                    ctx.shadowBlur = 0;
                });

                // Enhanced falling stars with trails
                if (Math.random() < 0.03) {
                    createFallingStar();
                }

                fallingStars.forEach((star, index) => {
                    // Update trail
                    star.trail.push({x: star.x, y: star.y});
                    if (star.trail.length > star.length) {
                        star.trail.shift();
                    }

                    // Draw trail
                    for (let i = 0; i < star.trail.length; i++) {
                        const fade = (i / star.trail.length) * star.opacity;
                        ctx.beginPath();
                        ctx.moveTo(star.trail[i].x, star.trail[i].y);
                        if (i < star.trail.length - 1) {
                            ctx.lineTo(star.trail[i + 1].x, star.trail[i + 1].y);
                        }
                        ctx.strokeStyle = `rgba(${hexToRgb(star.color).r}, ${hexToRgb(star.color).g}, ${hexToRgb(star.color).b}, ${fade})`;
                        ctx.lineWidth = 3 - (i / star.trail.length) * 2;
                        ctx.stroke();
                    }

                    // Draw head
                    ctx.beginPath();
                    ctx.arc(star.x, star.y, 3, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${hexToRgb(star.color).r}, ${hexToRgb(star.color).g}, ${hexToRgb(star.color).b}, ${star.opacity})`;
                    ctx.fill();

                    // Update position
                    star.x += star.vx;
                    star.y += star.vy;
                    star.opacity -= 0.008;

                    // Remove if off screen
                    if (star.x > canvas.width + 100 || star.y > canvas.height + 100 || star.opacity <= 0) {
                        fallingStars.splice(index, 1);
                    }
                });

                requestAnimationFrame(animate);
            }

            // Helper function to convert hex to rgb
            function hexToRgb(hex) {
                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : null;
            }

            animate();
        }

        // Create floating particles around the logo
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            const particleCount = 80;
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                
                // Random properties for each particle
                const size = Math.random() * 6 + 1;
                const posX = Math.random() * 120 - 10;
                const posY = Math.random() * 120 - 10;
                const animationDuration = Math.random() * 15 + 8;
                const animationDelay = Math.random() * 5;
                const opacity = Math.random() * 0.8 + 0.2;
                const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
                const color = colors[Math.floor(Math.random() * colors.length)];
                
                particle.style.cssText = 'position: absolute;' +
                    'width: ' + size + 'px;' +
                    'height: ' + size + 'px;' +
                    'background: ' + color + ';' +
                    'border-radius: 50%;' +
                    'top: 50%;' +
                    'left: 50%;' +
                    'transform: translate(-50%, -50%) translate(' + posX + 'px, ' + posY + 'px);' +
                    'animation: floatParticle ' + animationDuration + 's ease-in-out ' + animationDelay + 's infinite;' +
                    'z-index: 0;' +
                    'box-shadow: 0 0 8px ' + color + '66;';
                
                particlesContainer.appendChild(particle);
            }
            
            // Compute random offsets for the shared animation
            const offset25x = Math.random() * 40 - 20;
            const offset25y = Math.random() * 40 - 20;
            const offset50x = Math.random() * 40 - 20;
            const offset50y = Math.random() * 40 - 20;
            const offset75x = Math.random() * 40 - 20;
            const offset75y = Math.random() * 40 - 20;
            
            // Add the particle animation to the styles
            const style = document.createElement('style');
            style.textContent = '@keyframes floatParticle {' +
                '0%, 100% {' +
                'transform: translate(-50%, -50%) translate(0, 0) rotate(0deg);' +
                '}' +
                '25% {' +
                'transform: translate(-50%, -50%) translate(' + offset25x + 'px, ' + offset25y + 'px) rotate(90deg);' +
                '}' +
                '50% {' +
                'transform: translate(-50%, -50%) translate(' + offset50x + 'px, ' + offset50y + 'px) rotate(180deg);' +
                '}' +
                '75% {' +
                'transform: translate(-50%, -50%) translate(' + offset75x + 'px, ' + offset75y + 'px) rotate(270deg);' +
                '}' +
                '}';
            document.head.appendChild(style);
        }

        // Typing effect function with word reveal
        function startTyping() {
            const textElement = document.getElementById('thank-you-text');
            const cursorElement = document.getElementById('cursor-text');
            const fullText = 'This innovative app provides a seamless, user-friendly platform for posting diverse media types, organizing vast libraries with smart categorization, and fostering meaningful interactions—all without the need for complex setups, downloads, or hardware investments. Whether you\'re a professional content creator looking to broadcast to global audiences, an educator sharing educational resources, or a casual user preserving family memories, StreamPlay Pro adapts effortlessly to your unique workflow, ensuring high-quality playback and effortless collaboration every step of the way.';
            const words = fullText.split(' ');
            const typingSpeed = 150; // ms per word

            let i = 0;
            textElement.innerHTML = '';

            const typeWriter = function() {
                if (i < words.length) {
                    const wordSpan = document.createElement('span');
                    wordSpan.textContent = words[i] + ' ';
                    wordSpan.style.opacity = '0';
                    wordSpan.style.transition = 'opacity 0.3s ease';
                    textElement.appendChild(wordSpan);
                    
                    setTimeout(() => {
                        wordSpan.style.opacity = '1';
                    }, 50);
                    
                    i++;
                    setTimeout(typeWriter, typingSpeed);
                } else {
                    // Remove cursor after typing complete
                    cursorElement.style.display = 'none';
                }
            };

            // Start typing after a short delay
            setTimeout(typeWriter, 500);
        }
        
        // Initialize everything when the page loads
        window.addEventListener('load', function() {
            initStars();
            createParticles();
            
            // Start typing after 3.5s (after fade in)
            setTimeout(startTyping, 3500);
            
            // Add click effect to the CTA button
            const ctaButton = document.querySelector('.cta-button');
            ctaButton.addEventListener('click', function(e) {
                // Create a ripple effect
                const ripple = document.createElement('div');
                ripple.style.cssText = 'position: absolute;' +
                    'border-radius: 50%;' +
                    'background: rgba(255, 255, 255, 0.5);' +
                    'transform: scale(0);' +
                    'animation: ripple 0.6s linear;' +
                    'pointer-events: none;';
                
                const rect = ctaButton.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                
                ctaButton.appendChild(ripple);
                
                // Remove ripple after animation
                setTimeout(function() {
                    ripple.remove();
                }, 600);
                
                // Add ripple animation to styles if not already present
                if (!document.querySelector('#ripple-animation')) {
                    const rippleStyle = document.createElement('style');
                    rippleStyle.id = 'ripple-animation';
                    rippleStyle.textContent = '@keyframes ripple {' +
                        'to {' +
                        'transform: scale(4);' +
                        'opacity: 0;' +
                        '}' +
                        '}';
                    document.head.appendChild(rippleStyle);
                }
                
                // Button click animation
                ctaButton.style.transform = 'scale(0.95)';
                setTimeout(function() {
                    ctaButton.style.transform = '';
                }, 200);

                // Trigger more falling stars on click
                for (let i = 0; i < 5; i++) {
                    setTimeout(() => {
                        console.log('Extra falling star!');
                    }, i * 100);
                }
            });
            
            // Add subtle rotation to logo on mouse move
            document.addEventListener('mousemove', function(e) {
                const logo = document.querySelector('.logo');
                const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
                const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
                logo.style.transform = `perspective(1000px) rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
            });
        });
    