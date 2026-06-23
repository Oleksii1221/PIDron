const { app, BrowserWindow, Menu, dialog, session, shell } = require("electron");
const path = require("path");

function describeSerialPort(port, index) {
  const name = port.displayName || port.portName || `Serial port ${index + 1}`;
  const details = [
    port.portName,
    port.vendorId ? `VID ${port.vendorId}` : "",
    port.productId ? `PID ${port.productId}` : ""
  ].filter(Boolean);
  return details.length ? `${name} (${details.join(", ")})` : name;
}

function configureSerialAccess() {
  const ses = session.defaultSession;

  ses.setDevicePermissionHandler((details) => {
    return details.deviceType === "serial";
  });

  ses.on("select-serial-port", async (event, portList, webContents, callback) => {
    event.preventDefault();

    if (!portList.length) {
      dialog.showMessageBox(BrowserWindow.fromWebContents(webContents), {
        type: "warning",
        title: "PIDron serial",
        message: "Serial-порти не знайдено",
        detail: "Закрий Betaflight Configurator, INAV Configurator, Arduino Serial Monitor або іншу програму, яка може тримати COM-порт, перепідключи польотник і спробуй ще раз.",
        buttons: ["OK"]
      });
      callback("");
      return;
    }

    if (portList.length === 1) {
      callback(portList[0].portId);
      return;
    }

    const buttons = [...portList.map(describeSerialPort), "Скасувати"];
    const response = await dialog.showMessageBox(BrowserWindow.fromWebContents(webContents), {
      type: "question",
      title: "PIDron serial",
      message: "Вибери serial-порт польотника",
      detail: "Якщо потрібного порту немає, перевір USB-кабель, драйвер, режим DFU/COM і чи не відкритий порт в іншій програмі.",
      buttons,
      cancelId: buttons.length - 1,
      defaultId: 0,
      noLink: true
    });

    callback(response.response >= portList.length ? "" : portList[response.response].portId);
  });
}

function createWindow() {
  const window = new BrowserWindow({
    width: 1440,
    height: 940,
    minWidth: 1100,
    minHeight: 760,
    title: "PIDron",
    backgroundColor: "#eef2ef",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  window.loadFile(path.join(__dirname, "..", "index.html"));

  window.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  window.webContents.on("will-navigate", (event, url) => {
    if (!url.startsWith("file://")) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  configureSerialAccess();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
