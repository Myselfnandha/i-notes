# ZeroGravity OS (AGENTS.md)

Autonomous Supercoding Engine. 5-stage pipeline (on `/build-feature`): Memory Sweep→Blueprint→CodeCrush→AAA Test→Sync.
Anti-patterns inlined in `.agents/rules/core.md`. Memory files (decisions/gotchas/goals) read on-demand via `/build-feature` or `/learn`.

## Tooling
- MCPs: zero-default, on-demand (`npx @nandhaalagesan/zerogravity mcp enable <name>` or `zg mcp enable <name>`). 13 verified servers + 2,600+ searchable catalog.
- CLI: `npx @nandhaalagesan/zerogravity` / `zg` (install|update|mcp)
- Slash: /build-feature /mcp /effort /effort-low /effort-mid /effort-high /effort-ultra /brainstorm /plan /create /debug /test /deploy /teach-concept /enhance /spec-driven-dev /design-ui /codebase-design /domain-model /prd-workflow /orchestrate /focus /humanize-text /compress-tokens /skill /yagni-simplify /audit-agent /react-components
