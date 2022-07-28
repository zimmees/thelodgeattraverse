/* globals Botpoison */
/* eslint-env browser */
const FORM_ACTION_URL = 'https://submit-form.com';
const BOTPOISON_SRC = 'https://unpkg.com/@botpoison/browser';
const BOTPOISON_PK = 'pk_da450606-1f22-4400-a09e-7c9dfab657b2';

function insertScript(src, id) {
  return new Promise((resolve, reject) => {
    const scriptId = `script-${id}`;
    let script = document.getElementById(scriptId);
    if (!script) {
      script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(script);
      document.body.appendChild(script);
    } else {
      resolve(script);
    }
  });
}

function runBotpoison() {
  return insertScript(BOTPOISON_SRC, 'botpoison').then(() => {
    const botpoison = new Botpoison({
      publicKey: BOTPOISON_PK,
    });
    return botpoison.challenge();
  });
}

function updateForm(form, state = 'submitting') {
  form.classList.remove('--submitting', '--submitted');
  form.classList.add(`--${state}`);

  const data = Object.fromEntries(new FormData(form));

  const isLoading = state === 'submitting';
  const attrMethod = isLoading ? 'setAttribute' : 'removeAttribute';
  const fieldsets = Array.from(form.querySelectorAll('.fld__set') || []);
  fieldsets.forEach((el) => el[attrMethod]('disabled', true));

  return data;
}

function redirectToSubmittedPage(params) {
  return window.location.replace(
    `${window.location.origin}/contact-submitted?${params.toString()}`
  );
}

function init() {
  const forms = Array.from(
    document.querySelectorAll('.form[data-action]') || []
  );

  forms.forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      // Put form in loading state.
      const data = updateForm(form, 'submitting');
      const params = new URLSearchParams(data);

      // data._redirect = window.location.origin + '/contact-submitted';

      runBotpoison()
        .then(({ solution }) => {
          data._botpoison = solution;

          return fetch(`${FORM_ACTION_URL}/${form.dataset.action}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify(data),
          });
        })
        .then((response) => response.json())
        .then((data) => redirectToSubmittedPage(params))
        .catch((error) => {
          params.set('error', String(error));
          redirectToSubmittedPage(params);
        })
        .finally(() => {
          updateForm(form, 'submitted');
        });
    });
  });
}

export default init;
