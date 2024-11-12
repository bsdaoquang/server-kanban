/** @format */

import mongoose, { Schema } from 'mongoose';

const scheme = new Schema(
	{
		comment: {
			type: String,
			required: true,
		},
		star: {
			type: Number,
			default: 0,
		},
		createdBy: {
			type: String,
			required: true,
		},
		parentId: {
			type: String,
			required: true,
		},
		images: [String],
		like: {
			type: [String],
			default: [],
		},
		dislike: {
			type: [String],
			default: [],
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

const ReviewModel = mongoose.model('reviews', scheme);

export default ReviewModel;
