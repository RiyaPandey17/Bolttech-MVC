import { BookingRepository } from "../../domain/repositories/BookingRepository";
import { Booking } from "../../domain/entities/Bookings";
import { db } from "../db/knex";

export class KnexBookingRepository implements BookingRepository {
  // Fetch all bookings for a specific user
  async getBookingsForUser(userId: string, from: Date, to: Date): Promise<Booking[]> {
    console.log(userId)
    const rows = await db('bookings')
      .where({ user_id: userId })
      .andWhere(function() {
        this.where('date_from', '<=', to)
            .andWhere('date_to', '>=', from);
      });
  
    return rows.map(KnexBookingRepository.mapRowToBooking);
  }
  

  // Fetch all bookings for a car overlapping with given dates
  async getBookingsForCar(carId: string, from: Date, to: Date): Promise<Booking[]> {
    const rows = await db('bookings')
      .where({ car_id: carId })
      .andWhere('date_to', '>=', from)
      .andWhere('date_from', '<=', to);
    return rows.map(KnexBookingRepository.mapRowToBooking);
  }

  // Fetch all bookings in the system
// KnexBookingRepository.ts
async findAll(userId: string): Promise<any[]> {
  return db('bookings')
    .where('bookings.user_id', userId)                      // ✅ filter by user_id
    .join('cars', 'bookings.car_id', 'cars.id')
    .select(
      'bookings.id',
      'bookings.date_from as dateFrom',
      'bookings.date_to as dateTo',
      'bookings.total_price as totalPrice',
      'cars.id as carId',
      'cars.brand',
      'cars.model'
    );
}

  // Create a new booking
  async createBooking(booking: Booking): Promise<void> {
    await db('bookings').insert({
      id: booking.id,
      user_id: booking.userId,
      car_id: booking.carId,
      date_from: booking.dateFrom,
      date_to: booking.dateTo,
      total_price: booking.totalPrice,
    });
  }

  // Helper: convert DB row to Booking entity
  private static mapRowToBooking(row: any): Booking {
    return new Booking(
      row.id,
      row.user_id,
      row.car_id,
      new Date(row.date_from),
      new Date(row.date_to),
      Number(row.total_price),
    );
  }
}
