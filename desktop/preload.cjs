const { contextBridge, clipboard } = require("electron");

contextBridge.exposeInMainWorld("pidronDesktop", {
  writeClipboard(text) {
    clipboard.writeText(String(text));
    return true;
  },
  platform: process.platform
});
