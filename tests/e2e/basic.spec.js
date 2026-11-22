import { test, expect } from '@playwright/test';

test.describe('BilahBeu AI E2E Production Flows', () => {
  test('should load landing page, navigate to Chatbot, and get a response (online or offline brain)', async ({ page }) => {
    await page.goto('/');

    const brand = page.locator('.sidebar__app-name');
    await expect(brand).toBeVisible();
    await expect(brand).toHaveText('BilahBeu AI');

    const heroTitle = page.locator('h1');
    await expect(heroTitle).toBeVisible();

    const chatbotLink = page.locator('.sidebar__nav-item[aria-label="Chatbot"]');
    await expect(chatbotLink).toBeVisible();
    await chatbotLink.click();

    await expect(page).toHaveURL(/\/chatbot/);

    const chatbotHeader = page.locator('.chatbot-header__title');
    await expect(chatbotHeader).toBeVisible();
    await expect(chatbotHeader).toHaveText('Chatbot BilahBeu');

    const composerInput = page.locator('.chatbot-composer__input');
    await expect(composerInput).toBeVisible();
    await expect(composerInput).toHaveAttribute('placeholder', 'Tanya cara memilah sampah...');

    const testMessage = 'Bagaimana cara mendaur ulang botol plastik bekas?';
    await composerInput.fill(testMessage);

    const sendButton = page.locator('.chatbot-composer button[type="submit"]');
    await expect(sendButton).toBeEnabled();
    await sendButton.click();

    const userMessageBubble = page.locator('.chatbot-message--user .chatbot-message__bubble').last();
    await expect(userMessageBubble).toBeVisible();
    await expect(userMessageBubble).toHaveText(testMessage);

    const assistantBubbles = page.locator('.chatbot-message--assistant .chatbot-message__bubble');
    await expect(assistantBubbles).toHaveCount(2, { timeout: 15000 });
  });

  test('should show location denied alert AND allow browsing all waste banks without GPS', async ({ browser }) => {
    const context = await browser.newContext({ permissions: [] });
    const page = await context.newPage();

    await page.goto('/bank-sampah');

    await expect(
      page
        .getByRole('alert')
        .getByText('Lokasi tidak dapat diakses. Izinkan akses lokasi untuk mencari bank sampah terdekat.', {
          exact: true,
        })
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Coba lagi' })).toBeVisible();

    await page.getByRole('button', { name: 'Jelajahi Semua Bank Sampah' }).click();
    const bankList = page.getByRole('list', { name: 'Daftar bank sampah' });
    await expect(bankList).toBeVisible();
    expect(await bankList.getByRole('listitem').count()).toBeGreaterThan(5);

    await context.close();
  });

  test('should show accessible nearby waste bank list and Google Maps directions', async ({ page }) => {
    await page.context().grantPermissions(['geolocation'], { origin: 'http://localhost:5173' });
    await page.context().setGeolocation({ latitude: -6.976, longitude: 108.483 });

    await page.goto('/');

    const wasteBankLink = page.locator('.sidebar__nav-item[aria-label="Bank Sampah"]');
    await expect(wasteBankLink).toBeVisible();
    await wasteBankLink.click();

    await expect(page).toHaveURL(/\/bank-sampah/);
    const bankList = page.getByRole('list', { name: 'Daftar bank sampah' });
    await expect(bankList).toBeVisible();
    expect(await bankList.getByRole('listitem').count()).toBeGreaterThan(5);

    const firstDirectionLink = bankList.getByRole('link', { name: /Lihat rute ke/i }).first();
    await expect(firstDirectionLink).toHaveAttribute('href', /https:\/\/www\.google\.com\/maps\/dir\/\?api=1&destination=/);
    await expect(firstDirectionLink).toHaveAttribute('target', '_blank');
  });

  test('should complete Instant Try demo sample scan end-to-end into Result and DampakKu', async ({ page }) => {
    await page.goto('/scan');
    await expect(page.getByRole('heading', { name: 'Coba Contoh Sampah' })).toBeVisible();

    await page.getByRole('button', { name: /Coba sampel Botol Plastik PET/i }).click();
    const analyzeBtn = page.getByRole('button', { name: /Analisis gambar dengan AI/i });
    await expect(analyzeBtn).toBeVisible();
    await analyzeBtn.click();

    await expect(page).toHaveURL(/\/result\//, { timeout: 25000 });
    await expect(page.getByRole('heading', { name: 'Hasil Klasifikasi' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Tanya AI tentang Sampah Ini/i })).toBeVisible();

    await page.goto('/dampak');
    await expect(page.getByRole('heading', { name: 'DampakKu' })).toBeVisible();
  });

  test('should play Eco Challenge quiz and show 404 for unknown routes', async ({ page }) => {
    await page.goto('/tantangan');
    await expect(page.getByRole('heading', { name: 'Eco Challenge' })).toBeVisible();
    await page.getByRole('button', { name: 'Mulai Tantangan' }).click();
    await expect(page.getByText('Soal 1 / 10')).toBeVisible();

    await page.goto('/halaman-tidak-ditemukan-404');
    await expect(page.getByRole('heading', { name: 'Halaman Tidak Ditemukan' })).toBeVisible();
  });

  test('should navigate cleanly on mobile via bottom nav and mobile drawer', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'geolocation', {
        configurable: true,
        value: {
          getCurrentPosition: (_success, error) => error({ code: 1 }),
        },
      });
    });

    await page.goto('/');

    const wasteBankLink = page.locator('.bottom-nav__item[aria-label="Bank Sampah"]');
    await expect(wasteBankLink).toBeVisible();
    await wasteBankLink.click();

    await expect(page).toHaveURL(/\/bank-sampah/);
    await expect(page.getByRole('heading', { name: 'Bank Sampah Terdekat' })).toBeVisible();

    await page.getByRole('button', { name: 'Buka menu navigasi' }).click();
    await page.locator('#mobile-nav-drawer').getByRole('link', { name: 'Panduan' }).click();
    await expect(page).toHaveURL(/\/guide/);
    await expect(page.getByRole('heading', { name: 'Cara Menggunakan' })).toBeVisible();
  });
});
