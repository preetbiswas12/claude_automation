# Claude Automation for n8n

A Claude Code workspace for designing, building, validating, and deploying n8n workflows through the n8n MCP (Model Context Protocol) server.

## Overview

This project enables Claude Code to interact directly with an n8n instance via MCP tools. It automates the full workflow lifecycle — from template discovery and node configuration through validation and deployment — following best practices baked into the project's operating instructions.

## Prerequisites

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) (CLI or desktop)
- Node.js + npx (for the `n8n-mcp` server)
- A reachable n8n instance with API access

## Setup

1. Clone this repository
2. Ensure `.mcp.json` points to your n8n instance (configure `N8N_API_URL` and `N8N_API_KEY`)
3. Open the folder in Claude Code — the MCP server starts automatically

## How It Works

The `n8n-mcp` server exposes tools that let Claude Code:

- **Discover** — Search 2,352+ workflow templates by task, complexity, node type, or keyword
- **Inspect** — Fetch full node documentation, examples, and property metadata
- **Configure** — Validate node configs before and after building (minimal → full → workflow-level)
- **Build** — Construct workflows from validated nodes and templates
- **Deploy** — Create, update, validate, and test workflows on the live n8n instance

## Workflow Process

```
tools_documentation
  → search_templates / search_nodes (parallel)
    → get_node (fetch details)
      → validate_node (minimal → full)
        → build workflow
          → validate_workflow
            → n8n_create_workflow (deploy)
```

## Core Principles

| Principle | Description |
|-----------|-------------|
| Silent Execution | Tools run without intermediate commentary |
| Parallel Execution | Independent operations run simultaneously |
| Templates First | Always check existing templates before building from scratch |
| Multi-Level Validation | Quick check → Full validation → Workflow validation → Post-deployment |
| Never Trust Defaults | Explicitly configure every parameter that controls behavior |

## Project Structure

```
.
├── .mcp.json          # MCP server configuration (n8n-mcp)
├── CLAUDE.md          # Operating instructions for Claude Code
└── README.md          # This file
```

## Security Note

The `.mcp.json` contains an API key in plaintext. Before committing or pushing:

1. Move secrets to a `.env` file or environment variables
2. Add `.env` to `.gitignore`
3. Reference env vars in `.mcp.json` instead of hardcoded values

## Resources

- [n8n Documentation](https://docs.n8n.io)
- [n8n MCP Server (GitHub)](https://github.com/czlonkowski/n8n-mcp)
- [n8n Templates](https://n8n.io/workflows)
