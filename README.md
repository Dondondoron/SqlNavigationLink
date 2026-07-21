# SQL Nav Link

**SQL Nav Link** bridges your SQL scripts and SQLMesh models with VS Code. It uses an underlying Python engine (`sqlglot`/`SQLMesh`) to scan SQL files, extract table definitions, and provide **Go to Definition / Peek Definition** support across your entire data project.

---

## Features

* 🔍 **Smart SQL Definition Provider:** `Ctrl+Click` / `F12` on any table or model name in a `.sql` file to jump straight to its model definition or references across your workspace.
* 🌲 **Custom Path Sidebar View:** Add and manage custom folders or file target lists via the `SQL Nav Link` view container.
* 🐍 **Automatic Python Detection:** Automatically resolves Python from the official `ms-python.python` extension, local `.venv` environments, or a user-configured path.
* ⚡ **On-Demand SQL Parsing:** Crawls files and ASTs directly without requiring a background LSP process.

---

## Extension Settings

This extension contributes the following settings:

* `Dondondoron.sql-nav-link.pythonPath`: Specifies the absolute path to the Python executable used to run the background SQL crawler.

### Example `settings.json`:
```json
{
  "Dondondoron.sql-nav-link.pythonPath": "C:\\Python311\\python.exe"
}
```

> **Note:** If left unset, the extension will attempt to query your active VS Code Python environment or fallback to a `.venv` directory located in the extension root.

---

## Commands

The extension exposes the following commands via the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) or the Sidebar UI:

| Command | Description |
| :--- | :--- |
| `sql-nav-link.parsePaths` | Crawls and parses all configured paths or active workspace folders to update table definitions. |
| `sql-nav-link.addPath` | Adds a file or folder path to the sidebar Tree View. |
| `sql-nav-link.removePath` | Removes a selected path item from the sidebar Tree View. |
| `sql-nav-link.runPythonApp` | Runs the Python app with the current target paths passed via the integrated terminal. |

---

## Getting Started

1. **Prerequisites:** Ensure Python 3.9+ is installed along with the required Python libraries (`sqlglot`, `sqlmesh`, `pydantic`).
2. **Setup:** Open your SQL repository in VS Code.
3. **Parse Models:** 
   * Open the Command Palette (`Ctrl+Shift+P`) and run **`sql-nav-link.parsePaths`**.
   * Alternatively, use the **SQL Nav Link** sidebar view to add specific folders and trigger path indexing.
4. **Navigate:** Open any `.sql` file, hover over or `Ctrl+Click` (`Cmd+Click` on macOS) a table reference to navigate directly to its definition file.

---

## Requirements

* VS Code `1.80.0` or higher
* Python `3.9+`
* Python dependencies:
  ```bash
  pip install sqlglot sqlmesh pydantic
  ```

---