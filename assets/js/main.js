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


// ==========================================
// HORIZONTAL SCROLL CAROUSEL MECHANICS
// ==========================================
let nxCurrentSlideIndex = 0;

function moveNxCarousel(direction) {
    const track = document.getElementById('nxMovieTrack');
    const items = document.querySelectorAll('.nx-carousel-card-item');
    
    if (!track || items.length === 0) return;

    const totalItems = items.length;
    
    // Determine how many items are visible based on media screen sizes
    let itemsVisible = 5;
    if (window.innerWidth <= 992) itemsVisible = 3;
    if (window.innerWidth <= 576) itemsVisible = 2;
    
    const maxIndex = totalItems - itemsVisible;
    nxCurrentSlideIndex += direction;

    // Viewport structural boundary checks
    if (nxCurrentSlideIndex < 0) {
        nxCurrentSlideIndex = 0;
    } else if (nxCurrentSlideIndex > maxIndex) {
        nxCurrentSlideIndex = maxIndex;
    }

    // Read single card width parameters dynamically
    const itemWidth = items[0].getBoundingClientRect().width;
    const gapWidth = 8; // Matches track style layout parameters
    
    // Slide track left
    const shiftAmount = nxCurrentSlideIndex * (itemWidth + gapWidth);
    track.style.transform = `translateX(-${shiftAmount}px)`;
}

// Recalculate track position if screen resizing changes the card size dimensions
window.addEventListener('resize', () => {
    nxCurrentSlideIndex = 0;
    const track = document.getElementById('nxMovieTrack');
    if (track) track.style.transform = 'translateX(0px)';
});

// ==========================================
// INTERACTIVE PREVIEW CONTROLLERS (ROW CAROUSEL)
// ==========================================
function playPreview(cardElement) {
  const video = cardElement.querySelector('.nx-video-preview');
  
  if (video) {
      if (video.getAttribute('preload') === 'none') {
          video.setAttribute('preload', 'auto');
      }
      
      video.play()
          .then(() => {
              cardElement.classList.add('is-playing');
          })
          .catch(error => {
              console.log("Browser auto-play safety blocked video start:", error);
          });
  }
}

function stopPreview(cardElement) {
  const video = cardElement.querySelector('.nx-video-preview');
  
  if (video) {
      cardElement.classList.remove('is-playing');
      video.pause();
      video.currentTime = 0;
  }
}

// ==========================================
// MAIN HERO BANNER STREAM HOVER HANDLERS
// ==========================================
function playHeroPreview(containerElement) {
  const heroVideo = containerElement.querySelector('.hero-media-video');
  const parentContainer = containerElement.closest('.hero-img') || containerElement;
  
  if (heroVideo) {
      if (heroVideo.getAttribute('preload') === 'none') {
          heroVideo.setAttribute('preload', 'auto');
      }
      
      heroVideo.play()
          .then(() => {
              parentContainer.classList.add('is-playing-video');
          })
          .catch(err => {
              console.log("Hero auto playback halted by browser policy rules:", err);
          });
  }
}




// Grab DOM elements
const playButton = document.getElementById("heroPlayBtn");
const favDialog = document.getElementById("favDialog");
const selectEl = favDialog.querySelector("select");
const confirmBtn = document.getElementById("confirmBtn");

// 💡 FLAG TRACKER: Keeps track of whether the button is locked or unlocked
let isPlayButtonUnlocked = false;

// INTERCEPT BUTTON EVENT CLICK LOOP
playButton.addEventListener("click", (event) => {
  // If the button is currently locked, STOP it from taking the user to /renew.html
  if (!isPlayButtonUnlocked) {
    event.preventDefault(); 
    
    // Launch the HTML5 modal view box smoothly
    favDialog.showModal();
  }
  // If it IS unlocked (isPlayButtonUnlocked === true), the browser safely continues 
  // following the normal link action, taking them to the updated custom page path!
});

// MONITOR DIALOG CLOSING SELECTION PHASES
favDialog.addEventListener("close", () => {
  const chosenValue = favDialog.returnValue;
  
  // 💡 CONDITION STEP: Check if the user chose the exact secret option value
  if (chosenValue === "unlock_key") {
    
    // 1. Flip flag to true so next click goes through natively
    isPlayButtonUnlocked = true;
    
    // 2. Change the button path link dynamically on the page!
    playButton.href = "/unlocked-movie.html"; // 👈 Set your new target webpage path here!
    
    // 3. Optional: Instantly simulate a click so the user goes there right after confirming!
    playButton.click();
    
  } else {
    // If they chose anything else or canceled, reset paths back to safety defaults
    isPlayButtonUnlocked = false;
    playButton.href = "/renew.html";
  }
});

// MANAGE CONFIRM DIALOG LOGIC
confirmBtn.addEventListener("click", (event) => {
  event.preventDefault(); // Prevents fake layout form submission cycles
  
  // Close the popup window frame and forward the chosen selection string value downstream
  favDialog.close(selectEl.value); 
});
