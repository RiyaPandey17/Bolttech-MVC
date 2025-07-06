import { Request, Response } from 'express';
import { CreateBooking } from '../../../application/usecases/CreateBooking';
import { KnexBookingRepository } from '../../repositories/KnexBookingRepository';

export class BookingController {
  constructor(
    private createBookingUseCase: CreateBooking,
    private bookingRepo = new KnexBookingRepository()  // default init here
  ) {}

  // POST /api/bookings
  createBooking = async (req: Request, res: Response): Promise<void> => {
    const { userId, carId, dateFrom, dateTo } = req.body;
    try {
      await this.createBookingUseCase.execute({
        userId,
        carId,
        dateFrom: new Date(dateFrom),
        dateTo: new Date(dateTo)
      });
      res.status(201).json({ message: 'Booking created successfully' });
    } catch (err: any) {
      console.error(err);
      res.status(400).json({ message: err.message || 'Failed to create booking' });
    }
  }

// GET /api/bookings
getAllBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.query.userId as string;

    if (!userId) {
      res.status(400).json({ message: 'Missing userId in query params' });
      return;
    }

    const bookings = await this.bookingRepo.findAll(userId);
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
}
}

