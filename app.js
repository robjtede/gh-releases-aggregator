'use strict'

const path = require('path')
const url = require('url')
// const querystring = require('querystring')
const Debug = require('debug')

const {
  app,
  Menu,
  BrowserWindow
} = require('electron')

// const Config = require('electron-config')
const windowState = require('electron-window-state')

// const config = new Config()
const debug = new Debug('app:app.js')

console.log(`starting ${app.getName()} version ${app.getVersion()}`)
let mainWindow

const template = [
  {
    label: 'Application',
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { role: 'quit' }
    ]
  }, {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'selectall' }
    ]
  }, {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'toggledevtools' },
      { type: 'separator' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { role: 'resetzoom' }
    ]
  }, {
    role: 'window',
    submenu: [
      { role: 'minimize' },
      { role: 'close' }
    ]
  }, {
    role: 'help',
    submenu: [
      { label: 'Monux GitHub Repo', click: () => require('electron').shell.openExternal('https://github.com/robjtede/monux') },
      { label: 'Learn More About Electron', click: () => require('electron').shell.openExternal('http://electron.atom.io') }
    ]
  }
]

const createWindow = () => {
  debug('createWindow')

  const mainWindowState = windowState({
    defaultWidth: 1000,
    defaultHeight: 800
  })

  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 600,
    minHeight: 600,
    // titleBarStyle: 'hidden-inset',
    webPreferences: {
      experimentalFeatures: true
    }
  })

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))

  mainWindow.loadURL(url.format({
    pathname: path.resolve(__dirname, 'app/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindowState.manage(mainWindow)

  mainWindow.on('closed', () => { mainWindow = null })
}

app.on('ready', () => {
  debug('ready event')

  createWindow()
})

app.on('window-all-closed', () => {
  debug('window-all-closed event')

  // conflicts with auth strategy
  // if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  debug('activate event')
  if (!mainWindow) createWindow()
})
