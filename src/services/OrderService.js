const Order = require('../models/OrderProduct');
const Product = require('../models/ProductModal');

const createOrder = newOrder => {
	return new Promise(async (resolve, reject) => {
		const {
			orderItems,
			paymentMethod,
			itemPrice,
			shippingPrice,
			totalPrice,
			fullName,
			address,
			city,
			phone,
			user
		} = newOrder;

		try {
			const promise = orderItems.map(async order => {
				const productData = await Product.findOneAndUpdate(
					{
						_id: order.product,
						countInStock: { $gte: order.amount }
					},
					{
						$inc: {
							countInStock: -order.amount,
							selled: +order.amount
						}
					},
					{ new: true }
				);
				if (productData) {
					return {
						status: 'OK',
						message: 'SUCCESS'
					};
				} else {
					return {
						status: 'ERR',
						message: 'Error',
						id: order.product
					};
				}
			});
			const result = await Promise.all(promise);
			const newData = result && result.filter(item => item.id);
			if (newData.length) {
				const arrId = [];
				newData.forEach(item => {
					arrId.push(item.id);
				});
				resolve({
					status: 'ERR',
					message: `Product - id ${newData.join(
						','
					)} not enough product`
				});
			} else {
				const createOrder = await Order.create({
					orderItems,
					shippingAddress: {
						fullName,
						address,
						city,
						phone
					},
					paymentMethod,
					itemPrice,
					shippingPrice,
					totalPrice,
					user: user
				});
				if (createOrder) {
					resolve({
						status: 'OK',
						message: 'SUCCESS'
					});
				}
			}
		} catch (e) {
			reject(e);
		}
	});
};

const getOrderById = id => {
	return new Promise(async (resolve, reject) => {
		try {
			const order = await Order.find({
				user: id
			});
			if (order === null) {
				resolve({
					status: 'ERR',
					message: 'the product is not defined'
				});
			}
			resolve({
				status: 'OK',
				message: 'SUCCESS',
				data: order
			});
		} catch (e) {
			reject(e);
		}
	});
};

const cancelOrder = (id, data) => {
	return new Promise(async (resolve, reject) => {
		try {
			let order = [];
			const promises = data.map(async order => {
				const productData = await Product.findOneAndUpdate(
					{
						_id: order.product,
						selled: { $gte: order.amount }
					},
					{
						$inc: {
							countInStock: +order.amount,
							selled: -order.amount
						}
					},
					{ new: true }
				);
				if (productData) {
					order = await Order.findByIdAndDelete(id);
					if (order === null) {
						resolve({
							status: 'ERR',
							message: 'The order is not defined'
						});
					}
				} else {
					return {
						status: 'OK',
						message: 'ERR',
						id: order.product
					};
				}
			});
			const results = await Promise.all(promises);
			const newData = results && results[0] && results[0].id;

			if (newData) {
				resolve({
					status: 'ERR',
					message: `product - id: ${newData} invalid`
				});
			}
			resolve({
				status: 'OK',
				message: 'success',
				data: order
			});
		} catch (e) {
			reject(e);
		}
	});
};

module.exports = {
	createOrder,
	getOrderById,
	cancelOrder
};
