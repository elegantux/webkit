function toHex(number: number) {
  return number.toString(16).padStart(2, '0');
}

/**
 * Given a hex string color and opacity as a fraction (e.g. 0.25 for 25% transparent), return a hex
 * string representing the color at the requested opacity. Optionally, transparency can be removed
 * by blending on a solid white background.
 * For example, calling `hexColor('#FFFFFF', 0.25)` will return the string `#FFFFFF40`.
 */
export function hexOpacity(hexColor: string, opacityFraction: number, preserveTransparency = true) {
  if (preserveTransparency) {
    const opacityString = toHex(Math.floor(255 * opacityFraction));
    return `${hexColor}${opacityString}`;
  }

  // Extract channels.
  const r = parseInt(hexColor.substring(1, 3), 16);
  const g = parseInt(hexColor.substring(3, 5), 16);
  const b = parseInt(hexColor.substring(5, 7), 16);

  // Mix on white.
  // @see https://github.com/Qix-/color/blob/master/index.js#L364
  const weight = 2 * opacityFraction - 1;
  const w1 =
    ((weight * opacityFraction === -1 ? weight : (weight + opacityFraction) / (1 + weight * opacityFraction)) + 1) / 2;
  const w2 = 1 - w1;

  const result = {
    r: Math.floor(w2 * 255 + w1 * r),
    g: Math.floor(w2 * 255 + w1 * g),
    b: Math.floor(w2 * 255 + w1 * b),
  };
  return `#${toHex(result.r)}${toHex(result.g)}${toHex(result.b)}`;
}
