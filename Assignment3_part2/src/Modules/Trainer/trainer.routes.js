
import { Router } from 'express';
import * as trainerController from './trainer.controller.js';

const router = Router();

router.get('/', trainerController.getTrainers);
router.get('/detail/:id',trainerController.specificTrainers)
router.delete("/delete/:id", trainerController.deleteTrainer);
router.delete("/deleteAllTrainer", trainerController.deleteAllTrainer);
router.put("/update/:id", trainerController.updateTrainer);
router.post("/add", trainerController.addTrainer);


export default router;