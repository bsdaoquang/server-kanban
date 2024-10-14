/** @format */

import PromotionModel from '../models/PromotionModel';

const addNew = async (req: any, res: any) => {
	const body = req.body;

	try {
		const item = new PromotionModel(body);

		await item.save();

		res.status(200).json({
			message: 'Added',
			data: item,
		});
	} catch (error: any) {
		res.status(404).json({ message: error.message });
	}
};

const getPromotions = async (req: any, res: any) => {
	const body = req.body;
	try {
		const items = await PromotionModel.find();

		res.status(200).json({
			message: 'Added',
			data: items,
		});
	} catch (error: any) {
		res.status(404).json({ message: error.message });
	}
};

export { addNew, getPromotions };
