import { UserRepository } from "../../domain/repositories/UserRepository";
import { User } from "../../domain/entities/User";
import { db } from "../db/knex";

export class KnexUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    const row = await db('users').where({ id }).first();
    if (!row) return null;
    return new User(
      row.id,
      row.email,
      row.password_hash,
      row.name,
      row.license_number,
      new Date(row.license_valid_until)
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await db('users').where({ email }).first();
    if (!row) return null;
    return new User(
      row.id,
      row.email,
      row.password_hash,
      row.name,
      row.license_number,
      new Date(row.license_valid_until)
    );
  }

  async create({
    id,
    email,
    passwordHash,
    name,
    licenseNumber,
    licenseValidUntil
  }: {
    id: string,
    email: string,
    passwordHash: string,
    name: string,
    licenseNumber: string,
    licenseValidUntil: Date
  }): Promise<User> {
    await db('users').insert({
      id,
      email,
      password_hash: passwordHash,
      name,
      license_number: licenseNumber,
      license_valid_until: licenseValidUntil
    });
    return new User(id, email, passwordHash, name, licenseNumber, licenseValidUntil);
  }
}
