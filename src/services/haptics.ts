/**
 * Vibration API wrapper with safe fallbacks
 */
export function triggerHaptic(
  pattern: number | number[] = 15,
  enabled: boolean = true
) {
  if (!enabled || typeof window === 'undefined' || !('vibrate' in navigator)) {
    return;
  }
  try {
    navigator.vibrate(pattern);
  } catch {
    // Fail silently if vibration is blocked by browser policy
  }
}

export const HAPTIC_PATTERNS = {
  select: 12,
  drop: 20,
  blocked: [30, 40, 30],
  seal: [25, 40, 35],
  win: [40, 60, 40, 60, 80],
};
