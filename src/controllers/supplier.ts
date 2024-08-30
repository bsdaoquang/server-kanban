/** @format */

import SupplierModel from '../models/SupplierModel';

const getSuppliers = async (_req: any, res: any) => {
	try {
		const items = await SupplierModel.find({ isDeleted: false });

		res.status(200).json({
			message: 'Products',
			data: items,
		});
	} catch (error: any) {
		res.status(404).json({
			message: error.message,
		});
	}
};
const addNew = async (req: any, res: any) => {
	const body = req.body;
	try {
		const newSupplier = new SupplierModel(body);
		newSupplier.save();

		res.status(200).json({
			message: 'Add new supplier successfully!!!',
			data: newSupplier,
		});
	} catch (error: any) {
		res.status(404).json({
			message: error.message,
		});
	}
};

const update = async (req: any, res: any) => {
	const body = req.body;
	const { id } = req.query;
	try {
		await SupplierModel.findByIdAndUpdate(id, body);

		res.status(200).json({
			message: 'Supplier updated',
			data: [],
		});
	} catch (error: any) {
		res.status(404).json({
			message: error.message,
		});
	}
};

const removeSupplier = async (req: any, res: any) => {
	const { id } = req.query;
	try {
		await SupplierModel.findByIdAndDelete(id);

		res.status(200).json({
			message: 'Supplier removed',
			data: [],
		});
	} catch (error: any) {
		res.status(404).json({
			message: error.message,
		});
	}
};

export { addNew, getSuppliers, update, removeSupplier };
