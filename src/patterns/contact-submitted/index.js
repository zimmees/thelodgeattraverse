function init() {
  const root = document.querySelector('.submitted__card');
  const params = new URLSearchParams(window.location.search);

  if (params.has('error')) {
    root.classList.add('--has-error');
    root.classList.remove('--loading');
    root.querySelector('#submitted-error').textContent = params.get('error');
    return;
  }

  const items = [
    {
      el: root.querySelector('#submitted-name'),
      value: params.get('first_name') || 'there',
    },
    {
      el: root.querySelector('#submitted-phone'),
      value: params.get('phone'),
    },
    {
      el: root.querySelector('#submitted-email'),
      value: params.get('email'),
    },
  ];

  items.forEach((item) => {
    if (!item.el) return;
    if (!item.value) item.value = 'None provided';
    item.el.textContent = item.value;
  });

  root.classList.remove('--loading');
}

export default init;
