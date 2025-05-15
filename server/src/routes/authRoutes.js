import express from 'express';
import { register, login } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/user/login', (req, res) => login(req, res, 'user'));
router.post('/admin/login', (req, res) => login(req, res, 'admin'));
export default router;
