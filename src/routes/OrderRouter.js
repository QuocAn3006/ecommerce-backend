const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const { authUserMiddleware } = require('../middleware/authMiddleware');

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

module.exports = router;
