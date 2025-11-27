"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const travelStatusController_1 = require("./travelStatusController");
const router = (0, express_1.Router)();
router.get("/getall", travelStatusController_1.getAllTravelStatuses);
router.get("/get/:country", travelStatusController_1.getTravelStatusByCountry);
exports.default = router;
