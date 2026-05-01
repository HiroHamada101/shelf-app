/** Holds native Firebase confirmation result between phone -> OTP screens. */

let pendingConfirmation = null;

export function setPendingPhoneSession(confirmation) {
  pendingConfirmation = confirmation ?? null;
}

export function getPendingPhoneSession() {
  return pendingConfirmation;
}

export function clearPendingPhoneSession() {
  pendingConfirmation = null;
}
