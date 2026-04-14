// backend/src/modules/product/product.routes.js
import express from 'express';
import multer from 'multer';
import { createProduct } from './products.controller.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/products
// upload.array('images', 5) means we accept an array of files under the field name 'images', max 5.
router.post('/', upload.array('images', 5), createProduct);

export default router;