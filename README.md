# BLD Memory Trainer

Live site: https://blindfoldcubing.com

A lightweight web-based training application for blindfold cubers to improve visualization speed, story fluency, and recall accuracy using personalized letter-pair systems.

## Features

### Training Modes

- **Flash Pairs** - Display single letter pairs randomly (30 pairs, Vividness metric) 
- **2-Pair Fusion** - Form single mini-scenes from 2 pairs (10 pairs, Vividness metric)
- **3-Pair Chain** - Progressive chaining of 3 pairs (5 pairs, Vividness metric)
- **8-Pair Chain** - Continuous scene building (8 pairs, Flow metric)
- **Journey Mode** - Memory Palace chaining across rooms (15 pairs, Flow metric)
- **Full Cube Simulation** - Realistic BLD memo practice (20 pairs, Flow metric)

### Quality Metrics

- **Vividness (1-5)** - For short drills: Blurry → Dim → Clear → Vivid → Crystal
- **Flow (1-3)** - For long drills: Choppy → Smooth → Seamless

### Features

- ✅ Automatic timing per pair
- ✅ Adaptive quality metrics based on drill type
- ✅ Session tracking with recall accuracy
- ✅ CSV export for Google Sheets integration
- ✅ Dashboard with statistics
- ✅ Keyboard shortcuts for faster training
- ✅ Offline-first, no internet required
- ✅ Mobile-responsive design

## Getting Started

### Quick Start (No Build Required)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/gadisr/memorization_practice.git
   cd memorization_practice
   ```

2. **Start a local server:**
   
   Using Python:
   ```bash
   python -m http.server 8000
   ```
   
   Or using Node.js:
   ```bash
   npx http-server -p 8000
   ```

3. **Open in browser:**
   ```
   http://localhost:8000/public/
   ```

### Alternative: Direct File Access

Some browsers allow opening `public/index.html` directly, but a local server is recommended for proper module loading.

## Usage

### Starting a Training Session

1. Select your desired drill type from the dropdown
2. Adjust the number of pairs (or use the default)
3. Click "Start Session"
4. For each pair:
   - Visualize the image clearly
   - Press "Next" or Space bar when ready
5. After all pairs, rate your performance:
   - Quality (Vividness or Flow)
   - Number of pairs recalled correctly
   - Optional notes
6. Click "Save Session"

### Keyboard Shortcuts

- **Space** - Next pair (during session)
- **Enter** - Save session (on rating screen)
- **1-5** - Quick quality rating
- **Escape** - Cancel session

### Viewing Progress

- Click "View Dashboard" to see statistics
- Export your data to CSV for analysis
- Track improvements over time

## Data Storage

Drill sessions and stats stay in your browser's localStorage (key prefix `bld_trainer_`). Optional sign-in uses Firebase. The live site also uses Google Analytics.

- **Storage location:** Browser localStorage
- **Key prefix:** `bld_trainer_`
- **Export format:** CSV compatible with Google Sheets
- **Storage limit:** ~5-10MB (~25,000 sessions)

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires ES6 module support.

## Development

### TypeScript Compilation (Optional)

If you want to compile TypeScript to JavaScript:

```bash
npm install -g typescript
tsc
```

The app currently uses vanilla JavaScript with `.ts` file extensions and type annotations in comments for development convenience.

### Future Enhancements

- Analytics dashboard with charts
- Google Sheets API integration
- Custom pair library editor
- PWA conversion for mobile installation
- Audio mode for pairs
- Scene recall mode

## Production Deployment

### Architecture

The production deployment uses:
- **edge-proxy** (container `edge-nginx`) on host ports 80/443 for routing
- **bld_trainer_frontend** and **bld_trainer_api** containers on the external Docker network `edge`
- The app's own nginx service is NOT used in production (would conflict with edge-proxy)

### Deployment Process

The app deploys automatically via GitHub Actions on push to `main`:

1. SSH into the production droplet
2. Pull latest code from `main` branch
3. Rebuild and restart only `frontend` and `backend` containers:
   ```bash
   docker compose -f docker-compose.yml up -d --build --no-deps frontend backend
   ```

**Important:** The workflow does NOT:
- Start the nginx service (conflicts with edge-proxy)
- Use `docker-compose.prod.yml` (not needed for edge-proxy setup)
- Use `--remove-orphans` flag (would affect other stacks)

### Required GitHub Secrets

Configure these in repository Settings → Secrets and variables → Actions:
- `DEPLOY_HOST` - Droplet IP or hostname
- `DEPLOY_USER` - SSH username
- `DEPLOY_SSH_PRIVATE_KEY` - Private key for SSH authentication (no passphrase)
- `DEPLOY_PATH` - App directory on droplet (e.g., `/root/memorization_practice`)

### Manual Deployment

To deploy manually on the production server:

```bash
cd /root/memorization_practice
git pull origin main
docker compose -f docker-compose.yml up -d --build --no-deps frontend backend
```

### Network Configuration

The `docker-compose.yml` is configured for production edge-proxy compatibility:
- `backend` and `frontend` use `expose` (not `ports`) to avoid binding host ports
- Both services join the external `edge` network for edge-proxy routing
- Frontend `API_BASE_URL` is set to `/api/v1` (proxied by edge-nginx)

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT
