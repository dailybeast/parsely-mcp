#!/usr/bin/env node

import { randomUUID } from "node:crypto";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {
	CallToolRequestSchema,
	ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { ParselyClient } from "./services/parsely-client.js";
import { config } from "./config/index.js";
import express from "express";

const server = new Server(
	{
		name: "parsely-mcp",
		version: "0.1.0",
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
				name: "get_analytics_posts",
				description:
					"Get analytics data for top posts from Parse.ly. Returns metrics like views, visitors, and engagement time. Supports specific date ranges.",
				inputSchema: {
					type: "object",
					properties: {
						period_start: {
							type: "string",
							description: "Start date for traffic window (YYYY-MM-DD)",
						},
						period_end: {
							type: "string",
							description: "End date for traffic window (YYYY-MM-DD)",
						},
						pub_date_start: {
							type: "string",
							description: "Filter by content published after this date",
						},
						pub_date_end: {
							type: "string",
							description: "Filter by content published before this date",
						},
						days: {
							type: "number",
							description:
								"Number of days to look back (default: 7, ignored if period_start set)",
							default: 7,
						},
						limit: {
							type: "number",
							description: "Number of results to return (default: 10)",
							default: 10,
						},
						sort: {
							type: "string",
							description: 'Sort field (e.g., "hits", "avg_engaged_time")',
						},
						section: {
							type: "string",
							description: "Filter by content section",
						},
						tag: {
							type: "string",
							description: "Filter by content tag",
						},
					},
				},
			},
			{
				name: "get_analytics_authors",
				description:
					"Get analytics data for top authors from Parse.ly. Returns metrics like views and visitors by author.",
				inputSchema: {
					type: "object",
					properties: {
						days: {
							type: "number",
							description: "Number of days to look back (default: 7)",
							default: 7,
						},
						limit: {
							type: "number",
							description: "Number of results to return (default: 10)",
							default: 10,
						},
					},
				},
			},
			{
				name: "get_analytics_tags",
				description:
					"Get analytics data for top tags from Parse.ly. Returns metrics like views and visitors by tag.",
				inputSchema: {
					type: "object",
					properties: {
						days: {
							type: "number",
							description: "Number of days to look back (default: 7)",
							default: 7,
						},
						limit: {
							type: "number",
							description: "Number of results to return (default: 10)",
							default: 10,
						},
					},
				},
			},
			{
				name: "get_referrers",
				description:
					"Get referrer data from Parse.ly. Shows where traffic is coming from by type: social, search, other, or internal. Supports specific date ranges for comparison analysis.",
				inputSchema: {
					type: "object",
					properties: {
						type: {
							type: "string",
							description:
								'Referrer type: "social", "search", "other", or "internal" (default: "social")',
							enum: ["social", "search", "other", "internal"],
							default: "social",
						},
						period_start: {
							type: "string",
							description:
								"Start date for traffic window (YYYY-MM-DD or YYYY-MM-DDThh:mm). Use for specific date queries.",
						},
						period_end: {
							type: "string",
							description:
								"End date for traffic window (YYYY-MM-DD or YYYY-MM-DDThh:mm). Use same as period_start for single day.",
						},
						pub_date_start: {
							type: "string",
							description:
								"Filter by content published after this date (YYYY-MM-DD)",
						},
						pub_date_end: {
							type: "string",
							description:
								"Filter by content published before this date (YYYY-MM-DD)",
						},
						days: {
							type: "number",
							description:
								"Number of days to look back (default: 7). Ignored if period_start/period_end provided.",
							default: 7,
						},
						limit: {
							type: "number",
							description: "Number of results to return (default: 10)",
							default: 10,
						},
						section: {
							type: "string",
							description: "Filter by content section",
						},
						domain: {
							type: "string",
							description: "Filter by specific domain",
						},
					},
				},
			},
			{
				name: "search_content",
				description:
					"Search Parse.ly content. Find articles, posts, and pages by keyword.",
				inputSchema: {
					type: "object",
					properties: {
						query: {
							type: "string",
							description: "Search query string",
						},
						limit: {
							type: "number",
							description: "Number of results to return (default: 10)",
							default: 10,
						},
					},
					required: ["query"],
				},
			},
			{
				name: "get_shares",
				description:
					"Get social share data for posts from Parse.ly. Shows total shares and breakdown by platform.",
				inputSchema: {
					type: "object",
					properties: {
						days: {
							type: "number",
							description: "Number of days to look back (default: 7)",
							default: 7,
						},
						limit: {
							type: "number",
							description: "Number of results to return (default: 10)",
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
			case "get_analytics_posts": {
				const result = await parselyClient.getAnalytics(
					"posts",
					args as Record<string, string | number>
				);
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(result.data, null, 2),
						},
					],
				};
			}

			case "get_analytics_authors": {
				const result = await parselyClient.getAnalytics(
					"authors",
					args as Record<string, string | number>
				);
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(result.data, null, 2),
						},
					],
				};
			}

			case "get_analytics_tags": {
				const result = await parselyClient.getAnalytics(
					"tags",
					args as Record<string, string | number>
				);
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(result.data, null, 2),
						},
					],
				};
			}

			case "get_referrers": {
				const { type, ...params } = args as {
					type?: "social" | "search" | "other" | "internal";
					[key: string]: unknown;
				};
				const referrerType = type || "social";
				const result = await parselyClient.getReferrers(
					referrerType,
					params as Record<string, string | number>
				);
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(result.data, null, 2),
						},
					],
				};
			}

			case "search_content": {
				const { query, ...params } = args as {
					query: string;
					[key: string]: unknown;
				};
				if (!query) {
					throw new Error("Query parameter is required for search");
				}
				const result = await parselyClient.search(query, params);
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(result.data, null, 2),
						},
					],
				};
			}

			case "get_shares": {
				const result = await parselyClient.getShares(
					args as Record<string, string | number>
				);
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(result.data, null, 2),
						},
					],
				};
			}

			default:
				throw new Error(`Unknown tool: ${name}`);
		}
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error occurred";
		return {
			content: [
				{
					type: "text",
					text: `Error: ${errorMessage}`,
				},
			],
			isError: true,
		};
	}
});

