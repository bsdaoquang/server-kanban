/** @format */

import UserModel from '../models/UserModel';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { getAccesstoken } from '../utils/getAccesstoken';
import { generatorRandomText } from '../utils/generatorRadomText';
dotenv.config();

const register = async (req: any, res: any) => {
	const body = req.body;
	const { email, name, password } = body;
	try {
		const user = await UserModel.findOne({ email });

		if (user) {
			throw new Error(`Tài khoản đã tồn tại`);
		}

		const salt = await bcrypt.genSalt(10);
		const hashpassword = await bcrypt.hash(password, salt);

		body.password = hashpassword;

		const newUser: any = new UserModel(body);
		await newUser.save();

		delete newUser._doc.password;

		res.status(200).json({
			message: 'Register',
			data: {
				...newUser._doc,
				token: await getAccesstoken({
					_id: newUser._id,
					email: newUser.email,
					rule: 1,
				}),
			},
		});
	} catch (error: any) {
		res.status(404).json({
			message: error.message,
		});
	}
};

const loginWithGoogle = async (req: any, res: any) => {
	const body = req.body;
	const { email, name } = body;
	try {
		const user: any = await UserModel.findOne({ email });

		if (user) {
			await UserModel.findByIdAndUpdate(user._id, body);

			const newUser: any = await UserModel.findById(user._id);

			delete newUser._doc.password;

			res.status(200).json({
				message: 'Login successfuly!!!',
				data: {
					...newUser._doc,
					token: await getAccesstoken({
						_id: newUser._id,
						email: newUser.email,
						rule: newUser.rule ?? 1,
					}),
				},
			});
		} else {
			const salt = await bcrypt.genSalt(10);
			const hashpassword = await bcrypt.hash(generatorRandomText(6), salt);

			body.password = hashpassword;

			const newUser: any = new UserModel(body);
			await newUser.save();

			delete newUser._doc.password;

			res.status(200).json({
				message: 'Register',
				data: {
					...newUser._doc,
					token: await getAccesstoken({
						_id: newUser._id,
						email: newUser.email,
						rule: 1,
					}),
				},
			});
		}
	} catch (error: any) {
		res.status(404).json({
			message: error.message,
		});
	}
};

const login = async (req: any, res: any) => {
	const body = req.body;
	const { email, password } = body;
	try {
		const user: any = await UserModel.findOne({ email });

		if (!user) {
			throw new Error(`Tài khoản không tồn tại`);
		}

		const isMatchPassword = await bcrypt.compare(password, user.password);

		if (!isMatchPassword) {
			throw new Error(
				'Đăng nhập thất bại, vui lòng kiểm tra lại Email/Password và thử lại'
			);
		}

		delete user._doc.password;

		res.status(200).json({
			message: 'Login successfuly!!!',
			data: {
				...user._doc,
				token: await getAccesstoken({
					_id: user._id,
					email: user.email,
					rule: user.rule ?? 1,
				}),
			},
		});
	} catch (error: any) {
		res.status(404).json({
			message: error.message,
		});
	}
};

const refreshToken = async (req: any, res: any) => {
	const { id } = req.query;

	try {
		const user = await UserModel.findById(id);
		if (!user) {
			throw new Error('User not found');
		}

		const token = await getAccesstoken({
			_id: id,
			email: user.email,
			rule: user.rule,
		});

		res.status(200).json({
			message: 'fafa',
			data: token,
		});
	} catch (error: any) {
		res.status(404).json({
			message: error.message,
		});
	}
};

export { register, login, loginWithGoogle, refreshToken };
