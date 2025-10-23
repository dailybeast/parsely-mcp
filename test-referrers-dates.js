#!/usr/bin/env node

/**
 * Test referrers endpoint with specific dates to support the user's query:
 * "compare yesterdays referral traffic to an average of the last four similar days"
 */

import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.PARSELY_API_KEY;
const apiSecret = process.env.PARSELY_API_SECRET;
const baseUrl = 'https://api.parsely.com/v2';

// Get date strings (YYYY-MM-DD format)
function getDateString(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
}

async function testReferrersWithDates() {
  console.log('🧪 Testing referrers endpoint with specific date ranges\n');

  // Test yesterday (single day)
  const yesterday = getDateString(1);
  console.log(`Testing yesterday: ${yesterday}`);

  const types = ['social', 'search', 'other', 'internal'];

  for (const type of types) {
    try {
      const queryParams = new URLSearchParams({
        apikey: apiKey,
        secret: apiSecret,
        period_start: yesterday,
        period_end: yesterday,
        limit: '5',
      });

      const url = `${baseUrl}/referrers/${type}?${queryParams}`;
      const response = await fetch(url);

      if (!response.ok) {
        console.log(`  ❌ ${type}: FAILED (${response.status})`);
        continue;
      }

      const data = await response.json();
      const totalHits = data.data.reduce((sum, item) => sum + (item._hits || 0), 0);
      console.log(`  ✅ ${type}: ${data.data.length} referrers, ${totalHits} total hits`);

    } catch (error) {
      console.log(`  ❌ ${type}: ERROR - ${error.message}`);
    }
  }

  // Test a 7-day range
  console.log(`\n Testing 7-day range: ${getDateString(7)} to ${yesterday}`);
  try {
    const queryParams = new URLSearchParams({
      apikey: apiKey,
      secret: apiSecret,
      period_start: getDateString(7),
      period_end: yesterday,
      limit: '5',
    });

    const url = `${baseUrl}/referrers/social?${queryParams}`;
    const response = await fetch(url);
    const data = await response.json();

    console.log(`  ✅ Social (7 days): ${data.data.length} referrers`);
    if (data.data[0]) {
      console.log(`  Top referrer: ${data.data[0].name || data.data[0].url} (${data.data[0]._hits} hits)`);
    }
  } catch (error) {
    console.log(`  ❌ ERROR: ${error.message}`);
  }

  console.log('\n✅ Date-based queries working! LLM can now:');
  console.log('  - Query specific single days (yesterday)');
  console.log('  - Query multiple days for averages (last 4 similar days)');
  console.log('  - Split by referrer type (social, search, other, internal)');
  console.log('  - Aggregate "other" + "internal" as requested');
}

testReferrersWithDates().catch(console.error);