// Start the HTTP server with Streamable HTTP transport
async function main() {
	const app = express();
	const port = config.server.port;

	// Parse JSON request bodies
	app.use(express.json());

	// Health check endpoint
	app.get("/health", (_req, res) => {
		res.json({ status: "ok", service: "parsely-mcp" });
	});

	// Map of session ID to transport for stateful session management
	const transports = new Map<string, StreamableHTTPServerTransport>();

	// Handle all MCP requests on /mcp endpoint
	app.all("/mcp", async (req, res) => {
		const sessionId = req.headers["mcp-session-id"] as string | undefined;

		if (req.method === "GET" || req.method === "DELETE") {
			const transport = sessionId ? transports.get(sessionId) : undefined;
			if (!transport) {
				res.status(400).json({ error: "No valid session found" });
				return;
			}
			await transport.handleRequest(req, res);
			return;
		}

		if (req.method === "POST") {
			// If we have a session ID and it maps to an existing transport, reuse it
			if (sessionId && transports.has(sessionId)) {
				const transport = transports.get(sessionId)!;
				await transport.handleRequest(req, res, req.body);
				return;
			}

			// New session: create a transport and connect it to a new server instance
			const transport = new StreamableHTTPServerTransport({
				sessionIdGenerator: () => randomUUID(),
				onsessioninitialized: (id) => {
					transports.set(id, transport);
					console.error(`Session initialized: ${id}`);
				},
			});

			transport.onclose = () => {
				if (transport.sessionId) {
					transports.delete(transport.sessionId);
					console.error(`Session closed: ${transport.sessionId}`);
				}
			};

			await server.connect(transport);
			await transport.handleRequest(req, res, req.body);
			return;
		}

		res.status(405).json({ error: "Method not allowed" });
	});

	const host = "0.0.0.0";
	app.listen(port, host, () => {
		console.error(`Parse.ly MCP server running on http://${host}:${port}`);
		console.error(`Streamable HTTP endpoint: http://${host}:${port}/mcp`);
		console.error(`API Key: ${config.parsely.apiKey.substring(0, 8)}...`);
	});
}

main().catch((error) => {
	console.error("Fatal error in main():", error);
	process.exit(1);
});
