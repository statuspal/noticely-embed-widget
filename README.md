# Status Widget

A simple, embeddable status widget built with Preact. Shows a clean status indicator that can be positioned anywhere on your website.

## 🚀 Quick Start

### 1. Set Configuration

```html
<script>
  window.NoticelyWidgetConfig = {
    subdomain: 'your-subdomain' // Required for widget initialization
  };
</script>
```

### 2. Include Widget

```html
<script src="widget.iife.js"></script>
```

The widget automatically appears when the page loads!

## ⚙️ Configuration Options

### Required

- **`subdomain`** (string): Required for widget initialization

### Optional (with defaults)

| Option     | Default          | Description                                                    |
| ---------- | ---------------- | -------------------------------------------------------------- |
| `position` | `'bottom-right'` | `'top-left'`, `'top-right'`, `'bottom-left'`, `'bottom-right'` |
| `enabled`  | `true`           | `true`/`false` - whether to show the widget                    |
| `theme`    | `'light'`        | `'light'` or `'dark'` theme                                    |

### Example Configuration

```javascript
window.NoticelyWidgetConfig = {
  subdomain: 'my-company', // Required
  position: 'top-right', // Optional
  theme: 'dark' // Optional
};
```

## 🛠️ Development

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
npm install
npm run dev    # Development server at http://localhost:5173 with demo page
```

### Build

```bash
npm run build  # Creates widget.iife.js in dist/
```

### Testing

Open http://localhost:5173 during development to see the demo page with interactive controls.

## 📁 Project Structure

```
src/
├── widget.tsx       # Main widget component
└── widget.css       # Widget styles
```

## 🎨 Features

- **Lightweight**: Built with Preact
- **Responsive**: Works on mobile and desktop
- **Themeable**: Light and dark themes
- **Positioned**: Four corner positions
- **Interactive**: Close button to hide widget

## 📖 API Reference

### Global API

The widget provides a simple global API:

```javascript
window.NoticelyWidget = {
  create: function () {
    // Creates/recreates the widget using window.NoticelyWidgetConfig
  },
  destroy: function () {
    // Removes the widget from the page
  }
};
```

### Auto-initialization

The widget automatically initializes when:

1. `window.NoticelyWidgetConfig` is defined with a `subdomain`
2. The DOM is ready
3. `enabled` is not `false`

## 🔧 Usage Examples

### Basic HTML

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Website</title>
  </head>
  <body>
    <h1>Welcome</h1>

    <script>
      window.NoticelyWidgetConfig = {
        subdomain: 'my-company'
      };
    </script>
    <script src="widget.iife.js"></script>
  </body>
</html>
```

### With Custom Theme & Position

```html
<script>
  window.NoticelyWidgetConfig = {
    subdomain: 'my-company',
    theme: 'dark',
    position: 'top-left'
  };
</script>
<script src="widget.iife.js"></script>
```

## ❌ Error Handling

If `window.NoticelyWidgetConfig` is missing or doesn't have a `subdomain`:

- Console error is logged with helpful message
- Widget doesn't initialize
- No DOM elements are created

If `enabled: false`:

- Widget doesn't render
- No console errors

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b my-feature`
3. Make changes and test with `npm run dev`
4. Format code: `npm run format`
5. Submit a pull request

## 📄 License

MIT License
