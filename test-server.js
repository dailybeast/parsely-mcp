#!/usr/bin/env node

/**
 * Simple test script to verify the MCP server is working
 * This script simulates an MCP client connecting to the server
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn } from 'child_process';

async function testServer() {
  console.log('🚀 Starting MCP server test...\n');

  // Spawn the server process
  const serverProcess = spawn('node', ['dist/index.js'], {
    env: process.env,
    stdio: ['pipe', 'pipe', 'inherit'],
  });

  // Create client transport
  const transport = new StdioClientTransport({
    command: 'node',
    args: ['dist/index.js'],
    env: process.env,
  });

  // Create client
  const client = new Client(
    {
      name: 'test-client',
      version: '1.0.0',
    },
    {
      capabilities: {},
    }
  );

  try {
    // Connect to server
    await client.connect(transport);
    console.log('✅ Connected to MCP server\n');

    // List available tools
    console.log('📋 Listing available tools...');
    const toolsResult = await client.listTools();
    console.log(`Found ${toolsResult.tools.length} tools:\n`);

    toolsResult.tools.forEach((tool, i) => {
      console.log(`${i + 1}. ${tool.name}`);
      console.log(`   ${tool.description}\n`);
    });

    // Test a simple tool call - get analytics for posts
    console.log('🧪 Testing get_analytics_posts tool...');
    const result = await client.callTool({
      name: 'get_analytics_posts',
      arguments: {
        days: 7,
        limit: 3,
      },
    });

    console.log('✅ Tool call successful!\n');
    console.log('Response preview:');
    console.log(result.content[0].text.substring(0, 500) + '...\n');

    console.log('✅ All tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  } finally {
    await client.close();
    serverProcess.kill();
  }
}

testServer().catch(console.error);
