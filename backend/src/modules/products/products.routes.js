// backend/src/modules/product/product.routes.js
import express from 'express';
import multer from 'multer';
import { createProduct, updateProduct, deleteProduct, getProducts, getProductById, toggleLikeProduct, toggleSaveProduct} from './products.controller.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// READ routes (Open to cross-campus browsing)
router.get('/', getProducts);
router.get('/:id', getProductById);

// POST /api/products
// upload.array('images', 5) means we accept an array of files under the field name 'images', max 5.
router.post('/', upload.array('images', 5), createProduct);
router.put('/:id', updateProduct); 
router.delete('/:id', deleteProduct); 

// INTERACTION routes
router.post('/:id/like', toggleLikeProduct);
router.post('/:id/save', toggleSaveProduct);

export default router;