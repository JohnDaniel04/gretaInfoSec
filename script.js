/* ─── Screen Navigation ───────────────────────────────────────── */
function goTo(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  target.classList.add('active');

  // trigger timeline reveal when opening that screen
  if (id === 'screen-timeline') revealTimeline();

  // reset scroll position on content screens
  const inner = target.querySelector('.screen-inner');
  if (inner) inner.scrollTop = 0;
  target.scrollTop = 0;
}

/* ─── PIN Lock ────────────────────────────────────────────────── */
// The PIN is the monthsary start date: February 23 → "0223"
const CORRECT_PIN = '23';
let pinValue = '';

function pressKey(digit) {
  if (pinValue.length >= 6) return;
  pinValue += digit;
  updatePinDisplay();
}

function backspaceKey() {
  pinValue = pinValue.slice(0, -1);
  updatePinDisplay();
}

function updatePinDisplay() {
  const display = document.getElementById('pin-input-display');
  display.textContent = pinValue.length ? pinValue.split('').map(() => '●').join(' ') : ' ';
}

function checkPin() {
  if (pinValue === CORRECT_PIN) {
    document.getElementById('pin-msg').textContent = '';
    goTo('screen-hub');
    pinValue = '';
    updatePinDisplay();
  } else {
    const card = document.querySelector('.pin-card');
    card.classList.add('shake');
    document.getElementById('pin-msg').textContent = 'Try again';
    setTimeout(() => {
      card.classList.remove('shake');
      document.getElementById('pin-msg').textContent = '';
    }, 500);
    pinValue = '';
    updatePinDisplay();
  }
}

// Keyboard support on lock screen
document.addEventListener('keydown', (e) => {
  const lockActive = document.getElementById('screen-lock').classList.contains('active');
  if (!lockActive) return;
  if (e.key >= '0' && e.key <= '9') pressKey(e.key);
  else if (e.key === 'Backspace') backspaceKey();
  else if (e.key === 'Enter') checkPin();
});

/* ─── Lightbox ────────────────────────────────────────────────── */
let lbItems = [], lbIdx = 0;

function openLightbox(item) {
  lbItems = Array.from(document.querySelectorAll('.m-item'));
  lbIdx   = lbItems.indexOf(item);
  showLb(lbIdx);
  document.getElementById('lightbox').classList.add('active');
}

function showLb(i) {
  const item    = lbItems[i];
  const type    = item.getAttribute('data-type') || 'image';
  const caption = item.getAttribute('data-caption') || '';
  const lbImg   = document.getElementById('lb-img');
  const lbVid   = document.getElementById('lb-video');
  const lbSrc   = document.getElementById('lb-video-src');

  // stop any playing video first
  lbVid.pause();
  lbVid.removeAttribute('src');
  lbSrc.src = '';
  lbVid.load();

  if (type === 'video') {
    const src = item.getAttribute('data-src');
    lbSrc.src = src;
    lbVid.load();
    lbVid.style.display = 'block';
    lbImg.style.display = 'none';
  } else {
    lbImg.src = item.querySelector('img').src;
    lbImg.style.display = 'block';
    lbVid.style.display = 'none';
  }

  document.getElementById('lb-cap').textContent = caption;
}

function shiftLightbox(dir) {
  lbIdx = (lbIdx + dir + lbItems.length) % lbItems.length;
  showLb(lbIdx);
}

function closeLightbox() {
  const lbVid = document.getElementById('lb-video');
  lbVid.pause();
  document.getElementById('lightbox').classList.remove('active');
}

document.addEventListener('keydown', (e) => {
  if (!document.getElementById('lightbox').classList.contains('active')) return;
  if (e.key === 'ArrowRight') shiftLightbox(1);
  if (e.key === 'ArrowLeft')  shiftLightbox(-1);
  if (e.key === 'Escape')     closeLightbox();
});

/* Touch swipe on lightbox */
(function () {
  let tx = 0;
  const lb = document.getElementById('lightbox');
  lb.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) shiftLightbox(dx < 0 ? 1 : -1);
  }, { passive: true });
})();

/* ─── Timeline Reveal ─────────────────────────────────────────── */
function revealTimeline() {
  const items = document.querySelectorAll('.tl-item[data-tl]');
  items.forEach((item, i) => {
    setTimeout(() => item.classList.add('vis'), i * 200);
  });
}

/* ─── Flip Cards ──────────────────────────────────────────────── */
function flipCard(card) { card.classList.toggle('flipped'); }
