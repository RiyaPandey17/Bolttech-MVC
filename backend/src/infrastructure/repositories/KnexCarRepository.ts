import { CarRepository } from "../../domain/repositories/CarRepository";
import { Car } from "../../domain/entities/Car";
import { db } from "../db/knex";

export class KnexCarRepository implements CarRepository {
  async getAllCars(): Promise<Car[]> {
    const rows = await db('cars');
    return rows.map(row =>
      new Car(
        row.id,
        row.brand,
        row.model,
        row.stock,
        parseFloat(row.peak_season_price),
        parseFloat(row.mid_season_price),
        parseFloat(row.off_season_price)
      )
    );
  }

  async getCarById(id: string): Promise<Car | null> {
    const row = await db('cars').where({ id }).first();
    if (!row) return null;

    return new Car(
      row.id,
      row.brand,
      row.model,
      row.stock,
      parseFloat(row.peak_season_price),
      parseFloat(row.mid_season_price),
      parseFloat(row.off_season_price)
    );
  }
}
