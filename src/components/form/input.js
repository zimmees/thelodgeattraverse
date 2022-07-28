function init() {
  const inputs = Array.from(
    document.querySelectorAll('input, select, textarea') || []
  );
  const forms = Array.from(document.querySelectorAll('.form') || []);

  inputs.forEach((input) => {
    // Set input state as dirty the first time it is interacted with.
    input.addEventListener(
      'input',
      () => {
        if (input.dataset.dirty) return;
        input.classList.add('--dirty');
        input.dataset.dirty = true;
      },
      { once: true }
    );

    // Prevent default browser invalid messages to appear (use our own).
    input.addEventListener('invalid', (event) => {
      event.preventDefault();
    });

    // Flag whether form is valid or not.
    input.addEventListener('blur', () => {
      const form = input.form;
      if (!form) return;
      const formIsValid = form.checkValidity();
      const method = formIsValid ? 'add' : 'remove';
      form.classList[method]('--valid');
    });
  });

  // Check validity on form submit.
  forms.forEach((form) => {
    const submit = form.querySelector('[type="submit"]');
    submit.addEventListener('click', (event) => {
      form.classList.add('--dirty');

      const isValid = form.checkValidity();
      if (!isValid) {
        event.preventDefault();
        const firstInvalidInput = form.querySelector(':invalid');
        firstInvalidInput.focus();
      }
    });
  });
}

export default init;
