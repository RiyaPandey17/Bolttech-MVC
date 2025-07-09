import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { KnexUserRepository } from '../../repositories/KnexUserRepository';

const userRepo = new KnexUserRepository();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    const { email, password, name, licenseNumber, licenseValidUntil } = req.body;
    try {
      const existing = await userRepo.findByEmail(email);
      if (existing) {
        res.status(400).json({ message: 'Email already registered' });
        return;
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const id = uuidv4();
      const user = await userRepo.create({ id, email, passwordHash, name, licenseNumber, licenseValidUntil });

      res.status(201).json({ user: { id: user.id, email: user.email, name: user.name } });
    } catch (err) {
      console.error('Error during user registration:', err);
      res.status(500).json({ message: 'An error occurred while registering the user. Please try again later.' });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    try {
      const user = await userRepo.findByEmail(email);
      if (!user) {
        res.status(400).json({ message: 'Invalid email or password' });
        return;
      }

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        res.status(400).json({ message: 'Invalid email or password' });
        return;
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({ 
        user: { id: user.id, email: user.email, name: user.name },
        token
      });
    } catch (err) {
      console.error('Error during user login:', err);
      res.status(500).json({ message: 'An error occurred while logging in. Please try again later.' });
    }
  }

  static logout(_req: Request, res: Response): void {
    res.json({ message: 'Logged out successfully' });
  }

  static async me(req: Request, res: Response): Promise<void> {
    try {
      // @ts-ignore: user is set in middleware
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
      }
      const user = await userRepo.findById(userId);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.json({ id: user.id, email: user.email, name: user.name });
    } catch (err) {
      console.error('Error fetching user details:', err);
      res.status(500).json({ message: 'An error occurred while fetching user details. Please try again later.' });
    }
  }
}
