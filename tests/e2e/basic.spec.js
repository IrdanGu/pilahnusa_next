import { test, expect } from '@playwright/test';

test.describe('PilahNusa AI E2E Basic Flow', () => {
  test('should load landing page, navigate to Chatbot, and interact with the chat composer', async ({ page }) => {
    // 1. Visit the home page
    await page.goto('/');

    // 2. Verify that the home page has loaded correctly by checking the main logo / brand text
    const brand = page.locator('.sidebar__app-name');
    await expect(brand).toBeVisible();
    await expect(brand).toHaveText('PilahNusa AI');

    // Also assert the greeting text in the main content
    const heroTitle = page.locator('h1');
    await expect(heroTitle).toBeVisible();

    // 3. Navigate to the Chatbot page by clicking the Sidebar item
    const chatbotLink = page.locator('.sidebar__nav-item[aria-label="Chatbot"]');
    await expect(chatbotLink).toBeVisible();
    await chatbotLink.click();

    // 4. Verify that we have successfully navigated to /chatbot
    await expect(page).toHaveURL(/\/chatbot/);

    // 5. Verify the Chatbot page headers and components
    const chatbotHeader = page.locator('.chatbot-header__title');
    await expect(chatbotHeader).toBeVisible();
    await expect(chatbotHeader).toHaveText('Chatbot PilahNusa');

    // 6. Locate the input composer
    const composerInput = page.locator('.chatbot-composer__input');
    await expect(composerInput).toBeVisible();
    await expect(composerInput).toHaveAttribute('placeholder', 'Tanya cara memilah sampah...');

    // 7. Type a query into the composer
    const testMessage = 'Bagaimana cara mendaur ulang botol plastik bekas?';
    await composerInput.fill(testMessage);

    // 8. Submit the form
    const sendButton = page.locator('.chatbot-composer button[type="submit"]');
    await expect(sendButton).toBeEnabled();
    await sendButton.click();

    // 9. Verify that the message is added to the chat logs
    const userMessageBubble = page.locator('.chatbot-message--user .chatbot-message__bubble').last();
    await expect(userMessageBubble).toBeVisible();
    await expect(userMessageBubble).toHaveText(testMessage);

    // 10. Verify that a loader/assistant bubble appears or responds
    const assistantBubble = page.locator('.chatbot-message--assistant .chatbot-message__bubble');
    await expect(assistantBubble.first()).toBeVisible();
  });

  test('should navigate to the nearest waste bank page without requiring geolocation access', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'geolocation', {
        configurable: true,
        value: {
          getCurrentPosition: (_success, error) => error({ code: 1 }),
        },
      });
    });

    await page.goto('/');

    const wasteBankLink = page.locator('.sidebar__nav-item[aria-label="Bank Sampah"]');
    await expect(wasteBankLink).toBeVisible();
    await wasteBankLink.click();

    await expect(page).toHaveURL(/\/bank-sampah/);
    await expect(page.getByRole('heading', { name: 'Bank Sampah Terdekat' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Lokasi belum tersedia' })).toBeVisible();
  });
});
