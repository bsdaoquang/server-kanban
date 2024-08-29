/** @format */

import jwt from 'jsonwebtoken';

export const verifyToken = (req: any, res: any, next: any) => {
	const headers = req.headers.authorization;
	const accesstoken = headers ? headers.split(' ')[1] : '';

	try {
		if (!accesstoken) {
			throw new Error('Không có quyền');
		}

		const verfy: any = jwt.verify(
			accesstoken,
			process.env.SECRET_KEY as string
		);

		if (!verfy) {
			throw new Error('Invalid token');
		}
		req._id = verfy._id;

		next();
	} catch (error: any) {
		res.status(401).json({ error: error.message });
	}
};
