import fs from "fs";
import https from "https";
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors, { CorsOptions } from "cors";

import { AppConfigData } from "../trmrk/notes-app-config";

import appConfigObj from "./env/config.json";
const appConfig = appConfigObj as any as AppConfigData;

const options = {
  key: fs.readFileSync("sllCert/key.pem"),
  cert: fs.readFileSync("sllCert/cert.pem"),
};

// Set CORS headers
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || appConfigObj.allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

const app = express();

app.use(cors(corsOptions));
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
