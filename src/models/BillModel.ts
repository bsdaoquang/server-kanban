/** @format */

import mongoose, { Schema } from 'mongoose';
/*
			id,
			products,
			total,
			status: 0, 1, 2, 4
			customer_id,
			createdAt,
			shippingAddress,
			paymentStatus: 0, 1,2 
			paymentMethod: 'cod'
		*/

const scheme = new Schema(
	{
		products: [],
		total: {
			required: true,
			type: Number,
		},
		status: {
			type: Number,
			default: 0, // 0: pending, 1: shipping, 2: success, 3: cancel
			enum: [0, 1, 2, 3],
		},
		customer_id: {
			type: String,
			required: true,
		},
		shippingAddress: {
			type: {
				name: String,
				phoneNumber: String,
				address: String,
			},
		},
		paymentStatus: {
			type: Number,
			default: 0,
		},
		paymentMethod: {
			type: String,
			default: 'cod',
		},
	},
	{ timestamps: true }
);

const BillModel = mongoose.model('bills', scheme);
export default BillModel;
