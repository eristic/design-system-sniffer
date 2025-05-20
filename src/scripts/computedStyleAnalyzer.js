import puppeteer from "puppeteer";

// Helper function to compare two style objects
function areStylesEqual(styles1, styles2) {
  const relevantProperties = [
    "color",
    "background-color",
    "font-family",
    "font-size",
    "border-radius",
  ];

  return relevantProperties.every((prop) => styles1[prop] === styles2[prop]);
}

export async function analyzeComputedStyles(url, components) {
  console.log("🚀 Launching browser...");
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    // Set a longer timeout for navigation
    page.setDefaultNavigationTimeout(60000);

    // Set a user agent to avoid being blocked
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    );

    // Enable JavaScript
    await page.setJavaScriptEnabled(true);

    // Navigate to the page and wait for it to be fully loaded
    await page.goto(url, {
      waitUntil: ["networkidle0", "domcontentloaded", "load"],
      timeout: 60000,
    });

    // Wait for any dynamic content to load
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("🔍 Analyzing components...");

    const results = [];

    for (const component of components) {
      console.log(`\n📦 Analyzing ${component.name}...`);
      const uniqueElements = [];

      for (const selector of component.selectors) {
        try {
          console.log(`  🔎 Checking selector: ${selector}`);

          // Wait for the selector to be present in the DOM
          await page.waitForSelector(selector, { timeout: 5000 }).catch(() => {
            console.log(`    ⚠️ Selector not found: ${selector}`);
          });

          const elements = await page.$$(selector);

          if (elements.length > 0) {
            console.log(`    ✅ Found ${elements.length} elements`);

            for (const element of elements) {
              const styles = await page.evaluate((el) => {
                const computed = window.getComputedStyle(el);
                const relevantStyles = {};

                // Collect relevant CSS properties
                const properties = [
                  "color",
                  "background-color",
                  "font-family",
                  "font-size",
                  "font-weight",
                  "line-height",
                  "text-transform",
                  "letter-spacing",
                  "padding",
                  "margin",
                  "border",
                  "border-radius",
                  "box-shadow",
                  "display",
                  "width",
                  "height",
                ];

                for (const prop of properties) {
                  relevantStyles[prop] = computed.getPropertyValue(prop);
                }

                return relevantStyles;
              }, element);

              // Check if this element's styles match any existing unique element
              const isDuplicate = uniqueElements.some(
                (existing) =>
                  existing.selector === selector &&
                  areStylesEqual(existing.styles, styles)
              );

              if (!isDuplicate) {
                uniqueElements.push({
                  selector,
                  styles,
                });
              }
            }
          }
        } catch (error) {
          console.error(
            `    ❌ Error analyzing selector ${selector}:`,
            error.message
          );
        }
      }

      if (uniqueElements.length > 0) {
        results.push({
          name: component.name,
          elements: uniqueElements,
        });
      }
    }

    return results;
  } finally {
    await browser.close();
  }
}

export function generateComputedStyleReport(results) {
  let report = "Computed Style Analysis Report\n";
  report += "============================\n\n";

  for (const component of results) {
    const uniqueElements = [];

    for (const element of component.elements) {
      // Check if this element's styles match any existing unique element
      const isDuplicate = uniqueElements.some(
        (existing) =>
          existing.selector === element.selector &&
          areStylesEqual(existing.styles, element.styles)
      );

      if (!isDuplicate) {
        uniqueElements.push(element);
      }
    }

    report += `Component: ${component.name}\n`;
    report += `Total Unique Elements: ${uniqueElements.length}\n`;
    report += "----------------------------------------\n";

    // Write unique elements to report
    for (const element of uniqueElements) {
      report += `\nSelector: ${element.selector}\n`;
      report += "Styles:\n";

      for (const [property, value] of Object.entries(element.styles)) {
        if (value && value !== "none" && value !== "0px") {
          report += `  ${property}: ${value}\n`;
        }
      }

      report += "\n";
    }

    report += "\n";
  }

  return report;
}

export async function cleanup() {
  // This function is kept for compatibility
  // The browser is already closed in analyzeComputedStyles
}
