import express from 'express';
import { KnexCarRepository } from '../../repositories/KnexCarRepository';
import { KnexBookingRepository } from '../../repositories/KnexBookingRepository';
import { CheckCarAvailability } from '../../../application/usecases/CheckCarAvailability';
import { AvailabilityController } from '../controllers/AvailabilityController';
import { validateAvailability } from '../validators/availabilityValidator';

const router = express.Router();

const carRepo = new KnexCarRepository();
const bookingRepo = new KnexBookingRepository();
const useCase = new CheckCarAvailability(carRepo, bookingRepo);
const controller = new AvailabilityController(useCase);

router.get(
  '/',
  validateAvailability,
  controller.getAvailableCars
);

export default router;
