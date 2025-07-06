import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('cars').del();

  // Inserts seed entries
  await knex('cars').insert([
    {
      id: '11111111-1111-1111-1111-111111111111',
      brand: 'Toyota',
      model: 'Yaris',
      stock: 3,
      peak_season_price: 98.43,
      mid_season_price: 76.89,
      off_season_price: 53.65,
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      brand: 'Seat',
      model: 'Ibiza',
      stock: 5,
      peak_season_price: 85.12,
      mid_season_price: 65.73,
      off_season_price: 46.85,
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      brand: 'Nissan',
      model: 'Qashqai',
      stock: 2,
      peak_season_price: 101.46,
      mid_season_price: 82.94,
      off_season_price: 59.87,
    },
    {
      id: '44444444-4444-4444-4444-444444444444',
      brand: 'Jaguar',
      model: 'e-pace',
      stock: 1,
      peak_season_price: 120.54,
      mid_season_price: 91.35,
      off_season_price: 70.27,
    },
    {
      id: '55555555-5555-5555-5555-555555555555',
      brand: 'Mercedes',
      model: 'Vito',
      stock: 2,
      peak_season_price: 109.16,
      mid_season_price: 89.64,
      off_season_price: 64.97,
    }
  ]);
}
