const { test, expect } = require('@playwright/test');

test('styles look as expected', async ({ page }) => {
  const maxDiffPixelRatio = 0.001

  // Set viewport.
  page.setViewportSize({
    width: 1280,
    height: 1024
  })

  // Page banner.
  await page.goto('http://localhost:1234');
  await expect(page).toHaveScreenshot('page-banner.png', { maxDiffPixelRatio });

  // About section.
  await page.goto('http://localhost:1234#about');
  await expect(page).toHaveScreenshot('page-about.png', { maxDiffPixelRatio });

  // Services section.
  await page.goto('http://localhost:1234#services');
  await expect(page).toHaveScreenshot('page-services.png', { maxDiffPixelRatio });

  // Book section.
  await page.goto('http://localhost:1234#book');
  await expect(page).toHaveScreenshot('page-book.png', { maxDiffPixelRatio });

  // FAQ section.
  await page.goto('http://localhost:1234#faq');
  await expect(page).toHaveScreenshot('page-faq.png', { maxDiffPixelRatio });

  // Vendors section.
  await page.goto('http://localhost:1234#vendors');
  await expect(page).toHaveScreenshot('page-vendors.png', { maxDiffPixelRatio });

  // Contact section.
  await page.goto('http://localhost:1234#contact');
  await expect(page).toHaveScreenshot('page-contact.png', { maxDiffPixelRatio });

  // Footer section.
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  await expect(page).toHaveScreenshot('page-footer.png', { maxDiffPixelRatio });
})

test('faq toggle open and close', async ({ page }) => {
  await page.goto('http://localhost:1234');
  await expect(page.getByText('The Lodge has 100 white')).not.toBeVisible();
  await page.getByText('How many guests can The Lodge accommodate?').click();
  await expect(page.getByText('The Lodge has 100 white')).toBeVisible();
})

test.only('contact form', async ({ page }) => {
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
  await page.goto('http://localhost:1234#contact');

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
  const request = await requestPromise
  await page.waitForURL('http://localhost:1234/contact-submitted*');

  // Assert contact submitted page displays fields as expected.
  
})
