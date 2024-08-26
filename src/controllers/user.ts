/** @format */

import UserModel from '../models/UserModel';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { getAccesstoken } from '../utils/getAccesstoken';
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
const login = async (req: any, res: any) => {
	const body = req.body;
	const { email, password } = body;
	try {
		const user: any = await UserModel.findOne({ email });

		if (!user) {
			throw new Error(`Tài khoản không tồn tại`);
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

export { register, login };
