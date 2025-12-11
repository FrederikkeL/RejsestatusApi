import { Router } from "express";
import {
  getAllTravelStatuses,
  getTravelStatusByCountry,
} from "./travelStatusController";

const router = Router();

router.get("/getall", getAllTravelStatuses);

router.get("/get/:country", getTravelStatusByCountry);

export default router;
