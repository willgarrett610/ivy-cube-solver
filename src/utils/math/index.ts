export const RAD_TO_DEG = 180 / Math.PI;
export const DEG_TO_RAD = Math.PI / 180;

/**
 * Clamps a number between a minimum and maximum value.
 * @param value
 * @param min minimum value
 * @param max maximum value
 * @returns
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Normalizes a value within a range.
 * If it is outside the range, null is returned.
 * If it is inside the range, a value between 0 and 1 is returned.
 * 0 is returned if the value is equal to the minimum value.
 * 1 is returned if the value is equal to the maximum value.
 * Linearly maps the value to the 0-1 range if it is within the range.
 *
 * @param value
 * @param min minimum value
 * @param max maximum value
 * @returns
 */
export function normalizeWithinRange(
  value: number,
  min: number,
  max: number,
): number | null {
  if (value < min || value > max) {
    return null; // Value is not in range
  }

  return (value - min) / (max - min); // Linearly map to 0-1 range
}

/**
 * Linearly interpolates between two numbers.
 * @param a
 * @param b
 * @param t value between 0 and 1
 * @returns
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Linearly interpolates between two angles in degrees.
 * @param a degrees
 * @param b degrees
 * @param t value between 0 and 1
 * @returns degrees
 */
export function lerpAngle(a: number, b: number, t: number): number {
  return a + angleDifference(b, a) * t;
}

/**
 * Returns the difference between two angles in degrees.
 * @param a degrees
 * @param b degrees
 * @returns degrees
 */
export function angleDifference(a: number, b: number): number {
  const diff = b - a;
  return ((diff + 180) % 360) - 180;
}

/**
 * Returns the mod.
 * @param a
 * @param b
 * @returns
 */
export function mod(a: number, b: number): number {
  return ((a % b) + b) % b;
}
