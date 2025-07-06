import { CheckCarAvailability } from '../src/application/usecases/CheckCarAvailability';
import { Car } from '../src/domain/entities/Car';
import { Booking } from '../src/domain/entities/Bookings';

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
      getBookingsForCar: jest.fn().mockResolvedValue([])
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
        )
      ])
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
    // mock user already has booking
    bookingRepo.getBookingsForUser.mockResolvedValue([
      new Booking(
        'existing-booking-id',
        testUserId,
        'some-car-id',
        new Date('2025-07-10'),
        new Date('2025-07-11'),
        200
      )
    ]);

    const useCase = new CheckCarAvailability(carRepo, bookingRepo);

    const results = await useCase.execute(testUserId, dateFrom, dateTo);

    expect(results).toEqual([]);
  });

  it('should return empty list if car is fully booked during dates', async () => {
    // mock car fully booked
    bookingRepo.getBookingsForCar.mockResolvedValue([
      {}, {}, {}, {}, {} // same as car stock=5
    ]);

    const useCase = new CheckCarAvailability(carRepo, bookingRepo);

    const results = await useCase.execute(testUserId, dateFrom, dateTo);

    expect(results).toEqual([]);
  });

  it('should correctly calculate price over multiple days and seasons', async () => {
    // create a car with different prices
    carRepo.getAllCars.mockResolvedValue([
      new Car(
        testCarId,
        'Toyota',
        'Corolla',
        5,
        100, // peak
        80,  // mid
        60   // off
      )
    ]);

    const useCase = new CheckCarAvailability(carRepo, bookingRepo);

    const results = await useCase.execute(testUserId, dateFrom, dateTo);

    const carResult = results[0];
    expect(carResult.totalPrice).toBeGreaterThan(0);
    expect(carResult.averageDailyPrice).toBeGreaterThan(0);
  });
});
