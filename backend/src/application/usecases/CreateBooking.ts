import { BookingRepository } from "../../domain/repositories/BookingRepository";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { CarRepository } from "../../domain/repositories/CarRepository";
import { Booking } from "../../domain/entities/Bookings";
import { v4 as uuidv4 } from 'uuid';

// Helper to determine season for pricing
function getSeason(date: Date): 'peak' | 'mid' | 'off' {
  const year = date.getFullYear();
  const midSeasonRanges = [
    { from: new Date(year, 2, 1), to: new Date(year, 5, 1) },   // Mar 1 – Jun 1
    { from: new Date(year, 8, 15), to: new Date(year, 9, 31) }  // Sep 15 – Oct 31
  ];
  const peakSeasonRange = { from: new Date(year, 5, 1), to: new Date(year, 8, 15) }; // Jun 1 – Aug 15

  if (date >= peakSeasonRange.from && date <= peakSeasonRange.to) return 'peak';
  if (midSeasonRanges.some(r => date >= r.from && date <= r.to)) return 'mid';
  return 'off';
}

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
    // ✅ Check user exists
    const user = await this.userRepo.findById(params.userId);
    if (!user) throw new Error('User not found');

    // ✅ Check license validity
    if (!user.licenseValidUntil || new Date(user.licenseValidUntil) < params.dateTo) {
      throw new Error('User license is expired or will expire before end of booking');
    }

    // ✅ Check car exists
    const car = await this.carRepo.getCarById(params.carId);
    if (!car) throw new Error('Car not found');

    // ✅ Check user has no overlapping bookings
    const userBookings = await this.bookingRepo.getBookingsForUser(params.userId, params.dateFrom, params.dateTo);
    // Create a temporary booking just for overlap check
    const tempBooking = new Booking(
      'temp-id',
      params.userId,
      params.carId,
      params.dateFrom,
      params.dateTo,
      0 // price irrelevant here
    );
    if (userBookings.some(b => b.overlaps(tempBooking))) {
      throw new Error('User already has a booking during these dates');
    }

    // ✅ Check car availability
    const carBookings = await this.bookingRepo.getBookingsForCar(params.carId, params.dateFrom, params.dateTo);
    if (carBookings.length >= car.stock) {
      throw new Error('Car not available for these dates');
    }

    // ✅ Calculate total price (handles multiple seasons)
    let totalPrice = 0;
    let currentDate = new Date(params.dateFrom);
    const oneDayMs = 24 * 60 * 60 * 1000;

    while (currentDate <= params.dateTo) {
      const season = getSeason(currentDate);
      totalPrice += car.getPriceForSeason(season);
      currentDate = new Date(currentDate.getTime() + oneDayMs);
    }

    totalPrice = parseFloat(totalPrice.toFixed(2));

    // ✅ Create final booking entity
    const bookingEntity = new Booking(
      uuidv4(),
      params.userId,
      params.carId,
      params.dateFrom,
      params.dateTo,
      totalPrice
    );

    // ✅ Save to repository
    await this.bookingRepo.createBooking(bookingEntity);
  }
}
