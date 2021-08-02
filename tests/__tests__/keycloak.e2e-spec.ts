import * as Keycloak from "keycloak-connect";
import { Builder, Capabilities, until, WebDriver } from "selenium-webdriver";
import * as session from "express-session";

const capabilities = Capabilities.chrome();

capabilities.set("goog:chromeOptions", {
  args: [
    "--disable-gpu",
    "--headless",
    "--window-size=800,600",
    "--enable-javascript",
    "--disable-extensions",
    "--disable-dev-shm-usage",
    "--no-proxy-server",
    "--proxy-server='direct://'",
    "--proxy-bypass-list=*",
    "--no-sandbox",
  ],
});

describe("validate themes", () => {
  let driver: WebDriver;

  beforeEach(async () => {
    driver = await new Builder()
      .forBrowser("chrome")
      .withCapabilities(capabilities)
      .usingServer("http://selenium:4444/wd/hub")
      .build();
  });

  afterEach(async () => {
    await driver.quit();
  });

  test("should be able to see sign in text", async () => {
    const memoryStore = new session.MemoryStore();

    const keycloak = new Keycloak(
      { store: memoryStore },
      {
        realm: "test",
        resource: "test",
        "auth-server-url": "http://app.test:8080/auth/",
        "ssl-required": "external",
        "confidential-port": 0,
      }
    );

    const loginUrl = keycloak.loginUrl(
      "1b3497d3-9c9b-4901-b529-d1d9ac4c6a1d",
      "http://localhost:8000"
    );

    await driver.get(loginUrl);
    await driver.sleep(5000);
    await driver.wait(
      until.elementLocated({ xpath: "//h1[text()='Sign In']" })
    );
  });

  test("should be able to class name to sign in text", async () => {
    const memoryStore = new session.MemoryStore();

    const keycloak = new Keycloak(
      { store: memoryStore },
      {
        realm: "test",
        resource: "test",
        "auth-server-url": "http://app.test:8080/auth/",
        "ssl-required": "external",
        "confidential-port": 0,
      }
    );

    const loginUrl = keycloak.loginUrl(
      "1b3497d3-9c9b-4901-b529-d1d9ac4c6a1d",
      "http://localhost:8000"
    );

    await driver.get(loginUrl);
    await driver.sleep(5000);
    await driver.wait(
      until.elementLocated({
        className: "MuiTypography-root makeStyles-title-3 MuiTypography-h5",
      })
    );
  });
});
