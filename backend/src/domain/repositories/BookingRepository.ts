import { Booking } from "../entities/Bookings";

export interface BookingRepository {
  // ✅ Find all bookings *by user* that overlap with a date range
  getBookingsForUser(userId: string, from: Date, to: Date): Promise<Booking[]>;

  // Existing method to find bookings for a specific car in date range
  getBookingsForCar(carId: string, from: Date, to: Date): Promise<Booking[]>;

  // Create new booking
  createBooking(booking: Booking): Promise<void>;
}
