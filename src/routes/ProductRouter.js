const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/create-product', ProductController.creatProduct);
router.put(
	'/update-product/:id',
	authMiddleware,
	ProductController.updateProduct
);

router.get('/details-product/:id', ProductController.getDetailsProduct);

router.delete(
	'/delete-product/:id',
	authMiddleware,
	ProductController.deleteProduct
);

router.get('/get-all-product', ProductController.getAllProduct);
router.get('/get-all-type', ProductController.getAllType);
router.post(
	'/delete-many-product',
	authMiddleware,
	ProductController.deleteMany
);

module.exports = router;
