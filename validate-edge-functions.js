#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Edge Function TypeScript syntax...\n');

const functions = [
  'admin-create-user',
  'agency-create-advertiser'
];

let hasErrors = false;

functions.forEach(functionName => {
  const filePath = path.join(__dirname, 'supabase', 'functions', functionName, 'index.ts');
  
  console.log(`📝 Checking ${functionName}/index.ts...`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${filePath}`);
    hasErrors = true;
    return;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Basic syntax checks
    const checks = [
      {
        name: 'Starts with import statements',
        test: /^import\s+.*from\s+["'].+["']/m,
        required: true
      },
      {
        name: 'Has serve function call',
        test: /serve\s*\(\s*async\s*\(/,
        required: true
      },
      {
        name: 'Has CORS headers',
        test: /corsHeaders/,
        required: true
      },
      {
        name: 'Has proper Response returns',
        test: /new Response\(/,
        required: true
      },
      {
        name: 'No obvious syntax errors (balanced braces)',
        test: content => {
          const openBraces = (content.match(/{/g) || []).length;
          const closeBraces = (content.match(/}/g) || []).length;
          return openBraces === closeBraces;
        },
        required: true
      }
    ];
    
    let functionHasErrors = false;
    
    checks.forEach(check => {
      let passed = false;
      
      if (typeof check.test === 'function') {
        passed = check.test(content);
      } else {
        passed = check.test.test(content);
      }
      
      if (passed) {
        console.log(`  ✅ ${check.name}`);
      } else {
        console.log(`  ❌ ${check.name}`);
        if (check.required) {
          functionHasErrors = true;
        }
      }
    });
    
    // Check for common TypeScript/JavaScript issues
    const commonIssues = [
      {
        pattern: /console\.log\(/,
        message: 'Contains console.log (should use console.error for errors)'
      },
      {
        pattern: /\t/,
        message: 'Contains tabs (should use spaces for consistency)'
      }
    ];
    
    commonIssues.forEach(issue => {
      if (issue.pattern.test(content)) {
        console.log(`  ⚠️  Warning: ${issue.message}`);
      }
    });
    
    if (!functionHasErrors) {
      console.log(`✅ ${functionName} syntax validation passed\n`);
    } else {
      console.log(`❌ ${functionName} has syntax issues\n`);
      hasErrors = true;
    }
    
  } catch (error) {
    console.log(`❌ Error reading ${functionName}: ${error.message}\n`);
    hasErrors = true;
  }
});

if (hasErrors) {
  console.log('❌ Edge Functions have validation errors. Please fix before deploying.');
  process.exit(1);
} else {
  console.log('🎉 All Edge Functions passed validation! Ready to deploy.');
  console.log('\nNext steps:');
  console.log('1. Run: ./deploy-edge-functions-fixed.sh');
  console.log('2. Set environment variables in Supabase Dashboard');
  console.log('3. Test user creation in your app');
}