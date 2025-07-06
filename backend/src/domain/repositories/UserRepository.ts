import { User } from "../entities/User";

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: {
    id: string;
    email: string;
    passwordHash: string;
    name: string;
    licenseNumber: string;
    licenseValidUntil: Date;
  }): Promise<User>;
}
