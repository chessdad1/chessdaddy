# Complete Setup & Quick Start Guide

## For Absolute Beginners

This guide walks you through everything step-by-step with no prior coding experience required.

### What You Need to Download

1. **Node.js** - Programming tools (required)
   - Go to [nodejs.org](https://nodejs.org)
   - Click "LTS" (Long Term Support) - it's the green button
   - Download and run the installer
   - Keep clicking "Next" with default settings
   - When done, close the installer

2. **Git** - Version control software (required)
   - Go to [git-scm.com](https://git-scm.com)
   - Click the Windows download
   - Run the installer
   - Keep clicking "Next" with default settings

3. **Stockfish 18** - Chess engine (required)
   - Go to [stockfishchess.org/download](https://stockfishchess.org/download/)
   - Click "Windows" or "Windows modern CPU"
   - Extract the ZIP file to your Downloads folder

### Step 1: Open Terminal (Command Prompt)

**Windows:**
1. Press `Win + R` key
2. Type `cmd` and press Enter
3. You should see a black window with white text

### Step 2: Navigate to Your Projects Folder

In the terminal, type:
```bash
cd Desktop
```
Press Enter.

### Step 3: Clone the ChessDaddy Project

In the terminal, copy and paste this entire line:
```bash
git clone https://github.com/typp3212/chessdaddy.git
```
Press Enter and wait (30 seconds to 2 minutes).

### Step 4: Go Into the Project Folder

In the terminal, type:
```bash
cd chessdaddy
```
Press Enter.

### Step 5: Set Up Stockfish

**IMPORTANT:** Follow these exact steps:

1. In Windows File Explorer, open your Downloads folder
2. Find the Stockfish ZIP file you downloaded
3. Right-click → "Extract All"
4. Click "Extract" when the dialog appears
5. Open the extracted folder - you'll see `stockfish.exe`
6. Right-click `stockfish.exe` and select "Copy"
7. In the same File Explorer window, navigate to: `Desktop → chessdaddy`
8. If there's no `engines` folder, create one:
   - Right-click in empty space → "New Folder"
   - Name it `engines`
9. Open the `engines` folder
10. Right-click in empty space and select "Paste"
11. You should now see `stockfish.exe` inside the `engines` folder

### Step 6: Install Project Dependencies

Back in the terminal, type:
```bash
npm install
```
Press Enter and wait. This takes 2-5 minutes. You'll see lots of text scrolling.

### Step 7: Start the Application

In the terminal, type:
```bash
npm start
```
Press Enter. Wait 30-60 seconds. You should see:
```
Electron app has started
```

The ChessDaddy window should open automatically!

### Step 8: Verify Everything Works

In the app:
1. Click "Analysis" in the left sidebar
2. You should see a chessboard
3. The "Engine Analysis" section should appear on the right
4. Try clicking a square on the board

**If you see errors:** See the "Troubleshooting" section below.

---

## Building the Final .EXE

Once everything is working, create the Windows installer:

### In the Terminal:

```bash
npm run build-exe
```

Wait 2-5 minutes. When done, you'll see:
```
Build Complete
```

### Find Your .EXE:

1. Open File Explorer
2. Navigate to: `Desktop → chessdaddy → dist`
3. You'll see `ChessDaddy.exe` - this is your standalone application!
4. Copy it anywhere or share it with others
5. Double-click to run anytime

---

## File Structure (What Each Folder Does)

```
chessdaddy/               ← Main project folder
├── engines/              ← Stockfish executable goes here
│   └── stockfish.exe     ← Chess engine
├── src/                  ← Source code (React components)
│   ├── components/       ← UI screens
│   ├── services/         ← Engine & API code
│   └── styles/           ← Styling
├── public/               ← HTML template & Electron config
├── dist/                 ← Built .EXE file (created after npm run build-exe)
├── build/                ← Compiled React files
├── node_modules/         ← Dependencies (created by npm install)
├── package.json          ← Project configuration
└── README.md             ← Full documentation
```

---

## Troubleshooting

### "npm: command not found"
**Solution:** Node.js not installed properly
1. Restart your computer
2. Open terminal and type: `node --version`
3. If still error, reinstall Node.js from nodejs.org

### "git: command not found"
**Solution:** Git not installed properly
1. Restart your computer
2. Reinstall Git from git-scm.com

### "Stockfish not found" error when running the app
**Solution:** File not in correct location
1. Check: `Desktop → chessdaddy → engines`
2. Verify `stockfish.exe` is there (exact filename)
3. If not, see "Step 5" above again
4. Restart the app

### "npm install" is stuck or very slow
**Solution:** Interrupt and retry
1. Press `Ctrl + C` in the terminal (stops current command)
2. Type: `npm cache clean --force`
3. Type: `npm install` again

### App window won't open
**Solution:** Check terminal for errors
1. In the terminal, look for red error messages
2. Take a screenshot of the error
3. Visit: https://github.com/typp3212/chessdaddy/issues
4. Create a new issue with the error message

### "Cannot find module" errors
**Solution:** Dependencies not installed
1. Make sure you're in the `chessdaddy` folder
2. Delete the `node_modules` folder:
   ```bash
   rmdir /s /q node_modules
   ```
3. Run `npm install` again

### Build fails with "not found" errors
**Solution:** Dependencies need reinstall
```bash
rm -r node_modules
npm cache clean --force
npm install
npm run build-exe
```

---

## Common Questions

### Q: Can I share the .EXE with friends?
**A:** Yes! Copy `ChessDaddy.exe` and send it. It includes everything they need.

### Q: Does it need internet?
**A:** No (except for Chess.com game fetching). Stockfish is local.

### Q: Can I change the name/icon?
**A:** Yes, but requires code edits. See `INSTALLATION.md`

### Q: How do I uninstall?
**A:** Just delete the `ChessDaddy.exe` file. No registry changes.

### Q: Can I use a different chess engine?
**A:** Yes, but requires code edits. See `INSTALLATION.md`

---

## Support

If you get stuck:
1. Check this document again
2. See `INSTALLATION.md` for more details
3. Open an issue: https://github.com/typp3212/chessdaddy/issues
4. Include:
   - What you were doing
   - The exact error message
   - Your Windows version (Right-click "This PC" → Properties)

---

**Congratulations!** You now have a fully functional chess analysis application with Stockfish!
