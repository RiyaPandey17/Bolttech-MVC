import express from 'express';
import { KnexBookingRepository } from '../../repositories/KnexBookingRepository';
import { KnexUserRepository } from '../../repositories/KnexUserRepository';
import { KnexCarRepository } from '../../repositories/KnexCarRepository';
import { CreateBooking } from '../../../application/usecases/CreateBooking';
import { BookingController } from '../controllers/BookingController';
import { validateCreateBooking } from '../validators/bookingValidator';

const router = express.Router();

// instantiate repositories
const bookingRepo = new KnexBookingRepository();
const userRepo = new KnexUserRepository();
const carRepo = new KnexCarRepository();

// create use case
const useCase = new CreateBooking(bookingRepo, userRepo, carRepo);

// create controller
const controller = new BookingController(useCase);

// POST /api/bookings
router.post(
  '/',
  validateCreateBooking,
  controller.createBooking
);

router.get(
  '/',
  controller.getAllBookings
);

export default router;
