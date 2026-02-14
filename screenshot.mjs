import { chromium } from 'playwright';

const BASE = 'http://localhost:5199/roundhouse/';

const DEVICE = { name: 'iphone16', width: 393, height: 852, scale: 3 };

async function snap(page, name) {
  await page.waitForTimeout(600);
  await page.screenshot({ path: `screenshots/${name}.png`, fullPage: false });
  console.log(`  captured: ${name}`);
}

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: DEVICE.width, height: DEVICE.height },
    deviceScaleFactor: DEVICE.scale,
  });
  const page = await context.newPage();

  await page.goto(BASE);
  await page.waitForLoadState('networkidle');

  // 1. Welcome screen
  await snap(page, '01-welcome');

  // 2. Setup screen (empty)
  await page.locator('button', { hasText: /go/i }).click();
  await snap(page, '02-setup-empty');

  // 3. Add players
  for (const name of ['Emily', 'Alex', 'Jordan', 'Sam']) {
    await page.fill('input[name="playerName"]', name);
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(200);
  }
  await snap(page, '03-setup-players');

  // 4. Game picker
  await page.locator('button', { hasText: /start game/i }).click();
  await snap(page, '04-picker');

  // 5. Game description dropdown
  await page.locator('button', { hasText: /truth or dare/i }).first().click();
  await snap(page, '05-description');

  // 6. Pass phone
  await page.locator('button', { hasText: /play truth/i }).click();
  await snap(page, '06-pass-phone');

  // 7. Game: Truth or Dare
  await page.locator('button', { hasText: /ready/i }).click();
  await snap(page, '07-truth-or-dare');

  // 8. Pick truth
  await page.locator('button', { hasText: /^truth$/i }).first().click();
  await snap(page, '08-truth-prompt');

  // 9. Next round → pass phone → quit to picker
  await page.locator('button', { hasText: /next round/i }).click();
  await snap(page, '09-pass-phone-2');

  // Go through to game, then quit back to picker
  await page.locator('button', { hasText: /ready/i }).click();
  await page.locator('button', { hasText: /quit/i }).click();
  await snap(page, '10-picker-round2');

  // 11. Scroll the game list
  await page.evaluate(() => {
    const scrollable = document.querySelector('.scroll-fade');
    if (scrollable) scrollable.scrollTop = scrollable.scrollHeight;
  });
  await snap(page, '11-picker-scrolled');

  // 12. Hot Seat description
  await page.evaluate(() => {
    const scrollable = document.querySelector('.scroll-fade');
    if (scrollable) scrollable.scrollTop = 0;
  });
  await page.locator('button', { hasText: /hot seat/i }).first().click();
  await snap(page, '12-hotseat-desc');

  // 13-14. Play Hot Seat
  await page.locator('button', { hasText: /play hot seat/i }).click();
  await page.locator('button', { hasText: /ready/i }).click();
  await snap(page, '13-game-hotseat');

  // 15. Quit → Would You Rather
  await page.locator('button', { hasText: /quit/i }).click();
  await page.locator('button', { hasText: /would you rather/i }).first().click();
  await snap(page, '14-wyr-desc');

  // 16. Play WYR
  await page.locator('button', { hasText: /play would/i }).click();
  await page.locator('button', { hasText: /ready/i }).click();
  await snap(page, '15-game-wyr');

  // 17. Quit → Challenges
  await page.locator('button', { hasText: /quit/i }).click();
  await page.locator('button', { hasText: /challenges/i }).first().click();
  await snap(page, '16-challenges-desc');

  // 18. Play Challenges
  await page.locator('button', { hasText: /play challenges/i }).click();
  await page.locator('button', { hasText: /ready/i }).click();
  await snap(page, '17-game-challenges');

  // 19. Quit → Hot Takes
  await page.locator('button', { hasText: /quit/i }).click();
  await page.locator('button', { hasText: /hot takes/i }).first().click();
  await snap(page, '18-hottakes-desc');

  // 20. Play Hot Takes
  await page.locator('button', { hasText: /play hot takes/i }).click();
  await page.locator('button', { hasText: /ready/i }).click();
  await snap(page, '19-game-hottakes');

  // 21. Quit → Cap or Fax
  await page.locator('button', { hasText: /quit/i }).click();
  await page.locator('button', { hasText: /cap or fax/i }).first().click();
  await snap(page, '20-caporfax-desc');

  // 22. Play Cap or Fax
  await page.locator('button', { hasText: /play cap/i }).click();
  await page.locator('button', { hasText: /ready/i }).click();
  await snap(page, '21-game-caporfax');

  // 23. Quit → End Game
  await page.locator('button', { hasText: /quit/i }).click();
  await page.locator('button', { hasText: /end game/i }).click();
  await snap(page, '22-game-over');

  await context.close();
  await browser.close();
  console.log('\nAll screenshots saved to screenshots/');
}

main().catch(e => { console.error(e); process.exit(1); });
