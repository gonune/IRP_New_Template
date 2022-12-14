# Contributing

This section contains sub-project level contribution guidance. For over-arching standard operating procedures, please see [the Getting Started page](/docs/gettingStarted/README.md#contributing--developing).

## React JavaScript application

[Link to relevant codebase subdirectory]()

- Add to your workspace settings.json:
  ```
  "editor.formatOnSave": true,
  "editor.formatOnPaste": true,
  "typescript.format.enable": true,
  "[typescript]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  ```
- All comments should be in the format: `// The first letter is capitalized`
- Always leave "To Do" notes commented with the format: `// TODO: ...`
- All utility functions must be exported from the main `src/Webui/src/util/index.ts` file

## More coming soon...
