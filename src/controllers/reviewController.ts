/** @format */

import ReviewModel from '../models/ReviewModel';

const addnew = async (req: any, res: any) => {
	const body = req.body;

	try {
		const item = new ReviewModel(body);
		await item.save();
		res.status(200).json({
			data: item,
		});
	} catch (error: any) {
		res.status(404).json({
			message: error.message,
		});
	}
};
const getAll = async (req: any, res: any) => {
	const { id, limit } = req.query;
	try {
		const items = await ReviewModel.find({ parentId: id }).limit(limit ?? 5);
		res.status(200).json({
			data: items,
		});
	} catch (error: any) {
		res.status(404).json({
			message: error.message,
		});
	}
};
export { addnew, getAll };
