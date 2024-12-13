/** @format */

import BillModel from '../models/BillModel';

const addBill = async (req: any, res: any) => {
	const body = req.body;
	const uid = req.uid;

	try {
		body.customer_id = uid;

		const newBill = new BillModel(body);
		await newBill.save();

		// gửi email và notification cho admin
		// gửi api cho đơn vị giao hàng liên kết nếu có

		res.status(200).json({
			message: 'fafafa',
			data: newBill,
		});
	} catch (error: any) {
		res.status(400).json({
			message: error.message,
		});
	}
};

export { addBill };
