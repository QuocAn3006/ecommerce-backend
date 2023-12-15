const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const {
	authUserMiddleware,
	authMiddleware
} = require('../middleware/authMiddleware');

router.post(
	'/create-order/:id',
	authUserMiddleware,
	OrderController.createOrder
);

router.get(
	'/get-order-id/:id',
	authUserMiddleware,
	OrderController.getOrderById
);

router.delete(
	'/cancel-order/:id',
	authUserMiddleware,
	OrderController.cancelOrder
);

router.get('/get-all-order', authMiddleware, OrderController.getAllOrder);

module.exports = router;
