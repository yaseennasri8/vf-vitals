import express from "express";
import {
  createDomain,
  getAllDomains,
  getDomainById,
  updateDomain,
  deleteDomain,
  getUrlsViaSitemap,
} from "../controllers/domain.controller";

import urlRoutes from "../routes/url";
const router = express.Router();

router.post("/", createDomain);
router.get("/sitemap/*", getUrlsViaSitemap);
router.get("/", getAllDomains);
router.get("/:id", getDomainById);
router.put("/:id", updateDomain);
router.delete("/:id", deleteDomain);

router.use("/:id/url", urlRoutes);

export default router;
