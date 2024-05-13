
import { Router } from 'express';
import * as trainerController from './trainer.controller.js';

const router = Router();

router.get('/', trainerController.getTrainers);

export default router;