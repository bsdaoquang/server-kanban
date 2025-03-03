/** @format */

import mongoose, { Schema } from 'mongoose';

const scheme = new Schema(
	{
		url: String,
		email: String,
		method: String,
	},
	{
		timestamps: true,
	}
);

const LogModel = mongoose.model('Log', scheme);
export default LogModel;
