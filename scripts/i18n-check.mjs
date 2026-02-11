#!/usr/bin/env node

/**
 * i18n Check Script
 * 
 * Scans TypeScript/React files for potential hardcoded English strings
 * that should be moved to the VI dictionary (src/shared/i18n/vi.ts).
 * 
 * Usage:
 *   npm run i18n:check
 * 
 * Exit codes:
 *   0 = warnings found or no issues
 *   (never blocks build, only warns)
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');
const SRC_DIR = join(PROJECT_ROOT, 'src');

// Common English words that likely indicate hardcoded UI text
const SUSPICIOUS_PATTERNS = [
  // Common UI actions
  /\b(Submit|Cancel|Save|Delete|Edit|Create|Update|Remove|Add|Search|Filter|Sort|View|Close|Open|Back|Next|Previous|Confirm|Reset)\b/,
  
  // Common UI labels
  /\b(Dashboard|Settings|Profile|Logout|Login|Register|Email|Password|Username|Phone|Name|Address|Description|Title|Status|Date|Time)\b/,
  
  // Status/states
  /\b(Loading|Error|Success|Failed|Warning|Pending|Active|Inactive|Disabled|Enabled)\b/,
  
  // Messages
  /\b(Welcome|Hello|Goodbye|Thank you|Please|Sorry|Confirm|Are you sure)\b/,
  
  // Form validation
  /\b(Required|Invalid|Must be|Should be|Cannot be|Enter|Choose|Select)\b/,
];

// Files to skip (already use VI or are not UI-related)
const SKIP_PATTERNS = [
  /node_modules/,
  /\.test\.(ts|tsx)$/,
  /\.spec\.(ts|tsx)$/,
  /vite\.config/,
  /tailwind\.config/,
  /postcss\.config/,
  /\/types\//,
  /\/types\.ts$/,
  /\/constants\//,  // May contain hardcoded data, but check manually
  /\/i18n\//,       // The VI dictionary itself
];

// Patterns to ignore in content (not actual UI text)
const IGNORE_IN_CONTENT = [
  /aria-label=/,     // Accessibility labels (should convert but lower priority)
  /title=/,          // HTML titles (should convert but lower priority) 
  /className=/,      // Tailwind classes
  /import .* from/,  // Import statements
  /\/\/.*/,          // Comments
  /console\.(log|error|warn|info)/,  // Console logs
  /TODO:/,           // TODO comments
];

function shouldSkipFile(filePath) {
  return SKIP_PATTERNS.some(pattern => pattern.test(filePath));
}

function extractStringLiterals(content, filePath) {
  const findings = [];
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    
    // Skip lines that match ignore patterns
    if (IGNORE_IN_CONTENT.some(pattern => pattern.test(line))) {
      return;
    }
    
    // Find string literals (simple regex, not perfect but good enough)
    // Matches: "text", 'text', `text`, {text}, >text<
    const stringMatches = [
      ...line.matchAll(/["']([^"']{3,})["']/g),  // "text" or 'text'
      ...line.matchAll(/\{["']([^"']{3,})["']\}/g),  // {"text"} or {'text'}
    ];
    
    stringMatches.forEach(match => {
      const text = match[1];
      
      // Check if text matches suspicious patterns
      if (SUSPICIOUS_PATTERNS.some(pattern => pattern.test(text))) {
        findings.push({
          file: relative(PROJECT_ROOT, filePath),
          line: lineNum,
          text: text.substring(0, 60) + (text.length > 60 ? '...' : ''),
          fullLine: line.trim().substring(0, 80) + (line.trim().length > 80 ? '...' : ''),
        });
      }
    });
  });
  
  return findings;
}

function scanDirectory(dir) {
  let allFindings = [];
  
  try {
    const entries = readdirSync(dir);
    
    entries.forEach(entry => {
      const fullPath = join(dir, entry);
      
      if (shouldSkipFile(fullPath)) {
        return;
      }
      
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        allFindings = allFindings.concat(scanDirectory(fullPath));
      } else if (stat.isFile() && /\.(ts|tsx)$/.test(entry)) {
        const content = readFileSync(fullPath, 'utf-8');
        const findings = extractStringLiterals(content, fullPath);
        allFindings = allFindings.concat(findings);
      }
    });
  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error.message);
  }
  
  return allFindings;
}

function main() {
  console.log('🔍 Scanning for hardcoded English UI text...\n');
  
  const findings = scanDirectory(SRC_DIR);
  
  if (findings.length === 0) {
    console.log('✅ No suspicious hardcoded English text found!');
    console.log('   All UI text appears to use the VI dictionary.\n');
    return;
  }
  
  console.log(`⚠️  Found ${findings.length} potential hardcoded string(s):\n`);
  
  // Group by file
  const byFile = findings.reduce((acc, finding) => {
    if (!acc[finding.file]) {
      acc[finding.file] = [];
    }
    acc[finding.file].push(finding);
    return acc;
  }, {});
  
  Object.entries(byFile).forEach(([file, items]) => {
    console.log(`📄 ${file}`);
    items.forEach(item => {
      console.log(`   Line ${item.line}: "${item.text}"`);
      console.log(`   → ${item.fullLine}\n`);
    });
  });
  
  console.log('💡 Recommendations:');
  console.log('   1. Check if these strings are actual UI text');
  console.log('   2. If yes, move them to src/shared/i18n/vi.ts');
  console.log('   3. Replace with VI.* references');
  console.log('   4. False positives are OK (e.g., enum values, test data)\n');
  
  // Exit with 0 (warning only, don't block build)
  process.exit(0);
}

main();
