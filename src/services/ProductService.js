const Product = require('../models/ProductModal');

const createProduct = newProduct => {
	return new Promise(async (resolve, reject) => {
		const {
			name,
			image,
			type,
			price,
			countInStock,
			rating,
			description,
			discount
		} = newProduct;

		try {
			const checkProduct = await Product.findOne({
				name: name
			});
			if (checkProduct !== null) {
				resolve({
					status: 'ERR',
					message: 'the name of product is already'
				});
			}

			const newProduct = await Product.create({
				name,
				image,
				type,
				price,
				countInStock: Number(countInStock),
				rating,
				discount: Number(discount),
				description
			});
			if (createProduct) {
				resolve({
					status: 'OK',
					message: 'SUCCESS',
					data: newProduct
				});
			}
		} catch (e) {
			reject(e);
		}
	});
};

const updateProduct = (id, data) => {
	return new Promise(async (resolve, reject) => {
		try {
			const checkProduct = await Product.findOne({
				_id: id
			});
			if (checkProduct === null) {
				resolve({
					status: 'OK',
					message: 'the product is not defined'
				});
			}
			const updatedProduct = await Product.findByIdAndUpdate(id, data, {
				new: true
			});
			resolve({
				status: 'OK',
				message: 'SUCCESS',
				data: updatedProduct
			});
		} catch (e) {
			reject(e);
		}
	});
};

const deleteProduct = id => {
	return new Promise(async (resolve, reject) => {
		try {
			const checkProduct = await Product.findOne({
				_id: id
			});
			if (checkProduct === null) {
				resolve({
					status: 'OK',
					message: 'the user is not defined'
				});
			}
			await Product.findByIdAndDelete(id);
			resolve({
				status: 'OK',
				message: 'Delete product success'
			});
		} catch (e) {
			reject(e);
		}
	});
};

const deleteMany = ids => {
	return new Promise(async (resolve, reject) => {
		try {
			await Product.deleteMany({ _id: ids });
			resolve({
				status: 'OK',
				message: 'Delete many product success'
			});
		} catch (e) {
			reject(e);
		}
	});
};

const getAllProduct = (limit, page, sort, filter) => {
	return new Promise(async (resolve, reject) => {
		try {
			const totalProduct = await Product.count();
			let allProduct = [];
			if (filter) {
				const label = filter[0];
				const allProductFillter = await Product.find({
					[label]: { $regex: new RegExp(filter[1], 'i') }
				})
					.limit(limit)
					.skip(page * limit);
				resolve({
					status: 'OK',
					message: 'success',
					data: allProductFillter,
					total: totalProduct,
					pageCurrent: Number(page + 1),
					totalPage: Math.ceil(totalProduct / limit)
				});
			}
			if (sort) {
				const objectSort = {};
				objectSort[sort[1]] = sort[0];
				const allProductSort = await Product.find()
					.limit(limit)
					.skip(page * limit)
					.sort(objectSort);

				resolve({
					status: 'OK',
					message: 'success',
					data: allProductSort,
					total: totalProduct,
					pageCurrent: Number(page + 1),
					totalPage: Math.ceil(totalProduct / limit)
				});
			}
			if (!limit) {
				allProduct = await Product.find().sort({
					createdAt: -1,
					updatedAt: -1
				});
			} else {
				allProduct = await Product.find()
					.limit(limit)
					.skip(page * limit)
					.sort({ createdAt: -1, updatedAt: -1 });
			}

			resolve({
				status: 'OK',
				message: 'success',
				data: allProduct,
				total: totalProduct,
				pageCurrent: Number(page + 1),
				totalPage: Math.ceil(totalProduct / limit)
			});
		} catch (e) {
			reject(e);
		}
	});
};

const getAllType = () => {
	return new Promise(async (resolve, reject) => {
		try {
			const allType = await Product.distinct('type');
			resolve({
				status: 'OK',
				message: 'success',
				data: allType
			});
		} catch (e) {
			reject(e);
		}
	});
};

const getDetailsProduct = id => {
	return new Promise(async (resolve, reject) => {
		try {
			const product = await Product.findOne({
				_id: id
			});
			if (product === null) {
				resolve({
					status: 'OK',
					message: 'the product is not defined'
				});
			}
			resolve({
				status: 'OK',
				message: 'SUCCESS',
				data: product
			});
		} catch (e) {
			reject(e);
		}
	});
};
module.exports = {
	createProduct,
	updateProduct,
	getDetailsProduct,
	deleteProduct,
	getAllProduct,
	deleteMany,
	getAllType
};
