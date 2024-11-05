/** @format */

import mongoose, { Schema } from 'mongoose';

const scheme = new Schema(
	{
		name: String,
		phoneNumber: String,
		address: {
			type: String,
			required: true,
		},
		createdBy: {
			type: String,
			required: true,
		},
		isDefault: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

const AddressModel = mongoose.model('address', scheme);
export default AddressModel;
