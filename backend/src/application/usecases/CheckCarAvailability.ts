import { CarRepository } from "../../domain/repositories/CarRepository";
import { BookingRepository } from "../../domain/repositories/BookingRepository";
import { Car } from "../../domain/entities/Car";
import { getSeason } from "../../utils/dateUtils"; // Moved getSeason to a utility module
import dotenv from 'dotenv';
dotenv.config();

// Example usage of environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret'; // Fallback for development

export class CheckCarAvailability {
  constructor(
    private carRepo: CarRepository,
    private bookingRepo: BookingRepository
  ) {}

  async execute(
    userId: string,
    dateFrom: Date,
    dateTo: Date
  ): Promise<{
    car: Car;
    totalPrice: number;
    averageDailyPrice: number;
    stock: number;
    available: number;
  }[]> {
    // Validate date range
    if (dateTo <= dateFrom) {
      throw new Error('Invalid date range: dateTo must be after dateFrom.');
    }

    try {
      // 1. Check if user already has booking for these dates
      const userBookings = await this.bookingRepo.getBookingsForUser(userId, dateFrom, dateTo);
      if (userBookings.length > 0) {
        // User already has booking in the same period → can't book another
        return [];
      }

      const allCars = await this.carRepo.getAllCars();
      const days = Math.ceil((dateTo.getTime() - dateFrom.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      // 2. Fetch bookings for all cars in parallel
      const results = await Promise.all(
        allCars.map(async (car) => {
          const bookings = await this.bookingRepo.getBookingsForCar(car.id, dateFrom, dateTo);
          const bookedCount = bookings.length;
          const availableCount = car.stock - bookedCount;

          if (availableCount > 0) {
            let totalPrice = 0;
            const oneDayMs = 24 * 60 * 60 * 1000;
            let currentDate = new Date(dateFrom);

            while (currentDate <= dateTo) {
              const season = getSeason(currentDate);
              totalPrice += car.getPriceForSeason(season);
              currentDate = new Date(currentDate.getTime() + oneDayMs);
            }

            const averageDailyPrice = parseFloat((totalPrice / days).toFixed(2));
            totalPrice = parseFloat(totalPrice.toFixed(2));

            return {
              car,
              totalPrice,
              averageDailyPrice,
              stock: car.stock,
              available: availableCount,
            };
          }

          return null; // Skip cars with no availability
        })
      );

      // Filter out null results
      return results.filter((result) => result !== null) as {
        car: Car;
        totalPrice: number;
        averageDailyPrice: number;
        stock: number;
        available: number;
      }[];
    } catch (error) {
      console.error('Error in CheckCarAvailability:', error);
      throw new Error('Failed to check car availability. Please try again later.');
    }
  }
}

