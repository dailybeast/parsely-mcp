#!/usr/bin/env node

/**
 * Test all Parse.ly API endpoints to verify they're correct
 */

import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.PARSELY_API_KEY;
const apiSecret = process.env.PARSELY_API_SECRET;
const baseUrl = 'https://api.parsely.com/v2';

async function testEndpoint(name, endpoint, params = {}) {
  try {
    const queryParams = new URLSearchParams({
      apikey: apiKey,
      secret: apiSecret,
      limit: '2',
      days: '7',
      ...params,
    });

    const url = `${baseUrl}/${endpoint}?${queryParams}`;
    console.log(`\n🧪 Testing: ${name}`);
    console.log(`   Endpoint: /${endpoint}`);

    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.text();
      console.log(`   ❌ FAILED (${response.status}): ${error}`);
      return false;
    }

    const data = await response.json();
    console.log(`   ✅ SUCCESS - returned ${data.data?.length || 0} items`);
    if (data.data && data.data[0]) {
      console.log(`   Sample: ${JSON.stringify(data.data[0]).substring(0, 100)}...`);
    }
    return true;
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Testing all Parse.ly API endpoints...');
  console.log(`   API Key: ${apiKey?.substring(0, 20)}...`);

  const tests = [
    // Analytics endpoints
    ['Analytics - Posts', 'analytics/posts'],
    ['Analytics - Authors', 'analytics/authors'],
    ['Analytics - Tags', 'analytics/tags'],

    // Referrers
    ['Referrers - Posts', 'referrers/posts'],
    ['Referrers - Posts (social)', 'referrers/posts', { type: 'social' }],

    // Search
    ['Search', 'search', { q: 'trump', limit: '2' }],

    // Shares
    ['Shares - Posts', 'shares/posts'],
  ];

  let passed = 0;
  let failed = 0;

  for (const [name, endpoint, params] of tests) {
    const result = await testEndpoint(name, endpoint, params);
    if (result) passed++;
    else failed++;
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`📊 Results: ${passed} passed, ${failed} failed`);

  if (failed === 0) {
    console.log('✅ All endpoints working correctly!');
  } else {
    console.log('❌ Some endpoints failed - see above');
    process.exit(1);
  }
}

runTests().catch(console.error);
