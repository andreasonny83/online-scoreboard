import { After, Before, BeforeAll, Status, AfterAll, setDefaultTimeout } from 'cucumber';
import { Builder } from 'selenium-webdriver';
import { IMPLICIT_TIMEOUT, PAGE_LOAD_TIMEOUT, SCRIPT_TIMEOUT, CUCUMBER_STEP_TIMEOUT } from './const';
import { envConfig } from '../env-keys';
import { TestRunContext } from './test-run-context';
import { Options } from 'selenium-webdriver/chrome';

BeforeAll(function() {
  setDefaultTimeout(CUCUMBER_STEP_TIMEOUT);
});

BeforeAll(async function() {
  await TestRunContext.createTestUser();
});

Before(async function() {
  try {
    const chromeOptions = new Options();

    if (envConfig.HEADLESS) {
      chromeOptions.addArguments('--headless');
    }

    this.browser = await new Builder()
      .forBrowser(envConfig.BROWSER)
      .setChromeOptions(chromeOptions)
      .build();

    TestRunContext.setBrowser(this.browser);

    await this.browser
      .manage()
      .setTimeouts({ implicit: IMPLICIT_TIMEOUT, pageLoad: PAGE_LOAD_TIMEOUT, script: SCRIPT_TIMEOUT });
  } catch (e) {
    console.log('Failed to start the browser');
    console.log(e);
    process.exit(1);
  }
});

After(async function(scenario) {
  if (scenario.result.status === Status.FAILED) {
    try {
      const screenShot = await this.browser.takeScreenshot();
      this.attach(screenShot, 'image/png');
    } catch (e) {
      console.log(e);
    }
  }

  try {
    await this.browser.quit();
  } catch (e) {
    console.log('Failed to quit the browser');
    console.log(e);
    process.exit(1);
  }
});

AfterAll(async function() {
  await TestRunContext.destroyTestUsers();
});
