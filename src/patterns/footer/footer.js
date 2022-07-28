function init() {
  const copyEl = document.querySelector('.footer__copyright');
  if (copyEl) {
    copyEl.textContent = new Date().getFullYear();
  }
}

export default init;
