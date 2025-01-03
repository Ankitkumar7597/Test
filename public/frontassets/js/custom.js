// Get the button element
const scrollToTopBtn = document.getElementById("scrollToTopBtn");

window.onscroll = function () {

  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    scrollToTopBtn.style.display = "block";
  } else {
    scrollToTopBtn.style.display = "none";

  }
};


scrollToTopBtn.addEventListener("click", function () {
  smoothScrollToTop(5000);

});

function smoothScrollToTop(duration) {
  const start = document.documentElement.scrollTop || document.body.scrollTop;
  const startTime = performance.now();

  function scrollStep(timestamp) {
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
    const newScroll = start * (1 - ease);

    window.scrollTo(0, newScroll);

    if (progress < 1) {
      requestAnimationFrame(scrollStep);
    }
  }

  requestAnimationFrame(scrollStep);
}





document.addEventListener("DOMContentLoaded", function () {
  const dropdownToggles = document.querySelectorAll(".dropdown-toggle");
  const dropdownMenus = document.querySelectorAll(".dropdown-menu");

  dropdownToggles.forEach((toggle) => {
    const dropdownMenu = toggle.nextElementSibling;

    toggle.addEventListener("mouseenter", function () {
      // Show the dropdown menu on hover
      dropdownMenu.classList.add("show");
    });

    toggle.addEventListener("mouseleave", function () {
      // Hide the dropdown menu when mouse leaves
      dropdownMenu.classList.remove("show");
    });

    dropdownMenu.addEventListener("mouseenter", function () {
      // Keep the dropdown menu open when hovering over it
      dropdownMenu.classList.add("show");
    });

    dropdownMenu.addEventListener("mouseleave", function () {
      // Hide the dropdown menu when mouse leaves the menu
      dropdownMenu.classList.remove("show");
    });
  });

  // Close the dropdown if the user clicks outside of any dropdown
  window.addEventListener("click", function () {
    dropdownMenus.forEach((menu) => menu.classList.remove("show"));
  });
});

// Function to toggle mobile header visibility

document
  .getElementById("mobile-sidebar-btn")
  .addEventListener("click", function (event) {
    event.preventDefault(); // Default link behavior रोकें

    var mobileHeader = document.getElementById("mobile-header");

    // 'hidden' क्लास को टॉगल करें
    mobileHeader.classList.toggle("hidden");
  });

document
  .getElementById("mobile-sidebar-close")
  .addEventListener("click", function (event) {
    event.preventDefault(); // Default link behavior रोकें

    var mobileHeader = document.getElementById("mobile-header");

    // 'hidden' क्लास जोड़ें
    mobileHeader.classList.add("hidden");
  });


document.addEventListener("DOMContentLoaded", () => {
  const accordionToggles = document.querySelectorAll("[data-accordion-toggle]");

  accordionToggles.forEach((toggle) => {
    toggle.addEventListener("click", (e) => {
      e.preventDefault();

      const content = toggle.nextElementSibling;

      content.classList.toggle("active");
    });
  });
});



// Check if the element with id "open-popup" exists
const openPopupButton = document.getElementById("open-popup");
if (openPopupButton) {
  openPopupButton.addEventListener("click", function (event) {
    event.preventDefault();
    const popupBox = document.getElementById("popup-box");
    if (popupBox) {
      popupBox.classList.remove("hidden");
      document.body.classList.add("overflow-y-hidden");
    }
  });
}

// Check if the element with id "close-popup" exists
const closePopupButton = document.getElementById("close-popup");
if (closePopupButton) {
  closePopupButton.addEventListener("click", function () {
    const popupBox = document.getElementById("popup-box");
    const popupVideo = document.getElementById("popup-video");
    if (popupBox) {
      popupBox.classList.add("hidden");
      document.body.classList.remove("overflow-y-hidden");
      if (popupVideo) {
        popupVideo.src = popupVideo.src; // Stop video playback
      }
    }
  });
}

// Check if the element with id "popup-box" exists
const popupBox = document.getElementById("popup-box");
if (popupBox) {
  popupBox.addEventListener("click", function (event) {
    if (event.target === this) {
      popupBox.classList.add("hidden");
      document.body.classList.remove("overflow-y-hidden");
      const popupVideo = document.getElementById("popup-video");
      if (popupVideo) {
        popupVideo.src = popupVideo.src; // Stop video playback
      }
    }
  });
}








