import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import puppeteer from "puppeteer-core";

const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core/axe.min.js");

const base = process.env.QA_BASE ?? "http://localhost:3000";
const chromePath =
  process.env.CHROME_PATH ??
  "C:/Program Files/Google/Chrome/Application/chrome.exe";
const outDir = path.resolve("_screenshots");
fs.mkdirSync(outDir, { recursive: true });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const report = {
  base,
  viewportChecks: [],
  functional: [],
  accessibility: [],
  consoleErrors: [],
  pageErrors: [],
};

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const page = await browser.newPage();
page.setDefaultTimeout(20000);
page.on("console", (message) => {
  if (message.type() !== "error") return;
  const text = message.text();
  if (
    report.consoleErrors.length < 10 &&
    !report.consoleErrors.includes(text)
  ) {
    report.consoleErrors.push(text);
  }
});
page.on("pageerror", (error) => {
  const text = String(error);
  if (report.pageErrors.length < 10 && !report.pageErrors.includes(text)) {
    report.pageErrors.push(text);
  }
});

async function goto(url) {
  await page.goto(`${base}${url}`, { waitUntil: "networkidle0", timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  await sleep(500);
}

async function reduceMotion() {
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
}

async function runAxe(label) {
  await page.addStyleTag({
    content:
      "[data-reveal] { opacity: 1 !important; transform: none !important; }",
  });
  await sleep(200);
  await page.addScriptTag({ path: axePath });
  const result = await page.evaluate(async () => {
    return window.axe.run(document, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"],
      },
    });
  });

  report.accessibility.push({
    label,
    violations: result.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      help: violation.help,
      nodes: violation.nodes.slice(0, 6).map((node) => ({
        target: node.target,
        summary: node.failureSummary,
      })),
    })),
    passes: result.passes.length,
    incomplete: result.incomplete.length,
  });
}

