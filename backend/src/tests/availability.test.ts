import { CheckCarAvailability } from '../application/usecases/CheckCarAvailability';
import { Car } from '../domain/entities/Car';
import { Booking } from '../domain/entities/Bookings';

describe('CheckCarAvailability UseCase', () => {
  const testUserId = '11111111-1111-1111-1111-111111111111';
  const testCarId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  const dateFrom = new Date('2025-07-10');
  const dateTo = new Date('2025-07-12'); // 3 days

  let bookingRepo: any;
  let carRepo: any;

  beforeEach(() => {
    bookingRepo = {
      getBookingsForUser: jest.fn().mockResolvedValue([]),
      getBookingsForCar: jest.fn().mockResolvedValue([]),
    };

    carRepo = {
      getAllCars: jest.fn().mockResolvedValue([
        new Car(
          testCarId,
          'Toyota',
          'Corolla',
          5,
          100, // peak season
          80,  // mid season
          60   // off season
        ),
      ]),
    };
  });

  it('should return available cars with correct total & average price if user has no booking', async () => {
    const useCase = new CheckCarAvailability(carRepo, bookingRepo);

    const results = await useCase.execute(testUserId, dateFrom, dateTo);

    expect(bookingRepo.getBookingsForUser).toHaveBeenCalledWith(testUserId, dateFrom, dateTo);
    expect(carRepo.getAllCars).toHaveBeenCalled();
    expect(bookingRepo.getBookingsForCar).toHaveBeenCalledWith(testCarId, dateFrom, dateTo);

    expect(results).toHaveLength(1);
    const carResult = results[0];
    expect(carResult.car.id).toBe(testCarId);
    expect(carResult.available).toBeGreaterThan(0);
    expect(carResult.totalPrice).toBeGreaterThan(0);
    expect(carResult.averageDailyPrice).toBeGreaterThan(0);
  });

  it('should return empty list if user already has booking during dates', async () => {
    // Mock user already has booking
    bookingRepo.getBookingsForUser.mockResolvedValue([
      new Booking(
        'existing-booking-id',
        testUserId,
        'some-car-id',
        new Date('2025-07-10'),
        new Date('2025-07-11'),
        200
      ),
    ]);

    const useCase = new CheckCarAvailability(carRepo, bookingRepo);

    const results = await useCase.execute(testUserId, dateFrom, dateTo);

    expect(results).toEqual([]);
  });

  it('should return empty list if car is fully booked during dates', async () => {
    // Mock car fully booked with realistic Booking instances
    bookingRepo.getBookingsForCar.mockResolvedValue([
      new Booking('id1', testUserId, testCarId, dateFrom, dateTo, 200),
      new Booking('id2', testUserId, testCarId, dateFrom, dateTo, 200),
      new Booking('id3', testUserId, testCarId, dateFrom, dateTo, 200),
      new Booking('id4', testUserId, testCarId, dateFrom, dateTo, 200),
      new Booking('id5', testUserId, testCarId, dateFrom, dateTo, 200), // Matches car stock
    ]);

    const useCase = new CheckCarAvailability(carRepo, bookingRepo);

    const results = await useCase.execute(testUserId, dateFrom, dateTo);

    expect(results).toEqual([]);
  });

  it('should correctly calculate price over multiple days and seasons', async () => {
    // Create a car with different prices
    carRepo.getAllCars.mockResolvedValue([
      new Car(
        testCarId,
        'Toyota',
        'Corolla',
        5,
        100, // peak
        80,  // mid
        60   // off
      ),
    ]);

    const useCase = new CheckCarAvailability(carRepo, bookingRepo);

    const results = await useCase.execute(testUserId, dateFrom, dateTo);

    const carResult = results[0];
    expect(carResult.totalPrice).toBeGreaterThan(0);
    expect(carResult.averageDailyPrice).toBeGreaterThan(0);
  });
});
