/** @format */

import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import LogModel from '../models/LogModel';

interface AuthPayload extends JwtPayload {
	email: string;
}

export const logMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const headers = req.headers;

	const authorization = headers.authorization;
	const tokens = authorization?.split('Bearer ')[1];
	const verifyToken: any = jwt.verify(
		tokens as string,
		process.env.SECRET_KEY as string
	);
	const email = verifyToken ? verifyToken.email : '';

	// ai, làm cái gì, lúc nào
	const data = {
		email,
		method: req.method,
		url: req.url,
	};

	try {
		if (!req.url.includes('/logs')) {
			await LogModel.create(data);
		}
		next();
	} catch (error: any) {
		throw new Error(error.message);
	}
};

const saveLog = async (data: {
	email: string;
	method: string;
	url: string;
}) => {
	try {
		await LogModel.create(data);
		return 'OK';
	} catch (error: any) {
		throw new Error(error.message);
	}
};
