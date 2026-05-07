# ChessDaddy Installation Guide

## Quick Start (Easiest Method)

### Step 1: Download and Extract

1. Go to the [Releases page](https://github.com/typp3212/chessdaddy/releases)
2. Download the latest `ChessDaddy.exe` file
3. Run the installer
4. Launch ChessDaddy from your Start Menu or Desktop

**That's it!** The app includes Stockfish and everything needed.

---

## Building from Source

If you want to build from source or contribute:

### Prerequisites

- **Node.js** (v16+): [Download here](https://nodejs.org)
- **Git**: [Download here](https://git-scm.com)
- **Visual C++ Build Tools** (optional, for native modules)

### Step 1: Clone Repository

```bash
git clone https://github.com/typp3212/chessdaddy.git
cd chessdaddy
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs all required packages including React, Electron, chess.js, etc.

### Step 3: Download Stockfish 18

1. Go to [stockfishchess.org/download](https://stockfishchess.org/download/)
2. Download the **Windows** binary (choose AVX2 version if unsure)
3. Extract the ZIP file
4. Create a folder in the project: `mkdir engines`
5. Copy `stockfish.exe` into the `engines` folder

Your folder structure should look like:
```
chessdaddy/
├── engines/
│   └── stockfish.exe
├── src/
├── public/
└── package.json
```

### Step 4: Run in Development Mode

```bash
npm start
```

This opens the app in development mode with hot reload.

### Step 5: Build the Windows Executable

```bash
npm run build-exe
```

The compiled `.exe` file will be in the `dist/` folder.

---

## Verification

### Verify Stockfish is found:
```bash
dir engines
```
Should show `stockfish.exe`

### Verify Node.js installation:
```bash
node --version
npm --version
```

### Verify Git installation:
```bash
git --version
```

---

## Troubleshooting

### "Stockfish not found"
- Check that `stockfish.exe` exists in the `engines/` folder
- Verify the file path is correct
- Download Stockfish again if corrupted

### "Module not found" errors
```bash
rm -r node_modules
npm cache clean --force
npm install
```

### App won't start in development
```bash
# Kill any existing processes
killall node    # macOS/Linux
taskkill /F /IM node.exe  # Windows

# Clear cache and restart
npm cache clean --force
npm install
npm start
```

### Build fails
- Ensure you have at least 2GB free disk space
- Close antivirus temporarily during build
- Try building again: `npm run build-exe`

---

## System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| OS | Windows 10 64-bit | Windows 10/11 64-bit |
| RAM | 2GB | 4GB+ |
| Storage | 500MB | 1GB |
| Processor | Intel i5 or equivalent | Intel i7 or better |

---

## Build Customization

### Change Application Name
Edit `package.json`:
```json
{
  "name": "my-chess-app",
  "build": {
    "appId": "com.myapp.chess",
    "productName": "My Chess App"
  }
}
```

### Change Stockfish Path
Edit `src/services/ChessEngine.ts`:
```typescript
const stockfishPath = './engines/stockfish.exe'; // Change this path
```

### Build for Different Architectures
```bash
# 32-bit
npm run build-exe -- --ia32

# Portable (no installer)
npm run build-exe -- --portable
```

---

## Advanced Setup

### Using Different Engine

Replace Stockfish with another UCI engine:
1. Download the engine binary
2. Place in `engines/` folder
3. Update `ChessEngine.ts` with new path

### Enable Engine Debugging

Set environment variable before running:
```bash
set DEBUG=chessdaddy:* && npm start  # Windows
export DEBUG=chessdaddy:* && npm start  # macOS/Linux
```

### Custom Engine Configuration

Edit `src/services/StockfishWorker.ts` to adjust:
- Hash table size (default 256MB)
- Thread count (default: system cores)
- Analysis depth (default: 20)

---

## System Path Setup (Optional)

Add ChessDaddy to PATH for terminal access:

1. Build the application
2. Copy to a stable location: `C:\Program Files\ChessDaddy\`
3. Add to PATH environment variable
4. Access from terminal: `chessdaddy` or `start chessdaddy`

---

## Next Steps

1. Launch the application
2. Go to Settings to configure preferences
3. Try the Analysis Board with a FEN position
4. Fetch your Chess.com games and analyze them
5. Play puzzle mode

For more help, see [README.md](./README.md)
