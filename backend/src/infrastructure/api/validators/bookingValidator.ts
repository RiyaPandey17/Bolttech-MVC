import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateCreateBooking = [
  body('userId')
    .exists().withMessage('userId is required')
    .isUUID().withMessage('userId must be a valid UUID'),
  body('carId')
    .exists().withMessage('carId is required')
    .isUUID().withMessage('carId must be a valid UUID'),
  body('dateFrom')
    .exists().withMessage('dateFrom is required')
    .isISO8601().withMessage('dateFrom must be a valid date'),
  body('dateTo')
    .exists().withMessage('dateTo is required')
    .isISO8601().withMessage('dateTo must be a valid date'),
  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors)
      res.status(400).json({ errors: errors.array() });
      return; 
    }
    next();
  }
];
