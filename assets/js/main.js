/* =============================================================
1. GLOBAL FRAMEWORK & JQUERY INITIALIZATIONS
   ============================================================= */
(function ($) {
  "use strict";

  // Toggle .header-scrolled class to #header when page is scrolled
  $(window).scroll(function () {
    if ($(this).scrollTop() > 50) {
      $("#header").addClass("header-scrolled");
    } else {
      $("#header").removeClass("header-scrolled");
    }
  });

  // Mobile Navigation Menu Toggle Engine
  if ($(".nav-menu").length) {
    $(document).on("click", ".mobile-nav-toggle", function () {
      $("body").toggleClass("mobile-nav-active");
      $(".mobile-nav-toggle i").toggleClass("bx-x");
    });
  }
})(jQuery);

/* =============================================================
2. INDEPENDENT MULTI-ROW CAROUSEL MOVEMENT ENGINE
     ============================================================= */
// Stores and tracks separate current slide positions for each unique row section ID
let carouselPositions = {
  c1: 0, // Row 1 positional indicator tracking channel
  c2: 0, // Row 2 positional indicator tracking channel
  c3: 0,
  c4: 0,
  c5: 0,
  c6: 0,
  c7: 0,
  c8: 0,
};

function moveNxCarousel(direction, trackId) {
  const track = document.getElementById(trackId);
  if (!track) return;

  // Target ONLY the cards sliding inside this specific row container
  const items = track.querySelectorAll(".nx-carousel-card-item");
  if (items.length === 0) return;

  const totalItems = items.length;

  // Manage responsive display card column layout thresholds
  let itemsVisible = 5;
  if (window.innerWidth <= 992) itemsVisible = 3;
  if (window.innerWidth <= 576) itemsVisible = 2;

  const maxIndex = totalItems - itemsVisible;

  // Increment position tracker strictly for the active key row parameter code
  carouselPositions[trackId] += direction;

  // Viewport structural safety boundary checking
  if (carouselPositions[trackId] < 0) {
    carouselPositions[trackId] = 0;
  } else if (carouselPositions[trackId] > maxIndex) {
    carouselPositions[trackId] = maxIndex;
  }

  // Measure the layout item width bounding parameters dynamically
  const itemWidth = items[0].getBoundingClientRect().width;

  /* 💡 ALIGNMENT SYNC: Ensure this gap width matches your CSS track layout rule perfectly! */
  const gapWidth = 15;

  // Shift track container left smoothly
  const shiftAmount = carouselPositions[trackId] * (itemWidth + gapWidth);
  track.style.transform = `translateX(-${shiftAmount}px)`;
}

// Global window screen listener resets layout shifts cleanly if browser drops scale metrics
window.addEventListener("resize", () => {
  carouselPositions = {
    c1: 0,
    c2: 0,
    c3: 0,
    c4: 0,
    c5: 0,
    c6: 0,
    c7: 0,
    c8: 0,
  };
  document.querySelectorAll(".nx-carousel-moving-track").forEach((track) => {
    track.style.transform = "translateX(0px)";
  });
});

/* =============================================================
3. CAROUSEL VIDEO COMPONENT HOVER SNIPPET HANDLERS
     ============================================================= */
function playPreview(element) {
  // 1. Add the utility class to trigger the smooth CSS opacity cross-fade
  element.classList.add("is-playing");

  // 2. Safely check if there is an actual video to play (leaves images alone!)
  const video = element.querySelector("video.nx-video-preview");
  if (video) {
    video
      .play()
      .catch((err) => console.log("Video playback paused or blocked"));
  }
}

function stopPreview(element) {
  // 1. Remove the class to fade back to the primary starting image
  element.classList.remove("is-playing");

  // 2. Safely pause only if a video element exists
  const video = element.querySelector("video.nx-video-preview");
  if (video) {
    video.pause();
    video.currentTime = 0;
  }
}

/* =============================================================
4. HERO BANNER CINEMA BACKGROUND HOVER STREAM LOGICS
     ============================================================= */
function playHeroPreview(containerElement) {
  const heroVideo = containerElement.querySelector(".hero-media-video");
  const parentContainer =
    containerElement.closest(".hero-img") || containerElement;

  if (heroVideo) {
    if (heroVideo.getAttribute("preload") === "none") {
      heroVideo.setAttribute("preload", "auto");
    }

    heroVideo
      .play()
      .then(() => {
        parentContainer.classList.add("is-playing-video");
      })
      .catch((err) => {
        console.log("Hero auto playback halted by browser policy rules:", err);
      });
  }
}

function stopHeroPreview(containerElement) {
  const heroVideo = containerElement.querySelector(".hero-media-video");
  const parentContainer =
    containerElement.closest(".hero-img") || containerElement;

  if (heroVideo) {
    parentContainer.classList.remove("is-playing-video");
    heroVideo.pause();
    heroVideo.currentTime = 0;
  }
}

/* =============================================================
  5. LOVEFLIX MODAL ACCESS GATEKEEPER DIALOG SYSTEM
     ============================================================= */
const playButton = document.getElementById("heroPlayBtn");
const favDialog = document.getElementById("favDialog");
const dropdownTrigger = document.getElementById("dropdownTrigger");
const optionsTray = document.getElementById("optionsTray");
const selectedOptionText = document.getElementById("selectedOptionText");
const secureSelectValue = document.getElementById("secureSelectValue");
const optionItems = document.querySelectorAll(".option-item");
const cancelBtn = document.getElementById("cancelBtn");
const confirmBtn = document.getElementById("confirmBtn");

