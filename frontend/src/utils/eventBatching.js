// src/utils/eventBatching.js
// Utility to batch multiple event dispatches to reduce performance overhead

let eventQueue = [];
let batchTimeout = null;
const BATCH_DELAY = 50; // Batch events within 50ms

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
      // Use requestIdleCallback if available for non-critical events
      const dispatch = () => {
        window.dispatchEvent(new Event(eventName));
      };
      
      if (window.requestIdleCallback) {
        window.requestIdleCallback(dispatch, { timeout: 100 });
      } else {
        requestAnimationFrame(dispatch);
      }
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

