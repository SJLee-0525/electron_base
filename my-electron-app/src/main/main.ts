import { app, BrowserWindow } from "electron";

import path from "path";
import dotenv from "dotenv";

// 개발 환경에서 .env.development 로드
dotenv.config({ path: path.resolve(__dirname, "../../.env." + (process.env.NODE_ENV || "development")) });

const createWindow = () => {
  const url = process.env.VITE_DEV_SERVER_URL;
  const win = new BrowserWindow({ width: 800, height: 600, webPreferences: { contextIsolation: true } });

  console.log("__dirname:", __dirname);
  console.log("HTML 파일 경로:", path.join(__dirname, "../renderer/index.html"));

  if (url) {
    win.loadURL(url);
  } else {
    win.loadFile(path.join(__dirname, "../renderer/index.html")); // 경로 수정
  }
};

app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
