# Cursor Show

A lightweight Electron overlay that renders a visible cursor on top of everything — useful when games or fullscreen apps hide the system cursor.

## How it works

Runs as a transparent, always-on-top, click-through fullscreen window. Tracks the real cursor position at ~60fps and draws an arrow cursor SVG exactly where your mouse is, visible over any application including games.

## Usage

| Action | Result |
|--------|--------|
| `Shift+0` | Toggle cursor visibility on/off |
| Tray icon click | Toggle cursor visibility |
| Tray → Salir | Exit the app |

The app starts minimized in the system tray. Press `Shift+0` whenever you need to see your cursor.

## Installation

Download the latest installer from [Releases](../../releases) and run it. No configuration needed.

## Build from source

```bash
npm install
npm start        # run in dev mode
npm run build    # build installer
```

## Requirements

- Windows 10/11
- No admin rights needed

---

Made by [Crintech](https://github.com/Crinlorite)
