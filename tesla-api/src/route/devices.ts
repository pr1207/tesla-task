import express from 'express';
import controller from '../controller/devices';

const router = express.Router();

router.get('/batteries', controller.getBatteries);
router.get('/transformers', controller.getTransformers);

export = router;