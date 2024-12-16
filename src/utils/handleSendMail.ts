/** @format */

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 587,
	secure: false, // true for port 465, false for other ports
	auth: {
		user: process.env.USERNAME_EMAIL,
		pass: process.env.PASSWORD_EMAIL,
	},
});

export const handleSendMail = async (data: {
	from?: string;
	to: string;
	subject: string;
	text?: string;
	html: string;
}) => {
	try {
		const res = await transporter.sendMail({
			...data,
			from: data.from ?? 'bsdaoquang@gmail.com',
			text: 'text',
		});

		return res;
	} catch (error: any) {
		throw new Error(error.message);
	}
};
