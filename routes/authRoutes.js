import express from 'express';
import { signup, signin, getAllUsers, resetPassword } from '../controllers/authController.js';
import { auth, canCreateUser } from '../middlewares/auth.js';
import { USER_ROLES } from '../utils/constants.js';
import { signupValidation, signinValidation, forgotPasswordValidation } from '../validators/authValidator.js';
import { handleValidationErrors } from '../middlewares/validationHandler.js';

const router = express.Router();

router.post('/signup', signupValidation, handleValidationErrors, signup);

router.post('/create-user', ...auth(), canCreateUser, signupValidation, handleValidationErrors, signup);

router.post('/signin', signinValidation, handleValidationErrors, signin);

router.get('/users', ...auth(USER_ROLES.ADMIN), getAllUsers);

router.post('/reset-password', forgotPasswordValidation, handleValidationErrors, resetPassword);

export default router;
