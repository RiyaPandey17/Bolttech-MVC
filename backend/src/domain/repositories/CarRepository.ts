import { Car } from "../entities/Car";

export interface CarRepository {
  getAllCars(): Promise<Car[]>;
  getCarById(id: string): Promise<Car | null>;
}
