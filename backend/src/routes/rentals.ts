import { Router } from 'express';
import { body } from 'express-validator';
import {
  getMyRentals,
  getActiveRentals,
  createRental,
  returnRental,
  cancelRental
} from '../controllers/rentalController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

// Validation rules
const createRentalValidation = [
  body('clothingIds').isArray({ min: 1 }).withMessage('Выберите хотя бы одну вещь'),
  body('startDate').isISO8601().withMessage('Укажите дату начала'),
  body('endDate').isISO8601().withMessage('Укажите дату окончания')
];

const returnRentalValidation = [
  body('condition').optional().isIn(['NEW', 'EXCELLENT', 'GOOD', 'FAIR']).withMessage('Некорректное состояние')
];

// Protected routes
router.get('/', authenticate, getMyRentals);
router.get('/active', authenticate, getActiveRentals);
router.post('/', authenticate, createRentalValidation, validate, createRental);
router.put('/:id/return', authenticate, returnRentalValidation, validate, returnRental);
router.put('/:id/cancel', authenticate, cancelRental);

export default router;
