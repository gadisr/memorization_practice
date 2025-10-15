# Development Guide

## Running the Application

### Option 1: Python Development Server (Recommended)

The easiest way to run the application for development:

```bash
python serve.py
```

Then open: `http://localhost:8000/public/`

### Option 2: Compile TypeScript First

If you prefer to compile TypeScript to JavaScript:

1. Install TypeScript:
   ```bash
   npm install -g typescript
   ```

2. Compile TypeScript files:
   ```bash
   tsc
   ```

3. Start any web server:
   ```bash
   python -m http.server 8000
   ```

### Option 3: Use a Modern Dev Server

Use Vite for hot module reloading:

```bash
npm install -D vite
npx vite
```

## Browser Compatibility Note

Modern browsers don't natively execute `.ts` files. The Python server in Option 1 serves `.ts` files with the JavaScript MIME type, which works for development **only if your browser supports ES modules and the TypeScript syntax is simple** (no advanced types in runtime code).

For production or broader compatibility:
- Compile TypeScript to JavaScript using `tsc`
- Or use a bundler like Vite/Webpack

## File Modifications

When editing files:

1. **TypeScript files** (`src/**/*.ts`) - Contains types and logic
2. **HTML** (`public/index.html`) - UI structure  
3. **CSS** (`public/styles.css`) - Styling

Changes are reflected on browser refresh (no build step needed for simple TS).

## Testing

Manual testing workflow:

1. Start dev server
2. Open browser
3. Test each drill mode
4. Verify session saving
5. Check CSV export
6. Test keyboard shortcuts

## Known Limitations

- LocalStorage has 5-10MB limit
- No automated tests yet (planned for Phase 4)
- TypeScript compilation recommended for production

## Browser DevTools

Use browser console to debug:
- Check localStorage: `localStorage.getItem('bld_trainer_sessions')`
- Clear data: `localStorage.clear()`
- View sessions: Open DevTools → Application → Local Storage


