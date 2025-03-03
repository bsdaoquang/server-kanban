/** @format */

import { Request, Response } from 'express';
import OrderModel from '../models/OrderModel';
import BillModel from '../models/BillModel';
import ProductModel from '../models/ProductModel';
import SubProductModel from '../models/SubProductModel';
import moment from 'moment';
import CategoryModel from '../models/CategortModel';
const now = moment().format('YYYY-MM-DD');

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

const getBillsAndOrders = async (dates?: { start: Date; end: Date }) => {
	const filter = dates
		? {
				createdAt: {
					$gte: dates.start,
					$lt: dates.end,
				},
		  }
		: {};

	try {
		const bills = await BillModel.find(filter);
		const orders = await OrderModel.find(filter);

		return { bills, orders };
	} catch (error) {
		console.log(error);
		return { bills: [], orders: [] };
	}
};

const getTotalProfit = async (req: Request, res: Response) => {
	const datas = await getBillsAndOrders();

	const { bills, orders } = datas;

	const revenue =
		bills.reduce((a, b) => a + b.total, 0) -
		orders.reduce((a, b) => a + b.total, 0);

	const startMonth = moment().startOf('month').toDate();
	const endMonth = moment().endOf('month').toDate();
	const startYear = moment().startOf('year').toDate();
	const endYear = moment().endOf('year').toDate();

	const datasOfMonth = await getBillsAndOrders({
		start: startMonth,
		end: endMonth,
	});
	const datasOfYear = await getBillsAndOrders({
		start: startYear,
		end: endYear,
	});

	try {
		res.status(200).json({
			message: 'Get total profit successfully',
			data: {
				profitMonth:
					datasOfMonth.bills.reduce((a, b) => a + b.total, 0) -
					datasOfMonth.orders.reduce((a, b) => a + b.total, 0),
				profitYear:
					datasOfYear.bills.reduce((a, b) => a + b.total, 0) -
					datasOfYear.orders.reduce((a, b) => a + b.total, 0),
				bills,
				orders,
				revenue,
			},
		});
	} catch (error: any) {
		res.status(404).send({ message: error.message });
	}
};

const getTopCategories = async (req: Request, res: Response) => {
	/*
		{
	_id: ...
	product: ...
	count: 123
	}
		*/
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

		const products: {
			_id: string;
			count: number;
			qty: number;
			total: number;
		}[] = [];

		subProductsSellings.forEach((subProduct) => {
			const index = products.findIndex(
				(product) => product._id === subProduct.productId
			);

			if (index !== -1) {
				products[index].count += subProduct.count;
				products[index].qty += subProduct.qty ? subProduct.qty : 0;
				products[index].total += subProduct.total;
			} else {
				products.push({
					_id: subProduct.productId,
					count: subProduct.count,
					qty: subProduct.qty ?? 0,
					total: subProduct.total,
				});
			}
		});

		const categories = await CategoryModel.find();

		const countOfCategories = categories.map(async (category: any) => {
			const productsOfCategory = await ProductModel.find({
				categories: { $all: category._id },
			}).select('_id');

			const vals =
				productsOfCategory.length > 0
					? productsOfCategory.map((product: any) => {
							const item = products.find(
								(element) => element._id === product._id
							);

							return item
								? {
										count: item.count,
										total: item.total,
								  }
								: {
										count: 0,
										total: 0,
								  };
					  })
					: [];

			// console.log(products);
			return {
				...category._doc,
				count: vals.reduce((a, b) => a + b.count, 0),
				total: vals.reduce((a, b) => a + b.total, 0),
			};
		});

		const topCategories = await Promise.all(countOfCategories);

		res.status(200).json({
			message: 'Get top categories successfully',
			data: topCategories.sort((a, b) => b.count - a.count).slice(0, 4),
		});
	} catch (error: any) {
		console.log(error);
		res.status(404).send({ message: error.message });
	}
};

export {
	getOrderAndPurchase,
	getTopSellingAndLowQuantity,
	getTotalProfit,
	getTopCategories,
};
