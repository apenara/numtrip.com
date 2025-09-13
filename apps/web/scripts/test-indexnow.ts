#!/usr/bin/env tsx

import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const INDEXNOW_KEY = process.env.INDEXNOW_KEY;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://numtrip.com';

async function testIndexNow() {
  console.log('🔍 Testing IndexNow Configuration...\n');

  // Check environment variable
  if (!INDEXNOW_KEY) {
    console.error('❌ INDEXNOW_KEY not found in environment variables');
    return;
  }
  console.log('✅ IndexNow key found in environment:', INDEXNOW_KEY);

  // Check key file
  const keyFileUrl = `${SITE_URL}/${INDEXNOW_KEY}.txt`;
  console.log(`\n📄 Key file should be accessible at: ${keyFileUrl}`);

  // Test a sample submission (dry run)
  const testUrl = `${SITE_URL}/es`;
  const host = new URL(SITE_URL).hostname;

  console.log('\n🧪 Test payload:');
  console.log(JSON.stringify({
    host,
    key: INDEXNOW_KEY,
    keyLocation: keyFileUrl,
    urlList: [testUrl]
  }, null, 2));

  console.log('\n📝 Instructions for manual testing:');
  console.log('1. Make sure the key file is accessible at:', keyFileUrl);
  console.log('2. Run "pnpm indexnow:submit" to submit all URLs to IndexNow');
  console.log('3. Check Bing Webmaster Tools for submission status');
  console.log('\n✨ IndexNow test complete!');
}

testIndexNow().catch(console.error);