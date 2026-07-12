import express from "express";
import {getAllNotifications,markRead,markAllRead} from "../controllers/notificationController.js"
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router=express.Router();

router.get("/getAllNotifications",isAuthenticated,getAllNotifications);
router.put("/markRead/:notificationId",isAuthenticated,markRead);
router.put("/markAllRead",isAuthenticated,markAllRead);


export default router;