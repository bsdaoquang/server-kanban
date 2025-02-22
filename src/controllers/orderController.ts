/** @format */
import { Request, Response } from 'express';
import OrderModel from '../models/OrderModel';
import ProductModel from '../models/ProductModel';
import SubProductModel from '../models/SubProductModel';

const addOrder = async (req: Request, res: Response) => {
	const body = req.body;
	try {
		const item = new OrderModel(body);
		await item.save();

		res.status(201).send({ message: 'Order created', data: item });
	} catch (error: any) {
		res.status(404).send({ message: error.message });
	}
};

const getOrders = async (req: Request, res: Response) => {
	const { page, limit, start, end } = req.query;

	const pageNumber = page ? parseInt(page as string) : 1;
	const limitNumber = limit ? parseInt(limit as string) : 20;

	const filter: any = {};

	if (start && end) {
		filter.createdAt = {
			$gte: new Date(start as string),
			$lte: new Date(end as string),
		};
	}

	try {
		const items = await OrderModel.find(filter)
			.limit(limitNumber)
			.skip((pageNumber - 1) * limitNumber)
			.sort({ createdAt: -1 });

		const vals: any = [];

		items.forEach((item: any) => {
			const datas = item._doc.items;

			datas.forEach((data: any) => {
				// if (cost && data.cost < parseInt(cost as string)) {
				// 	vals.push({
				// 		...data._doc,
				// 		createdAt: item._doc.createdAt,
				// 		user_id: item._doc.user_id,
				// 	});
				// }
				vals.push({
					...data._doc,
					createdAt: item._doc.createdAt,
					user_id: item._doc.user_id,
				});
			});
		});

		const promises = vals.map(async (item: any) => {
			const product: any = await ProductModel.findById(item.product_id);
			const subProduct: any = await SubProductModel.findById(
				item.subProduct_id
			);

			return {
				...item,
				product: product?._doc,
				subProduct: subProduct?._doc,
			};
		});

		const orders = await Promise.all(promises);

		res.status(200).json({
			message: 'Orders fetched',
			data: orders,
			total: await OrderModel.countDocuments({}),
		});
	} catch (error: any) {
		res.status(404).send({ message: error.message });
	}
};

export { addOrder, getOrders };
