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
});

const CustomerModel = mongoose.model('customers', scheme);

export default CustomerModel;
