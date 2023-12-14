const OrderService = require('../services/OrderService');

const createOrder = async (req, res) => {
	try {
		const {
			paymentMethod,
			itemPrice,
			shippingPrice,
			totalPrice,
			fullName,
			address,
			city,
			phone
		} = req.body;

		if (
			!paymentMethod ||
			!itemPrice ||
			!shippingPrice ||
			!totalPrice ||
			!fullName ||
			!address ||
			!city ||
			!phone
		) {
			return res.status(200).json({
				status: 'ERR',
				message: 'the input is required'
			});
		}
		const response = await OrderService.createOrder(req.body);
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e
		});
	}
};

const getOrderById = async (req, res) => {
	try {
		const userId = req.params.id;
		if (!userId) {
			return res.status(200).json({
				status: 'ERR',
				message: 'the userID is required'
			});
		}
		const response = await OrderService.getOrderById(userId);
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e
		});
	}
};

const cancelOrder = async (req, res) => {
	try {
		const data = req.body.orderItems;
		const orderId = req.body.orderId;
		if (!orderId) {
			return res.status(200).json({
				status: 'ERR',
				message: 'the userID is required'
			});
		}
		const response = await OrderService.cancelOrder(orderId, data);
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e
		});
	}
};

module.exports = {
	createOrder,
	getOrderById,
	cancelOrder
};
