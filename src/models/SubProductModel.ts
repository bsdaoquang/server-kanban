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
export default SubProductModel;
