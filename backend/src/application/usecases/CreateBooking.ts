import { BookingRepository } from "../../domain/repositories/BookingRepository";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { CarRepository } from "../../domain/repositories/CarRepository";
import { Booking } from "../../domain/entities/Bookings";
import { v4 as uuidv4 } from 'uuid';
import { getSeason } from "../../utils/dateUtils";

export class CreateBooking {
  constructor(
    private bookingRepo: BookingRepository,
    private userRepo: UserRepository,
    private carRepo: CarRepository
  ) {}

  async execute(params: {
    userId: string;
    carId: string;
    dateFrom: Date;
    dateTo: Date;
  }): Promise<void> {
    try {
      const user = await this.userRepo.findById(params.userId);
      if (!user) throw new Error('User not found');

      if (!user.licenseValidUntil || new Date(user.licenseValidUntil) < params.dateTo) {
        throw new Error('User license is expired or will expire before the end of the booking');
      }

      const car = await this.carRepo.getCarById(params.carId);
      if (!car) throw new Error('Car not found');

      const userBookings = await this.bookingRepo.getBookingsForUser(params.userId, params.dateFrom, params.dateTo);
      const tempBooking = new Booking(
        'temp-id',
        params.userId,
        params.carId,
        params.dateFrom,
        params.dateTo,
        0
      );
      if (userBookings.some(b => b.overlaps(tempBooking))) {
        throw new Error('User already has a booking during these dates');
      }

      const carBookings = await this.bookingRepo.getBookingsForCar(params.carId, params.dateFrom, params.dateTo);
      if (carBookings.length >= car.stock) {
        throw new Error('Car not available for these dates');
      }

      let totalPrice = 0;
      const oneDayMs = 24 * 60 * 60 * 1000;
      const days = Math.ceil((params.dateTo.getTime() - params.dateFrom.getTime()) / oneDayMs);

      for (let i = 0; i <= days; i++) {
        const day = new Date(params.dateFrom.getTime() + i * oneDayMs);
        const season = getSeason(day);
        totalPrice += car.getPriceForSeason(season);
      }

      totalPrice = parseFloat(totalPrice.toFixed(2));

      const bookingEntity = new Booking(
        uuidv4(),
        params.userId,
        params.carId,
        params.dateFrom,
        params.dateTo,
        totalPrice
      );

      await this.bookingRepo.createBooking(bookingEntity);
    } catch (err) {
      console.error('Error creating booking:', err);
      throw err;
    }
  }
}
