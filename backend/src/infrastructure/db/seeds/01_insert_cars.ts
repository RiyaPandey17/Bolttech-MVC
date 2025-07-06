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
      peak_season_price: 9843,
      mid_season_price: 7689,
      off_season_price: 5365,
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      brand: 'Seat',
      model: 'Ibiza',
      stock: 5,
      peak_season_price: 8512,
      mid_season_price: 6573,
      off_season_price: 4685,
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      brand: 'Nissan',
      model: 'Qashqai',
      stock: 2,
      peak_season_price: 10146,
      mid_season_price: 8294,
      off_season_price: 5987,
    },
    {
      id: '44444444-4444-4444-4444-444444444444',
      brand: 'Jaguar',
      model: 'e-pace',
      stock: 1,
      peak_season_price: 12054,
      mid_season_price: 9135,
      off_season_price: 7027,
    },
    {
      id: '55555555-5555-5555-5555-555555555555',
      brand: 'Mercedes',
      model: 'Vito',
      stock: 2,
      peak_season_price: 10916,
      mid_season_price: 8964,
      off_season_price: 6497,
    }
  ]);
}
