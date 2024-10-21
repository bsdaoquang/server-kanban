/** @format */

import mongoose, { Schema } from 'mongoose';

const scheme = new Schema({
	createdBy: {
		type: String,
		required: true,
	},
	total: {
		type: Number,
		required: true,
	},
});

const BillModel = mongoose.model('bills', scheme);
export default BillModel;
