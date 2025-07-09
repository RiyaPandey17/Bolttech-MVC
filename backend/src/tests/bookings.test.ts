import { CreateBooking } from '../application/usecases/CreateBooking';
import { Booking } from '../domain/entities/Bookings';

describe('CreateBooking UseCase', () => {
  const testUserId = '11111111-1111-1111-1111-111111111111';
  const testCarIdA = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  const dateFrom = new Date('2025-07-10');
  const dateTo = new Date('2025-07-15');

  let bookingRepo: any;
  let userRepo: any;
  let carRepo: any;
  
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {}); 
  });
  
  afterAll(() => {
    (console.error as jest.Mock).mockRestore();
  });

  beforeEach(() => {
    // Create fresh mocks before each test
    bookingRepo = {
      getBookingsForUser: jest.fn().mockResolvedValue([]),
      getBookingsForCar: jest.fn().mockResolvedValue([]),
      createBooking: jest.fn()
    };

    userRepo = {
      findById: jest.fn().mockResolvedValue({
        id: testUserId,
        licenseValidUntil: '2026-01-01'
      })
    };

    carRepo = {
      getCarById: jest.fn().mockResolvedValue({
        id: testCarIdA,
        stock: 5,
        getPriceForSeason: jest.fn().mockReturnValue(100)
      })
    };
  });

  it('should create a booking when user has no overlapping bookings and car is available', async () => {
    const useCase = new CreateBooking(bookingRepo, userRepo, carRepo);

    await useCase.execute({
      userId: testUserId,
      carId: testCarIdA,
      dateFrom,
      dateTo
    });

    expect(userRepo.findById).toHaveBeenCalledWith(testUserId);
    expect(carRepo.getCarById).toHaveBeenCalledWith(testCarIdA);
    expect(bookingRepo.getBookingsForUser).toHaveBeenCalledWith(testUserId, dateFrom, dateTo);
    expect(bookingRepo.getBookingsForCar).toHaveBeenCalledWith(testCarIdA, dateFrom, dateTo);
    expect(bookingRepo.createBooking).toHaveBeenCalled();

    // Optionally, check the created booking entity
    const bookingArg = bookingRepo.createBooking.mock.calls[0][0] as Booking;
    expect(bookingArg.userId).toBe(testUserId);
    expect(bookingArg.carId).toBe(testCarIdA);
    expect(bookingArg.totalPrice).toBeGreaterThan(0);
  });

  it('should throw error if user has overlapping booking', async () => {
    // Mock user already has a booking that overlaps
    bookingRepo.getBookingsForUser.mockResolvedValue([
      new Booking(
        'existing-id',
        testUserId,
        'other-car-id',
        new Date('2025-07-12'),
        new Date('2025-07-14'),
        200
      )
    ]);

    const useCase = new CreateBooking(bookingRepo, userRepo, carRepo);

    await expect(
      useCase.execute({
        userId: testUserId,
        carId: testCarIdA,
        dateFrom,
        dateTo
      })
    ).rejects.toThrow(/already has a booking/i);
  });

  it('should throw error if car not found', async () => {
    carRepo.getCarById.mockResolvedValue(null);

    const useCase = new CreateBooking(bookingRepo, userRepo, carRepo);

    await expect(
      useCase.execute({
        userId: testUserId,
        carId: testCarIdA,
        dateFrom,
        dateTo
      })
    ).rejects.toThrow(/Car not found/i);
  });

  it('should throw error if user not found', async () => {
    userRepo.findById.mockResolvedValue(null);

    const useCase = new CreateBooking(bookingRepo, userRepo, carRepo);

    await expect(
      useCase.execute({
        userId: testUserId,
        carId: testCarIdA,
        dateFrom,
        dateTo
      })
    ).rejects.toThrow(/User not found/i);
  });
});
