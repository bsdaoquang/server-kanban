/** @format */
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

dotenv.config();

export const getAccesstoken = async (payload: {
	_id: Types.ObjectId;
	email: string;
	rule?: number;
}) => {
	const token = jwt.sign(payload, process.env.SECRET_KEY as string, {
		// expiresIn: '10m',
	});
	return token;
};
