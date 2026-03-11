# Parse.ly MCP Server

A Model Context Protocol (MCP) server that provides access to Parse.ly analytics API via **Streamable HTTP transport**. This server enables AI assistants like Claude to query Parse.ly data for content analytics, referrers, search, and social shares.

**Built with [Claude Code](https://claude.ai/code)** - See [CLAUDE.md](CLAUDE.md) for development guidance.

## Features

- **Streamable HTTP Transport**: Modern MCP Streamable HTTP protocol with session management
- **Analytics Tools**: Get metrics for top posts, authors, and tags with date-based queries
- **Referrer Data**: Track traffic sources by type (social, search, other, internal)
- **Content Search**: Search through Parse.ly content
- **Social Shares**: View share counts across platforms
- **Date Range Support**: Query specific days or ranges for time-based comparisons
- **Type-Safe**: Built with TypeScript for reliability
- **Well-Tested**: Comprehensive unit tests with mocked API responses
- **Docker Support**: Easy containerized deployment with port exposure

## Prerequisites

- Node.js >= 20.0.0
- Parse.ly API credentials (API key and secret)
- Get your credentials from https://dash.parse.ly/

## Installation

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/dailybeast/parsely-mcp.git
cd parsely-mcp
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from the example:
```bash
cp .env.example .env
```

4. Edit `.env` and add your Parse.ly credentials:
```
PARSELY_API_KEY=your_api_key_here
PARSELY_API_SECRET=your_api_secret_here
PORT=3000
```

5. Build the project:
```bash
npm run build
```

6. Run the server:
```bash
npm start
```

The server will start on `http://localhost:3000` with the following endpoints:
- **MCP endpoint**: `http://localhost:3000/mcp` - Streamable HTTP transport (POST, GET, DELETE)
- **Health check**: `http://localhost:3000/health` - Server health status

### Docker

1. Build the Docker image:
```bash
docker build -t parsely-mcp .
```

2. Run the container with environment variables:
```bash
docker run -e PARSELY_API_KEY=your_key -e PARSELY_API_SECRET=your_secret -p 3000:3000 parsely-mcp
```

## Available Tools

The MCP server exposes the following tools:

### `get_analytics_posts`
Get analytics data for top posts.
- Parameters: `days` (number, default: 7), `limit` (number, default: 10), `sort` (string, optional)

### `get_analytics_authors`
Get analytics data for top authors.
- Parameters: `days` (number, default: 7), `limit` (number, default: 10)

### `get_analytics_tags`
Get analytics data for top tags.
- Parameters: `days` (number, default: 7), `limit` (number, default: 10)

### `get_referrers`
Get referrer data showing traffic sources.
- Parameters: `days` (number, default: 7), `limit` (number, default: 10), `type` (string, optional: "social", "search", etc.)

### `search_content`
Search Parse.ly content.
- Parameters: `query` (string, required), `limit` (number, default: 10)

### `get_shares`
Get social share data for posts.
- Parameters: `days` (number, default: 7), `limit` (number, default: 10)

## Development

### Available Scripts

```bash
npm run build          # Compile TypeScript
npm run dev            # Watch mode for development
npm run lint           # Run ESLint
npm test               # Run tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Generate coverage report
```

### Running Tests

Tests use mocked Parse.ly API responses and don't require real credentials:

```bash
npm test
```

For tests that need environment variables:

```bash
PARSELY_API_KEY=test PARSELY_API_SECRET=test npm test
```

## Configuration

All configuration is done via environment variables:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PARSELY_API_KEY` | Yes | - | Your Parse.ly API key |
| `PARSELY_API_SECRET` | Yes | - | Your Parse.ly API secret |
| `PARSELY_API_BASE_URL` | No | `https://api.parse.ly/v2` | Parse.ly API base URL |
| `PORT` | No | `3000` | Server port |

## API Documentation

For more information about the Parse.ly API:
- [API Overview](https://docs.parse.ly/api/api-overview/)
- [API Endpoints](https://docs.parse.ly/api/api-endpoints/)

## Contributing

Contributions are welcome! Please ensure:
1. All tests pass (`npm test`)
2. Code is linted (`npm run lint`)
3. TypeScript compiles without errors (`npm run build`)

## License

MIT License - see [LICENSE](LICENSE) for details

## Support

For issues and questions:
- GitHub Issues: https://github.com/dailybeast/parsely-mcp/issues
- Parse.ly Documentation: https://docs.parse.ly/

## Acknowledgments

- **Built with [Claude Code](https://claude.ai/code)** - AI-assisted development
- [Model Context Protocol SDK](https://github.com/modelcontextprotocol/typescript-sdk) - TypeScript SDK for MCP
- [Parse.ly API](https://www.parse.ly/) - Content analytics platform

## Development

This project uses [CLAUDE.md](CLAUDE.md) for AI-assisted development guidance. The file contains:
- Architecture overview and code organization
- Common development commands
- Testing requirements and conventions
- Open-source best practices
