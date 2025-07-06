import { Request, Response, NextFunction } from 'express';
import { CheckCarAvailability } from '../../../application/usecases/CheckCarAvailability';

export class AvailabilityController {
  constructor(private useCase: CheckCarAvailability) {}

  getAvailableCars = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { dateFrom, dateTo, userId } = req.query as { dateFrom: string; dateTo: string; userId: string };
      const cars = await this.useCase.execute(userId, new Date(dateFrom), new Date(dateTo));
      res.json(
        cars.map(ac => ({
          carId: ac.car.id,
          brand: ac.car.brand,
          model: ac.car.model,
          totalPrice: ac.totalPrice,
          averageDailyPrice: ac.averageDailyPrice,
          stock: ac.stock,
          available: ac.available,
        }))
      );
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
}
