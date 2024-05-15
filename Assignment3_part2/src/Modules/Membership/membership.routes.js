


import { Router } from "express";
import * as MemberController from "./membership.controller.js";

const router = Router();

router.get("/getAllRevenuesMember", MemberController.getAllRevenuesMember);
router.get("/getRevenueSpecificTrainer/:id", MemberController.getRevenueSpecificTrainer);
router.get("/", MemberController.getMembers);
router.get("/detail/:id", MemberController.specificMember);
router.get("/get-member-by-nationalId", MemberController.getMemberByNationalId);
router.get("/check_trainerId", MemberController.getTrainerId);
router.post("/add", MemberController.addMember);
router.put("/softDelete/:id", MemberController.deleteMember);
router.put("/update/:id", MemberController.updateMember);

export default router;