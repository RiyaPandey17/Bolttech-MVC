import express from 'express';
import { AuthController } from '../controllers/AuthController';
import { validateRegister, validateLogin } from '../validators/authValidator';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/auth/register', validateRegister, AuthController.register);
router.post('/auth/login', validateLogin, AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/auth/me', authenticateToken, AuthController.me);

export default router;
