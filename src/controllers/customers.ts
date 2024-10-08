/** @format */

import CustomerModel from '../models/CustomModel';
import bcrypt from 'bcrypt';
import { getAccesstoken } from '../utils/getAccesstoken';
import { generatorRandomText } from '../utils/generatorRadomText';
import { handleSendMail } from '../utils/handleSendMail';

const getVerifiCode = async (req: any, res: any) => {
	const body = req.body;
	const { id } = req.query;
	const { code } = req.body;

	try {
		const customer = await CustomerModel.findById(id);

		if (!customer) {
			throw new Error('User is not found!!');
		}

		const verifyCode = customer.verifyCode;

		if (code !== verifyCode) {
			throw new Error('Code is invalid!!!');
		}

		await CustomerModel.findByIdAndUpdate({
			isVerify: true,
			verifyCode: '',
		});

		res.status(200).json({
			message: 'Verify successfully!!!',
			data: [],
		});
	} catch (error: any) {
		res.status(404).json({
			message: error.message,
		});
	}
};

const create = async (req: any, res: any) => {
	const body = req.body;
	try {
		const code = generatorRandomText(6);
		const salt = await bcrypt.genSalt(10);
		const hashpassword = await bcrypt.hash(body.password, salt);

		body.password = hashpassword;

		const newCustomer: any = new CustomerModel({ ...body, verifyCode: code });
		await newCustomer.save();

		// const accesstoken = await getAccesstoken({
		// 	_id: newCustomer._id,
		// 	email: body.email,
		// 	rule: 1,
		// });

		delete newCustomer._doc.password;
		delete newCustomer._doc.verifyCode;

		// Gửi mã số này đến email mà người dùng đăng ký

		await handleSendMail({
			from: 'Support Kanban project',
			to: body.email,
			subject: 'Hello ✔',
			text: 'Hello world?',
			html: `<h1>Mã xác minh${code}</h1>`,
		});

		// console.log(result);
		// console.log(code);

		res.status(200).json({
			message: 'Register successfully!!!',
			data: newCustomer,
		});
	} catch (error: any) {
		console.log(error);
		res.status(404).json({
			message: error.message,
		});
	}
};

export { create, getVerifiCode };
