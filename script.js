/* Main script for Remus portfolio
   - header toggle
   - shared role-info panel
   - dynamic heads background (loads images from assets/heads/)
   - graceful polygon fallback if heads fail to load
*/

/* ---------------------------
   CONFIG: list the head image files you placed into /assets/heads/
   Edit these filenames to match your actual files.
---------------------------- */
/* ===========================
   DYNAMIC BACKGROUND WITH INVINCIBLE HEADS
   =========================== */

// List of Invincible head images
/* ===========================
   DYNAMIC BACKGROUND WITH INVINCIBLE HEADS (with rotation)
   =========================== */

const headImages = [
  "assets/heads/inv1.png",
  "assets/heads/inv2-eve.png",
  "assets/heads/inv3-man.png",
  "assets/heads/inv4.png",
  "assets/heads/inv5.png",
  "assets/heads/inv6.png",
  "assets/heads/inv7.png",
  "assets/heads/inv8.png",
  "assets/heads/inv9.png",
  "assets/heads/inv10.png",
  "assets/heads/inv11.png",
  "assets/heads/inv12.png",
  "assets/heads/inv13.png",
  "assets/heads/inv14.png",
  "assets/heads/inv15.png",
  "assets/heads/inv16.png"
];

function drawHeads() {
  const canvas = document.getElementById("bgCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const count = 20; // number of heads

  for (let i = 0; i < count; i++) {
    const img = new Image();
    img.src = headImages[Math.floor(Math.random() * headImages.length)];

    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 100 + 50; // 50–150px
    const angle = Math.random() * Math.PI * 2; // random rotation

    img.onload = () => {
      ctx.save(); // save current canvas state
      ctx.translate(x + size / 2, y + size / 2); // move to center of image
      ctx.rotate(angle); // apply rotation
      ctx.globalAlpha = 0.8;
      ctx.drawImage(img, -size / 2, -size / 2, size, size); // draw rotated
      ctx.restore(); // restore canvas state
    };
  }
}

window.addEventListener("load", drawHeads);
window.addEventListener("resize", drawHeads);


/* ===============================
   IMAGE PRELOAD (returns Promise resolving to loaded images array)
   =============================== */
function preloadHeads(list) {
  return new Promise((resolve) => {
    if (!Array.isArray(list) || list.length === 0) return resolve([]);

    const loaded = [];
    let completed = 0;

    list.forEach((src) => {
      const img = new Image();
      img.onload = () => {
        loaded.push(img);
        completed++;
        if (completed === list.length) resolve(loaded);
      };
      img.onerror = () => {
        // still count and continue even if some fail
        completed++;
        if (completed === list.length) resolve(loaded);
      };
      img.src = src;
      // set crossOrigin in case you need to load external images with CORS
      // img.crossOrigin = 'anonymous';
    });
  });
}

/* ===============================
   DRAW: Either draw heads (if loaded) or fallback polygons
   =============================== */
function drawHeadsOrFallback(loadedHeads) {
  if (loadedHeads && loadedHeads.length > 0) {
    drawHeadsCanvas(loadedHeads);
  } else {
    // fallback to polygons if no heads loaded
    drawPolygonsFallback();
  }
}

/* ===============================
   Draw heads on canvas
   =============================== */
function drawHeadsCanvas(images) {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // handle high-DPI
  const w = window.innerWidth;
  const h = window.innerHeight;
  const dpr = window.devicePixelRatio || 1;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // clear
  ctx.clearRect(0, 0, w, h);

  // background fill (slightly darker)
  ctx.fillStyle = '#021225';
  ctx.fillRect(0, 0, w, h);

  // number of heads: scale with area but keep reasonable bounds
  const area = w * h;
  const count = Math.max(6, Math.min(28, Math.round(area / 120000))); // ~6–28 depending on size

  for (let i = 0; i < count; i++) {
    const img = images[Math.floor(Math.random() * images.length)];
    const size = Math.random() * 120 + 50; // 50–170 px
    const x = Math.random() * (w - size);
    const y = Math.random() * (h - size);
    const rot = (Math.random() - 0.5) * 0.6; // small rotation in radians
    const alpha = 0.65 + Math.random() * 0.25; // 0.65 - 0.9

    ctx.save();
    ctx.globalAlpha = alpha;

    // draw with rotation about center
    ctx.translate(x + size / 2, y + size / 2);
    ctx.rotate(rot);
    ctx.drawImage(img, -size / 2, -size / 2, size, size);

    ctx.restore();
  }
}

/* ===============================
   POLYGON FALLBACK (if heads fail)
   =============================== */
function randomDarkBlue() {
  const blues = ["#0a192f", "#112240", "#1e3a5f", "#243b53", "#102a43", "#0d1b2a", "#1b263b", "#274060"];
  return blues[Math.floor(Math.random() * blues.length)];
}

function drawPolygonsFallback() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const w = window.innerWidth;
  const h = window.innerHeight;
  const dpr = window.devicePixelRatio || 1;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  ctx.clearRect(0, 0, w, h);
  const polygonCount = 20;
  for (let i = 0; i < polygonCount; i++) {
    const sides = Math.floor(Math.random() * 5) + 3;
    const x = Math.random() * w;
    const y = Math.random() * h;
    const radius = Math.random() * 130 + 30;
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
    ctx.globalAlpha = 0.6;
    ctx.fill();
  }
}