try {
  await reduceMotion();

  // 1. Horizontal-overflow checks across representative widths.
  for (const width of [320, 375, 390, 430, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
    await goto("/");
    const layout = await page.evaluate(() => {
      const doc = document.documentElement;
      window.scrollTo(9999, 0);
      const scrollX = window.scrollX;
      window.scrollTo(0, 0);
      return {
        clientWidth: doc.clientWidth,
        scrollWidth: doc.scrollWidth,
        canScrollHorizontally: scrollX > 0,
        h1Count: document.querySelectorAll("h1").length,
        serviceCount: document.querySelectorAll('article[id^="service-"]').length,
      };
    });
    report.viewportChecks.push({ width, ...layout });
  }

  // 2. Desktop screenshots.
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
  await goto("/");
  await page.screenshot({ path: path.join(outDir, "desktop-hero.png") });
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
  await goto("/");
  await page.screenshot({ path: path.join(outDir, "desktop-1280-hero.png") });
  await page.setViewport({ width: 1024, height: 900, deviceScaleFactor: 1 });
  await goto("/");
  await page.screenshot({ path: path.join(outDir, "desktop-1024-hero.png") });
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
  await goto("/");
  await page.screenshot({
    path: path.join(outDir, "desktop-full.jpg"),
    fullPage: true,
    type: "jpeg",
    quality: 55,
  });

  const snap = async (id, name) => {
    await page.evaluate((sectionId) => {
      const target = document.getElementById(sectionId);
      window.scrollTo(0, (target?.offsetTop ?? 0) - 96);
    }, id);
    await sleep(350);
    await page.screenshot({ path: path.join(outDir, `${name}.png`) });
  };

  await snap("about", "desktop-about");
  await snap("services", "desktop-services");
  await snap("why-us", "desktop-why");
  await snap("approach", "desktop-approach");
  await page.evaluate(() => {
    const target = document.querySelector(
      'section[aria-labelledby="cta-heading"]',
    );
    window.scrollTo(0, (target?.offsetTop ?? 0) - 96);
  });
  await sleep(350);
  await page.screenshot({ path: path.join(outDir, "desktop-cta.png") });
  await snap("contact", "desktop-contact");

  // 3. Tablet and mobile screenshots.
  await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 1 });
  await goto("/");
  await page.screenshot({ path: path.join(outDir, "tablet-hero.png") });
  await page.screenshot({
    path: path.join(outDir, "tablet-full.jpg"),
    fullPage: true,
    type: "jpeg",
    quality: 55,
  });

  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await goto("/");
  await page.screenshot({ path: path.join(outDir, "mobile-hero.png") });
  await page.evaluate(() => {
    const region = document.querySelector(
      '[role="region"][aria-label="Technology showcase"]',
    );
    region?.scrollIntoView({ block: "center" });
  });
  await sleep(500);
  await page.screenshot({
    path: path.join(outDir, "mobile-hero-carousel.png"),
  });
  await snap("approach", "mobile-approach");
  await page.screenshot({
    path: path.join(outDir, "mobile-full.jpg"),
    fullPage: true,
    type: "jpeg",
    quality: 55,
  });

  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 1 });
  await goto("/");
  await page.screenshot({ path: path.join(outDir, "mobile-375-hero.png") });

  await page.setViewport({ width: 320, height: 844, deviceScaleFactor: 1 });
  await goto("/");
  await page.screenshot({ path: path.join(outDir, "mobile-320-hero.png") });

  // 4. Hero carousel behavior.
  const heroSnapshot = async () => {
    await page.evaluate(() => window.scrollTo(0, 0));
    await sleep(700);
  };

  const readTrackX = () =>
    page.evaluate(() => {
      const first = document.querySelector('ul[aria-label="Showcase items"]');
      const track = first?.parentElement;
      if (!track) return null;
      const transform = getComputedStyle(track).transform;
      return transform === "none"
        ? 0
        : new DOMMatrixReadOnly(transform).m41;
    });

  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "no-preference" },
  ]);
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
  await goto("/");
  await heroSnapshot();

  const galleryMetrics = await page.evaluate(() => {
    const region = document.querySelector(
      '[role="region"][aria-label="Technology showcase"]',
    );
    const first = document.querySelector('ul[aria-label="Showcase items"]');
    const second = first?.nextElementSibling;
    const track = first?.parentElement;
    const firstBox = first?.getBoundingClientRect();
    const secondBox = second?.getBoundingClientRect();
    const trackStyle = track ? getComputedStyle(track) : null;

    return {
      cardCount: document.querySelectorAll("[data-gallery-card]").length,
      firstAltCount: Array.from(first?.querySelectorAll("img") ?? []).filter(
        (image) => image.alt,
      ).length,
      duplicateAltCount: Array.from(
        second?.querySelectorAll("img") ?? [],
      ).filter((image) => image.alt).length,
      duplicateAriaHidden: second?.getAttribute("aria-hidden"),
      equalGroupWidths: Boolean(
        firstBox && secondBox && Math.abs(firstBox.width - secondBox.width) < 1,
      ),
      seamGap:
        firstBox && secondBox ? Math.round(secondBox.left - firstBox.right) : null,
      trackGap: trackStyle ? parseFloat(trackStyle.columnGap) : null,
      tabIndex: region?.tabIndex,
      describedBy: region?.getAttribute("aria-describedby"),
      instructions: document
        .getElementById("technology-carousel-instructions")
        ?.textContent?.trim(),
    };
  });

  const autoStart = await readTrackX();
  await sleep(900);
  const autoEnd = await readTrackX();
  await page.screenshot({
    path: path.join(outDir, "desktop-hero-carousel-live.png"),
  });

  const galleryBox = await page.$eval(
    '[role="region"][aria-label="Technology showcase"]',
    (region) => {
      const box = region.getBoundingClientRect();
      return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    },
  );
  await page.mouse.move(galleryBox.x, galleryBox.y);
  await sleep(300);
  const hoverStart = await readTrackX();
  await sleep(500);
  const hoverEnd = await readTrackX();
  await page.mouse.move(2, 2);
  await sleep(500);
  const resumed = await readTrackX();

  await page.focus(
    '[role="region"][aria-label="Technology showcase"]',
  );
  await sleep(300);
  const keyStart = await readTrackX();
  await page.keyboard.press("ArrowRight");
  await sleep(400);
  const keyEnd = await readTrackX();

  await reduceMotion();
  await goto("/");
  await heroSnapshot();
  const reducedStart = await readTrackX();
  await sleep(700);
  const reducedEnd = await readTrackX();

  report.functional.push({
    name: "Hero carousel: seamless duplicate, movement, pause and reduced motion",
    pass:
      galleryMetrics.cardCount === 8 &&
      galleryMetrics.firstAltCount === 4 &&
      galleryMetrics.duplicateAltCount === 0 &&
      galleryMetrics.duplicateAriaHidden === "true" &&
      galleryMetrics.equalGroupWidths &&
      galleryMetrics.trackGap !== null &&
      Math.abs((galleryMetrics.seamGap ?? -1) - (galleryMetrics.trackGap ?? 0)) < 1 &&
      galleryMetrics.tabIndex === 0 &&
      galleryMetrics.describedBy === "technology-carousel-instructions" &&
      Boolean(galleryMetrics.instructions) &&
      autoStart !== null &&
      autoEnd !== null &&
      Math.abs(autoEnd - autoStart) > 10 &&
      hoverStart !== null &&
      hoverEnd !== null &&
      Math.abs(hoverEnd - hoverStart) < 1 &&
      resumed !== null &&
      Math.abs(resumed - hoverEnd) > 1 &&
      keyStart !== null &&
      keyEnd !== null &&
      Math.abs(keyEnd - keyStart) > 50 &&
      reducedStart !== null &&
      reducedEnd !== null &&
      Math.abs(reducedEnd - reducedStart) < 1,
    detail: {
      ...galleryMetrics,
      autoStart,
      autoEnd,
      hoverStart,
      hoverEnd,
      resumed,
      keyStart,
      keyEnd,
      reducedStart,
      reducedEnd,
    },
  });

  // 5. Desktop anchor navigation.
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
  await goto("/");
  await page.click('nav[aria-label="Primary"] a[href="#services"]');
  await sleep(500);
  const navCheck = await page.evaluate(() => {
    const section = document.getElementById("services");
    return {
      hash: window.location.hash,
      sectionTop: section
        ? Math.round(section.getBoundingClientRect().top)
        : null,
      headerHeight: Math.round(
        document.querySelector("header")?.getBoundingClientRect().height ?? 0,
      ),
    };
  });
  report.functional.push({
    name: "Desktop navigation anchor + offset",
    pass:
      navCheck.hash === "#services" &&
      navCheck.sectionTop !== null &&
      navCheck.sectionTop >= 60 &&
      navCheck.sectionTop < 140,
    detail: navCheck,
  });

  // 6. Link and content audit.
  await goto("/");
  const linkAudit = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll("a"));
    return {
      totalAnchors: anchors.length,
      emptyHrefs: anchors
        .filter((a) => !a.getAttribute("href") || a.getAttribute("href") === "#")
        .map((a) => a.textContent?.trim()),
      brokenHashLinks: anchors
        .filter((a) => {
          const href = a.getAttribute("href") ?? "";
          return href.startsWith("#") && !document.querySelector(href);
        })
        .map((a) => a.getAttribute("href")),
      telLinks: anchors
        .filter((a) => (a.getAttribute("href") ?? "").startsWith("tel:"))
        .map((a) => a.getAttribute("href")),
      imagesWithoutAlt: Array.from(document.querySelectorAll("img")).filter(
        (img) => !img.hasAttribute("alt"),
      ).length,
      h1: Array.from(document.querySelectorAll("h1")).map((h1) =>
        h1.textContent?.trim(),
      ),
      serviceTitles: Array.from(
        document.querySelectorAll('[id^="service-"] h3'),
      ).map((heading) => heading.textContent?.trim()),
    };
  });
  report.functional.push({
    name: "Links, images and service content",
    pass:
      linkAudit.emptyHrefs.length === 0 &&
      linkAudit.brokenHashLinks.length === 0 &&
      linkAudit.telLinks.length >= 4 &&
      linkAudit.imagesWithoutAlt === 0 &&
      linkAudit.h1.length === 1 &&
      linkAudit.serviceTitles.length === 6,
    detail: linkAudit,
  });

  // 7. Mobile navigation open, close and navigate.
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await goto("/");
  await page.click('button[aria-controls="mobile-navigation"]');
  await page.waitForSelector('[role="dialog"]');
  const menuOpen = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]');
    return {
      visible: Boolean(dialog),
      expanded: document
        .querySelector('button[aria-controls="mobile-navigation"]')
        ?.getAttribute("aria-expanded"),
      activeElement:
        document.activeElement?.getAttribute("aria-label") ??
        document.activeElement?.textContent?.trim().slice(0, 40),
    };
  });
  await page.screenshot({ path: path.join(outDir, "mobile-menu.png") });
  await page.keyboard.press("Escape");
  await sleep(400);
  const menuClosed = (await page.$('[role="dialog"]')) === null;
  report.functional.push({
    name: "Mobile menu opens, traps focus and closes with Escape",
    pass: menuOpen.visible && menuOpen.expanded === "true" && menuClosed,
    detail: { ...menuOpen, closedWithEscape: menuClosed },
  });

  await page.click('button[aria-controls="mobile-navigation"]');
  await page.waitForSelector('[role="dialog"]');
  await page.click('[role="dialog"] a[href="#approach"]');
  await sleep(600);
  const mobileNavCheck = await page.evaluate(() => {
    const section = document.getElementById("approach");
    return {
      hash: window.location.hash,
      dialogClosed: !document.querySelector('[role="dialog"]'),
      sectionTop: section
        ? Math.round(section.getBoundingClientRect().top)
        : null,
    };
  });
  report.functional.push({
    name: "Mobile menu link closes menu and scrolls to section",
    pass:
      mobileNavCheck.hash === "#approach" &&
      mobileNavCheck.dialogClosed &&
      mobileNavCheck.sectionTop !== null &&
      mobileNavCheck.sectionTop >= 60 &&
      mobileNavCheck.sectionTop < 140,
    detail: mobileNavCheck,
  });

  // 8. Contact form validation and honest server failure handling.
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
  await goto("/#contact");
  await page.waitForSelector("#contact form");
  await page.click('#contact form button[type="submit"]');
  await page.waitForFunction(() =>
    document.body.innerText.includes("Please enter your full name."),
  );
  const emptyErrors = await page.$$eval('#contact form [role="alert"]', (nodes) =>
    nodes.map((node) => node.textContent?.trim()),
  );
  const successAfterEmpty = await page.evaluate(() =>
    document.body.innerText.includes("Enquiry received."),
  );

  await page.type("#fullName", "QA Test");
  await page.type("#email", "not-an-email");
  await page.type(
    "#message",
    "This is a test enquiry generated by the QA validation pass.",
  );
  await page.click('#contact form button[type="submit"]');
  await page.waitForFunction(() =>
    document.body.innerText.includes("valid email address"),
  );
  const invalidEmailShown = await page.evaluate(() =>
    document.body.innerText.includes("valid email address"),
  );

  await page.click("#email", { clickCount: 3 });
  await page.type("#email", "qa@example.com");
  const [response] = await Promise.all([
    page.waitForResponse(
      (res) =>
        res.url().includes("/api/contact") && res.request().method() === "POST",
    ),
    page.click('#contact form button[type="submit"]'),
  ]);
  await page.waitForFunction(
    () =>
      document.querySelector('#contact form [role="alert"]')?.textContent
        ?.toLowerCase()
        .includes("not connected") ?? false,
  );
  const serverState = await page.evaluate(() => ({
    successVisible: document.body.innerText.includes("Enquiry received."),
    alert: document
      .querySelector('#contact form [role="alert"]')
      ?.textContent?.trim(),
    submitDisabled: document.querySelector(
      '#contact form button[type="submit"]',
    )?.disabled,
  }));
  report.functional.push({
    name: "Contact form validation and unconfigured email handling",
    pass:
      emptyErrors.length >= 3 &&
      invalidEmailShown &&
      response.status() === 503 &&
      serverState.successVisible === false &&
      Boolean(serverState.alert) &&
      serverState.submitDisabled === false,
    detail: {
      emptyErrors,
      successAfterEmpty,
      invalidEmailShown,
      responseStatus: response.status(),
      serverState,
    },
  });

  // 9. Service deep link preselect.
  await goto("/?service=website-design-development#contact");
  await page.waitForSelector("#service");
  await sleep(400);
  const selectedService = await page.$eval(
    "#service",
    (select) => select.value,
  );
  report.functional.push({
    name: "Service card enquiry link preselects the service",
    pass: selectedService === "website-design-development",
    detail: { selectedService },
  });

  // 9. Accessibility scans.
  await goto("/");
  await runAxe("desktop-home");
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await goto("/");
  await page.click('button[aria-controls="mobile-navigation"]');
  await page.waitForSelector('[role="dialog"]');
  await runAxe("mobile-menu-open");
} catch (error) {
  report.fatalError = String(error);
  process.exitCode = 1;
} finally {
  fs.writeFileSync(
    path.join(outDir, "qa-report.json"),
    JSON.stringify(report, null, 2),
  );
  await browser.close();
}

const compact = {
  viewportChecks: report.viewportChecks,
  functional: report.functional.map((check) => ({
    name: check.name,
    pass: check.pass,
    detail: check.detail,
  })),
  accessibility: report.accessibility.map((scan) => ({
    label: scan.label,
    violationCount: scan.violations.length,
    violations: scan.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      nodes: violation.nodes.length,
      targets: violation.nodes.map((node) => node.target),
    })),
  })),
  consoleErrors: report.consoleErrors,
  pageErrors: report.pageErrors,
  fatalError: report.fatalError,
};

console.log(JSON.stringify(compact, null, 2));
