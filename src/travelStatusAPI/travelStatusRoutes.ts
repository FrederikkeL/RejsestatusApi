import { Router } from "express";
import { getAllTravelStatuses } from "./travelStatusController.ts";

const router = Router();

router.get("/getall", getAllTravelStatuses);

export default router;