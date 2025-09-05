/**
 * Message ID Generator
 * Generates unique message IDs to prevent React key conflicts
 */

let messageCounter = 0;
let lastTimestamp = 0;

export function generateUniqueMessageId(): string {
  let timestamp = Date.now();

  // Ensure timestamp is always unique by incrementing if same as last
  if (timestamp <= lastTimestamp) {
    timestamp = lastTimestamp + 1;
  }
  lastTimestamp = timestamp;

  const random1 = Math.random().toString(36).substr(2, 9);
  const random2 = Math.random().toString(36).substr(2, 5);
  const random3 = Math.random().toString(36).substr(2, 3);
  const counter = ++messageCounter;
  const performanceNow = performance.now().toString().replace(".", "");

  return `msg-${timestamp}-${counter}-${random1}-${random2}-${random3}-${performanceNow}`;
}

export function generateMessageIdWithPrefix(prefix: string = ""): string {
  let timestamp = Date.now();

  // Ensure timestamp is always unique by incrementing if same as last
  if (timestamp <= lastTimestamp) {
    timestamp = lastTimestamp + 1;
  }
  lastTimestamp = timestamp;

  const random1 = Math.random().toString(36).substr(2, 9);
  const random2 = Math.random().toString(36).substr(2, 5);
  const random3 = Math.random().toString(36).substr(2, 3);
  const counter = ++messageCounter;
  const performanceNow = performance.now().toString().replace(".", "");

  return `${prefix}msg-${timestamp}-${counter}-${random1}-${random2}-${random3}-${performanceNow}`;
}
