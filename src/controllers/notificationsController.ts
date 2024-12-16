/** @format */

import NotificationModel from '../models/NotificationModel';

const getAllNotifications = async (req: any, res: any) => {
	try {
		const items = await NotificationModel.find({ toId: 'admin' });
		res.status(200).json({
			message: '',
			data: items,
		});
	} catch (error: any) {
		res.status(404).json({
			message: error.message,
		});
	}
};

const update = async (req: any, res: any) => {
	const { id } = req.query;
	const body = req.body;

	try {
		await NotificationModel.findByIdAndUpdate(id, body);

		res.status(200).json({
			message: 'Updated!!',
			data: [],
		});
	} catch (error: any) {
		res.status(404).json({
			message: error.message,
		});
	}
};

export { getAllNotifications, update };
