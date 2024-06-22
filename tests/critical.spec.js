const { test, expect } = require('@playwright/test');
const options = {
  stylePath: './tests/critical.css'
}

test('page banner appears as expected', async ({ page }) => {
  await page.goto('');
  await expect(page).toHaveScreenshot('page-banner.png', options);
})

test('#about section appears as expected', async ({ page }) => {
  await page.goto('#about');
  await expect(page).toHaveScreenshot('page-about.png', options);
})

test('#services section appears as expected', async ({ page }) => {
  await page.goto('#services');
  await expect(page).toHaveScreenshot('page-services.png', options);
})

test('#book section appears as expected', async ({ page }) => {
  await page.goto('#book');
  await expect(page).toHaveScreenshot('page-book.png', options);
})

test('#faq section appears as expected', async ({ page, browserName }) => {
  const isFirefox = browserName === 'firefox';

  await page.goto('#faq');
  await expect(page).toHaveScreenshot('page-faq.png', {
    ...options,
    maxDiffPixelRatio: isFirefox ? 0.02 : 0.01,
    threshold: isFirefox ? 0.5 : 0.2
  });
})

test('#vendors section appears as expected', async ({ page }) => {
  await page.goto('#vendors');
  await expect(page).toHaveScreenshot('page-vendors.png', options);
})

test('#contact section appears as expected', async ({ page }) => {
  await page.goto('#contact');
  await expect(page).toHaveScreenshot('page-contact.png', options);
})

test('footer section appears as expected', async ({ page }) => {
  await page.goto('');
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  await expect(page).toHaveScreenshot('page-footer.png', options);
})

test('faq toggle open and close', async ({ page }) => {
  await page.goto('');
  await expect(page.getByText('The Lodge has 100 white')).not.toBeVisible();
  await page.getByText('How many guests can The Lodge accommodate?').click();
  await expect(page.getByText('The Lodge has 100 white')).toBeVisible();
})

test('contact form', async ({ page }) => {
  let count = 0;
  const formEndpoint = 'https://submit-form.com/L29wfuP2'
  const formData = {
    first_name: 'Test',
    last_name: 'Ing',
    phone: '555-555-5555',
    email: 'test@ing.com',
    email_confirm: '',
    message: 'This is a test.'
  }

  // Scroll to contact section.
  await page.goto('#contact');

  // Mock API calls to: https://submit-form.com/L29wfuP2
  await page.route(formEndpoint, async (route) => {
    count += 1;
    const postData = route.request().postData()
    expect(JSON.parse(postData)).toMatchObject(formData)
    expect(count).toEqual(1)
    await route.fulfill();
  });

  // Form does not submit if all required fields aren't filled in.
  let form = await page.locator('.contact__form')
  let formMsg = await page.locator('.form__message')
  // await expect(formMsg.height).toEqual(0)
  let height = await formMsg.evaluate((el) => {
    return window.getComputedStyle(el).getPropertyValue('height')
  });

  // Assert form error is NOT visible.
  await expect(form).not.toHaveClass(/--dirty/)
  await expect(formMsg).not.toBeVisible()

  // Submit form.
  await page.getByRole('button', { name: 'Send' }).click()

  // Assert form error IS visible.
  await expect(form).toHaveClass(/--dirty/)
  await expect(formMsg).toBeVisible()

  // Form submits if all required fields are filled in.
  await page.getByPlaceholder('First name').fill(formData.first_name)
  await page.getByPlaceholder('Last name').fill(formData.last_name)
  await page.getByPlaceholder('Phone').fill(formData.phone)
  await page.getByPlaceholder('Email').locator('visible=true').fill(formData.email)
  await page.getByPlaceholder('Message').fill(formData.message)
  const requestPromise = page.waitForRequest(formEndpoint);
  await page.getByRole('button', { name: 'Send' }).click()
  await page.waitForURL('/contact-submitted*');

  // Assert contact submitted page displays fields as expected.
  
})
