import domainRoutes from "./routes/domain";
import express from "express";
import dbConnection from "./config/db";
import path from "path";
import limiter from "./middlware/rateLimiter";
import { initProcessor } from "./services/domain/domain.service";
import { createCronJob } from "./cron/cron";
import { pagination } from "./middlware/pagination";
import errorHandler from "./middlware/errorHandler";
import cluster from "node:cluster";
import os from "os";
const hsts = require("hsts");
require("dotenv").config();

const app = express();
const port = process.env.PORT;
const basePath = path.join(__dirname, "../");

app.enable("trust proxy");

app.use(express.json());
app.use(express.static(basePath));
app.use(limiter);
app.use(
  hsts({
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  })
);

// Routes
app.use("/api/domain", domainRoutes);
app.use(pagination);
app.use(errorHandler);

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", function () {
    cluster.fork();
  });
} else {
  app.listen(port, () => {
    console.log(`Server ${process.pid} start listening port ${port}...`);
    dbConnection()
      .then(() => initProcessor())
      .then(() => createCronJob());
  });
}
