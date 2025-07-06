import { CarRepository } from "../../domain/repositories/CarRepository";
import { BookingRepository } from "../../domain/repositories/BookingRepository";
import { Car } from "../../domain/entities/Car";

function getSeason(date: Date): 'peak' | 'mid' | 'off' {
  const year = date.getFullYear();

  const midSeasonRanges = [
    { from: new Date(year, 2, 1), to: new Date(year, 5, 1) },    // Mar 1 - Jun 1
    { from: new Date(year, 8, 15), to: new Date(year, 9, 31) }   // Sep 15 - Oct 31
  ];
  const peakSeasonRange = { from: new Date(year, 5, 1), to: new Date(year, 8, 15) }; // Jun 1 - Aug 15

  if (date >= peakSeasonRange.from && date <= peakSeasonRange.to) return 'peak';
  if (midSeasonRanges.some(r => date >= r.from && date <= r.to)) return 'mid';
  return 'off';
}

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
    // 🟩 1. Check if user already has booking for these dates
    const userBookings = await this.bookingRepo.getBookingsForUser(userId, dateFrom, dateTo);
    if (userBookings.length > 0) {
      // user already has booking in same period → can't book another
      return [];  
    }

    const allCars = await this.carRepo.getAllCars();
    const days = Math.ceil((dateTo.getTime() - dateFrom.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const results: {
      car: Car;
      totalPrice: number;
      averageDailyPrice: number;
      stock: number;
      available: number;
    }[] = [];

    for (const car of allCars) {
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

        results.push({
          car,
          totalPrice,
          averageDailyPrice,
          stock: car.stock,
          available: availableCount
        });
      }
    }

    return results;
  }
}

