// Haptic feedback for party game interactions
// Falls back silently on devices that don't support vibration

export function hapticTap() {
  navigator.vibrate?.(10);
}

export function hapticSuccess() {
  navigator.vibrate?.([50, 30, 50]);
}

export function hapticBuzz() {
  navigator.vibrate?.([200, 100, 200]);
}
