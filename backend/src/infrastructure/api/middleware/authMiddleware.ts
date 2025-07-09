import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user?: any;
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'No token provided' });
  } else {
    jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey', (err, decoded) => {
      if (err) {
        res.status(403).json({ message: 'Invalid or expired token' });
      } else {
        req.user = decoded;
        next();
      }
    });
  }
}
