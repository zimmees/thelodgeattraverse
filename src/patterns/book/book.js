function init() {
  const wraps = Array.from(document.querySelectorAll('.book__iframe') || []);

  if (!wraps?.length) return;

  wraps.forEach((wrap) => {
    const btn = wrap.querySelector('.btn');
    const iframe = wrap.querySelector('iframe');
    btn.addEventListener('click', () => {
      /* eslint-disable no-self-assign */
      iframe.src = iframe.src;
      /* eslint-enable no-self-assign */
    });
  });
}

export default init;
