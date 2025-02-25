/** @format */

import { Request, Response } from 'express';
import OrderModel from '../models/OrderModel';
import BillModel from '../models/BillModel';
import ProductModel from '../models/ProductModel';
import SubProductModel from '../models/SubProductModel';

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

const getProductDetail = async (items: any[]) => {
	const promises = items.map(async (item) => {
		const product = await ProductModel.findById(item.productId);

		return {
			...item,
			product,
		};
	});

	return await Promise.all(promises);
};

const getTopSellingAndLowQuantity = async (req: Request, res: Response) => {
	try {
		const bills = await BillModel.find();

		const sellings = bills.map((bill) => bill.products).flat();
		const subProductsSellings: {
			_id: string;
			count: number;
			productId: string;
			qty?: number;
			total: number;
		}[] = [];

		if (sellings.length > 0) {
			sellings.forEach((product: any) => {
				const index = subProductsSellings.findIndex(
					(subProduct) => subProduct._id === product._id
				);

				const total = product.price * product.count;

				if (index === -1) {
					subProductsSellings.push({
						_id: product._id,
						count: product.count,
						qty: product.qty,
						productId: product.productId,
						total: total ?? 0,
					});
				} else {
					subProductsSellings[index].count += product.count;
					subProductsSellings[index].qty += product.qty;
					subProductsSellings[index].total += total;
				}
			});
		}

		const topSelling = subProductsSellings
			.sort((a, b) => b.count - a.count)
			.slice(0, 5);

		const products = await ProductModel.find().select('_id images title');

		const promises = products.map(async (product: any) => {
			const subProduct = await SubProductModel.find({
				productId: product._id,
			}).select('qty');

			const qty = subProduct.reduce((a, b) => a + b.qty, 0);

			return {
				...product._doc,
				qty,
			};
		});

		const productsWithQty = await Promise.all(promises);
		const lowQuantity = productsWithQty
			.sort((a, b) => a.qty - b.qty)
			.slice(0, 5);

		res.status(200).json({
			message: 'Get top selling and low quantity successfully',
			data: {
				topSelling: await getProductDetail(topSelling),
				lowQuantity,
			},
		});
	} catch (error: any) {
		res.status(404).send({ message: error.message });
	}
};

export { getOrderAndPurchase, getTopSellingAndLowQuantity };
