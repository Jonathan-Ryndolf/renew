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



// DOM Element Targets
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

// 1. TOGGLE DROPDOWN OPEN/CLOSE OVERLAYS
dropdownTrigger.addEventListener("click", (e) => {
  e.stopPropagation();
  dropdownTrigger.parentElement.classList.toggle("is-open");
});

// 2. MONITOR OPTION ITEM CLICKS
optionItems.forEach(item => {
  item.addEventListener("click", function() {
    const value = this.getAttribute("data-value");
    const text = this.textContent;

    // Update text labels and hidden script input references
    selectedOptionText.textContent = text;
    secureSelectValue.value = value;

    // Shut options shelf view tray
    dropdownTrigger.parentElement.classList.remove("is-open");
  });
});

// Close custom tray safely if click falls outside menu borders
document.addEventListener("click", () => {
  dropdownTrigger.parentElement.classList.remove("is-open");
});

// Locate your current playButton click listener logic block and update it:
playButton.addEventListener("click", (event) => {
  if (!isPlayButtonUnlocked) {
    event.preventDefault(); 
    
    // Clear out residual text states on fresh window displays
    selectedOptionText.textContent = "Choose...";
    secureSelectValue.value = "default";
    
    // 💡 FREEZE ON OPEN: Injects the layout locking tag onto your document body
    document.body.classList.add("modal-open-lock");
    
    favDialog.showModal();
  }
});

// Update BOTH your confirmBtn and cancelBtn listeners to clear the lock when closed:
confirmBtn.addEventListener("click", () => {
  const finalChosenValue = secureSelectValue.value;

  // 💡 RELEASE LOCK: Unlocks scroll functionalities instantly
  document.body.classList.remove("modal-open-lock");

  if (finalChosenValue === "unlock_key") {
    isPlayButtonUnlocked = true;
    playButton.href = "/unlocked-movie.html";
    favDialog.close();
    playButton.click(); 
  } else {
    isPlayButtonUnlocked = false;
    playButton.href = "/renew.html";
    favDialog.close();
  }
});

cancelBtn.addEventListener("click", () => {
  // 💡 RELEASE LOCK: Unlocks scroll functionalities on cancel close events
  document.body.classList.remove("modal-open-lock");
  favDialog.close();
});
