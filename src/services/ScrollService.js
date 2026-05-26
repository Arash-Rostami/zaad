// Smooth requestAnimationFrame-based scrolling
function easeInOutQuint(t) {
  return t < 0.5
      ? 16 * t ** 5
      : 1 - Math.pow(-2 * t + 2, 5) / 2;
}

function getScrollY() {
  return window.scrollY;
}

export function animateScrollTo(elementId, duration = 1450) {
  const target = document.getElementById(elementId);
  if (!target) return;

  const startY = getScrollY();

  const targetY =
      target.getBoundingClientRect().top + startY;

  const offset = 88;
  const distance = targetY - startY - offset;

  if (Math.abs(distance) < 5) return;

  const startTime = performance.now();

  function step(timestamp) {
    const progress = Math.min(
        (timestamp - startTime) / duration,
        1
    );

    window.scrollTo({
      top: startY + distance * easeInOutQuint(progress),
      behavior: 'auto',
    });

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

export function animateScrollToTop(duration = 1300) {
  const startY = getScrollY();

  if (startY === 0) return;

  const startTime = performance.now();

  function step(timestamp) {
    const progress = Math.min(
        (timestamp - startTime) / duration,
        1
    );

    window.scrollTo({
      top: startY * (1 - easeInOutQuint(progress)),
      behavior: 'auto',
    });

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}