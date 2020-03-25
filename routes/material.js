const express = require("express");
const router = express.Router();
const MaterialController = require("../controllers/material");
const CollectorMaterialController = require("../controllers/collectorMaterial")

//router.post("/test3", MaterialController.test3);
//router.post("/test2", MaterialController.test2);
router.post("/createMaterial", MaterialController.createMaterial);
router.get("/getMaterials", MaterialController.getMaterials);
router.get("/:materialID", MaterialController.getMaterial);
router.put("/updateMaterial", MaterialController.updateMaterial);
router.delete("/:_id", MaterialController.deleteMaterial);
router.get("/checkMaterialExist/:materialID", MaterialController.checkMaterialExist);

router.post("/findMaterial", MaterialController.findMaterial);
//router.get("/test", MaterialController.test);

router.post("/getCollectors", CollectorMaterialController.getCollectors)

module.exports = router;
