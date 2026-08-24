# 🧠 BLD Memory Trainer

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
   git clone <repository-url>
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

## File Structure

```
memorization_practice/
├── public/
│   ├── index.html           # Main HTML structure
│   └── styles.css           # Application styles
├── src/
│   ├── types.ts             # TypeScript type definitions
│   ├── app.ts              # Main application controller
│   ├── config/
│   │   └── drill-config.ts  # Drill mode configurations
│   ├── data/
│   │   └── pair-reference.json  # All letter pairs (AA-ZZ)
│   ├── services/
│   │   ├── pair-generator.ts    # Random pair generation
│   │   ├── timer.ts            # Timing functions
│   │   ├── session-manager.ts  # Session state management
│   │   ├── csv-exporter.ts     # CSV export functionality
│   │   └── quality-adapter.ts  # Quality metric logic
│   ├── storage/
│   │   └── session-storage.ts  # LocalStorage persistence
│   ├── ui/
│   │   ├── renderer.ts         # UI rendering functions
│   │   └── keyboard-handler.ts # Keyboard shortcuts
│   └── utils/
│       └── validators.ts       # Input validation
├── docs/
│   ├── application_brief.md    # Product specification
│   └── features/
│       └── 0001_PLAN.md       # Technical implementation plan
├── package.json
├── tsconfig.json
└── README.md
```

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

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT

---

**Happy training! 🎲🧠**
