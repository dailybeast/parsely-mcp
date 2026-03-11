# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Parse.ly MCP (Model Context Protocol) server built with TypeScript and Node.js. Parse.ly is an analytics platform for tracking editorial content performance. This server exposes Parse.ly API functionality through MCP tools.

**This is an open-source project.** Follow open-source best practices for security, licensing, and community contribution.

**Key References:**
- Parse.ly API Overview: https://docs.parse.ly/api/api-overview/
- Parse.ly API Endpoints: https://docs.parse.ly/api/api-endpoints/
- MCP TypeScript SDK: https://github.com/modelcontextprotocol/typescript-sdk

## Development Commands

### Build and Development
```bash
npm run build          # Compile TypeScript
npm run dev            # Development mode with watch
npm run lint           # Run ESLint
npm run test           # Run all tests
npm run test:watch     # Run tests in watch mode
```

### Docker
```bash
docker build -t parsely-mcp .
docker run -p 3000:3000 parsely-mcp
```

## Architecture

### MCP Server Structure
The server follows the Model Context Protocol specification using the TypeScript SDK. It exposes Parse.ly analytics data through MCP tools that can be consumed by Claude and other AI assistants.

### Transport Layer
- Uses Streamable HTTP transport via the `/mcp` endpoint
- Supports stateful sessions with `mcp-session-id` headers
- Exposes a configurable port for client connections
- Authentication uses Parse.ly API keys and secrets

### Core MCP Tools

The server implements these MCP tools for accessing Parse.ly analytics:

1. **Analytics Tools**
   - Get analytics by post
   - Get analytics by author
   - Get analytics by tag
   - Combinations of the above dimensions

2. **Referrer Tools**
   - Get referrers filtered by type (social, search, direct, etc.)

3. **Search Tools**
   - Search Parse.ly content

4. **Engagement Tools**
   - Get shares data
   - Get posts data

### Code Organization

- `/src/index.ts` - MCP server entry point and initialization
- `/src/tools/` - Individual MCP tool implementations
- `/src/services/` - Parse.ly API client and helper functions
- `/src/types/` - TypeScript type definitions for Parse.ly API responses
- `/src/config/` - Configuration management (API keys, endpoints, etc.)

### Parse.ly API Integration

- API base URL: `https://api.parse.ly/v2/`
- Authentication: API key and secret passed as query parameters
- Rate limiting considerations apply
- Response format: JSON

## Testing

Always run lint and compile before testing changes. Fix all linting and compilation errors immediately when encountered.

### Test Structure
- Unit tests for individual tools in `/src/tools/__tests__/`
- Integration tests for Parse.ly API client in `/src/services/__tests__/`
- End-to-end tests for MCP server functionality

### Running Specific Tests
```bash
npm test -- --testPathPattern=tools    # Test specific directory
npm test -- --testNamePattern="search" # Test by name pattern
```

## Configuration

The server requires Parse.ly API credentials:
- `PARSELY_API_KEY` - Your Parse.ly API key
- `PARSELY_API_SECRET` - Your Parse.ly API secret
- `PORT` - HTTP transport port (default: 3000)

### Environment Variable Handling

**CRITICAL SECURITY REQUIREMENTS:**

1. **Never commit secrets**: The `.gitignore` must include `.env` and any other files containing secrets
2. **Provide template**: Always maintain a `.env.example` file with placeholder values showing required variables
3. **Use dotenv**: Load environment variables using the `dotenv` package
4. **Validate on startup**: The server should fail fast if required environment variables are missing
5. **Docker secrets**: For Docker deployments, support environment variables passed at runtime

Example `.env.example`:
```
PARSELY_API_KEY=your_api_key_here
PARSELY_API_SECRET=your_api_secret_here
PORT=3000
```

## Open Source Licensing

This project requires a permissive open-source license. Common choices:
- **MIT License** - Simple and permissive (recommended for maximum adoption)
- **Apache 2.0** - Includes patent protection
- **ISC License** - Functionally equivalent to MIT, more concise

The LICENSE file must be included in the repository root. When adding dependencies, ensure their licenses are compatible with the chosen license.

## Required Repository Files

For open-source distribution, ensure these files are present:

1. **LICENSE** - Contains the open-source license text
2. **.gitignore** - Must exclude:
   - `.env` and `.env.local`
   - `node_modules/`
   - `dist/` or `build/` (compiled output)
   - `.DS_Store` and OS-specific files
   - IDE-specific files (`.vscode/`, `.idea/`, etc.)
   - `*.log` files
3. **.env.example** - Template showing required environment variables (no actual secrets)
4. **README.md** - Installation, usage, and contribution instructions
5. **package.json** - Must include proper metadata for npm publication:
   - `name`, `version`, `description`
   - `repository` field pointing to the GitHub repo
   - `license` field matching the LICENSE file
   - `keywords` for discoverability

## Development Workflow

When implementing features, work incrementally:
1. Complete one logical unit of work at a time
2. Commit after each completed component (e.g., after config setup, after API client, after each tool)
3. Use descriptive commit messages that explain what was implemented
4. This ensures work can be easily resumed if interrupted
