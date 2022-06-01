import express from "express";
import * as urlController from "../controllers/url.controller";

const router = express.Router({ mergeParams: true });

router.post("/", urlController.createUrl);
router.get("/", urlController.getAllUrls);
router.get("/:urlId", urlController.getDomainUrlById);
router.put("/:urlId", urlController.updateDomainUrlById);
router.delete("/:urlId", urlController.deleteDomainUrlById);

export default router;
