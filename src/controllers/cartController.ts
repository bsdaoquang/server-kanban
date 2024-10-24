/** @format */

import CartModel from '../models/CartModel';

const addProduct = async (req: any, res: any) => {
	const { id } = req.query;

	const body = req.body;

	try {
		if (id) {
			await CartModel.findByIdAndUpdate(id, body);

			res.status(200).json({
				data: [],
				message: 'Update cart to DB!!!',
			});
		} else {
			const item = new CartModel(body);
			await item.save();
			res.status(200).json({
				data: [],
				message: 'Update cart to DB!!!',
			});
		}
	} catch (error: any) {
		res.status(404).json({ message: error.message });
	}
};

const getCartItems = async (req: any, res: any) => {
	const uid = req.uid;
	try {
		const items = await CartModel.find({ createdBy: uid });

		res.status(200).json({ data: items });
	} catch (error: any) {
		res.status(404).json({ message: error.message });
	}
};

const removeCartItem = async (req: any, res: any) => {
	const { id } = req.query;
	try {
		await CartModel.findByIdAndDelete(id);

		res.status(200).json({ message: 'fafa', data: [] });
	} catch (error: any) {
		res.status(404).json({ message: error.message });
	}
};

export { addProduct, getCartItems, removeCartItem };
