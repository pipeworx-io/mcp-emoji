# mcp-emoji

Emoji MCP.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `emoji_lookup` | Look up an emoji by :shortcode: (e.g. ":fire:" or "fire") to get the character + keywords, OR pass an emoji character to get its shortcode/name. Keyless, offline. |
| `search_emoji` | Search emoji by keyword/name (e.g. "party", "money", "animal") and return matching emoji with shortcodes. Keyless, offline. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "emoji": {
      "url": "https://gateway.pipeworx.io/emoji/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Emoji data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
