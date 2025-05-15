import express from 'express';
import {
  register,
  login,
  adminRegister,
} from '../controllers/authController.js';

const router = express.Router();

// רישום למשתמש רגיל
router.post('/register', register);

// רישום לאדמין - כתובת שונה לפי הדרישות
router.post('/admin/register', adminRegister);

// התחברות אחידה
router.post('/login', login);

export default router;
