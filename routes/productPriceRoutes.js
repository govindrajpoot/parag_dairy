import express from 'express';
import {createProductPrice,getProductPrices,getProductPriceById,updateProductPrice,deleteProductPrice} from '../controllers/productPriceController.js';
import { auth } from '../middlewares/auth.js';
import { USER_ROLES } from '../utils/constants.js';
import { createProductPriceValidation, updateProductPriceValidation } from '../validators/productPriceValidator.js';
import { handleValidationErrors } from '../middlewares/validationHandler.js';

const router = express.Router();

router.post('/', ...auth(USER_ROLES.ADMIN), createProductPriceValidation, handleValidationErrors, createProductPrice);

router.get('/', ...auth(USER_ROLES.ADMIN, USER_ROLES.DISTRIBUTOR), getProductPrices);

router.get('/:id', ...auth(USER_ROLES.ADMIN, USER_ROLES.DISTRIBUTOR), getProductPriceById);

router.put('/:id', ...auth(USER_ROLES.ADMIN), updateProductPriceValidation, handleValidationErrors, updateProductPrice);

router.delete('/:id', ...auth(USER_ROLES.ADMIN), deleteProductPrice);

export default router;
