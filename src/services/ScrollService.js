// Smooth requestAnimationFrame-based scrolling
function easeInOutQuint(t) {
    return t < 0.5
        ? 16 * t ** 5
        : 1 - Math.pow(-2 * t + 2, 5) / 2;
}

function getScrollY() {
    return window.scrollY;
}

let scrollRunId = 0;

let smoothScroller = null;

export function registerSmoothScroll(instance) {
    smoothScroller = instance;
}

export function unregisterSmoothScroll(instance) {
    if (smoothScroller === instance) smoothScroller = null;
}

function getHeaderOffset() {
    const header =
        document.querySelector("[data-site-header]") ||
        document.querySelector("header");
    return header ? header.getBoundingClientRect().bottom : 88;
}

function runRafScroll(runId, startY, distance, duration) {
    const startTime = performance.now();

    function step(timestamp) {
        if (runId !== scrollRunId) return;
        const progress = Math.min((timestamp - startTime) / duration, 1);

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

export function animateScrollTo(elementId, duration = 1450) {
    const runId = ++scrollRunId;

    function attempt(elapsed) {
        if (runId !== scrollRunId) return;

        const target = document.getElementById(elementId);
        if (!target) {
            if (elapsed >= 1200) return;
            setTimeout(() => attempt(elapsed + 100), 100);
            return;
        }

        const startY = getScrollY();

        const targetY =
            target.getBoundingClientRect().top + startY;

        const offset = getHeaderOffset();
        const distance = targetY - startY - offset;

        if (Math.abs(distance) < 5) return;

        if (smoothScroller) {
            smoothScroller.scrollTo(target, {
                offset: -offset,
                duration: duration / 1000,
                easing: easeInOutQuint,
            });
            return;
        }

        runRafScroll(runId, startY, distance, duration);
    }

    attempt(0);
}

export function animateScrollToTop(duration = 1300) {
    const runId = ++scrollRunId;
    const startY = getScrollY();

    if (startY === 0) return;

    if (smoothScroller) {
        smoothScroller.scrollTo(0, {
            duration: duration / 1000,
            easing: easeInOutQuint,
        });
        return;
    }

    runRafScroll(runId, startY, -startY, duration);
}

export function animateScrollToBottom(duration = 1300) {
    const runId = ++scrollRunId;
    const startY = getScrollY();
    const maxY = document.documentElement.scrollHeight - window.innerHeight;

    if (maxY <= startY) return;

    if (smoothScroller) {
        smoothScroller.scrollTo(maxY, {
            duration: duration / 1000,
            easing: easeInOutQuint,
        });
        return;
    }

    runRafScroll(runId, startY, maxY - startY, duration);
}