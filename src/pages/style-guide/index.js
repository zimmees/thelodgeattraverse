import CopyCard from '../../components/copy-card/copy-card.js';

window.customElements.define('ldg-copy-card', CopyCard);

(function () {
  const dom = {
    body: document.body,
    toggles: {
      theme: document.querySelector('.toggle--theme input'),
      rhythm: document.querySelector('.toggle--rhythm input'),
    },
  };
  const classes = {
    theme: ['dark-mode', 'light-mode'],
    rhythm: 'rhythm',
    scrolled: '--scrolled',
  };
  let scrollTimeout;

  init();

  function init() {
    // Header.
    window.addEventListener('scroll', handleScroll, false);

    // Toggles.
    dom.toggles.theme.addEventListener('change', toggleTheme);
    dom.toggles.rhythm.addEventListener('change', toggleRhythm);
    if (dom.toggles.theme.checked) toggleTheme();
    if (dom.toggles.rhythm.checked) toggleRhythm();
    if (dom.body.classList.contains(classes.theme[0]))
      dom.toggles.theme.click();
    if (dom.body.classList.contains(classes.rhythm)) dom.toggles.rhythm.click();
  }

  function handleScroll(event) {
    if (scrollTimeout) {
      window.cancelAnimationFrame(scrollTimeout);
    }

    scrollTimeout = window.requestAnimationFrame(() => {
      const method = window.scrollY >= 32 ? 'add' : 'remove';
      dom.body.classList[method](classes.scrolled);
    });
  }

  function toggleTheme() {
    const method = dom.toggles.theme.checked ? 'add' : 'remove';
    dom.body.classList[method](classes.theme[0]);
  }

  function toggleRhythm() {
    const method = dom.toggles.rhythm.checked ? 'add' : 'remove';
    dom.body.classList[method](classes.rhythm);
  }
})();
