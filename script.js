document.addEventListener('DOMContentLoaded', () => {
    // 0. Grand Cinematic 5-Second Video Splash Intro Controller
    const introLoader = document.getElementById('intro-loader');
    const introProgressFill = document.getElementById('intro-progress-fill');
    const skipIntroBtn = document.getElementById('skip-intro-btn');
    const introCanvas = document.getElementById('intro-fireworks-canvas');

    if (introLoader) {
        document.body.classList.add('intro-active');

        // Fireworks Burst Engine for Intro
        if (introCanvas) {
            introCanvas.width = window.innerWidth;
            introCanvas.height = window.innerHeight;
            const ctx = introCanvas.getContext('2d');
            let particles = [];
            const colors = ['#00FF66', '#FFD700', '#FFFFFF', '#00CC44'];

            function createParticle(x, y) {
                const count = 40;
                for (let i = 0; i < count; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const speed = Math.random() * 6 + 2;
                    particles.push({
                        x: x,
                        y: y,
                        vx: Math.cos(angle) * speed,
                        vy: Math.sin(angle) * speed,
                        alpha: 1,
                        size: Math.random() * 4 + 2,
                        color: colors[Math.floor(Math.random() * colors.length)]
                    });
                }
            }

            function animateParticles() {
                ctx.clearRect(0, 0, introCanvas.width, introCanvas.height);
                particles.forEach((p, index) => {
                    p.x += p.vx;
                    p.y += p.vy;
                    p.alpha -= 0.015;
                    ctx.save();
                    ctx.globalAlpha = Math.max(0, p.alpha);
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                    if (p.alpha <= 0) particles.splice(index, 1);
                });
                if (particles.length > 0) {
                    requestAnimationFrame(animateParticles);
                }
            }

            // Launch fireworks burst at 3.5s and 4.2s
            setTimeout(() => {
                createParticle(window.innerWidth * 0.3, window.innerHeight * 0.4);
                createParticle(window.innerWidth * 0.7, window.innerHeight * 0.3);
                animateParticles();
            }, 3500);

            setTimeout(() => {
                createParticle(window.innerWidth * 0.5, window.innerHeight * 0.5);
                animateParticles();
            }, 4200);
        }

        // Animate 5-Second Progress Bar
        const startTime = Date.now();
        const duration = 5000; // 5 Seconds

        const updateProgress = () => {
            const elapsed = Date.now() - startTime;
            const percentage = Math.min(100, (elapsed / duration) * 100);
            if (introProgressFill) introProgressFill.style.width = percentage + '%';
            if (elapsed < duration) {
                requestAnimationFrame(updateProgress);
            }
        };
        requestAnimationFrame(updateProgress);

        // Function to dismiss intro and start website
        const dismissIntro = () => {
            introLoader.classList.add('fade-out');
            document.body.classList.remove('intro-active');
            setTimeout(() => {
                introLoader.style.display = 'none';
            }, 900);
        };

        // Auto dismiss at 5 seconds
        const introTimeout = setTimeout(dismissIntro, 5000);

        // Skip Button Click
        if (skipIntroBtn) {
            skipIntroBtn.addEventListener('click', () => {
                clearTimeout(introTimeout);
                dismissIntro();
            });
        }
    }

    // 1. Scroll Progress Bar Indicator
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + "%";
        });
    }

    // 2. Video Lazy Loading & Viewport Play/Pause Management
    const videoObserverOptions = {
        root: null,
        rootMargin: '200px 0px',
        threshold: 0.15
    };

    const handleVideoIntersection = (entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            const dataSrc = video.getAttribute('data-src');

            if (entry.isIntersecting) {
                if (dataSrc && (!video.src || video.src === window.location.href)) {
                    video.src = dataSrc;
                    video.load();
                }
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.catch(() => {});
                }
            } else {
                if (!video.paused) {
                    video.pause();
                }
            }
        });
    };

    const videoObserver = new IntersectionObserver(handleVideoIntersection, videoObserverOptions);
    document.querySelectorAll('video[data-src]').forEach(video => videoObserver.observe(video));
    document.querySelectorAll('video:not([data-src])').forEach(video => videoObserver.observe(video));

    // 3. Virtual Flag Hoisting & Canvas Confetti / Fireworks
    const flagBtn = document.getElementById('hoist-flag-btn');
    const flagStatus = document.getElementById('hoist-status');
    const canvas = document.getElementById('fireworks-canvas');

    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor(x, y, color) {
                this.x = x;
                this.y = y;
                this.color = color;
                this.radius = Math.random() * 4 + 2;
                this.velocity = {
                    x: (Math.random() - 0.5) * 8,
                    y: (Math.random() - 0.5) * 8
                };
                this.alpha = 1;
                this.friction = 0.96;
                this.gravity = 0.15;
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.color;
                ctx.fill();
                ctx.restore();
            }

            update() {
                this.velocity.x *= this.friction;
                this.velocity.y *= this.friction;
                this.velocity.y += this.gravity;
                this.x += this.velocity.x;
                this.y += this.velocity.y;
                this.alpha -= 0.015;
            }
        }

        function triggerFireworks() {
            const colors = ['#025323', '#FFD700', '#FFFFFF', '#00FF66', '#E6B800'];
            for (let i = 0; i < 150; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * (canvas.height * 0.6);
                const color = colors[Math.floor(Math.random() * colors.length)];
                particles.push(new Particle(x, y, color));
            }
            animateParticles();
        }

        let animationFrame = null;
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p, index) => {
                if (p.alpha > 0) {
                    p.update();
                    p.draw();
                } else {
                    particles.splice(index, 1);
                }
            });

            if (particles.length > 0) {
                animationFrame = requestAnimationFrame(animateParticles);
            } else {
                animationFrame = null;
            }
        }

        let fireworksInterval = null;
        function startContinuousFireworks(durationMs = 6000) {
            triggerFireworks();
            const startTime = Date.now();

            if (fireworksInterval) clearInterval(fireworksInterval);

            fireworksInterval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                if (elapsed >= durationMs) {
                    clearInterval(fireworksInterval);
                    fireworksInterval = null;
                } else {
                    const colors = ['#025323', '#FFD700', '#FFFFFF', '#00FF66', '#E6B800', '#FFCC00'];
                    for (let i = 0; i < 45; i++) {
                        const x = Math.random() * canvas.width;
                        const y = Math.random() * (canvas.height * 0.7);
                        const color = colors[Math.floor(Math.random() * colors.length)];
                        particles.push(new Particle(x, y, color));
                    }
                    if (!animationFrame) {
                        animateParticles();
                    }
                }
            }, 380);
        }

        // Automatic 6-Second Fireworks trigger when user reaches Armed Forces section or Footer
        let isBottomFireworksTriggered = false;
        const bottomSectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !isBottomFireworksTriggered) {
                    isBottomFireworksTriggered = true;
                    startContinuousFireworks(6000);
                }
            });
        }, { threshold: 0.15 });

        const militarySection = document.getElementById('Military');
        const footerSection = document.querySelector('.site-footer');
        if (militarySection) bottomSectionObserver.observe(militarySection);
        if (footerSection) bottomSectionObserver.observe(footerSection);

        if (flagBtn) {
            flagBtn.addEventListener('click', () => {
                startContinuousFireworks(4000);
                if (flagStatus) {
                    flagStatus.innerHTML = `🎉 <strong style="color:#FFD700">Flag Hoisted Proudly!</strong> Celebrating 79 Years of Independence! 🇵🇰`;
                    flagStatus.style.display = 'block';
                }
            });
        }
    }

    // 4. Interactive Landmarks Explorer Modal
    const landmarkData = {
        minar: {
            title: "Minar-e-Pakistan (Lahore)",
            tag: "Symbol of Freedom Resolution",
            image: "./assests/image8.jpg",
            desc: "Constructed at Iqbal Park Lahore where the Lahore Resolution was passed on 23 March 1940. Standing 70 meters high, its architecture blends Mughal and modern design representing the birth of Pakistan."
        },
        mazar: {
            title: "Mazar-e-Quaid (Karachi)",
            tag: "Final Resting Place of Quaid-e-Azam",
            image: "./assests/image1.jpg",
            desc: "The iconic white marble mausoleum of Quaid-e-Azam Muhammad Ali Jinnah in Karachi. Designed by Yahya Merchant, it is a magnificent modern Islamic monument surrounded by lush gardens."
        },
        badshahi: {
            title: "Badshahi Mosque (Lahore)",
            tag: "Crown Jewel of Mughal Heritage",
            image: "./assests/image2.jpg",
            desc: "Built by Emperor Aurangzeb in 1673, Badshahi Mosque is one of the world's grandest historic mosques with red sandstone and marble domes holding up to 100,000 worshippers."
        },
        k2: {
            title: "K2 Peak — Savage Mountain",
            tag: "2nd Highest Peak on Earth (8,611m)",
            image: "./assests/image3.jpg",
            desc: "Located in the Karakoram range of Gilgit-Baltistan, K2 is world-renowned for its majestic beauty and challenging peaks, symbolizing the invincible spirit of Pakistan."
        },
        faisal: {
            title: "Faisal Mosque (Islamabad)",
            tag: "National Mosque of Pakistan",
            image: "./assests/image4.jpg",
            desc: "Nestled against the Margalla Hills in Islamabad, Faisal Mosque resembles a Bedouin tent. Designed by Turkish architect Vedat Dalokay, it is an architectural wonder of the Islamic world."
        },
        gwadar: {
            title: "Gwadar Deep Sea Port (Balochistan)",
            tag: "Gateway to Economic Future",
            image: "./assests/images14.webp",
            desc: "A warm-water deep sea port located on the Arabian Sea in Balochistan. Gwadar is the economic centerpiece of CPEC and Pakistan's gateway to global maritime trade."
        },
        hunza: {
            title: "Hunza Valley & Baltit Fort",
            tag: "Paradise on Earth (Gilgit-Baltistan)",
            image: "./assests/images10.jpg",
            desc: "Surrounded by snow-capped peaks of Rakaposhi and Ladyfinger, Hunza Valley is world-famous for its ancient Silk Route history, longevity of people, and 700-year-old Baltit Fort."
        },
        babe_khyber: {
            title: "Bab-e-Khyber & Khyber Pass",
            tag: "Historic Gateway to South Asia",
            image: "./assests/images12.webp",
            desc: "The famous monument standing at the entrance of the Khyber Pass near Peshawar, symbolizing centuries of brave warriors and historic trade routes."
        },
        rohtas: {
            title: "Rohtas Fort (Jhelum)",
            tag: "UNESCO World Heritage Citadel",
            image: "./assests/images15.webp",
            desc: "A formidable 16th-century fortress constructed by Sher Shah Suri near Jhelum. Famous for its massive defensive walls, grand gates, and strategic military architecture."
        }
    };

    // 4. Landmarks 3D Coverflow Focus Carousel & Modal Controller
    const modal = document.getElementById('landmark-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalTag = document.getElementById('modal-tag');
    const modalImg = document.getElementById('modal-img');
    const modalDesc = document.getElementById('modal-desc');
    const modalClose = document.getElementById('modal-close');

    const track = document.getElementById('landmarks-track');
    const cards = document.querySelectorAll('#landmarks-track .landmark-card');
    const prevBtn = document.getElementById('landmarks-prev-btn');
    const nextBtn = document.getElementById('landmarks-next-btn');

    const totalUniqueLandmarks = 9;
    let currentCoverIndex = 9; // Start at first card of middle Set 2
    let coverflowInterval = null;
    let isTransitioning = false;

    function updateCoverflow(targetIndex, animate = true) {
        if (!cards.length || !track) return;
        currentCoverIndex = targetIndex;

        cards.forEach((card, i) => {
            if (i === currentCoverIndex) {
                card.classList.add('active-center');
            } else {
                card.classList.remove('active-center');
            }
        });

        // Force synchronous browser layout reflow to ensure offsetLeft is 100% accurate
        void track.offsetHeight;

        if (animate) {
            track.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
        } else {
            track.style.transition = 'none';
        }

        // Dynamic Viewport Center Calculation
        const viewport = document.querySelector('.landmarks-coverflow-viewport');
        const activeCard = cards[currentCoverIndex];
        if (viewport && activeCard) {
            const viewportCenter = viewport.offsetWidth / 2;
            const cardCenter = activeCard.offsetLeft + (activeCard.offsetWidth / 2);
            const translateX = viewportCenter - cardCenter;
            track.style.transform = `translateX(${translateX}px)`;
        }

        // Silent post-animation wrap jump (eliminates screen shake/jerk)
        if (animate) {
            isTransitioning = true;
            setTimeout(() => {
                isTransitioning = false;
                if (currentCoverIndex >= totalUniqueLandmarks * 2) {
                    updateCoverflow(currentCoverIndex - totalUniqueLandmarks, false);
                } else if (currentCoverIndex < totalUniqueLandmarks) {
                    updateCoverflow(currentCoverIndex + totalUniqueLandmarks, false);
                }
            }, 600);
        }
    }

    // Recalibrate on Window Resize
    window.addEventListener('resize', () => {
        updateCoverflow(currentCoverIndex, false);
    });

    function startCoverflowTimer() {
        if (!coverflowInterval) {
            coverflowInterval = setInterval(() => {
                if (!isTransitioning) {
                    updateCoverflow(currentCoverIndex + 1, true);
                }
            }, 2600); // 2.6 seconds pause per card in center
        }
    }

    function stopCoverflowTimer() {
        if (coverflowInterval) {
            clearInterval(coverflowInterval);
            coverflowInterval = null;
        }
    }

    if (track && cards.length) {
        updateCoverflow(9, false);
        startCoverflowTimer();

        // Pause on hover
        const wrapper = document.querySelector('.landmarks-coverflow-wrapper');
        if (wrapper) {
            wrapper.addEventListener('mouseenter', stopCoverflowTimer);
            wrapper.addEventListener('mouseleave', startCoverflowTimer);
        }

        // Manual Prev / Next Buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (isTransitioning) return;
                stopCoverflowTimer();
                updateCoverflow(currentCoverIndex - 1, true);
                startCoverflowTimer();
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (isTransitioning) return;
                stopCoverflowTimer();
                updateCoverflow(currentCoverIndex + 1, true);
                startCoverflowTimer();
            });
        }

        // Modal Click Delegation
        track.addEventListener('click', (e) => {
            const card = e.target.closest('.landmark-card');
            if (!card) return;
            const key = card.getAttribute('data-landmark');
            const data = landmarkData[key];
            if (data && modal) {
                modalTitle.textContent = data.title;
                modalTag.textContent = data.tag;
                modalImg.src = data.image;
                modalDesc.textContent = data.desc;
                modal.classList.add('active');
            }
        });
    }

    if (modalClose) {
        modalClose.addEventListener('click', () => modal.classList.remove('active'));
    }
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    }

    // 5. Back To Top Floating Button
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 8. Mobile Menu Drawer Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
        document.querySelectorAll('#nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    // 9. APS Peshawar Candle Tribute Controller
    const lightCandleBtn = document.getElementById('light-candle-btn');
    const candleCountSpan = document.getElementById('candle-count');
    const candlePrayerMsg = document.getElementById('candle-prayer-msg');
    let candleCount = 1440;

    if (lightCandleBtn) {
        lightCandleBtn.addEventListener('click', () => {
            candleCount++;
            if (candleCountSpan) candleCountSpan.textContent = candleCount.toLocaleString();
            if (candlePrayerMsg) candlePrayerMsg.classList.add('active');

            // Visual pulse effect
            lightCandleBtn.style.transform = 'scale(1.08)';
            setTimeout(() => {
                lightCandleBtn.style.transform = 'scale(1)';
            }, 250);
        });
    }

    // 10. Patriotic Anthem Background Audio Loop Controller (Guaranteed Unmuted Sound Engine)
    const anthemAudio = document.getElementById('bg-anthem-audio');
    const audioToggleBtn = document.getElementById('audio-toggle-btn');
    const audioIcon = document.getElementById('audio-icon');
    const audioLabel = document.getElementById('audio-label');

    const START_TIME = 0;   // Start from 0 seconds (Beginning of patriotic anthem)
    const END_TIME = 240;   // 4 minutes loop
    let isAudioPlaying = false;
    let userToggledOff = false;

    if (anthemAudio) {
        anthemAudio.volume = 0.85;

        // Auto Loop when audio reaches end time
        anthemAudio.addEventListener('timeupdate', () => {
            if (anthemAudio.currentTime >= END_TIME) {
                anthemAudio.currentTime = START_TIME;
            }
        });

        function updateAudioUI(playing) {
            if (!audioToggleBtn) return;
            if (playing && !anthemAudio.muted) {
                audioToggleBtn.classList.add('playing');
                if (audioIcon) audioIcon.className = 'fa-solid fa-volume-high';
                if (audioLabel) audioLabel.textContent = 'Anthem ON';
            } else {
                audioToggleBtn.classList.remove('playing');
                if (audioIcon) audioIcon.className = 'fa-solid fa-volume-xmark';
                if (audioLabel) audioLabel.textContent = 'Anthem OFF';
            }
        }

        function playAnthemSound() {
            if (userToggledOff) return;
            anthemAudio.pause();
            anthemAudio.muted = false;
            anthemAudio.volume = 0.85;

            const promise = anthemAudio.play();
            if (promise !== undefined) {
                promise.then(() => {
                    isAudioPlaying = true;
                    updateAudioUI(true);
                }).catch(() => {
                    // If autoplay blocked by browser without interaction, attempt muted play so it's ready
                    anthemAudio.muted = true;
                    anthemAudio.play().then(() => {
                        isAudioPlaying = false;
                        updateAudioUI(false);
                    }).catch(() => {});
                });
            }
        }

        function pauseAnthem() {
            anthemAudio.pause();
            isAudioPlaying = false;
            updateAudioUI(false);
        }

        function toggleAnthem() {
            if (isAudioPlaying && !anthemAudio.paused && !anthemAudio.muted) {
                userToggledOff = true;
                pauseAnthem();
            } else {
                userToggledOff = false;
                playAnthemSound();
            }
        }

        if (audioToggleBtn) {
            audioToggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleAnthem();
            });
        }

        // Show Anthem ON by default
        updateAudioUI(true);

        // Attempt sound playback on load
        playAnthemSound();
        window.addEventListener('load', playAnthemSound);

        // Guaranteed Sound Unlock: Fresh unmuted play() on any user interaction (click, touch, pointer, scroll, keydown, mousemove)
        const instantSoundEvents = ['pointerdown', 'touchstart', 'click', 'mousemove', 'keydown', 'scroll'];
        function unlockFullAudio() {
            if (!userToggledOff) {
                anthemAudio.pause();
                anthemAudio.muted = false;
                anthemAudio.volume = 0.85;
                const promise = anthemAudio.play();
                if (promise !== undefined) {
                    promise.then(() => {
                        isAudioPlaying = true;
                        updateAudioUI(true);
                    }).catch(() => {});
                }
            }
            instantSoundEvents.forEach(evt => window.removeEventListener(evt, unlockFullAudio));
        }

        instantSoundEvents.forEach(evt => window.addEventListener(evt, unlockFullAudio, { passive: true }));
    }

    // 11. Footer Grand White Celebration Modal Overlay Controller
    const celebrationModal = document.getElementById('footer-celebration-modal');
    const closeCelebrationBtn = document.getElementById('close-celebration-btn');
    const celebrationProgress = document.getElementById('celebration-progress');
    const footerElement = document.querySelector('.site-footer');

    let celebrationTimer = null;
    let celebrationProgressInterval = null;
    let isCelebrationActive = false;
    let lastCelebrationTime = 0;
    const CELEBRATION_DURATION = 4500; // 4.5 seconds

    function triggerFooterCelebration() {
        if (!celebrationModal || isCelebrationActive) return;

        isCelebrationActive = true;
        celebrationModal.style.display = 'flex';
        setTimeout(() => {
            celebrationModal.classList.add('active');
        }, 50);

        if (typeof startContinuousFireworks === 'function') {
            startContinuousFireworks(4500);
        }

        const startTime = Date.now();
        if (celebrationProgressInterval) clearInterval(celebrationProgressInterval);
        celebrationProgressInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const pct = Math.min(100, (elapsed / CELEBRATION_DURATION) * 100);
            if (celebrationProgress) celebrationProgress.style.width = pct + '%';
        }, 50);

        if (celebrationTimer) clearTimeout(celebrationTimer);
        celebrationTimer = setTimeout(() => {
            closeFooterCelebration();
        }, CELEBRATION_DURATION);
    }

    function closeFooterCelebration() {
        if (celebrationTimer) clearTimeout(celebrationTimer);
        if (celebrationProgressInterval) clearInterval(celebrationProgressInterval);
        if (celebrationModal) {
            celebrationModal.classList.remove('active');
            setTimeout(() => {
                celebrationModal.style.display = 'none';
                isCelebrationActive = false;
            }, 500);
        }
    }

    if (closeCelebrationBtn) {
        closeCelebrationBtn.addEventListener('click', closeFooterCelebration);
    }

    if (footerElement) {
        const footerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const now = Date.now();
                if (entry.isIntersecting && !isCelebrationActive && (now - lastCelebrationTime > 7000)) {
                    lastCelebrationTime = now;
                    triggerFooterCelebration();
                }
            });
        }, { threshold: 0.15 });

        footerObserver.observe(footerElement);
    }

    // 12. Ultra-Smooth Animated Navigation Scroll Controller
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;

            const targetSection = document.querySelector(href);
            if (targetSection) {
                e.preventDefault();

                // Close mobile menu if open
                const navLinksContainer = document.querySelector('.nav-links');
                if (navLinksContainer && navLinksContainer.classList.contains('active')) {
                    navLinksContainer.classList.remove('active');
                }

                // Calculate position with fixed navbar offset
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
