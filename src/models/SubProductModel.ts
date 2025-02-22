/** @format */

import mongoose, { Schema } from 'mongoose';

const scheme = new Schema(
	{
		size: String,
		color: String,
		price: {
			type: Number,
			required: true,
		},
		qty: {
			type: Number,
			default: 0,
			required: true,
		},
		discount: {
			type: Number,
		},
		cost: {
			type: Number,
			default: 0,
		},
		productId: {
			type: String,
			required: true,
		},
		images: [String],
		isDeleted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

const billProduct = new Schema(
	{
		size: String,
		color: String,
		price: {
			type: Number,
			required: true,
		},
		qty: {
			type: Number,
			default: 0,
			required: true,
		},
		billId: {
			type: String,
			required: true,
		},
		discount: {
			type: Number,
		},
		productId: {
			type: String,
			required: true,
		},
		images: [String],
		isDeleted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

const SubProductModel = mongoose.model('subproducts', scheme);
const BillProductModel = mongoose.model('billProducts', billProduct);

export { BillProductModel };

export default SubProductModel;
