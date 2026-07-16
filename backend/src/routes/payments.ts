import { Router } from 'express';
import { body } from 'express-validator';
import { createPayment, handleWebhook, getPaymentHistory } from '../controllers/paymentController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

// Validation rules
const createPaymentValidation = [
  body('orderId').notEmpty().withMessage('Укажите ID заказа'),
  body('paymentMethod').isIn(['kaspi', 'halyk', 'card']).withMessage('Некорректный способ оплаты')
];

// Protected routes
router.post('/create', authenticate, createPaymentValidation, validate, createPayment);
router.get('/history', authenticate, getPaymentHistory);

// Webhook (no auth - called by payment provider)
router.post('/webhook', handleWebhook);

export default router;
