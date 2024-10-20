import fs from "fs";
import https from "https";
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

import { AppConfigData } from "../trmrk/notes-app-config";

import appConfigObj from "./env/config.json";
const appConfig = appConfigObj as any as AppConfigData;

const options = {
  key: fs.readFileSync("sllCert/key.pem"),
  cert: fs.readFileSync("sllCert/cert.pem"),
};

const app = express();

// Proxy to ASP.NET Core app
app.use(
  "/",
  createProxyMiddleware({
    target: appConfig.apiHost, // URL of your ASP.NET Core app
    changeOrigin: false,
    secure: false,
    // logLevel: "debug", // Add this line for verbose logging
    /* onError: (err, req, res) => {
      console.error("Proxy Error:", err);
      res.status(500).send("Proxy Error: " + err.message);
    }, */
  })
);

const PORT = appConfigObj.apiProxyPort;

/* app.listen(PORT, () => {
  console.log(`Node.js server is running on port ${PORT}`);
}); */

https.createServer(options, app).listen(PORT, () => {
  console.log(`HTTPS proxy server is running on port ${PORT}`);
});
