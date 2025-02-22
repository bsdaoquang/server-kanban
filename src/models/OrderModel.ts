/** @format */

import mongoose from 'mongoose';

export interface IOrder {
	createdAt: string;
	updatedAt: string;
	user_id: string;
	items: IProductItem[];
	total: number;
}

export interface IProductItem {
	product_id: string;
	total: number;
	price: number;
	quantity: number;
	subProduct_id: string;
	cost: number;
	status: string;
}

const scheme = new mongoose.Schema<IOrder>(
	{
		user_id: { type: String, required: true, ref: 'User' },
		items: [
			{
				product_id: { type: String, required: true, ref: 'Product' },
				total: { type: Number, required: true },
				price: { type: Number, required: true },
				quantity: { type: Number, required: true },
				subProduct_id: { type: String, required: true, ref: 'SubProduct' },
				cost: { type: Number, required: true },
				status: { type: String, required: true },
			},
		],
		total: { type: Number, default: 0 },
	},
	{ timestamps: true }
);

const OrderModel = mongoose.model<IOrder>('Order', scheme);
export default OrderModel;
