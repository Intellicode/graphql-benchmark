// Utils for simulating async operations

/**
 * Simulates an asynchronous delay
 * @param {number} ms - milliseconds to delay
 * @returns {Promise<void>}
 */
export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Adds a variable delay based on operation complexity
 * @param {number} baseMs - base milliseconds to delay
 * @param {number} variancePercent - percentage variance (0-100)
 * @returns {Promise<void>}
 */
export const randomDelay = async (baseMs = 50, variancePercent = 50) => {
  const variance = baseMs * (variancePercent / 100);
  const delay = baseMs + (Math.random() * variance * 2 - variance);
  await sleep(delay);
};

/**
 * Adds a delay proportional to the size of the data being processed
 * @param {Array|Object} data - data to process
 * @param {number} msPerItem - milliseconds per item
 * @param {number} baseMs - minimum delay
 * @returns {Promise<void>}
 */
export const scaledDelay = async (data, msPerItem = 1, baseMs = 10) => {
  const size = Array.isArray(data) ? data.length : 1;
  const delay = baseMs + size * msPerItem;
  await sleep(delay);
};
