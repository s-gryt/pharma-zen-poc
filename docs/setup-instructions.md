# Development Environment Setup

## Prerequisites

### Required Software
- **Node.js:** Version 18.0.0 or higher ([Download](https://nodejs.org/))
- **npm:** Version 8.0.0 or higher (comes with Node.js)
- **Git:** Latest version ([Download](https://git-scm.com/))

### Recommended Tools
- **VS Code:** Primary IDE with extensions listed below
- **Chrome DevTools:** For debugging and performance profiling
- **React Developer Tools:** Browser extension for React debugging

## Initial Setup

### 1. Clone and Install
```bash
# Clone the repository
git clone <repository-url>
cd walgreens-poc

# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. VS Code Extensions
Install these extensions for optimal development experience:

**Essential Extensions:**
```
- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Auto Rename Tag
- Bracket Pair Colorizer 2
- indent-rainbow
- Material Icon Theme
```

**Code Quality Extensions:**
```
- ESLint
- Prettier - Code formatter
- StyleLint
- Thunder Client (API testing)
- GitLens — Git supercharged
```

**Optional but Recommended:**
```
- Auto Import - ES6, TS, JSX, TSX
- CSS Peek
- HTML CSS Support
- IntelliSense for CSS class names
- Path Intellisense
```

### 3. VS Code Settings
Create `.vscode/settings.json` in project root:

```json
{
  "editor.formatOnSave": true,
  "editor.formatOnPaste": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.fixAll.stylelint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "css.validate": false,
  "scss.validate": false,
  "stylelint.validate": ["css", "scss"],
  "files.associations": {
    "*.css": "scss"
  },
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

## Package Scripts

### Development
```bash
# Start development server (http://localhost:8080)
npm run dev

# Run with host exposure (for mobile testing)
npm run dev -- --host

# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Quality
```bash
# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Style linting
npm run stylelint
npm run stylelint:fix

# Check for duplicate code
npm run jscpd
```

### Testing
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run specific test file
npm run test ProductCard.test.tsx
```

## Environment Configuration

### Environment Variables
Create `.env.local` file in project root:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:3001/api
VITE_API_TIMEOUT=10000

# Application Configuration  
VITE_APP_NAME="Walgreens POC"
VITE_APP_VERSION="1.0.0"

# Feature Flags
VITE_ENABLE_MOCK_API=true
VITE_ENABLE_DEBUG_MODE=true

# Authentication
VITE_AUTH_COOKIE_NAME="walgreens_auth"
VITE_AUTH_EXPIRE_DAYS=7
```

### TypeScript Configuration
Verify `tsconfig.json` includes strict settings:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true
  }
}
```

## Browser Setup

### Chrome Extensions
Install these for enhanced development experience:

1. **React Developer Tools** - Debug React components
2. **Redux DevTools** - State management debugging (if needed later)
3. **Lighthouse** - Performance and accessibility auditing
4. **Web Vitals** - Core web vitals monitoring
5. **Colorblinding** - Accessibility testing

### Developer Tools Configuration
Enable these Chrome DevTools settings:
- **Console:** Preserve log on navigation
- **Network:** Disable cache while DevTools is open
- **Performance:** Enable advanced paint instrumentation
- **Application:** Show detailed cookie information

## Git Configuration

### Pre-commit Hooks
Install Husky for automated code quality checks:

```bash
# Install husky
npm install --save-dev husky

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run lint && npm run type-check"

# Add commit-msg hook for conventional commits
npx husky add .husky/commit-msg "npx commitlint --edit \$1"
```

### Commit Message Convention
Use conventional commits format:

```bash
# Feature
git commit -m "feat(product-catalog): add search functionality"

# Bug fix
git commit -m "fix(auth): resolve login redirect issue"

# Documentation
git commit -m "docs(api): update endpoint specifications"

# Refactoring
git commit -m "refactor(cart): extract cart calculations to hook"

# Style changes
git commit -m "style(button): update hover state colors"

# Tests
git commit -m "test(product-card): add integration tests"
```

## Debugging Setup

### VS Code Launch Configuration
Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Chrome",
      "request": "launch",
      "type": "node",
      "program": "${workspaceFolder}/node_modules/.bin/vite",
      "args": ["--mode", "development"],
      "console": "integratedTerminal"
    },
    {
      "name": "Attach to Chrome",
      "port": 9222,
      "request": "attach",
      "type": "chrome",
      "webRoot": "${workspaceFolder}/src",
      "sourceMaps": true
    }
  ]
}
```

### Browser Debugging
Launch Chrome with debugging enabled:

```bash
# Windows
chrome.exe --remote-debugging-port=9222

# macOS  
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222

# Linux
google-chrome --remote-debugging-port=9222
```

## Performance Monitoring

### Bundle Analysis
```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist

# Check for unused dependencies
npx depcheck

# Audit dependencies for vulnerabilities
npm audit
npm audit fix
```

### Development Server Optimization
Add to `vite.config.ts` for optimal development performance:

```typescript
export default defineConfig({
  server: {
    host: '::',
    port: 8080,
    hmr: {
      overlay: true
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@mui/material', '@emotion/react']
  }
});
```

## Troubleshooting

### Common Issues

**1. Module Resolution Errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
```

**2. TypeScript Errors**
```bash
# Restart TypeScript language server in VS Code
Cmd/Ctrl + Shift + P -> "TypeScript: Restart TS Server"

# Check TypeScript version
npx tsc --version
```

**3. Styling Issues**
```bash
# Rebuild Tailwind CSS
npm run build:css

# Clear browser cache
Cmd/Ctrl + Shift + R (hard refresh)
```

**4. Hot Reload Not Working**
- Check file permissions
- Verify file paths use forward slashes
- Restart development server
- Check antivirus software interference

### Getting Help
1. Check this documentation first
2. Search existing GitHub issues
3. Ask in team Slack channel
4. Create detailed GitHub issue with reproduction steps

## Next Steps
After setup completion:
1. Run `npm run dev` to verify everything works
2. Open browser to `http://localhost:8080`
3. Verify hot reload by editing a component
4. Run test suite with `npm run test`
5. Check code quality with `npm run lint`