/**
 * @author 2K Studio
 * @license CC-BY-NC 4.0 - https://creativecommons.org/licenses/by-nc/4.0/
 */

"use strict";
const electron = require("electron");
const path = require("path");
const os = require("os");
const pkg = require("../../../../package.json");
let mainWindow = undefined;

function getWindow() {
    return mainWindow;
}

function destroyWindow() {
    if (!mainWindow) return;
    mainWindow.close();
    mainWindow = undefined;
}

function createWindow() {
    destroyWindow();
    mainWindow = new electron.BrowserWindow({
        title: pkg.preductname,
        width: 1280,
        height: 720,
        minWidth: 1280,
        minHeight: 720,
        resizable: false,
        icon: `./src/assets/images/icon.${os.platform() === "win32" ? "ico" : "png"}`,
        transparent: os.platform() === 'win32',
        frame: os.platform() !== 'win32',
        show: false,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        },
    });
const { app } = require('electron');

app.commandLine.appendSwitch('disable-features', 'ElectronEnableRemoteModule');

    electron.Menu.setApplicationMenu(null);
    mainWindow.setMenuBarVisibility(false);
    mainWindow.loadFile(path.join(electron.app.getAppPath(), 'src', 'launcher.html'));
    mainWindow.once('ready-to-show', () => {
        if (mainWindow) {
            mainWindow.show();
        }
    });
}

module.exports = {
    getWindow,
    createWindow,
    destroyWindow,
};