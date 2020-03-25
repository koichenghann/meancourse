const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user");
const ScheduleController = require("../controllers/schedule");
const CollectorMaterialController = require("../controllers/collectorMaterial");

router.post("/signup", UserController.createUser);
router.get("/checkUserExist/:username", UserController.checkUserExist);
router.post("/login", UserController.userLogin);
router.post("/createCollector", UserController.createCollector);
router.post("/createSchedule", ScheduleController.createSchedule);
router.post("/getUser", UserController.getUser);
router.post("/validatePassword", UserController.validatePassword);
router.post("/updateProfile", UserController.updateProfile);
router.post("/updatePassword", UserController.updatePassword);
router.post("/getSchedule", ScheduleController.getSchedule);
router.post("/updateSchedule", ScheduleController.updateSchedule);
router.post("/updateCollectorMaterial", CollectorMaterialController.saveMaterials);
router.post("/getCollectorMaterial", CollectorMaterialController.getMaterials)
router.post("/findUser", UserController.findUser);
router.post("/test", UserController.test);
router.post("/getRecyclers", UserController.getRecyclers);
router.post("/getCollectors", UserController.getCollectors);

module.exports = router;
