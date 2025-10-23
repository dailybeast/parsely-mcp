#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { ParselyClient } from './services/parsely-client.js';
import { config } from './config/index.js';

const server = new Server(
  {
    name: 'parsely-mcp',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const parselyClient = new ParselyClient();

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_analytics_posts',
        description: 'Get analytics data for top posts from Parse.ly. Returns metrics like views, visitors, and engagement time.',
        inputSchema: {
          type: 'object',
          properties: {
            days: {
              type: 'number',
              description: 'Number of days to look back (default: 7)',
              default: 7,
            },
            limit: {
              type: 'number',
              description: 'Number of results to return (default: 10)',
              default: 10,
            },
            sort: {
              type: 'string',
              description: 'Sort field (e.g., "hits", "avg_engaged_time")',
            },
          },
        },
      },
      {
        name: 'get_analytics_authors',
        description: 'Get analytics data for top authors from Parse.ly. Returns metrics like views and visitors by author.',
        inputSchema: {
          type: 'object',
          properties: {
            days: {
              type: 'number',
              description: 'Number of days to look back (default: 7)',
              default: 7,
            },
            limit: {
              type: 'number',
              description: 'Number of results to return (default: 10)',
              default: 10,
            },
          },
        },
      },
      {
        name: 'get_analytics_tags',
        description: 'Get analytics data for top tags from Parse.ly. Returns metrics like views and visitors by tag.',
        inputSchema: {
          type: 'object',
          properties: {
            days: {
              type: 'number',
              description: 'Number of days to look back (default: 7)',
              default: 7,
            },
            limit: {
              type: 'number',
              description: 'Number of results to return (default: 10)',
              default: 10,
            },
          },
        },
      },
      {
        name: 'get_referrers',
        description: 'Get referrer data from Parse.ly. Shows where traffic is coming from (social, search, direct, etc.).',
        inputSchema: {
          type: 'object',
          properties: {
            days: {
              type: 'number',
              description: 'Number of days to look back (default: 7)',
              default: 7,
            },
            limit: {
              type: 'number',
              description: 'Number of results to return (default: 10)',
              default: 10,
            },
            type: {
              type: 'string',
              description: 'Filter by referrer type (e.g., "social", "search", "internal")',
            },
          },
        },
      },
      {
        name: 'search_content',
        description: 'Search Parse.ly content. Find articles, posts, and pages by keyword.',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query string',
            },
            limit: {
              type: 'number',
              description: 'Number of results to return (default: 10)',
              default: 10,
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'get_shares',
        description: 'Get social share data for posts from Parse.ly. Shows total shares and breakdown by platform.',
        inputSchema: {
          type: 'object',
          properties: {
            days: {
              type: 'number',
              description: 'Number of days to look back (default: 7)',
              default: 7,
            },
            limit: {
              type: 'number',
              description: 'Number of results to return (default: 10)',
              default: 10,
            },
          },
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    switch (name) {
      case 'get_analytics_posts': {
        const result = await parselyClient.getAnalytics('posts', args as Record<string, string | number>);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result.data, null, 2),
            },
          ],
        };
      }

      case 'get_analytics_authors': {
        const result = await parselyClient.getAnalytics('authors', args as Record<string, string | number>);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result.data, null, 2),
            },
          ],
        };
      }

      case 'get_analytics_tags': {
        const result = await parselyClient.getAnalytics('tags', args as Record<string, string | number>);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result.data, null, 2),
            },
          ],
        };
      }

      case 'get_referrers': {
        const result = await parselyClient.getReferrers(args as Record<string, string | number>);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result.data, null, 2),
            },
          ],
        };
      }

      case 'search_content': {
        const { query, ...params } = args as { query: string; [key: string]: unknown };
        if (!query) {
          throw new Error('Query parameter is required for search');
        }
        const result = await parselyClient.search(query, params);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result.data, null, 2),
            },
          ],
        };
      }

      case 'get_shares': {
        const result = await parselyClient.getShares(args as Record<string, string | number>);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result.data, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Parse.ly MCP server running on stdio');
  console.error(`API Key: ${config.parsely.apiKey.substring(0, 8)}...`);
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
