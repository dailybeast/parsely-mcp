#!/usr/bin/env node

/**
 * Direct API test - bypasses MCP to test Parse.ly API directly
 */

import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.PARSELY_API_KEY;
const apiSecret = process.env.PARSELY_API_SECRET;
const baseUrl = 'https://api.parsely.com/v2';

console.log('🔑 API Key:', apiKey?.substring(0, 20) + '...');
console.log('🔒 Secret:', apiSecret ? '***' : 'MISSING');
console.log();

async function testDirectAPI() {
  try {
    const url = `${baseUrl}/analytics/posts?apikey=${apiKey}&secret=${apiSecret}&days=7&limit=3`;
    console.log('📡 Calling Parse.ly API...');
    console.log('URL:', url.replace(apiSecret, '***'));
    console.log();

    const response = await fetch(url);

    console.log('📊 Response Status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      process.exit(1);
    }

    const data = await response.json();
    console.log('✅ API call successful!\n');
    console.log('Data received:');
    console.log(JSON.stringify(data, null, 2));

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.cause) {
      console.error('Cause:', error.cause);
    }
    process.exit(1);
  }
}

testDirectAPI();
