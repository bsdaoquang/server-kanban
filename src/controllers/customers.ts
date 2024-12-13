/** @format */

import bcrypt from 'bcrypt';
import CustomerModel from '../models/CustomModel';
import { generatorRandomText } from '../utils/generatorRadomText';
import { getAccesstoken } from '../utils/getAccesstoken';
import { handleSendMail } from '../utils/handleSendMail';

const getVerifiCode = async (req: any, res: any) => {
	const { id, code } = req.query;

	try {
		const customer: any = await CustomerModel.findById(id);
		if (!customer) {
			throw new Error('User is not found!!');
		}
		const verifyCode = customer._doc.verifyCode;
		if (code !== verifyCode) {
			throw new Error('Code is invalid!!!');
		}

		await CustomerModel.findByIdAndUpdate(id, {
			isVerify: true,
			verifyCode: '',
			isDeleted: false,
		});

		const accesstoken = await getAccesstoken({
			_id: customer._id,
			email: customer._doc.email,
			rule: 1,
		});

		delete customer._doc.password;
		delete customer._doc.verifyCode;

		res.status(200).json({
			message: 'Verify successfully!!!',

			data: {
				...customer._doc,
				accesstoken,
			},
		});
	} catch (error: any) {
		res.status(404).json({
			message: error.message,
		});
	}
};

const resendCode = async (req: any, res: any) => {
	const { id, email } = req.query;

	try {
		const code = generatorRandomText(6);

		console.log(code);

		await handleSendMail({
			from: 'Support Kanban project',
			to: email,
			subject: 'Hello ✔',
			text: 'Hello world?',
			html: `<h1>Mã xác minh${code}</h1>`,
		});

		await CustomerModel.findByIdAndUpdate(id, { verifyCode: code });

		res.status(200).json({
			message: 'New code',
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
		const user = await CustomerModel.findOne({ email: body.email });
		console.log(user);
		if (user) {
			throw new Error('User is existing!!!!');
		}
		const code = generatorRandomText(6);
		const salt = await bcrypt.genSalt(10);
		const hashpassword = await bcrypt.hash(body.password, salt);

		body.password = hashpassword;

		const newCustomer: any = new CustomerModel({ ...body, verifyCode: code });
		await newCustomer.save();

		delete newCustomer._doc.password;
		delete newCustomer._doc.verifyCode;

		await handleSendMail({
			from: 'Support Kanban project',
			to: body.email,
			subject: 'Hello ✔',
			text: 'Hello world?',
			html: `<h1>Mã xác minh${code}</h1>`,
		});

		console.log(code);

		res.status(200).json({
			message: 'Register successfully!!!',
			data: newCustomer,
		});
	} catch (error: any) {
		// console.log(error);
		res.status(404).json({
			message: error.message,
		});
	}
};

const login = async (req: any, res: any) => {
	const body = req.body;

	const { email, password } = body;

	try {
		const customer: any = await CustomerModel.findOne({ email });

		if (!customer) {
			throw new Error('User not found!!!');
		}

		const isMatchPassword = await bcrypt.compare(password, customer.password);

		if (!isMatchPassword) {
			throw new Error('Email/Password is not correct!!!');
		}

		const item = customer._doc;

		delete item.password;
		const accesstoken = await getAccesstoken({ _id: item._id, email });
		item.accesstoken = accesstoken;

		res.status(200).json({
			message: 'login successfully!!!',
			data: item,
		});
	} catch (error: any) {
		res.status(404).json({
			message: error.message,
		});
	}
};

const getProfile = async (req: any, res: any) => {
	const { id } = req.query;

	try {
		const user: any = await CustomerModel.findById(id).select('-password');
		if (!user) {
			throw new Error('User not found');
		}

		res.status(200).json({
			message: 'Profile',
			data: user,
		});
	} catch (error: any) {
		res.status(404).json({
			message: error.message,
		});
	}
};

const update = async (req: any, res: any) => {
	const body = req.body;
	const id = req.uid;

	try {
		const user = await CustomerModel.findById(id);

		if (!user) {
			throw new Error('User not found');
		}
		await CustomerModel.findByIdAndUpdate(id, body);

		const newUser = await CustomerModel.findById(id).select('-password');

		res.status(200).json({
			message: 'fafa',
			data: newUser,
		});
	} catch (error: any) {
		res.status(404).json({
			message: error.message,
		});
	}
};

export { create, getVerifiCode, resendCode, login, getProfile, update };
