/** @format */

import { query } from 'express';
import AddressModel from '../models/AddressModel';
import CartModel from '../models/CartModel';
import { constants } from 'os';

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
				data: item,
				message: 'Update cart to DB!!!',
			});
		}
	} catch (error: any) {
		res.status(404).json({ message: error.message });
	}
};

const updateProductInCart = async (req: any, res: any) => {
	const { id } = req.query;

	const body = req.body;

	try {
		await CartModel.findByIdAndUpdate(id, body);

		res.status(200).json({ message: 'Done', data: [] });
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

const clearCardByUser = async (req: any, res: any) => {
	const uid = req.uid;

	try {
		const cartItems = await CartModel.find({ createdBy: uid });

		cartItems.forEach(
			async (item) => await CartModel.findByIdAndDelete(item._id)
		);

		res.status(200).json({
			message: 'Đã xóa đơn hàng',
			data: [],
		});
	} catch (error: any) {
		res.status(404).json({
			message: error.message,
		});
	}
};

const addNewAddress = async (req: any, res: any) => {
	const body = req.body;

	const { isDefault } = body;

	const uid = req.uid;
	try {
		const item = new AddressModel(body);
		await item.save();
		if (isDefault) {
			const defaultAddressItem = await AddressModel.findOne({
				$and: [{ createdBy: uid }, { isDefault: true }],
			});

			if (defaultAddressItem) {
				await AddressModel.findByIdAndUpdate(defaultAddressItem._id, {
					isDefault: false,
				});
			}
		} else {
			res.status(200).json({ message: 'fafa', data: item });
		}
	} catch (error: any) {
		res.status(404).json({ message: error.message });
	}
};

const getAddressByUser = async (req: any, res: any) => {
	const id = req.uid;
	try {
		const items = await AddressModel.find({ createdBy: id });
		res.status(200).json({ message: 'fafa', data: items });
	} catch (error: any) {
		res.status(404).json({ message: error.message });
	}
};

const deleteAddress = async (req: any, res: any) => {
	const { id } = req.query;
	try {
		await AddressModel.findByIdAndDelete(id);
		res.status(200).json({ message: 'Deleted' });
	} catch (error: any) {
		res.status(404).json({ message: error.message });
	}
};

const updateAddress = async (req: any, res: any) => {
	const body = req.body;
	const { id } = req.query;
	try {
		await AddressModel.findByIdAndUpdate(id, body);

		const item = await AddressModel.findById(id);

		res.status(200).json({ message: 'Update', data: item });
	} catch (error: any) {
		res.status(404).json({ message: error.message });
	}
};

export {
	addProduct,
	getCartItems,
	removeCartItem,
	updateProductInCart,
	addNewAddress,
	getAddressByUser,
	deleteAddress,
	updateAddress,
	clearCardByUser,
};
