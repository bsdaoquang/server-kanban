/** @format */

import mongoose, { Schema } from 'mongoose';

const supplierScheme = new Schema({
	name: {
		type: String,
		required: true,
	},
	slug: String,
	product: String,
	categories: {
		type: [String],
	},
	price: Number,
	contact: String,
	isTaking: {
		type: Number,
		default: 0,
		enum: [0, 1],
	},
	photoUrl: String,
	createdAt: {
		type: Date,
		default: Date.now(),
	},
	updatedAt: {
		type: Date,
		default: Date.now(),
	},
});

const SupplierModel = mongoose.model('suppliers', supplierScheme);
export default SupplierModel;
