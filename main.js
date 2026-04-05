const { app, BrowserWindow, globalShortcut, screen, Tray, Menu } = require('electron')
const path = require('path')

let overlayWindow = null
let tray = null
let cursorInterval = null
let isVisible = false

function createOverlay() {
  const { bounds } = screen.getPrimaryDisplay()

  overlayWindow = new BrowserWindow({
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    transparent: true,
    frame: false,
    skipTaskbar: true,
    focusable: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  overlayWindow.setAlwaysOnTop(true, 'screen-saver')
  overlayWindow.setIgnoreMouseEvents(true)
  overlayWindow.loadFile(path.join(__dirname, 'overlay.html'))
  overlayWindow.on('closed', () => { overlayWindow = null })
}

function startCursorUpdate() {
  if (cursorInterval) return
  cursorInterval = setInterval(() => {
    if (!overlayWindow || overlayWindow.isDestroyed()) return
    const pos = screen.getCursorScreenPoint()
    overlayWindow.webContents.send('cursor-pos', pos)
  }, 16) // ~60fps
}

function stopCursorUpdate() {
  if (cursorInterval) { clearInterval(cursorInterval); cursorInterval = null }
}

function showCursor() {
  if (!overlayWindow || overlayWindow.isDestroyed()) {
    createOverlay()
    overlayWindow.webContents.once('did-finish-load', () => {
      overlayWindow.webContents.send('show', true)
    })
  } else {
    overlayWindow.webContents.send('show', true)
  }
  startCursorUpdate()
  isVisible = true
  updateTray()
}

function hideCursor() {
  if (overlayWindow && !overlayWindow.isDestroyed()) {
    overlayWindow.webContents.send('show', false)
  }
  stopCursorUpdate()
  isVisible = false
  updateTray()
}

function toggleCursor() {
  isVisible ? hideCursor() : showCursor()
}

function updateTray() {
  if (!tray) return
  tray.setToolTip(`Cursor Show — ${isVisible ? 'visible' : 'oculto'} (Shift+0)`)
}

app.whenReady().then(() => {
  createOverlay()

  // Tray icon (fallback to no icon if missing)
  try {
    tray = new Tray(path.join(__dirname, 'icon.ico'))
  } catch {
    // no icon file — skip tray
  }
  if (tray) {
    tray.setToolTip('Cursor Show — oculto (Shift+0)')
    tray.setContextMenu(Menu.buildFromTemplate([
      { label: 'Toggle cursor (Shift+0)', click: toggleCursor },
      { type: 'separator' },
      { label: 'Salir', click: () => app.quit() }
    ]))
    tray.on('click', toggleCursor)
  }

  // Shift+0: toggle cursor visibility
  globalShortcut.register('Shift+0', toggleCursor)
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
  stopCursorUpdate()
})

app.on('window-all-closed', (e) => {
  e.preventDefault() // keep running in tray
})
