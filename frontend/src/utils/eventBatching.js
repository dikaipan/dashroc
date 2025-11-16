// src/utils/eventBatching.js
// Utility to batch multiple event dispatches to reduce performance overhead

let eventQueue = [];
let batchTimeout = null;
const BATCH_DELAY = 50; // Batch events within 50ms

// Check for scheduler.postTask availability (better priority management)
const hasPostTask = typeof scheduler !== 'undefined' && scheduler.postTask;

/**
 * Yields to browser using the best available API
 * @param {Function} callback - Function to execute after yielding
 * @param {string} priority - Priority level for postTask
 */
function yieldToBrowser(callback, priority = 'user-visible') {
  if (hasPostTask) {
    // Use scheduler.postTask for better priority management (Chrome 94+)
    scheduler.postTask(callback, { priority });
  } else if (typeof requestIdleCallback !== 'undefined') {
    // Use requestIdleCallback as fallback
    requestIdleCallback(callback, { timeout: 100 });
  } else {
    // Fallback to setTimeout
    setTimeout(callback, 0);
  }
}

/**
 * Batches event dispatches to prevent performance violations
 * Multiple events of the same type within BATCH_DELAY will be merged into one
 * 
 * @param {string} eventName - Event name to dispatch
 * @param {Object} eventData - Optional event data
 */
export function batchedDispatchEvent(eventName, eventData = null) {
  // Add to queue
  eventQueue.push({ eventName, eventData, timestamp: Date.now() });
  
  // Clear existing timeout
  if (batchTimeout) {
    clearTimeout(batchTimeout);
  }
  
  // Schedule batch dispatch
  batchTimeout = setTimeout(() => {
    // Group events by name
    const eventGroups = {};
    eventQueue.forEach(event => {
      if (!eventGroups[event.eventName]) {
        eventGroups[event.eventName] = [];
      }
      eventGroups[event.eventName].push(event);
    });
    
    // Dispatch each unique event type only once
    Object.keys(eventGroups).forEach(eventName => {
      const events = eventGroups[eventName];
      // Use scheduler.postTask for better performance and priority management
      const dispatch = () => {
        window.dispatchEvent(new Event(eventName));
      };
      
      // Use yieldToBrowser which prefers scheduler.postTask
      yieldToBrowser(dispatch, 'user-visible');
    });
    
    // Clear queue
    eventQueue = [];
    batchTimeout = null;
  }, BATCH_DELAY);
}

/**
 * Immediately dispatch an event (for critical events)
 * @param {string} eventName - Event name to dispatch
 */
export function immediateDispatchEvent(eventName) {
  window.dispatchEvent(new Event(eventName));
}

