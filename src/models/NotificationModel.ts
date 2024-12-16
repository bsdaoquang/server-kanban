/** @format */

import mongoose, { Schema } from 'mongoose';

const scheme = new Schema(
	{
		title: String,
		body: String,
		id: String,
		url: String,
		isRead: { type: Boolean, default: false },
		fromId: { type: String, requred: true },
		toId: { type: String, requred: true },
		from: String,
		to: String,
	},
	{ timestamps: true }
);

const NotificationModel = mongoose.model('notifications', scheme);

export default NotificationModel;
