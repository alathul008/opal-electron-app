import { app, BrowserWindow, desktopCapturer, ipcMain } from 'electron';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Resolve current directory path for Electron
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Set the app root directory
process.env.APP_ROOT = path.join(__dirname, '..');

// Set environment paths for development and production builds
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');

// Set public path depending on development or production
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? 
  path.join(process.env.APP_ROOT, 'public') : 
  RENDERER_DIST;

let win: BrowserWindow | null;
let studio: BrowserWindow | null;
let floatingWebCam:BrowserWindow|null

function createMainWindow() {
  win = new BrowserWindow({
    width: 300,      // Adjusted width to 400px
    height: 600,     // Keep height at 600px
    minWidth: 300,   // Min width remains at 300px
    minHeight: 600,  // Min height remains at 600px
    hasShadow: false,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    focusable: false,
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
      preload: path.join(__dirname, 'preload.mjs'),
    },
  });

  studio = new BrowserWindow({
    width: 250,     // Reduced width for compact view
    height: 150,    // Adjust height for better proportions
    minWidth: 250,  // Min width set to 250px
    maxWidth: 300,  // Max width set to 300px
    minHeight: 150, // Min height adjusted to maintain a good aspect ratio
    maxHeight: 250, // Max height adjusted to prevent excessive expansion
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    focusable: false,
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
      preload: path.join(__dirname, 'preload.mjs'),
    },
  });

  floatingWebCam = new BrowserWindow({
    width: 400,
    height: 400, // Equal width and height for a circular shape
    minWidth: 300,
    maxWidth: 400,
    minHeight: 300,
    maxHeight: 400,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    focusable: false,
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
      preload: path.join(__dirname, 'preload.mjs'),
    },
  });

  // Set visibility and always on top
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.setAlwaysOnTop(true, 'screen-saver', 1);
  studio.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  studio.setAlwaysOnTop(true, 'screen-saver', 1);
  floatingWebCam.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  floatingWebCam.setAlwaysOnTop(true, 'screen-saver', 1);





  // Send a test message when the window has finished loading
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  studio.webContents.on('did-finish-load',()=>{
    studio?.webContents.send('main-process-message', new Date().toLocaleString());
  })

  
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
    studio.loadURL(`${import.meta.env.VITE_APP_URL}/studio.html`)
    floatingWebCam.loadURL(`${import.meta.env.VITE_APP_URL}/webcam.html`)
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
    studio.loadFile(path.join(RENDERER_DIST,'studio.html'))
    floatingWebCam.loadFile(path.join(RENDERER_DIST,'webcam.html'))
  }
}

// Quit the app when all windows are closed (except for macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    win = null;
    studio = null;
    floatingWebCam = null;
  }
});
ipcMain.on("closeApp",()=>{
  if(process.platform !=='darwin'){
    app.quit();
    win = null;
    studio = null;
    floatingWebCam = null;

  }
})
ipcMain.handle('getSources',async()=>{
  const data= await desktopCapturer.getSources({
    thumbnailSize: { width: 150, height: 100 },
    fetchWindowIcons:true,
    types: ['screen','window'],
  })
  return data

})

ipcMain.on("media-sources",(_,payload)=>{
  console.log("EVENT:media sources",payload)
  studio?.webContents.send("profile-received",payload)
})

ipcMain.on('resize-studio',(_,payload)=>{
  console.log("EVENT:resize-studio",payload)
  if(payload.shrink){
    studio?.setSize(400,100)
  }
  if (!payload.shrink) {
    studio?.setSize(400,250)
    
  }
})

ipcMain.on('hide-plugin',(_,payload)=>{
  console.log("EVENT:Hide-plugin",payload)
  win?.webContents.send('hide-plugin',payload)
})





// Recreate the window if the app is activated and there are no open windows
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

// Create the window when the app is ready
app.whenReady().then(createMainWindow);
