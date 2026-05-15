/**
 * Field validation utilities.
 * Works purely via CSS class toggling — no mutation of React state.
 */

/**
 * Mark a DOM element as valid or invalid.
 * @param {HTMLElement} el
 * @param {boolean} isValid
 */
export function validateField(el, isValid) {
  if (!el) return;
  el.classList.remove('field-error', 'field-valid');
  el.classList.add(isValid ? 'field-valid' : 'field-error');
}

/**
 * Clear validation styling from a DOM element.
 * @param {HTMLElement} el
 */
export function clearValidation(el) {
  if (!el) return;
  el.classList.remove('field-error', 'field-valid');
}

/**
 * Batch-validate multiple { el, isValid, label } objects.
 * @param {Array<{ el: HTMLElement, isValid: boolean, label: string }>} fields
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateForm(fields) {
  const errors = [];
  fields.forEach(({ el, isValid, label }) => {
    validateField(el, isValid);
    if (!isValid) errors.push(label);
  });
  return { valid: errors.length === 0, errors };
}
