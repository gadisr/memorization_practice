# 🚀 Quick Start Guide

## Get Running in 30 Seconds

### Method 1: Python (Easiest)

```bash
python serve.py
```

Open browser to: **http://localhost:8000/public/**

### Method 2: Compile TypeScript First (Recommended for Production)

Since browsers cannot execute `.ts` files directly, compile to JavaScript:

```bash
# Install TypeScript (one time)
npm install

# Compile TypeScript to JavaScript  
npm run build

# Serve the application
npm run serve
```

Open browser to: **http://localhost:8000/public/**

## What You Can Do

1. **Select a drill mode** - Flash Pairs, Chains, Journey, etc.
2. **Start training** - See pairs appear one at a time
3. **Rate your performance** - Vividness (1-5) or Flow (1-3)
4. **Track progress** - View stats and export to CSV

## Keyboard Shortcuts

- `Space` - Next pair
- `Enter` - Save session
- `1-5` - Quick rating
- `Esc` - Cancel

## File Structure

```
/public/index.html  → Open this in your browser
/src/*.ts          → TypeScript source files
/src/data/         → Letter pair reference (AA-ZZ)
```

## Troubleshooting

**Problem:** Browser shows "Module not found" errors  
**Solution:** Make sure you're running a local server, not opening the HTML file directly

**Problem:** TypeScript errors in console  
**Solution:** Run `npm run build` to compile TypeScript to JavaScript first

**Problem:** Data not saving  
**Solution:** Check that localStorage is enabled in your browser

## Next Steps

- Read [README.md](README.md) for full documentation
- See [DEVELOPMENT.md](DEVELOPMENT.md) for development setup
- Check [docs/application_brief.md](docs/application_brief.md) for product details


