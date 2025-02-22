/** @format */

import { Request, Response } from 'express';
import OrderModel from '../models/OrderModel';
import BillModel from '../models/BillModel';

const getTimes = (timeType: string) => {
	let start;
	let end;
	const now = new Date();

	switch (timeType) {
		case 'weekly':
			start = new Date(now.setDate(now.getDate() - now.getDay()));
			end = new Date(now.setDate(now.getDate() - now.getDay() + 6));
			break;
		case 'monthly':
			start = new Date(now.getFullYear(), now.getMonth(), 1);
			end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
			break;
		case 'yearly':
			start = new Date(now.getFullYear(), 0, 1);
			end = new Date(now.getFullYear(), 11, 31);
			break;
	}

	return { start, end };
};

const getDatas = async (date: Date, type: string) => {
	const filter =
		type === 'yearly'
			? {
					createdAt: {
						$gte: new Date(date.setMonth(date.getMonth())),
						$lt: new Date(date.setMonth(date.getMonth() + 1)),
					},
			  }
			: {
					createdAt: {
						$gte: new Date(date.setHours(0, 0, 0, 0)),
						$lt: new Date(date.setHours(23, 59, 59, 999)),
					},
			  };

	const orders = await OrderModel.find(filter);
	const purchases = await BillModel.find(filter);

	return {
		orders: orders.reduce((a, b) => a + b.total, 0),
		purchase: purchases.reduce((a, b) => a + b.total, 0),
	};
};

const getOrderAndPurchase = async (req: Request, res: Response) => {
	const { timeType } = req.query;

	try {
		const dates = getTimes(timeType as string);
		const nums =
			timeType === 'yearly'
				? 12
				: dates.start && dates.end
				? dates.end.getDate() - dates.start.getDate() + 1
				: 0;

		const days: Date[] = [];
		for (let i = 0; i < nums; i++) {
			if (timeType === 'yearly') {
				dates.start = new Date(dates.start as Date);
				dates.start.setMonth(i);

				const day = new Date(dates.start as Date);
				days.push(day);
			} else {
				const day = new Date(dates.start as Date);
				day.setDate(day.getDate() + i);
				days.push(day);
			}
		}

		const promises = days.map(async (day) => ({
			date: day,
			data: await getDatas(day, timeType as string),
		}));

		const results = await Promise.all(promises);

		res
			.status(200)
			.json({ message: 'Get order and purchase successfully', data: results });
	} catch (error: any) {
		console.log(error);
		res.status(404).send({ message: error.message });
	}
};

export { getOrderAndPurchase };
