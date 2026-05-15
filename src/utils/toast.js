/**
 * Toast notification system
 * No external dependencies — pure DOM injection.
 */

let _container = null;

function getContainer() {
  if (!_container) {
    _container = document.createElement('div');
    _container.id = 'toast-container';
    _container.className = 'toast-container';
    document.body.appendChild(_container);
  }
  return _container;
}

/**
 * Show a toast notification.
 * @param {string} message  - HTML or text message
 * @param {'error'|'success'|'info'|'warning'} type
 * @param {number} duration - ms before auto-dismiss (default 4000)
 */
export function showToast(message, type = 'info', duration = 4000) {
  const container = getContainer();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icons = { error: '✕', success: '✓', info: 'ℹ', warning: '⚠' };
  toast.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ'}</span><span class="toast-msg">${message}</span>`;

  container.appendChild(toast);

  // Trigger enter animation on next frame
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('toast-visible'));
  });

  const dismiss = () => {
    toast.classList.remove('toast-visible');
    toast.classList.add('toast-exit');
    toast.addEventListener('animationend', () => {
      toast.remove();
    }, { once: true });
  };

  const timer = setTimeout(dismiss, duration);

  // Allow click to dismiss early
  toast.addEventListener('click', () => {
    clearTimeout(timer);
    dismiss();
  });
}
