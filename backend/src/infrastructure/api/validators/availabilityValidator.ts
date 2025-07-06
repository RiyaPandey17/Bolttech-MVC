import { query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateAvailability = [
  query('dateFrom')
    .exists().withMessage('dateFrom is required')
    .isISO8601().withMessage('dateFrom must be a valid date'),
  query('dateTo')
    .exists().withMessage('dateTo is required')
    .isISO8601().withMessage('dateTo must be a valid date'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return; 
      }
    next();
  }
];
