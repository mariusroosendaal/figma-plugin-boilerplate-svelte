# Figma Plugin Boilerplate - Svelte + UI3 Kit

A modern Figma plugin boilerplate built with Svelte and the Figma UI3 Kit components.

## Features

- **Svelte Framework** - Modern, reactive UI framework
- **UI3 Kit Integration** - Pre-configured custom Figma UI component library
- **TypeScript Support** - Full type safety with configured tsconfig
- **Vite Build System** - Fast builds with custom plugin inlining
- **Hot Reload Development** - Watch mode for rapid iteration
- **Message Passing Setup** - Pre-wired communication between UI and plugin code
- **Working Demo** - Includes example shapes, text, tabs, and dropdowns
- **ESLint & Prettier** - Code quality and formatting tools configured

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone or download this boilerplate
2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the plugin:
   ```bash
   npm run build
   ```

4. Import the plugin in Figma:
   - Open Figma
   - Go to `Plugins > Development > Import Plugin from Manifest`
   - Select the `manifest.json` file from the `dist/` directory

### Development

For development with hot reload:

```bash
npm run dev
```

Then enable "Hot reload plugin" in Figma's Plugin Development menu.

## Available Scripts

- `npm run build` - Production build (outputs to `dist/`)
- `npm run dev` - Watch mode for development with hot reload
- `npm run lint` - Check code quality with ESLint and Prettier
- `npm run prettier` - Auto-format all code files

## How It Works

Figma plugins have two separate parts that communicate with each other:

1. **Plugin Sandbox** (`code.ts`) - Runs in Figma's sandbox environment with access to the Plugin API. This is where you create, modify, and read Figma nodes.

2. **UI Layer** (Svelte components) - Runs in an isolated iframe with no direct access to the Plugin API. This is your user interface.

These two parts communicate via `postMessage()`. The UI sends messages to the plugin code, and the plugin code can send messages back to update the UI.

### Build Process

The custom Vite configuration handles Figma's unique requirements:
- Inlines all CSS and JavaScript into a single HTML file (required by Figma)
- Keeps the UI bundle in `dist/index.html` and the plugin code in `dist/code.js`
- Handles SVG imports from the UI3 Kit library
- Copies `manifest.json` to the output directory

## Plugin Structure

```
├── src/
│   ├── code.ts          # Plugin logic (runs in Figma sandbox)
│   ├── main.js          # Entry point for UI
│   ├── PluginUI.svelte  # Main UI component
│   ├── index.html       # HTML template
│   ├── manifest.json    # Plugin configuration
│   ├── env.d.ts         # TypeScript environment definitions
│   └── styles/          # CSS variable reference files
│       ├── global.css   # UI3 Kit CSS variables
│       └── figma-development-theme.css  # Figma theme variables
├── dist/                # Built files (generated)
├── vite.config.ts       # Vite build configuration
└── package.json         # Dependencies and scripts
```

## Demo Components

The included demo showcases these UI3 Kit components:

- **Button** - Primary action buttons
- **Dropdown** - Dropdown selection menus
- **Tabs** - Tabbed navigation
- **Text** - Typography with variant styles
- **Input** - Text input fields
- **Label** - Form labels

## Writing Documentation

Use `README.template.md` as a starting point for your plugin's documentation. The template follows the standard structure used across all plugins in this collection:

- Clear, specific description
- Feature list with bold labels
- Step-by-step usage instructions
- Settings explanation (if applicable)
- Standard development section

See `AGENTS.md` in the repository root for detailed documentation guidelines and writing style conventions.

## Building Your Plugin

### Customization Checklist

Before building your own plugin, update these files:

1. **`src/manifest.json`** - Change the `name` and `id` fields to match your plugin
2. **`package.json`** - Update `name` and `description`
3. **`README.md`** - Use `README.template.md` as a starting point for your plugin's documentation
4. **`src/PluginUI.svelte`** - Replace the demo UI with your own interface
5. **`src/code.ts`** - Replace the demo logic with your plugin functionality

### Modifying the Demo

1. **UI Changes**: Edit `src/PluginUI.svelte`
2. **Plugin Logic**: Modify `src/code.ts`
3. **Styling**: Update the `<style>` section in the Svelte component

### CSS Variables & Styling

The `src/styles/` directory contains CSS variable reference files:

- **`global.css`** - UI3 Kit variables (colors, sizes, spacing, fonts)
- **`figma-development-theme.css`** - Figma's official theme variables

These files are for reference only (no need to import them). Use the variables in your custom styles:

```css
.my-element {
  color: var(--figma-color-text);
  padding: var(--size-small);
  background: var(--figma-color-bg);
  font-family: var(--figma-font-stack);
}
```

The UI3 Kit components automatically provide these variables, and Figma injects its theme variables when your plugin runs.

### Adding New UI Components

Import additional components from the UI3 Kit:

```javascript
import { NewComponent } from 'figma-ui3-kit-svelte';
```

### Communication Between UI and Plugin

The UI communicates with the plugin code via messages:

```javascript
// In UI (PluginUI.svelte)
function sendMessage(type, data = {}) {
    parent.postMessage({ pluginMessage: { type, ...data } }, '*');
}

// In plugin code (code.ts)
figma.ui.onmessage = async (msg) => {
    if (msg.type === 'your-action') {
        // Handle the action
    }
};
```

### Font Loading for Text Elements

When creating text elements in Figma, you must load the font first:

```javascript
// Load font before creating text
await figma.loadFontAsync({ family: "Inter", style: "Regular" });

const text = figma.createText();
text.characters = "Your text here";
```

## Building for Production

```bash
npm run build
```

This creates optimized files in the `dist/` directory ready for distribution.

## License

MIT License - feel free to use this boilerplate for your own Figma plugins.
