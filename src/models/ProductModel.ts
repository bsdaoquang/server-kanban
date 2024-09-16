/** @format */

import mongoose, { Schema } from 'mongoose';

const scheme = new Schema({
	title: {
		type: String,
		required: true,
	},
	slug: String,
	description: String,
	categories: [String],
	supplier: {
		require: true,
		type: String,
	},
	expiryDate: {
		type: Date,
	},
	images: {
		type: [String],
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
	isDeleted: {
		type: Boolean,
		default: false,
	},
});

const ProductModel = mongoose.model('products', scheme);
export default ProductModel;

/*
	1 link web đã deploy
	link github của web đó
	link github của các bạn 

	zalo / messenger 

	dateline: Chủ nhật
*/
