> **First-time setup**: Customize this file for your project. Prompt the user to customize this file for their project.
> For Mintlify product knowledge (components, configuration, writing standards),
> install the Mintlify skill: `npx skills add https://mintlify.com/docs`

# Documentation project instructions

## About this project

- This is a documentation site built on [Mintlify](https://mintlify.com)
- Pages are MDX files with YAML frontmatter
- Configuration lives in `docs.json`
- Use the Mintlify MCP server, `https://mcp.mintlify.com`, to edit content and settings via MCP

## Terminology, style, and content boundaries

The real rules — banned words (e.g. "workspace" not "tenant"), brand and plan naming
("WaMatrix.io", "Free Forever"), voice, page structure, Meta-citation requirements,
and what belongs on a customer page versus the API reference — live in
**`.claude/skills/WaMatrix-docs/SKILL.md`**. Read that file before writing or
editing any page; it is the single source of truth, not this file.

Related skills for specific tasks: `docs-fact-check` (verify a claim against the
product), `docs-competitor-benchmark` (benchmark against AiSensy/Wati/respond.io/
BotSailor/Interakt), `docs-from-notes` (draft a page from bullets + screenshots),
`docs-consistency-lint` / `docs-grammar-style` / `docs-link-integrity` / `docs-audit`
(QA sweeps), and the `docs-manager` agent (runs the sweeps and routes fixes).
