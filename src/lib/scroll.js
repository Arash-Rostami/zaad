/**
 * Ultra-luxurious custom mathematical scrolling engine.
 * Delivers a highly responsive, physical, slow-out cinematic kinematic ease motion
 * utilizing requestAnimationFrame (bypassing generic default platform scrolling).
 */
export function animateScrollTo(elementId, duration = 1450) {
  const target = document.getElementById(elementId);
  if (!target) return;

  // We find current viewport scroll state
  const startY = window.pageYOffset || document.documentElement.scrollTop;

  // We determine absolute destination position
  const rect = target.getBoundingClientRect();
  const targetY = rect.top + startY;

  // Header height offset (apprx 76px) + extra visual space for luxurious aesthetic centering
  const offset = 88;
  const distance = targetY - startY - offset;
  if (Math.abs(distance) < 5) return; // redundant near-zero actions

  const startTime = performance.now();

  /**
   * High-end custom double-sided quintic easing function.
   * Acceleration is gentle yet progressive, whereas the deceleration phase
   * features an extremely luxurious, lingering slow-tail drift to the zero vector.
   */
  function easeInOutQuint(t) {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
  }
  function animationStep(timestamp) {
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = easeInOutQuint(progress);
    window.scrollTo(0, startY + distance * ease);
    if (progress < 1) {
      requestAnimationFrame(animationStep);
    }
  }
  requestAnimationFrame(animationStep);
}

/**
 * Ultra-luxurious custom math-based back-to-top scrolling engine.
 */
export function animateScrollToTop(duration = 1300) {
  const startY = window.pageYOffset || document.documentElement.scrollTop;
  if (startY === 0) return;
  const startTime = performance.now();
  function easeInOutQuint(t) {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
  }
  function animationStep(timestamp) {
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = easeInOutQuint(progress);
    window.scrollTo(0, startY * (1 - ease));
    if (progress < 1) {
      requestAnimationFrame(animationStep);
    }
  }
  requestAnimationFrame(animationStep);
}
