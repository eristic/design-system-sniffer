import { analyzeComputedStyles, cleanup, generateComputedStyleReport } from './computedStyleAnalyzer.js';
import { writeFile, mkdir, rename, access } from 'fs/promises';
import { join } from 'path';

// Get URL from command line arguments or use default
const TARGET_URL = process.argv[2];
const PUBLIC_DIR = join(process.cwd(), 'public');
const OLD_COMPUTED_DIR = join(process.cwd(), 'old-computed-styles');

const components = [
  {
    name: 'Button',
    selectors: [
      'button',
      '[role="button"]',
      '.btn',
      '.button',
      '[class*="button"]',
      '[class*="btn"]'
    ]
  },
  {
    name: 'Input',
    selectors: [
      'input',
      'textarea',
      '[role="textbox"]',
      '[class*="input"]',
      '[class*="textarea"]'
    ]
  },
  {
    name: 'Card',
    selectors: [
      '.card',
      '[class*="card"]',
      '[role="article"]',
      '[class*="tile"]'
    ]
  },
  {
    name: 'Modal',
    selectors: [
      '.modal',
      '[class*="modal"]',
      '[role="dialog"]',
      '[class*="dialog"]'
    ]
  },
  {
    name: 'Navigation',
    selectors: [
      'nav',
      '[role="navigation"]',
      '[class*="nav"]',
      '[class*="menu"]'
    ]
  },
  {
    name: 'Link',
    selectors: [
      'a',
      '[role="link"]',
      '[class*="link"]'
    ]
  },
  {
    name: 'Text',
    selectors: [
      'p',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      '[class*="text"]'
    ]
  },
  {
    name: 'Checkbox',
    selectors: [
      'input[type="checkbox"]',
      '[class*="checkbox"]'
    ]
  },
  {
    name: 'Radio',
    selectors: [
      'input[type="radio"]',
      '[class*="radio"]'
    ]
  },
  {
    name: 'Switch',
    selectors: [
      '[class*="switch"]'
    ]
  },
  {
    name: 'Slider',
    selectors: [
      'input[type="range"]',
      '[class*="slider"]'
    ]
  },
  {
    name: 'Progress',
    selectors: [
      'progress',
      '[class*="progress"]'
    ]
  },
  {
    name: 'Tooltip',
    selectors: [
      'div[role="tooltip"]',
      '[class*="tooltip"]'
    ]
  },
];

async function main() {
  try {
    // Ensure directories exist
    await mkdir(PUBLIC_DIR, { recursive: true });
    await mkdir(OLD_COMPUTED_DIR, { recursive: true });
    
    console.log('🚀 Starting computed style analysis...');
    console.log(`🌐 Analyzing URL: ${TARGET_URL}`);
    
    // Check if old computed-styles.json exists and move it
    const oldComputedStylesPath = join(PUBLIC_DIR, 'computed-styles.json');
    try {
      await access(oldComputedStylesPath);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = join(OLD_COMPUTED_DIR, `computed-styles-${timestamp}.json`);
      await rename(oldComputedStylesPath, backupPath);
      console.log('📦 Moved old computed-styles.json to:', backupPath);
    } catch (err) {
      // File doesn't exist, no need to move
    }
    
    // Run computed style analysis
    const computedStyleResults = await analyzeComputedStyles(TARGET_URL, components);
    
    // Generate and save computed style report
    const computedStyleReport = generateComputedStyleReport(computedStyleResults);
    await writeFile(join(OLD_COMPUTED_DIR, 'computed-styles.txt'), computedStyleReport);
    
    // Save raw computed style data to public directory
    await writeFile(
      oldComputedStylesPath,
      JSON.stringify(computedStyleResults, null, 2)
    );
    
    console.log('✅ Analysis complete!');
    console.log('📊 New computed-styles.json saved to:', PUBLIC_DIR);
    console.log('📝 Text report saved to:', OLD_COMPUTED_DIR);
    
  } catch (error) {
    console.error('❌ Error during analysis:', error);
    process.exit(1);
  } finally {
    await cleanup();
  }
}

main(); 