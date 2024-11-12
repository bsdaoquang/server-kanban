/** @format */

import mongoose, { Schema } from 'mongoose';

const scheme = new Schema({
	firstName: String,
	lastName: String,
	email: {
		required: true,
		type: String,
	},
	password: {
		required: true,
		type: String,
	},
	isDeleted: {
		type: Boolean,
		default: true,
	},
	isVerify: {
		type: Boolean,
		default: false,
	},
	verifyCode: String,
	createdAt: {
		type: Date,
		default: Date.now,
	},
	photoURL: String,
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

const CustomerModel = mongoose.model('customers', scheme);

export default CustomerModel;
