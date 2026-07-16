import { Router } from 'express';
import { body } from 'express-validator';
import {
  getPlans,
  getCurrentSubscription,
  subscribe,
  cancelSubscription
} from '../controllers/subscriptionController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

// Validation rules
const subscribeValidation = [
  body('planId').notEmpty().withMessage('Выберите план подписки')
];

// Public routes
router.get('/plans', getPlans);

// Protected routes
router.get('/current', authenticate, getCurrentSubscription);
router.post('/subscribe', authenticate, subscribeValidation, validate, subscribe);
router.post('/cancel', authenticate, cancelSubscription);

export default router;
