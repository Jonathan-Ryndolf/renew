document.addEventListener("DOMContentLoaded", () => {
  const videoContainer = document.querySelector(".video-container");
  const video = document.querySelector(".video-element");

  // Select elements safely
  const playBtn = document.querySelector(".play-btn");
  const skipBackBtn = document.querySelector(".skip-back-btn");
  const skipFwdBtn = document.querySelector(".skip-fwd-btn");
  const volumeBtn = document.querySelector(".volume-btn");
  const fullscreenBtn = document.querySelector(".fullscreen-btn");
  const backBtn = document.querySelector(".back-btn");

  const progressContainer = document.querySelector(".progress-container");
  const progressFilled = document.querySelector(".progress-filled");
  const progressHandle = document.querySelector(".progress-handle");
  const timeDisplay = document.querySelector(".time-display");

  // SVG Strings for icons
  const playIcon = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
  const pauseIcon =
    '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
  const volumeHighIcon =
    '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';
  const volumeMuteIcon =
    '<svg viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.21.05-.42.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>';
  const expandIcon =
    '<svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>';
  const compressIcon =
    '<svg viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>';

  // Play & Pause
  function togglePlay() {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }

  function updatePlayButton() {
    if (playBtn) playBtn.innerHTML = video.paused ? playIcon : pauseIcon;
  }

  if (playBtn) playBtn.addEventListener("click", togglePlay);
  video.addEventListener("click", togglePlay);
  video.addEventListener("play", updatePlayButton);
  video.addEventListener("pause", updatePlayButton);

  // Skip Buttons
  if (skipBackBtn) {
    skipBackBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      video.currentTime = Math.max(0, video.currentTime - 10);
    });
  }
  if (skipFwdBtn) {
    skipFwdBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      video.currentTime = Math.min(video.duration, video.currentTime + 10);
    });
  }

  // Time Label Formatter (Using standard strings to avoid template literal backtick bugs)
  function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const displayMins = mins < 10 ? "0" + mins : mins;
    const displaySecs = secs < 10 ? "0" + secs : secs;

    if (hrs > 0) {
      return hrs + ":" + displayMins + ":" + displaySecs;
    }
    return mins + ":" + displaySecs;
  }

  // Track Progress Bar Update
  function updateProgress() {
    if (!video.duration) return;
    const percentage = (video.currentTime / video.duration) * 100;
    if (progressFilled) progressFilled.style.width = percentage + "%";
    if (progressHandle) progressHandle.style.left = percentage + "%";
    if (timeDisplay) {
      timeDisplay.textContent =
        formatTime(video.currentTime) + " / " + formatTime(video.duration);
    }
  }

  video.addEventListener("timeupdate", updateProgress);
  video.addEventListener("loadedmetadata", updateProgress);

  // Timeline Scrubbing Click
  if (progressContainer) {
    progressContainer.addEventListener("click", (e) => {
      e.stopPropagation();
      const rect = progressContainer.getBoundingClientRect();
      const scrubTime = ((e.clientX - rect.left) / rect.width) * video.duration;
      video.currentTime = scrubTime;
    });
  }

  // Mute control
  if (volumeBtn) {
    volumeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      video.muted = !video.muted;
      volumeBtn.innerHTML = video.muted ? volumeMuteIcon : volumeHighIcon;
    });
  }

  // Fullscreen Toggle
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!document.fullscreenElement) {
        videoContainer
          .requestFullscreen()
          .then(() => {
            fullscreenBtn.innerHTML = compressIcon;
          })
          .catch((err) => console.error(err));
      } else {
        document.exitFullscreen();
        fullscreenBtn.innerHTML = expandIcon;
      }
    });
  }

  if (backBtn) {
    backBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      window.history.back();
    });
  }

  // --- AUTO-HIDE TIMER SYSTEM ---
  let hideTimeout;

  function showControls() {
    clearTimeout(hideTimeout);
    videoContainer.classList.remove("controls-hidden");
    videoContainer.classList.remove("hide-cursor");

    // Hide panel after 2.5 seconds only if the video is playing
    if (!video.paused) {
      hideTimeout = setTimeout(() => {
        videoContainer.classList.add("controls-hidden");
        videoContainer.classList.add("hide-cursor");
      }, 2500);
    }
  }

  // Connect user activity to the timer reset
  videoContainer.addEventListener("mousemove", showControls);
  videoContainer.addEventListener("click", showControls);

  videoContainer.addEventListener("mouseleave", () => {
    if (!video.paused) {
      clearTimeout(hideTimeout);
      videoContainer.classList.add("controls-hidden");
      videoContainer.classList.add("hide-cursor");
    }
  });

  video.addEventListener("pause", () => {
    clearTimeout(hideTimeout);
    videoContainer.classList.remove("controls-hidden");
    videoContainer.classList.remove("hide-cursor");
  });

  // Run safely once the video data loads up
  video.addEventListener("loadedmetadata", showControls);
  showControls();
});

const video = document.querySelector("video");
const volumeSlider = document.getElementById("volume-slider");
const muteBtn = document.getElementById("mute-btn");

// Change volume when slider moves
volumeSlider.addEventListener("input", (e) => {
  const volumeValue = e.target.value;
  video.volume = volumeValue;

  // Automatically unmute if user turns volume up
  if (volumeValue > 0) {
    video.muted = false;
    muteBtn.textContent = "🔊";
  } else {
    muteBtn.textContent = "🔇";
  }
});
