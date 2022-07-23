/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
module.exports = {
  appId: "YourAppID",
  productName: "Vendle",
  copyright: "Copyright © 2022 Nawaf Aloufi",
  asar: true,
  directories: {
    output: "release/0.1",
    buildResources: "build",
  },
  files: ["dist"],
  win: {
    target: [
      {
        target: "nsis",
        arch: ["x64"],
      },
    ],
    artifactName: "Vendle-Setup.${ext}",
  },
  nsis: {
    oneClick: false,
    perMachine: false,
    allowToChangeInstallationDirectory: true,
    deleteAppDataOnUninstall: false,
  },
  mac: {
    target: ["dmg"],
    artifactName: "Vendle-Installer.${ext}",
  },
  linux: {
    target: ["AppImage"],
    artifactName: "Vendle-Installer.${ext}",
  },
};