let isPlayButtonUnlocked = false;

// 1. Toggle custom dropdown list layer expansions
if (dropdownTrigger) {
  dropdownTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdownTrigger.parentElement.classList.toggle("is-open");
  });
}

// 2. Map selection parameters downward when item elements are clicked
optionItems.forEach((item) => {
  item.addEventListener("click", function () {
    const value = this.getAttribute("data-value");
    const text = this.textContent;

    if (selectedOptionText) selectedOptionText.textContent = text;
    if (secureSelectValue) secureSelectValue.value = value;

    if (dropdownTrigger)
      dropdownTrigger.parentElement.classList.remove("is-open");
  });
});

// Close shelf safely if an outer click escape happens
document.addEventListener("click", () => {
  if (dropdownTrigger)
    dropdownTrigger.parentElement.classList.remove("is-open");
});

// 3. Intercept Play button interactions to prompt validation checks
if (playButton) {
  playButton.addEventListener("click", (event) => {
    if (!isPlayButtonUnlocked) {
      event.preventDefault();

      if (selectedOptionText) selectedOptionText.textContent = "Pay with...";
      if (secureSelectValue) secureSelectValue.value = "default";

      document.body.classList.add("modal-open-lock");
      if (favDialog) favDialog.showModal();
    }
  });
}

// 4. Modal submit confirm validation sequences
if (confirmBtn) {
  confirmBtn.addEventListener("click", () => {
    const finalChosenValue = secureSelectValue
      ? secureSelectValue.value
      : "default";

    document.body.classList.remove("modal-open-lock");

    if (finalChosenValue === "unlock_key") {
      isPlayButtonUnlocked = true;
      if (playButton) {
        playButton.href = "/player.html";
        if (favDialog) favDialog.close();
        playButton.click();
      }
    } else {
      isPlayButtonUnlocked = false;
      if (playButton) playButton.href = "/renew.html";
      if (favDialog) favDialog.close();
    }
  });
}

// 5. Cancel close event handlers
if (cancelBtn) {
  cancelBtn.addEventListener("click", () => {
    document.body.classList.remove("modal-open-lock");
    if (favDialog) favDialog.close();
  });
}

/* =============================================================
   6. INTERACTIVE CUSTOM ISOLATED ENVELOPE HANDLERS
   ============================================================= */
document.addEventListener("DOMContentLoaded", function () {
  const firstNotif = document.getElementById("firstNotif");
  const envelopeOverlay = document.getElementById("envelopeOverlay");
  const envelopeWrapper = document.getElementById("envelopeWrapper");

  if (firstNotif && envelopeOverlay && envelopeWrapper) {
    // 1. Open isolated custom modal overlay layer
    firstNotif.addEventListener("click", function (e) {
      e.preventDefault();
      envelopeOverlay.classList.add("lx-env-activated");
      document.body.classList.add("modal-open-lock"); // Safe scroll locks from standard framework
    });

    // 2. Control sequential open steps on custom envelope box clicks
    envelopeWrapper.addEventListener("click", function (e) {
      e.stopPropagation();

      if (!envelopeWrapper.classList.contains("lx-env-open-flap")) {
        // Step A: Swing flap open
        envelopeWrapper.classList.add("lx-env-open-flap");
      } else if (!envelopeWrapper.classList.contains("lx-env-pull-out")) {
        // Step B: Extract surprise image upward cleanly
        envelopeWrapper.classList.add("lx-env-pull-out");

        // 💡 THE CURE: Tell the card layer to release its crop parameters right as it rises
        const letterCard = document.getElementById("letterImageCard");
        if (letterCard) {
          letterCard.classList.add("lx-env-reveal-ratio");
        }
      }
    });

    // 3. Dismount modal smoothly and clear dynamic layout states
    envelopeOverlay.addEventListener("click", function () {
      envelopeOverlay.classList.remove("lx-env-activated");
      document.body.classList.remove("modal-open-lock");

      setTimeout(() => {
        envelopeWrapper.classList.remove("lx-env-open-flap", "lx-env-pull-out");

        // 💡 RESET ON CLOSE: Return the card back to its safe cropped state for next time
        const letterCard = document.getElementById("letterImageCard");
        if (letterCard) {
          letterCard.classList.remove("lx-env-reveal-ratio");
        }
      }, 400);
    });

    // 3. Dismount modal smoothly when clicking outer darkened framework boundary area
    envelopeOverlay.addEventListener("click", function () {
      envelopeOverlay.classList.remove("lx-env-activated");
      document.body.classList.remove("modal-open-lock");

      // Clear dynamic layout class values after transition sequence passes
      setTimeout(() => {
        envelopeWrapper.classList.remove("lx-env-open-flap", "lx-env-pull-out");
      }, 400);
    });
  }
});

// You only need this single function. Delete the querySelectorAll completely.
function secureRedirect(event, url, target) {
  event.preventDefault(); // Stops the '#' behavior

  //   // Opens the URL in a new tab safely
  //   window.open(url, "_blank", "noopener,noreferrer");
  // }
  if (target === "_blank") {
    // Opens in a new tab safely
    window.open(url, "_blank", "noopener,noreferrer");
  } else {
    // Opens in the same tab (default behavior)
    window.location.href = url;
  }
}
