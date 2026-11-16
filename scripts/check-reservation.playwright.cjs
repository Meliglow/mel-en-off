async (page) => {
  const base = 'http://127.0.0.1:4181';
  const failures = [];
  const errors = [];
  const mutations = [];
  const check = (condition, message) => { if (!condition) failures.push(message); };
  const onError = (error) => errors.push(error.message);
  const onRequest = (request) => { if (request.method() !== 'GET') mutations.push(request.method() + ' ' + request.url()); };
  page.on('pageerror', onError);
  page.on('request', onRequest);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const routes = ['/', '/liens', '/logiciel-reservation', '/demos/specialiste', '/demos/institut', '/demos/maquillage'];
  for (const route of routes) {
    const response = await page.goto(base + route);
    check(response.status() === 200, `${route}: HTTP ${response.status()}`);
    await page.evaluate(() => document.fonts.ready);
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 950 });
      const metrics = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth, broken: [...document.images].filter(image => image.complete && !image.naturalWidth).map(image => image.src) }));
      check(metrics.scroll <= metrics.width + 1, `${route}: overflow at ${width}: ${metrics.scroll}`);
      check(metrics.broken.length === 0, `${route}: broken images ${metrics.broken.join(',')}`);
    }
    if (route === '/logiciel-reservation') {
      check(await page.locator('h1').count() === 1, 'Offer: one h1');
      check(await page.locator('.model a[target="_blank"]').count() === 6, 'Offer: all model links open separately');
      await page.locator('#monthly-cost').fill('80');
      check((await page.locator('#annual-cost').innerText()).includes('960'), 'Calculator: 80 × 12');
      await page.locator('#monthly-cost').fill('-1');
      check((await page.locator('#annual-cost').innerText()).startsWith('—'), 'Calculator: reject negative amount');
      await page.locator('#monthly-cost').fill('');
      await page.locator('.offer-faq-list summary').first().click();
      check(await page.locator('.offer-faq-list details').first().evaluate(element => element.open), 'FAQ: opens');
      await page.locator('.offer-faq-list summary').first().click();
      await page.setViewportSize({ width: 390, height: 844 });
      await page.screenshot({ path: 'previews/reservation-mobile.png', fullPage: true });
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.screenshot({ path: 'previews/reservation-full.png', fullPage: true });
    }
  }
  for (const model of ['specialiste', 'institut', 'maquillage']) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}/demos/${model}`);
    check(await page.locator('#to-date').isDisabled(), `${model}: cannot continue without a service`);
    check(await page.locator('[data-step="2"]').isDisabled(), `${model}: future steps locked`);
    await page.locator('.customizer summary').click();
    await page.locator('#brand-name').fill('<b>Ma beauté</b>');
    check(await page.locator('[data-brand]').first().innerText() === '<b>Ma beauté</b>', `${model}: custom name escaped`);
    check(await page.locator('[data-brand] b').count() === 0, `${model}: no HTML injection`);
    await page.locator('#brand-color').selectOption('#242426');
    check(await page.locator('body').evaluate(element => getComputedStyle(element).getPropertyValue('--accent').trim()) === '#242426', `${model}: custom color`);
    await page.locator('#brand-image').setInputFiles('previews/melnourdi-v1/assets/institut.jpg');
    await page.waitForFunction(() => document.querySelector('#brand-photo').src.startsWith('blob:'));
    await page.locator('#reset-brand').click();
    check(!(await page.locator('#brand-photo').getAttribute('src')).startsWith('blob:'), `${model}: photo reset`);
    await page.locator('.customizer summary').click();
    await page.locator('input[name="service"]').first().check();
    if (model === 'institut') {
      await page.locator('input[name="service"]').nth(1).check();
      check((await page.locator('#summary-price').innerText()).includes('37'), 'Institut: 12 + 25 = 37');
      check((await page.locator('#summary-duration').innerText()).includes('45'), 'Institut: combined duration 45');
    }
    await page.locator('#to-date').click();
    check(await page.locator('#to-details').isDisabled(), `${model}: cannot continue without a slot`);
    await page.locator('.day-button[aria-label^="dimanche"]').click();
    check(await page.locator('#slot-empty').isVisible(), `${model}: Sunday empty state`);
    check(await page.locator('#to-details').isDisabled(), `${model}: no Sunday reservation`);
    await page.locator('.day-button:not([aria-label^="dimanche"])').first().click();
    check(await page.locator('.slot-button:disabled').count() > 0, `${model}: unavailable slots disabled`);
    await page.locator('.slot-button:not(:disabled)').first().click();
    await page.locator('#next-week').click();
    check(await page.locator('#to-details').isDisabled(), `${model}: week change clears prior slot`);
    await page.locator('#previous-week').click();
    check(await page.locator('#previous-week').isDisabled(), `${model}: no past week`);
    await page.locator('.day-button:not([aria-label^="dimanche"])').first().click();
    await page.locator('.slot-button:not(:disabled)').first().click();
    await page.locator('#to-details').click();
    await page.locator('#client-email').fill('invalide');
    await page.locator('#demo-consent').check();
    await page.locator('#details-form button[type="submit"]').click();
    check(await page.locator('[data-panel="2"]').isVisible(), `${model}: invalid email rejected`);
    await page.locator('#client-email').fill('camille@example.com');
    await page.locator('#demo-consent').uncheck();
    await page.locator('#details-form button[type="submit"]').click();
    check(await page.locator('[data-panel="2"]').isVisible(), `${model}: demo acknowledgement required`);
    await page.locator('#demo-consent').check();
    await page.locator('#first-name').fill('   ');
    await page.locator('#details-form button[type="submit"]').click();
    check(await page.locator('[data-panel="2"]').isVisible(), `${model}: whitespace name rejected`);
    await page.locator('#first-name').fill('Camille <img src=x>');
    await page.locator('#details-form button[type="submit"]').click();
    check(await page.locator('[data-panel="3"]').isVisible(), `${model}: full flow completes`);
    check(await page.locator('#confirmation-copy img').count() === 0, `${model}: confirmation safely renders text`);
    check((await page.locator('#confirmation-copy').innerText()).includes('Camille <img src=x>'), `${model}: name preserved as text`);
    check(await page.locator('#confirmation-title').evaluate(element => element === document.activeElement), `${model}: focus on new heading`);
    check(await page.evaluate(() => localStorage.length === 0 && sessionStorage.length === 0), `${model}: no local persistence`);
    await page.locator('#restart-demo').click();
    check(await page.locator('#to-date').isDisabled(), `${model}: restart resets selection`);
    check(await page.locator('#client-note').inputValue() === '', `${model}: restart clears details`);
    await page.screenshot({ path: `previews/demo-${model}-mobile.png`, fullPage: true });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `previews/demo-${model}-desktop.png`, fullPage: true });
  }
  check(errors.length === 0, `JavaScript errors: ${errors.join(' | ')}`);
  check(mutations.length === 0, `Unexpected writes: ${mutations.join(' | ')}`);
  page.off('pageerror', onError); page.off('request', onRequest);
  return { passed: failures.length === 0, failures, routes: routes.length, widths: [320, 390, 768, 1024, 1440], flows: 3, scriptErrors: errors, networkWrites: mutations };
}
