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

## WhatsApp Auto-Coder

This repo includes an autonomous n8n workflow that turns WhatsApp messages into GitHub PRs. Send a task via WhatsApp, get a built project pushed and merged.

### Architecture

```
WhatsApp (Twilio/Meta webhook)
    ↓
n8n Webhook Trigger
    ↓
Parse Message → Safety Gate → OWL Agent (OpenRouter)
    ↓
Claude Code (headless `claude -p`)
    ↓
GitHub Pipeline (gh CLI: repo → push → PR → merge)
    ↓
WhatsApp response (status update)
```

### Quick Start

1. Copy `.env.example` to `.env` and fill in credentials
2. Import workflows into n8n:
   ```bash
   n8n import:workflow --input=workflows/whatsapp-auto-coder.json
   n8n import:workflow --input=workflows/github-pipeline.json
   ```
3. Configure WhatsApp webhook to point to `http://<n8n-host>:5678/webhook/auto-coder`
4. Activate the workflow and send a test message

## Project Structure

```
.
├── .env.example              # Environment variable template for Auto-Coder
├── .env                     # Your secrets (gitignored)
├── CLAUDE.md                # Operating instructions for Claude Code
├── README.md                # This file
├── scripts/
│   ├── parse-whatsapp.js    # WhatsApp message parser (reference)
│   └── safety-check.js      # Safety gate logic (reference)
├── prompts/
│   ├── agent-system-prompt.md    # OWL agent system prompt (reference)
│   └── claude-code-template.md    # Claude Code prompt template (reference)
└── workflows/
    ├── whatsapp-auto-coder.json    # Main Auto-Coder workflow (import into n8n)
    └── github-pipeline.json        # GitHub sub-workflow (import into n8n)
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
