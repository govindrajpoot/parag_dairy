import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsForDistributor
} from '../controllers/productController.js';
import { auth } from '../middlewares/auth.js';
import { USER_ROLES } from '../utils/constants.js';
import { productValidation, productUpdateValidation } from '../validators/productValidator.js';
import { handleValidationErrors } from '../middlewares/validationHandler.js';

const router = express.Router();

router.post('/', ...auth(USER_ROLES.ADMIN), productValidation, handleValidationErrors, createProduct);

router.get('/', ...auth(USER_ROLES.ADMIN), getProducts);

router.get('/distributor', ...auth(USER_ROLES.ADMIN, USER_ROLES.DISTRIBUTOR), getProductsForDistributor);

router.get('/:id', ...auth(USER_ROLES.ADMIN), getProductById);

router.put('/:id', ...auth(USER_ROLES.ADMIN), productUpdateValidation, handleValidationErrors, updateProduct);

router.delete('/:id', ...auth(USER_ROLES.ADMIN), deleteProduct);

export default router;
