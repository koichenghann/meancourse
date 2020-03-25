const express = require("express");
const router = express.Router();
const SubmissionController = require("../controllers/submission");

//router.post("/test3", MaterialController.test3);
//router.post("/test2", MaterialController.test2);
//router.post("/createMaterial", MaterialController.createMaterial);
//router.get("/getMaterials", MaterialController.getMaterials);
//router.get("/:materialID", MaterialController.getMaterial);
//router.put("/updateMaterial", MaterialController.updateMaterial);
//router.delete("/:_id", MaterialController.deleteMaterial);
//router.get("/checkMaterialExist/:materialID", MaterialController.checkMaterialExist);
//router.get("/test", MaterialController.test);

router.post("/test", SubmissionController.generateDummySub);
router.post("/getSubmissions", SubmissionController.getSubmissions);
router.post("/updateSubmission", SubmissionController.updateSubmission);
router.post("/addSubmission", SubmissionController.addSubmission);




module.exports = router;
