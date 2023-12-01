const User = require('../models/UserModal');
const brypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
	generalAccessToken,
	generalRefreshAccessToken
} = require('./JwtService');

const createUser = newUser => {
	return new Promise(async (resolve, reject) => {
		const { name, email, password, confirmPassword } = newUser;

		try {
			const checkUser = await User.findOne({
				email: email
			});
			if (checkUser !== null) {
				resolve({
					status: 'ERR',
					message: 'the email is already'
				});
			}
			const hashPassword = brypt.hashSync(password, 10);
			const hashConfirmPassword = brypt.hashSync(confirmPassword, 10);
			const createdUser = await User.create({
				name,
				email,
				password: hashPassword,
				confirmPassword: hashConfirmPassword
			});
			if (createdUser) {
				resolve({
					status: 'OK',
					message: 'SUCCESS',
					data: createdUser
				});
			}
		} catch (e) {
			reject(e);
		}
	});
};

const loginUser = userLogin => {
	return new Promise(async (resolve, reject) => {
		const { email, password } = userLogin;

		try {
			const checkUser = await User.findOne({
				email: email
			});
			if (checkUser === null) {
				resolve({
					status: 'ERR',
					message: 'the user is not defined'
				});
			}
			const comparePassword = brypt.compareSync(
				password,
				checkUser.password
			);
			if (!comparePassword) {
				resolve({
					status: 'ERR',
					message: 'the email or password is incorrect'
				});
			}
			const access_token = await generalAccessToken({
				id: checkUser.id,
				isAdmin: checkUser.isAdmin
			});
			const refresh_token = await generalRefreshAccessToken({
				id: checkUser.id,
				isAdmin: checkUser.isAdmin
			});
			resolve({
				status: 'OK',
				message: 'SUCCESS',
				access_token,
				refresh_token
			});
		} catch (e) {
			reject(e);
		}
	});
};

const updateUser = (id, data) => {
	return new Promise(async (resolve, reject) => {
		try {
			const checkUser = await User.findOne({
				_id: id
			});
			if (checkUser === null) {
				resolve({
					status: 'OK',
					message: 'the user is not defined'
				});
			}
			const updatedUser = await User.findByIdAndUpdate(id, data, {
				new: true
			});
			resolve({
				status: 'OK',
				message: 'SUCCESS',
				data: updatedUser
			});
		} catch (e) {
			reject(e);
		}
	});
};

const deleteUser = id => {
	return new Promise(async (resolve, reject) => {
		try {
			const checkUser = await User.findOne({
				_id: id
			});
			if (checkUser === null) {
				resolve({
					status: 'OK',
					message: 'the user is not defined'
				});
			}
			await User.findByIdAndDelete(id);
			resolve({
				status: 'OK',
				message: 'Delete user success'
			});
		} catch (e) {
			reject(e);
		}
	});
};

const deleteMany = ids => {
	return new Promise(async (resolve, reject) => {
		try {
			await User.deleteMany({ _id: ids });
			resolve({
				status: 'OK',
				message: 'Delete many user success'
			});
		} catch (e) {
			reject(e);
		}
	});
};

const getAllUser = () => {
	return new Promise(async (resolve, reject) => {
		try {
			const allUser = await User.find().sort({
				createdAt: -1,
				updatedAt: -1
			});
			resolve({
				status: 'OK',
				message: 'success',
				data: allUser
			});
		} catch (e) {
			reject(e);
		}
	});
};

const getDetailsUser = id => {
	return new Promise(async (resolve, reject) => {
		try {
			const user = await User.findOne({
				_id: id
			});
			if (user === null) {
				resolve({
					status: 'OK',
					message: 'the user is not defined'
				});
			}
			resolve({
				status: 'OK',
				message: 'SUCCESS',
				data: user
			});
		} catch (e) {
			reject(e);
		}
	});
};

module.exports = {
	createUser,
	loginUser,
	updateUser,
	deleteUser,
	getAllUser,
	getDetailsUser,
	deleteMany
};
