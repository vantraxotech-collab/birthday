// Happy Birthday Arooj — Authentic Zero.University Engine
// Pure vanilla JS with 60fps hardware accelerated 3D animations and audio

function initApp() {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // --- AUDIO SYSTEM (Authentic Zero.University Sound FX) ---
  let isSoundEnabled = true;
  const ambStage1 = document.getElementById('audio-amb-stage1');
  const ambStage2 = document.getElementById('audio-amb-stage2');
  const mainSong = document.getElementById('audio-main-song');
  const fxLoader = document.getElementById('audio-fx-loader');
  const fxLoaderDrag = document.getElementById('audio-fx-loader-drag');
  const fxHold = document.getElementById('audio-fx-hold');
  const fxShatter = document.getElementById('audio-fx-shatter');
  const fxHand = document.getElementById('audio-fx-hand');
  const fxWhoosh = document.getElementById('audio-fx-whoosh');
  const fxXp = document.getElementById('audio-fx-xp');

  const soundToggle = document.getElementById('global-sound-toggle');
  const soundStatusText = document.getElementById('sound-status-text');
  const dockMusicBtn = document.getElementById('dock-music-btn');
  const dockMusicText = document.getElementById('dock-music-text');

  // Start initial ambient sound and prime all audio elements on first mobile gesture
  let hasInteracted = false;
  function initAudioOnFirstTouch() {
    if (hasInteracted) return;
    hasInteracted = true;

    // Mobile Autoplay Fix: Pre-unlock all celebration audio tracks during user interaction
    [ambStage1, ambStage2, mainSong, fxHold, fxShatter, fxXp, fxWhoosh].forEach(audio => {
      if (!audio) return;
      try {
        const p = audio.play();
        if (p !== undefined) {
          p.then(() => {
            // Keep ambStage1 playing if sound enabled; pause others until needed
            if (audio !== ambStage1) {
              audio.pause();
              audio.currentTime = 0;
            }
          }).catch(() => {});
        }
      } catch (err) {}
    });

    if (isSoundEnabled && ambStage1) {
      ambStage1.volume = 0.5;
      ambStage1.play().catch(() => {});
      soundToggle.classList.add('is-playing');
    }
  }
  window.addEventListener('click', initAudioOnFirstTouch, { once: true });
  window.addEventListener('touchstart', initAudioOnFirstTouch, { once: true });
  window.addEventListener('pointerdown', initAudioOnFirstTouch, { once: true });

  function playFx(audioEl, vol = 0.8) {
    if (!isSoundEnabled || !audioEl) return;
    try {
      audioEl.currentTime = 0;
      audioEl.volume = vol;
      audioEl.play().catch(() => {});
    } catch (e) {}
  }

  function toggleSound() {
    isSoundEnabled = !isSoundEnabled;
    if (isSoundEnabled) {
      soundToggle.classList.add('is-playing');
      soundStatusText.innerText = 'SOUND: ON';
      dockMusicText.innerText = stage3Completed ? 'Him & I (Remix)' : 'Soundtrack';
      if (stage3Completed) {
        if (mainSong) {
          mainSong.volume = 0.85;
          mainSong.play().catch(() => {});
        }
      } else {
        if (ambStage1) ambStage1.play().catch(() => {});
      }
    } else {
      soundToggle.classList.remove('is-playing');
      soundStatusText.innerText = 'SOUND: OFF';
      dockMusicText.innerText = 'Mute';
      if (ambStage1) ambStage1.pause();
      if (ambStage2) ambStage2.pause();
      if (mainSong) mainSong.pause();
      if (fxHold) fxHold.pause();
    }
  }

  soundToggle.addEventListener('click', toggleSound);
  dockMusicBtn.addEventListener('click', toggleSound);

  // --- STAGE 1: CINEMATIC RED ROSE IN CLOUDS (SCROLL-CONTROLLED VIDEO ENGINE) ---
  const roseVideo = document.getElementById('intro-rose-video');
  const roseVideoProgress = document.getElementById('rose-video-progress');
  const introTitleWrap = document.getElementById('intro-title-wrap');
  const scrollPlayIndicator = document.getElementById('scroll-play-indicator');
  const scrollPlayStatus = document.getElementById('scroll-play-status');
  const playPulseDot = document.getElementById('play-pulse-dot');
  const skipIntroBtn = document.getElementById('skip-intro-btn');

  let roseStageCompleted = false;
  let pauseDebounceTimer = null;

  // Handle Video Scrub & Play on Scroll
  function handleScrollPlay(deltaY = 100) {
    if (roseStageCompleted || !roseVideo) return;

    // Wake up ambient audio on first interaction
    initAudioOnFirstTouch();

    // Play video smoothly while scrolling
    if (roseVideo.paused) {
      roseVideo.play().catch(() => {});
    }

    if (scrollPlayStatus) scrollPlayStatus.innerText = 'PLAYING... TRAVELING CLOUDS';
    if (playPulseDot) {
      playPulseDot.classList.remove('bg-rose-400');
      playPulseDot.classList.add('bg-[#FFE29A]', 'animate-ping');
    }

    // Clear previous pause timer
    clearTimeout(pauseDebounceTimer);

    // Pause smoothly when user stops scrolling (extended to 340ms for buttery glide on mobile)
    pauseDebounceTimer = setTimeout(() => {
      if (!roseStageCompleted && roseVideo && !roseVideo.paused) {
        roseVideo.pause();
        if (scrollPlayStatus) scrollPlayStatus.innerText = 'PAUSED • SCROLL TO CONTINUE';
        if (playPulseDot) {
          playPulseDot.classList.remove('bg-[#FFE29A]', 'animate-ping');
          playPulseDot.classList.add('bg-rose-400', 'animate-pulse');
        }
      }
    }, 340);
  }

  // Mouse Wheel / Trackpad Scroll
  window.addEventListener('wheel', (e) => {
    const s1 = document.getElementById('stage-1');
    if (!s1 || s1.classList.contains('stage-hidden') || roseStageCompleted) return;
    if (e.deltaY > 0) {
      handleScrollPlay(Math.abs(e.deltaY));
    } else if (e.deltaY < 0) {
      // Gentle rewind on upward scroll
      if (roseVideo && roseVideo.currentTime > 0.15) {
        roseVideo.currentTime = Math.max(0, roseVideo.currentTime - 0.2);
        if (scrollPlayStatus) scrollPlayStatus.innerText = 'REWINDING...';
      }
    }
  }, { passive: true });

  // Keyboard navigation (ArrowDown, PageDown, Space)
  window.addEventListener('keydown', (e) => {
    const s1 = document.getElementById('stage-1');
    if (!s1 || s1.classList.contains('stage-hidden') || roseStageCompleted) return;
    if (['ArrowDown', 'PageDown', 'Space'].includes(e.code)) {
      e.preventDefault();
      handleScrollPlay(150);
    } else if (['ArrowUp', 'PageUp'].includes(e.code)) {
      e.preventDefault();
      if (roseVideo && roseVideo.currentTime > 0.15) {
        roseVideo.currentTime = Math.max(0, roseVideo.currentTime - 0.25);
      }
    }
  });

  // Touch Swipe & Tap on Mobile with smooth inertial glide
  let roseTouchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    roseTouchStartY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    const s1 = document.getElementById('stage-1');
    if (!s1 || s1.classList.contains('stage-hidden') || roseStageCompleted) return;
    const currentY = e.touches[0].clientY;
    const diff = roseTouchStartY - currentY;
    if (diff > 2) {
      handleScrollPlay(diff);
    } else if (diff < -6) {
      if (roseVideo && roseVideo.currentTime > 0.15) {
        roseVideo.currentTime = Math.max(0, roseVideo.currentTime - 0.15);
      }
    }
    roseTouchStartY = currentY;
  }, { passive: true });

  // Update progress bar and fade text as video progresses
  if (roseVideo) {
    roseVideo.addEventListener('timeupdate', () => {
      if (!roseVideo.duration) return;
      const progress = (roseVideo.currentTime / roseVideo.duration) * 100;
      if (roseVideoProgress) roseVideoProgress.style.width = `${progress}%`;

      // Dynamic text fade out: fades out as soon as user starts scrolling
      if (introTitleWrap) {
        if (progress > 28) {
          introTitleWrap.style.opacity = '0';
        } else if (progress > 6) {
          introTitleWrap.style.opacity = `${1 - (progress - 6) / 22}`;
        } else {
          introTitleWrap.style.opacity = '1';
        }
      }

      // Completion threshold: user scrolled to the end of rose video
      if (roseVideo.currentTime >= roseVideo.duration - 0.25 && !roseStageCompleted) {
        finishRoseStage();
      }
    });

    roseVideo.addEventListener('ended', () => {
      if (!roseStageCompleted) finishRoseStage();
    });
  }

  // Click scroll indicator or stage to toggle/advance playback
  if (scrollPlayIndicator) {
    scrollPlayIndicator.addEventListener('click', () => {
      if (roseVideo && roseVideo.paused) {
        roseVideo.play().catch(() => {});
        setTimeout(() => { if (roseVideo && !roseVideo.paused) roseVideo.pause(); }, 1400);
      } else if (roseVideo) {
        roseVideo.pause();
      }
    });
  }

  const stage1El = document.getElementById('stage-1');
  if (stage1El) {
    stage1El.addEventListener('click', (e) => {
      if (e.target.closest('button') || e.target.closest('#scroll-play-indicator') || e.target.closest('#skip-intro-btn')) return;
      handleScrollPlay(100);
    });
  }

  // Transition from Rose Video Stage into Stage 3 (Tap to Hold)
  function finishRoseStage() {
    if (roseStageCompleted) return;
    roseStageCompleted = true;
    clearTimeout(pauseDebounceTimer);

    if (roseVideo) roseVideo.pause();
    playFx(fxHand, 0.9);

    if (window.confetti) {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#FF758F', '#F59E0B', '#FFE29A', '#ffffff', '#E11D48']
      });
    }

    const s1 = document.getElementById('stage-1');
    const s3 = document.getElementById('stage-3');

    // Smooth cinematic dissolve transition
    if (s1) {
      s1.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s ease, filter 0.8s ease';
      s1.style.opacity = '0';
      s1.style.transform = 'scale(1.05)';
      s1.style.filter = 'blur(6px)';
    }

    setTimeout(() => {
      if (s1) s1.classList.add('stage-hidden');
      if (s3) {
        s3.classList.remove('stage-hidden');
        s3.style.opacity = '1';
        s3.style.visibility = 'visible';
      }
    }, 700);
  }

  // Skip / Continue Button
  if (skipIntroBtn) {
    skipIntroBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playFx(fxWhoosh, 0.8);
      finishRoseStage();
    });
  }

  // Replay Rose Intro from Bottom Dock
  const dockRoseBtn = document.getElementById('dock-rose-btn');
  if (dockRoseBtn) {
    dockRoseBtn.addEventListener('click', () => {
      const hero = document.getElementById('hero-experience-wrapper');
      const s1 = document.getElementById('stage-1');
      const s3 = document.getElementById('stage-3');
      const s4 = document.getElementById('stage-4');
      if (hero && s1) {
        if (mainSong) { mainSong.pause(); mainSong.currentTime = 0; }
        if (isSoundEnabled && ambStage1) {
          ambStage1.currentTime = 0;
          ambStage1.play().catch(() => {});
        }
        if (dockMusicText) dockMusicText.innerText = 'Soundtrack';

        hero.style.display = 'block';
        if (s3) s3.classList.add('stage-hidden');
        if (s4) s4.classList.add('stage-hidden');
        s1.classList.remove('stage-hidden');
        s1.style.opacity = '1';
        s1.style.transform = 'scale(1)';
        s1.style.filter = 'none';
        roseStageCompleted = false;
        if (roseVideo) {
          roseVideo.currentTime = 0;
          roseVideo.pause();
        }
        if (roseVideoProgress) roseVideoProgress.style.width = '0%';
        if (introTitleWrap) introTitleWrap.style.opacity = '1';
        if (scrollPlayStatus) scrollPlayStatus.innerText = 'SCROLL TO FLY THROUGH CLOUDS';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // Replay Tap & Hold from Bottom Dock
  const dockHoldBtn = document.getElementById('dock-hold-btn');
  if (dockHoldBtn) {
    dockHoldBtn.addEventListener('click', () => {
      const hero = document.getElementById('hero-experience-wrapper');
      const s1 = document.getElementById('stage-1');
      const s3 = document.getElementById('stage-3');
      const s4 = document.getElementById('stage-4');
      if (hero && s3) {
        if (mainSong) { mainSong.pause(); mainSong.currentTime = 0; }
        if (isSoundEnabled && ambStage1) {
          ambStage1.currentTime = 0;
          ambStage1.play().catch(() => {});
        }
        if (dockMusicText) dockMusicText.innerText = 'Soundtrack';

        hero.style.display = 'block';
        if (s1) s1.classList.add('stage-hidden');
        if (s4) s4.classList.add('stage-hidden');
        s3.classList.remove('stage-hidden');
        s3.style.opacity = '1';
        s3.style.visibility = 'visible';
        stage3Completed = false;
        holdProgress = 0;
        if (holdProgressCircle) holdProgressCircle.style.strokeDashoffset = 289;
        updateTimePassingAtmosphere(0);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // --- STAGE 2: 3D FLOATING TOKEN MEDALLIONS & TO STAGE 3 ---
  const stage2 = document.getElementById('stage-2');
  const tokens = document.querySelectorAll('.token-badge');
  const toStage3Btn = document.getElementById('to-stage-3-btn');

  if (stage2) {
    stage2.addEventListener('mousemove', (e) => {
      const rx = (e.clientX / window.innerWidth - 0.5) * 26;
      const ry = (e.clientY / window.innerHeight - 0.5) * 26;
      tokens.forEach((t, i) => {
        const factor = (i + 1) * 0.95;
        t.style.transform = `translate(${rx * factor}px, ${ry * factor}px) scale(1.05)`;
      });
    });
  }

  if (toStage3Btn) {
    toStage3Btn.addEventListener('click', () => {
      playFx(fxWhoosh, 0.8);
      if (stage2) stage2.classList.add('stage-hidden');
      const s3 = document.getElementById('stage-3');
      if (s3) s3.classList.remove('stage-hidden');
    });
  }

  // --- STAGE 3: "TOUCH & HOLD TO CONNECT" (DYNAMIC TIME-PASSING) ---
  const tapHoldTrigger = document.getElementById('tap-hold-trigger');
  const holdProgressCircle = document.getElementById('hold-progress-circle');
  const stage3Bg = document.getElementById('stage3-bg');
  const timePassingOverlay = document.getElementById('time-passing-overlay');
  const timePassingIndicator = document.getElementById('time-passing-indicator');
  const glassShatterFlash = document.getElementById('glass-shatter-flash');

  let holdInterval = null;
  let holdProgress = 0;
  const maxHoldDuration = 1800; // ms
  let stage3Completed = false;

  function updateTimePassingAtmosphere(progress) {
    const zoomScale = 1.0 + (progress / 100) * 0.16;

    if (progress < 30) {
      timePassingIndicator.innerText = "Time of Day: Morning Sunlight (Dawn)";
      timePassingOverlay.style.opacity = '0';
      stage3Bg.style.filter = `brightness(1) saturate(1) contrast(1)`;
    } else if (progress < 65) {
      timePassingIndicator.innerText = "Time of Day: Golden Sunset Hour";
      const localT = (progress - 30) / 35;
      timePassingOverlay.style.opacity = `${localT * 0.6}`;
      timePassingOverlay.style.background = 'radial-gradient(circle, rgba(245, 158, 11, 0.45) 0%, rgba(180, 83, 9, 0.6) 100%)';
      stage3Bg.style.filter = `brightness(${1 - localT * 0.1}) saturate(${1 + localT * 0.4}) sepia(${localT * 0.35})`;
    } else {
      timePassingIndicator.innerText = "Time of Day: Romantic Twilight & Starlight";
      const localT = (progress - 65) / 35;
      timePassingOverlay.style.opacity = `${0.6 + localT * 0.35}`;
      timePassingOverlay.style.background = 'radial-gradient(circle, rgba(147, 51, 234, 0.5) 0%, rgba(190, 24, 93, 0.65) 100%)';
      stage3Bg.style.filter = `brightness(${0.9 - localT * 0.15}) saturate(${1.4 + localT * 0.3}) hue-rotate(${localT * 50}deg) contrast(1.15)`;
    }

    stage3Bg.style.transform = `scale(${zoomScale})`;
  }

  function startHold(e) {
    if (stage3Completed) return;
    if (e.type === 'touchstart') e.preventDefault();
    tapHoldTrigger.classList.add('is-holding');

    // MOBILE AUTOPLAY FIX: Prime mainSong synchronously during this real touchstart event
    if (mainSong) {
      try {
        const prime = mainSong.play();
        if (prime !== undefined) {
          prime.then(() => {
            if (!stage3Completed) {
              mainSong.pause();
              mainSong.currentTime = 0;
            }
          }).catch(() => {});
        }
      } catch (err) {}
    }

    // Start authentic hold sound
    if (isSoundEnabled && fxHold) {
      fxHold.currentTime = 0;
      fxHold.volume = 0.85;
      fxHold.playbackRate = 1.0;
      fxHold.play().catch(() => {});
    }

    const startTime = Date.now();
    holdInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      holdProgress = Math.min((elapsed / maxHoldDuration) * 100, 100);
      
      // Update SVG stroke-dashoffset (circumference = 2 * PI * 46 ≈ 289)
      const offset = 289 - (289 * holdProgress) / 100;
      holdProgressCircle.style.strokeDashoffset = offset;

      // Escalate hold audio pitch
      if (fxHold) {
        fxHold.playbackRate = 1.0 + (holdProgress / 100) * 0.6;
      }

      // Update dynamic time passing visuals
      updateTimePassingAtmosphere(holdProgress);

      if (holdProgress >= 100) {
        clearInterval(holdInterval);
        completeStage3();
      }
    }, 25);
  }

  function endHold() {
    if (stage3Completed) return;
    tapHoldTrigger.classList.remove('is-holding');
    clearInterval(holdInterval);
    holdProgress = 0;
    holdProgressCircle.style.strokeDashoffset = 289;

    // Reset visuals and stop audio
    updateTimePassingAtmosphere(0);
    stage3Bg.style.transform = 'scale(1)';
    if (fxHold) {
      fxHold.pause();
      fxHold.currentTime = 0;
    }
  }

  tapHoldTrigger.addEventListener('mousedown', startHold);
  window.addEventListener('mouseup', endHold);
  tapHoldTrigger.addEventListener('touchstart', startHold, { passive: false });
  window.addEventListener('touchend', endHold);

  function completeStage3() {
    stage3Completed = true;
    tapHoldTrigger.classList.remove('is-holding');
    if (fxHold) fxHold.pause();

    // Trigger authentic Glass Shatter sound & Flash
    playFx(fxShatter, 0.95);
    setTimeout(() => playFx(fxXp, 0.9), 250);

    // Stop ambient audio and start the main celebration song: Him and I (Siimi Remix)
    if (ambStage1) { ambStage1.pause(); ambStage1.currentTime = 0; }
    if (ambStage2) { ambStage2.pause(); ambStage2.currentTime = 0; }

    function playCelebrationSong() {
      if (isSoundEnabled && mainSong) {
        mainSong.currentTime = 0;
        mainSong.volume = 0.85;
        const playPromise = mainSong.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            soundToggle.classList.add('is-playing');
            if (dockMusicText) dockMusicText.innerText = 'Him & I (Remix)';
          }).catch((err) => {
            console.log('Mobile audio start deferred to next interaction:', err);
          });
        }
      }
    }

    playCelebrationSong();

    glassShatterFlash.style.opacity = '1';
    setTimeout(() => { glassShatterFlash.style.opacity = '0'; }, 400);

    // Celestial Confetti Blast
    if (window.confetti) {
      const count = 200;
      const defaults = { 
        origin: { y: 0.6 },
        colors: ['#FFE29A', '#FF758F', '#F59E0B', '#E11D48', '#ffffff']
      };
      function fire(particleRatio, opts) {
        confetti(Object.assign({}, defaults, opts, {
          particleCount: Math.floor(count * particleRatio)
        }));
      }
      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    }

    // Transition into Stage 4: Birthday Climax
    setTimeout(() => {
      document.getElementById('stage-3').classList.add('stage-hidden');
      const stage4 = document.getElementById('stage-4');
      stage4.classList.remove('stage-hidden');

      const starVideo = document.getElementById('star-animation-video');
      if (starVideo) {
        starVideo.currentTime = 0;
        starVideo.play().catch(() => {});
      }
    }, 800);
  }

  // --- STAGE 4: ENTER UNIVERSE BUTTON ---
  const enterUniverseBtn = document.getElementById('enter-universe-btn');
  if (enterUniverseBtn) {
    enterUniverseBtn.addEventListener('click', () => {
      playFx(fxWhoosh, 0.9);
      // Ensure celebration song is playing on mobile
      if (isSoundEnabled && mainSong && mainSong.paused) {
        mainSong.volume = 0.85;
        mainSong.play().catch(() => {});
        soundToggle.classList.add('is-playing');
        if (dockMusicText) dockMusicText.innerText = 'Him & I (Remix)';
      }
      // Smoothly scroll down past the hero viewport
      const hero = document.getElementById('hero-experience-wrapper');
      if (hero) hero.style.display = 'none';
      const dock = document.getElementById('bottom-dock');
      if (dock) dock.classList.remove('opacity-0', 'pointer-events-none');
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    });
  }

  // Mobile safety net: any interaction once stage 3 is completed guarantees the song plays
  function resumeCelebrationAudioOnGesture() {
    if (stage3Completed && isSoundEnabled && mainSong && mainSong.paused) {
      mainSong.volume = 0.85;
      mainSong.play().then(() => {
        soundToggle.classList.add('is-playing');
        if (dockMusicText) dockMusicText.innerText = 'Him & I (Remix)';
      }).catch(() => {});
    }
  }
  window.addEventListener('click', resumeCelebrationAudioOnGesture);
  window.addEventListener('touchend', resumeCelebrationAudioOnGesture);

  // --- MAIN WEBPAGE: 3D POLAROID GALLERY WITH AROOJ'S REAL PHOTOS ---
  const aroojMemories = [
    { src: 'assets/IMG-20260204-WA0007_1.jpg', caption: 'Quiet Grace & Serenity' },
    { src: 'assets/IMG-20260405-WA0014.jpg', caption: 'Catching the Golden Hour Light' },
    { src: 'assets/IMG-20260728-WA0005.jpg', caption: 'Comfort in Pure Simplicity' },
    { src: 'assets/IMG-20260728-WA0006.jpg', caption: 'Forever Precious to Me' },
    { src: 'assets/IMG-20260805-WA0091.jpg', caption: 'That Gentle Twinkle in Your Eyes' },
    { src: 'assets/IMG-20260916-WA0061.jpg', caption: 'Timeless Beauty Personified' },
    { src: 'assets/IMG-20260918-WA0000.jpg', caption: 'Pure Magic in Every Dimension' },
    { src: 'assets/IMG-20260918-WA0002.jpg', caption: 'My Absolute Favorite Smile' },
    { src: 'assets/IMG-20260918-WA0003.jpg', caption: 'A Warmth Like Soft Sunlight' },
    { src: 'assets/IMG-20260918-WA0004.jpg', caption: 'Poise, Elegance, and Perfection' },
    { src: 'assets/IMG-20260918-WA0006.jpg', caption: 'The Sweetest Little Expressions' },
    { src: 'assets/IMG-20260918-WA0008.jpg', caption: 'Turning Every Day into a Blessing' },
    { src: 'assets/IMG-20260918-WA0009.jpg', caption: 'Nobody Wears Grace Quite Like You' },
    { src: 'assets/IMG-20260918-WA0010.jpg', caption: 'Looking at You is My Favorite View' },
    { src: 'assets/IMG-20260918-WA0019_1.jpg', caption: 'Laughter That Sings Like Music' },
    { src: 'assets/IMG-20260918-WA0021.jpg', caption: 'Calm Oceans in Your Eyes' },
    { src: 'assets/IMG-20260918-WA0022.jpg', caption: 'Natural, Breathtaking, and True' },
    { src: 'assets/IMG-20260918-WA0025.jpg', caption: 'Your Strength Inspires My Heart' },
    { src: 'assets/IMG-20260918-WA0027.jpg', caption: 'A Constellation All on Your Own' },
    { src: 'assets/IMG-20260918-WA0028.jpg', caption: 'Kindness That Heals the World' },
    { src: 'assets/IMG-20260918-WA0029.jpg', caption: 'Effortless and Stunning' },
    { src: 'assets/IMG-20260918-WA0030.jpg', caption: 'Treasured in Every Single Lifetime' },
    { src: 'assets/IMG-20260918-WA0032.jpg', caption: 'The Birthday Queen Arrives' },
    { src: 'assets/IMG-20260918-WA0033.jpg', caption: 'Sweet Reminders of Life’s Joy' },
    { src: 'assets/IMG-20260918-WA0034.jpg', caption: 'My Anchor and Peaceful Harbor' },
    { src: 'assets/IMG-20260918-WA0035.jpg', caption: 'One Look That Says Everything' },
    { src: 'assets/IMG-20260918-WA0036.jpg', caption: 'A Glow Time Cannot Dim' },
    { src: 'assets/IMG-20260918-WA0037.jpg', caption: 'Endless Fondness with Every Breath' },
    { src: 'assets/IMG-20260918-WA0038.jpg', caption: 'Serenity When We Are Near' },
    { src: 'assets/IMG-20260918-WA0043.jpg', caption: 'Our Private, Beautiful Fairy Tale' },
    { src: 'assets/IMG-20260918-WA0044.jpg', caption: 'Thoughts of You are My Warmest Space' },
    { src: 'assets/IMG-20260919-WA0004.jpg', caption: 'Smiles That Turn the World Bright' },
    { src: 'assets/IMG-20260921-WA0064.jpg', caption: 'Worth More Than a Thousand Universes' },
    { src: 'assets/IMG-20260921-WA0065.jpg', caption: 'Celebrating You Today & Always' },
    { src: 'assets/IMG_20260718_160656.jpg', caption: 'High Definition Perfection' },
    { src: 'assets/IMG_20260925_182538.jpg', caption: 'Today We Celebrate Your Light' }
  ];

  const galleryGrid = document.getElementById('polaroid-grid');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeLightboxBtn = document.getElementById('close-lightbox-btn');

  if (galleryGrid) {
    aroojMemories.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'polaroid-card group cursor-pointer';

    card.innerHTML = `
      <div class="polaroid-inner p-3 pb-5 flex flex-col justify-between h-full">
        <div class="relative w-full aspect-[4/5] rounded-lg overflow-hidden bg-black/40 mb-3">
          <img src="${item.src}" alt="Arooj" loading="lazy" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
          <div class="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition">
            <i data-lucide="heart" class="w-3.5 h-3.5 fill-[#FF758F] text-[#FF758F]"></i>
          </div>
        </div>
        <div class="flex items-center justify-between text-black px-1">
          <span class="font-cormorant font-semibold text-sm truncate pr-2">${item.caption}</span>
          <span class="font-mono text-[10px] text-amber-800 font-bold">#${String(index + 1).padStart(2, '0')}</span>
        </div>
      </div>
    `;

    // 3D Parallax Tilt Effect on Mouse Move
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });

    // Lightbox modal opener
    card.addEventListener('click', () => {
      playFx(fxWhoosh, 0.4);
      lightboxImg.src = item.src;
      lightboxCaption.innerText = `"${item.caption}"`;
      lightboxModal.classList.add('is-open');
    });

      galleryGrid.appendChild(card);
    });
  }

  // Re-run Lucide on newly created cards
  if (window.lucide) {
    window.lucide.createIcons();
  }

  closeLightboxBtn.addEventListener('click', () => {
    lightboxModal.classList.remove('is-open');
  });
  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      lightboxModal.classList.remove('is-open');
    }
  });

  // --- INTERACTIVE BIRTHDAY WISH & CANDLES BLOW-OUT ---
  const blowCandlesBtn = document.getElementById('blow-candle-btn');
  const candleFlames = [
    document.getElementById('candle-flame-1'),
    document.getElementById('candle-flame-2'),
    document.getElementById('candle-flame-3')
  ];
  const birthdayWishQuote = document.getElementById('wish-success-msg');
  let areCandlesBlown = false;

  function blowOutCandles() {
    if (areCandlesBlown) return;
    areCandlesBlown = true;

    // Blow flames
    candleFlames.forEach(flame => {
      if (flame) {
        flame.style.opacity = '0';
        flame.style.transform = 'scale(0.2)';
      }
    });

    // Audio confirmation
    playFx(fxXp, 0.9);

    // Update button text
    if (blowCandlesBtn) {
      blowCandlesBtn.innerHTML = `
        <i data-lucide="sparkles" class="w-4 h-4 text-[#FFE29A]"></i>
        <span>YOUR WISH IS SENT TO THE STARS!</span>
      `;
      blowCandlesBtn.classList.remove('glow-box-gold');
      blowCandlesBtn.classList.add('border-amber-400', 'text-amber-200');
    }

    // Reveal heartfelt wish blessing
    if (birthdayWishQuote) {
      birthdayWishQuote.classList.remove('hidden');
    }

    // Grand Celebration Confetti Explosion
    if (window.confetti) {
      const end = Date.now() + 2.5 * 1000;
      const colors = ['#FFE29A', '#F59E0B', '#FF758F', '#E11D48', '#ffffff'];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }

    if (window.lucide) window.lucide.createIcons();
  }

  blowCandlesBtn.addEventListener('click', blowOutCandles);
  candleFlames.forEach(f => f.addEventListener('click', blowOutCandles));

  // --- FLOATING CANVAS ROSE PETALS ---
  const particleCanvas = document.getElementById('particle-canvas');
  if (particleCanvas) {
    const pCtx = particleCanvas.getContext('2d');
    function resizeParticleCanvas() {
      particleCanvas.width = window.innerWidth;
      particleCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeParticleCanvas);
    resizeParticleCanvas();

    const petals = [];
    const numPetals = 45;

    for (let i = 0; i < numPetals; i++) {
      petals.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 9 + 6,
        speedX: Math.random() * 1.5 - 0.75,
        speedY: Math.random() * 1.2 + 0.6,
        rotation: Math.random() * 360,
        rotSpeed: Math.random() * 1.5 - 0.75,
        opacity: Math.random() * 0.5 + 0.25,
        color: Math.random() > 0.4 ? 'rgba(255, 117, 143,' : 'rgba(0, 223, 129,'
      });
    }

    function renderPetals() {
      pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

      petals.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotSpeed;

        if (p.y > particleCanvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * particleCanvas.width;
        }
        if (p.x > particleCanvas.width + 20) p.x = -20;
        if (p.x < -20) p.x = particleCanvas.width + 20;

        pCtx.save();
        pCtx.translate(p.x, p.y);
        pCtx.rotate((p.rotation * Math.PI) / 180);
        pCtx.fillStyle = `${p.color} ${p.opacity})`;
        pCtx.beginPath();
        pCtx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
        pCtx.fill();
        pCtx.restore();
      });

      requestAnimationFrame(renderPetals);
    }
    renderPetals();
  }
}

// Guaranteed launch whether DOM is already parsed or still loading
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
