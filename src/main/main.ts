import { app, BrowserWindow } from "electron";
import path from "path";
import dotenv from "dotenv";

// 개발 환경에서 .env.development 로드
dotenv.config({ path: path.resolve(__dirname, "../../.env." + (process.env.NODE_ENV || "development")) });

const createWindow = () => {
  const url = process.env.VITE_DEV_SERVER_URL;
  const win = new BrowserWindow({ width: 1280, height: 720, webPreferences: { contextIsolation: true } });

  if (url) {
    win.loadURL(url);
  } else {
    win.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
};

app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
