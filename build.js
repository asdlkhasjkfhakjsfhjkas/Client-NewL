const builder = require('electron-builder')
const { preductname } = require('./package.json')

builder.build({
    config: {
        generateUpdatesFilesForAllChannels: false,
        appId: preductname,
        productName: preductname,
        artifactName: "${productName}-${os}-${arch}.${ext}",
        files: ["src/**/*", "package.json", "LICENSE.md"],
        directories: { "output": "dist" },
        compression: 'maximum',
        asar: true,
        publish: [{
            provider: "github",
            releaseType: 'release',
        }],
        win: {
            icon: "./src/assets/images/icon.ico",
            target: [{
                target: "nsis",
                arch: ["x64"]
            }],
        },
    }
}).then(() => {
    console.log('Build terminada')
}).catch(err => {
    console.error('Error critico', err)
})