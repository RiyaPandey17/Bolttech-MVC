import { Request, Response } from 'express';
import { CreateBooking } from '../../../application/usecases/CreateBooking';
import { KnexBookingRepository } from '../../repositories/KnexBookingRepository';

export class BookingController {
  constructor(
    private createBookingUseCase: CreateBooking,
    private bookingRepo = new KnexBookingRepository()
  ) {}

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
      console.error('Error creating booking:', err.message || err);
      res.status(400).json({ message: err.message || 'Failed to create booking. Please try again later.' });
    }
  }

  getAllBookings = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.query.userId as string;

      if (!userId) {
        res.status(400).json({ message: 'Missing userId in query parameters' });
        return;
      }

      const bookings = await this.bookingRepo.findAll(userId);
      res.json(bookings);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      res.status(500).json({ message: 'An error occurred while fetching bookings. Please try again later.' });
    }
  }
}

