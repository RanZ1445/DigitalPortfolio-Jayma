/**
 * Simplified and optimized script.js
 * - Reduced complexity while maintaining functionality
 * - Better performance with fewer DOM queries
 * - Simplified event handling
 */

document.addEventListener('DOMContentLoaded', () => {
  // Cache DOM elements
  const siteHeader = document.getElementById('siteHeader');
  const toggleBtn = document.getElementById('toggleNavbar');
  const scrollElements = document.querySelectorAll('a[href^="#"]');
  const memberCards = document.querySelectorAll('.member-card');
  
  // Header toggle functionality
  if (siteHeader && toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isCollapsed = siteHeader.classList.toggle('collapsed');
      toggleBtn.textContent = isCollapsed ? '˅' : '^';
      toggleBtn.setAttribute('aria-expanded', (!isCollapsed).toString());
    });
  }

  // Smooth scrolling for anchor links
  scrollElements.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      
      const targetEl = document.querySelector(href);
      if (!targetEl) return;

      e.preventDefault();
      const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 80;
      const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });

  // Horizontal scroll functionality for carousels
  document.querySelectorAll('.carousel-btn, .hscroll-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const container = document.getElementById(targetId);
      if (!container) return;

      const card = container.querySelector('.hcard, .carousel-card');
      const gap = 14;
      const scrollAmount = card ? (card.offsetWidth + gap) : 260;
      const direction = btn.classList.contains('left') ? -scrollAmount : scrollAmount;
      
      container.scrollBy({ left: direction, behavior: 'smooth' });
    });
  });

  // Member role toggle functionality
  if (memberCards.length > 0) {
    // Close all role descriptions
    const closeAllRoles = () => {
      memberCards.forEach(card => {
        const desc = card.querySelector('.role-description');
        const btn = card.querySelector('.toggle-role');
        if (desc) desc.classList.remove('open');
        if (btn) {
          btn.setAttribute('aria-expanded', 'false');
          btn.textContent = 'Show role';
        }
      });
    };

    // Set up click handlers for each member card
    memberCards.forEach(card => {
      const btn = card.querySelector('.toggle-role');
      const desc = card.querySelector('.role-description');
      
      if (!btn || !desc) return;

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = desc.classList.contains('open');
        
        if (isOpen) {
          desc.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
          btn.textContent = 'Show role';
        } else {
          closeAllRoles();
          desc.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
          btn.textContent = 'Hide role';
        }
      });
    });

    // Close all roles when clicking outside
    document.addEventListener('click', () => closeAllRoles());

    // Close with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAllRoles();
    });
  }

  // Apply background images from data-bg attributes
  document.querySelectorAll('[data-bg]').forEach(section => {
    const bgImage = section.getAttribute('data-bg');
    if (bgImage) {
      section.style.backgroundImage = `url('${bgImage}')`;
    }
  });
});

// Handle hash navigation on page load
window.addEventListener('load', () => {
  if (location.hash) {
    const target = document.querySelector(location.hash);
    if (target) {
      const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 80;
      const offset = headerHeight + 12;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      
      // Small delay to ensure DOM is fully ready
      setTimeout(() => {
        window.scrollTo({ top, behavior: 'smooth' });
      }, 100);
    }
  }
});
/* ===========================
   DYNAMIC POLYGON BACKGROUND
   =========================== */
function randomDarkBlue() {
  const blues = [
    "#0a192f", "#112240", "#1e3a5f", "#243b53",
    "#102a43", "#0d1b2a", "#1b263b", "#274060"
  ];
  return blues[Math.floor(Math.random() * blues.length)];
}

function drawPolygons() {
  const canvas = document.getElementById("bgCanvas");
  if (!canvas) return; // safeguard if canvas missing
  const ctx = canvas.getContext("2d");

  // Resize canvas
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Generate random polygons
  const polygonCount = 20; // number of shapes
  for (let i = 0; i < polygonCount; i++) {
    const sides = Math.floor(Math.random() * 5) + 3; // 3–7 sides
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * 120 + 40; // 40–160 px
    const color = randomDarkBlue();

    ctx.beginPath();
    for (let j = 0; j < sides; j++) {
      const angle = (j / sides) * (2 * Math.PI);
      const px = x + radius * Math.cos(angle);
      const py = y + radius * Math.sin(angle);
      if (j === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.6; // nice transparency for overlap
    ctx.fill();
  }
}

// Run once on load
window.addEventListener("load", drawPolygons);
// Redraw on resize
window.addEventListener("resize", drawPolygons);
