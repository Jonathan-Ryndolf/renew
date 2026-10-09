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
     6. INTERACTIVE CUSTOM ISOLATED ENVELOPE HANDLERS (DYNAMIC)
     ============================================================= */
document.addEventListener("DOMContentLoaded", function () {
  const notifTriggers = document.querySelectorAll(".nx-trigger-notif");
  const envelopeOverlay = document.getElementById("envelopeOverlay");
  const envelopeWrapper = document.getElementById("envelopeWrapper");
  const envelopeSurpriseImg = document.getElementById("envelopeSurpriseImg");
  const letterCard = document.getElementById("letterImageCard");

  if (envelopeOverlay && envelopeWrapper && envelopeSurpriseImg) {
    // 1. Loop through all notifications using our class trigger
    notifTriggers.forEach(function (notif) {
      notif.addEventListener("click", function (e) {
        e.preventDefault();

        // Grab the custom image path set on this specific notification
        const specificImagePath = notif.getAttribute("data-target-img");

        if (specificImagePath) {
          // Swap the image inside the envelope layout instantly before opening
          envelopeSurpriseImg.src = specificImagePath;

          // Open isolated custom modal overlay layer
          envelopeOverlay.classList.add("lx-env-activated");
          document.body.classList.add("modal-open-lock");
        }
      });
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

        // Tell the card layer to release its crop parameters right as it rises
        if (letterCard) {
          letterCard.classList.add("lx-env-reveal-ratio");
        }
      }
    });

    // 3. Dismount modal smoothly and clear dynamic layout states
    envelopeOverlay.addEventListener("click", function () {
      envelopeOverlay.classList.remove("lx-env-activated");
      document.body.classList.remove("modal-open-lock");

      // Clear dynamic layout class values after transition sequence passes
      setTimeout(() => {
        envelopeWrapper.classList.remove("lx-env-open-flap", "lx-env-pull-out");

        // RESET ON CLOSE: Return the card back to its safe cropped state
        if (letterCard) {
          letterCard.classList.remove("lx-env-reveal-ratio");
        }

        // Optional: clear image source so old image doesn't flash next time it opens
        envelopeSurpriseImg.src = "";
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

// 1. Establish the single origin trigger point
const c02Viewport = document.querySelector("#c02 .nx-carousel-clip-viewport");

// 2. Establish all your distinct target items across the page
const c02Heading = document.querySelector("#c02 .nx-carousel-heading");
const c02touch = document.querySelectorAll(".touch"); // Creates the collection list array

if (c02Viewport) {
  // Triggers when cursor enters the origin track box area
  c02Viewport.addEventListener("mouseenter", () => {
    // 💡 ADDED: Applies the shifted class directly to the viewport itself
    c02Viewport.classList.add("is-shifted");

    if (c02Heading) c02Heading.classList.add("is-shifted");

    // Safely loop through the collection list array to update classes
    if (c02touch) {
      c02touch.forEach((element) => element.classList.add("is-out"));
    }
  });

  // Triggers when cursor leaves the origin track box area
  c02Viewport.addEventListener("mouseleave", () => {
    // 💡 ADDED: Strips the shifted class from the viewport itself
    c02Viewport.classList.remove("is-shifted");

    if (c02Heading) c02Heading.classList.remove("is-shifted");

    // Safely loop through to strip away classes on leave
    if (c02touch) {
      c02touch.forEach((element) => element.classList.remove("is-out"));
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("myAudio");
  audio.volume = 0.01;
  audio.play().catch((error) => {
    console.log("Autoplay blocked by browser:", error);
  });
});

///
///
///

document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("myAudio");
  const audioBtn = document.getElementById("audioToggleBtn");

  // SVG Strings for rendering state changes
  const volumeHighIcon =
    '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';
  const volumeMuteIcon =
    '<svg viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.21.05-.42.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>';

  // 1. Handle background autoplay initialization safely
  if (audio) {
    audio.volume = 0.1; // Low fallback volume baseline level
    audio.play().catch((error) => {
      console.log(
        "Autoplay blocked by browser. Awaiting user interaction:",
        error
      );
    });
  }

  // 2. Click interaction logic handler
  if (audioBtn && audio) {
    audioBtn.addEventListener("click", () => {
      // Toggle element mute status metric
      audio.muted = !audio.muted;

      // Re-render matching button graphical path state
      audioBtn.innerHTML = audio.muted ? volumeMuteIcon : volumeHighIcon;
    });
  }
});
