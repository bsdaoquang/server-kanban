/** @format */

import mongoose, { Schema } from 'mongoose';

const scheme = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: String,
		code: {
			type: String,
			required: true,
		},
		value: {
			type: Number,
			required: true,
		},
		numOfAvailable: {
			type: Number,
			default: 100,
		},
		type: {
			type: String,
			default: 'discount',
		},
		startAt: {
			type: Date,
			required: true,
		},
		productIds: {
			type: [String],
		},
		endAt: Date,
		imageURL: String,
		isDeleted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

const PromotionModel = mongoose.model('promotions', scheme);

export default PromotionModel;
