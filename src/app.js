/**
 * @author 2K Studio
 * @license CC-BY-NC 4.0 - https://creativecommons.org/licenses/by-nc/4.0/
 */

const { app, ipcMain } = require('electron');
const { Microsoft } = require('battly-api');
const { autoUpdater } = require('electron-updater')
const { io } = require("socket.io-client");
const socket = io("http://api.shopalexis.xyz");
socket.on("connect", () => {
});

//hacer que todo lo del devtools se guarde en un archivo de texto
const fs = require('fs');
const path = require('path');
const dataDirectory = process.env.APPDATA || (process.platform == 'darwin' ? `${process.env.HOME}/Library/Application Support` : process.env.HOME)
let filePath = `${dataDirectory}/Registro.log`;        



                
const UpdateWindow = require("./assets/js/windows/updateWindow.js");
const MainWindow = require("./assets/js/windows/mainWindow.js");

let dev = process.env.NODE_ENV === 'dev';

if (dev) {
    let appPath = path.resolve('./AppData/Launcher').replace(/\\/g, '/');
    if (!fs.existsSync(appPath)) fs.mkdirSync(appPath, { recursive: true });
    app.setPath('userData', appPath);
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.whenReady().then(() => {
        UpdateWindow.createWindow();
    });
}

ipcMain.on('update-window-close', () => UpdateWindow.destroyWindow())
ipcMain.on('update-window-dev-tools', () => UpdateWindow.getWindow().webContents.openDevTools())
ipcMain.on('main-window-open', () => MainWindow.createWindow())
ipcMain.on('main-window-dev-tools', () => MainWindow.getWindow().webContents.openDevTools())
ipcMain.on('main-window-close', () => MainWindow.destroyWindow())
ipcMain.on('main-window-progress', (progress_actual, size_actual) => {
    MainWindow.getWindow().setProgressBar(parseInt(size_actual.progress_actual) / parseInt(size_actual.size_actual));
})
ipcMain.on('main-window-progress-reset', () => MainWindow.getWindow().setProgressBar(0))
ipcMain.on('main-window-minimize', () => MainWindow.getWindow().minimize())

ipcMain.on('main-window-maximize', () => {
    if (MainWindow.getWindow().isMaximized()) {
        MainWindow.getWindow().unmaximize();
    } else {
        MainWindow.getWindow().maximize();
    }
})


ipcMain.on('main-window-hide', () => MainWindow.getWindow().hide())
ipcMain.on('main-window-show', () => MainWindow.getWindow().show())

ipcMain.handle('Microsoft-window', async(event, client_id) => {
    return await new Microsoft(client_id).getAuth();
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('restartLauncher', () => {
    app.relaunch();
    app.exit();
});

let startedAppTime = Date.now();

const rpc = require('discord-rpc');
let client = new rpc.Client({ transport: 'ipc' });

ipcMain.on('new-status-discord', async () => {
    client.login({ clientId: '1139732620603838614' });
    client.on('ready', () => {
        client.request('SET_ACTIVITY', {
            pid: process.pid,
            activity: {
                details: 'En el Menú',
                assets: {
                    large_image: 'icon',
                    large_text: '2K Studio',
                },
                instance: false,
                timestamps: {
                    start: startedAppTime
                }
            },
        });
    });
});


ipcMain.on('new-status-discord-jugando', async (event, status) => {
    console.log(status)
    if(client) await client.destroy();
    client = new rpc.Client({ transport: 'ipc' });
    client.login({ clientId: '1139732620603838614' });
    client.on('ready', () => {
        client.request('SET_ACTIVITY', {
            pid: process.pid,
            activity: {
                details: status,
                assets: {
                    large_image: 'icon',
                    large_text: '2K Studio',
                },
                instance: false,
                timestamps: {
                    start: startedAppTime
                }
            },
        });
    });
});

ipcMain.on('delete-and-new-status-discord', async () => {
    if(client) client.destroy();
    client = new rpc.Client({ transport: 'ipc' });
    client.login({ clientId: '1139732620603838614' });
    client.on('ready', () => {
        client.request('SET_ACTIVITY', {
            pid: process.pid,
            activity: {
                details: 'En el Menú',
                assets: {
                    large_image: 'icon',
                    large_text: '2K Studio',
                },
                instance: false,
                timestamps: {
                    start: startedAppTime
                }
            },
        });
    });
});

autoUpdater.autoDownload = false;

ipcMain.handle('update-app', () => {
    return new Promise(async(resolve, reject) => {
        autoUpdater.checkForUpdates().then(() => {
            resolve();
        }).catch(error => {
            console.log(error);
            resolve({
                error: true,
                message: error
            })
        })
    })
})

autoUpdater.on('update-available', () => {
    const updateWindow = UpdateWindow.getWindow();
    if (updateWindow) updateWindow.webContents.send('updateAvailable');
});

ipcMain.on('start-update', () => {
    autoUpdater.downloadUpdate();
})

autoUpdater.on('update-not-available', () => {
    const updateWindow = UpdateWindow.getWindow();
    if (updateWindow) updateWindow.webContents.send('update-not-available');
});

autoUpdater.on('update-downloaded', () => {
    autoUpdater.quitAndInstall();
});

autoUpdater.on('download-progress', (progress) => {
    const updateWindow = UpdateWindow.getWindow();
    if (updateWindow) updateWindow.webContents.send('download-progress', progress);
})