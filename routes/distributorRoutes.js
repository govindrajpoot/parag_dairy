import express from 'express';
import {getDistributors,getDistributorById,updateDistributor,deleteDistributor, createDemand} from '../controllers/distributorController.js';
import { auth } from '../middlewares/auth.js';
import { USER_ROLES } from '../utils/constants.js';
import { distributorUpdateValidation, createDemandValidation } from '../validators/distributorValidator.js';
import { handleValidationErrors } from '../middlewares/validationHandler.js';

const router = express.Router();

/**
 * @route   GET /api/distributors
 * @desc    Get all distributors
 * @access  Private (Admin only)
 */
router.get('/', ...auth(USER_ROLES.ADMIN), getDistributors);

/**
 * @route   GET /api/distributors/:id
 * @desc    Get distributor by ID
 * @access  Private (Admin only)
 */
router.get('/:id', ...auth(USER_ROLES.ADMIN), getDistributorById);

/**
 * @route   PUT /api/distributors/:id
 * @desc    Update distributor by ID
 * @access  Private (Admin only)
 */
router.put('/:id', ...auth(USER_ROLES.ADMIN), distributorUpdateValidation, handleValidationErrors, updateDistributor);

/**
 * @route   DELETE /api/distributors/:id
 * @desc    Delete distributor by ID
 * @access  Private (Admin only)
 */
router.delete('/:id', ...auth(USER_ROLES.ADMIN), deleteDistributor);

/**
 * @route   POST /api/distributors/demands
 * @desc    Create demand for distributor (product-wise)
 * @access  Private (Distributor only)
 */
router.post('/demands', ...auth(USER_ROLES.DISTRIBUTOR), createDemandValidation, handleValidationErrors, createDemand);

export default router;
