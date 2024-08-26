/** @format */
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { ObjectId, Types } from 'mongoose';

dotenv.config();

export const getAccesstoken = async (payload: {
	_id: Types.ObjectId;
	email: string;
	rule: number;
}) => {
	const token = jwt.sign(payload, process.env.SECRET_KEY as string);

	return token;
};
