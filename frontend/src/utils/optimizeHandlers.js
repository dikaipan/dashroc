/**
 * Utility functions to optimize event handlers and reduce performance violations
 * Specifically optimized for Interaction to Next Paint (INP) improvements
 */

// Check for scheduler.postTask availability (better priority management)
const hasPostTask = typeof scheduler !== 'undefined' && scheduler.postTask;

/**
 * Yields to the browser using the best available API for INP optimization
 * @param {Function} callback - Function to execute after yielding
 * @param {string} priority - 'user-blocking', 'user-visible', or 'background' (for postTask)
 */
function yieldToBrowser(callback, priority = 'user-visible') {
  if (hasPostTask) {
    // Use scheduler.postTask for better priority management (Chrome 94+)
    scheduler.postTask(callback, { priority });
  } else if (typeof requestIdleCallback !== 'undefined') {
    // Use requestIdleCallback as fallback (not ideal for INP, but better than nothing)
    requestIdleCallback(callback, { timeout: 5 });
  } else {
    // Fallback to setTimeout - yield to next event loop
    setTimeout(callback, 0);
  }
}

/**
 * Optimizes click handler for better INP (Interaction to Next Paint)
 * - Immediately yields to browser to allow paint
 * - Uses scheduler.postTask if available for better priority
 * - Prevents blocking the main thread
 * 
 * @param {Function} handler - Click handler function
 * @param {Object} options - Options object
 * @param {boolean} options.urgent - If true, uses 'user-blocking' priority (default: false)
 * @param {boolean} options.preventDefault - If true, prevents default (default: true)
 * @param {boolean} options.stopPropagation - If true, stops propagation (default: false)
 * @returns {Function} Optimized click handler
 */
export function optimizeClickHandler(handler, options = {}) {
  const {
    urgent = false,
    preventDefault = true,
    stopPropagation = false
  } = options;

  return (e) => {
    if (preventDefault && e) e.preventDefault();
    if (stopPropagation && e) e.stopPropagation();
    
    // Yield immediately to allow browser to paint response
    // Use appropriate priority based on urgency
    const priority = urgent ? 'user-blocking' : 'user-visible';
    yieldToBrowser(() => {
      handler(e);
    }, priority);
  };
}

/**
 * Defers click handler execution to reduce click handler violations
 * @deprecated Use optimizeClickHandler instead for better INP
 * @param {Function} handler - Click handler function
 * @returns {Function} Optimized click handler
 */
export function deferClickHandler(handler) {
  return optimizeClickHandler(handler);
}

/**
 * Optimizes transition handler for React state updates with better INP
 * - Uses startTransition for non-urgent state updates (must be passed as parameter)
 * - Yields to browser before executing
 * - Prevents blocking interactions
 * 
 * @param {Function} transitionFn - Function that uses startTransition or sets state
 * @param {Object} options - Options object
 * @param {Function} options.startTransition - React's startTransition function (optional)
 * @returns {Function} Optimized handler
 */
export function optimizeTransitionHandler(transitionFn, options = {}) {
  const { startTransition } = options;

  return (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Yield to browser first, then execute transition
    yieldToBrowser(() => {
      if (startTransition && typeof startTransition === 'function') {
        startTransition(() => {
          transitionFn(e);
        });
      } else {
        // If startTransition not provided, execute directly
        transitionFn(e);
      }
    }, 'user-visible');
  };
}

/**
 * Defers transition handler execution to reduce violations
 * @deprecated Use optimizeTransitionHandler instead for better INP
 * @param {Function} transitionFn - Function that uses startTransition
 * @returns {Function} Optimized handler
 */
export function deferTransitionHandler(transitionFn) {
  return optimizeTransitionHandler(transitionFn);
}

/**
 * Optimizes pointer event handlers (click, tap, etc.) for better INP
 * Specifically designed for pointer interactions which are measured for INP
 * 
 * @param {Function} handler - Pointer event handler
 * @param {Object} options - Options object
 * @param {string} options.eventType - 'click', 'pointerdown', etc. (default: 'click')
 * @param {boolean} options.immediateFeedback - If true, provides immediate visual feedback (default: true)
 * @returns {Function} Optimized pointer handler
 */
export function optimizePointerHandler(handler, options = {}) {
  const {
    eventType = 'click',
    immediateFeedback = true
  } = options;

  return (e) => {
    // Provide immediate visual feedback if possible
    if (immediateFeedback && e && e.currentTarget) {
      // Add active state immediately (synchronous, lightweight)
      e.currentTarget.classList.add('active');
      // Remove active state after a brief delay (async)
      yieldToBrowser(() => {
        if (e.currentTarget) {
          e.currentTarget.classList.remove('active');
        }
      }, 'background');
    }

    // Execute handler with priority management
    yieldToBrowser(() => {
      handler(e);
    }, 'user-visible');
  };
}

