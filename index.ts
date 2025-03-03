/** @format */

import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import userRouter from './src/routers/user';
import storageRouter from './src/routers/storage';
import productRouter from './src/routers/productRouter';
import supplierRouter from './src/routers/supplier';
import customerRouter from './src/routers/customerRouter';
import promotionRouter from './src/routers/promotionRouter';
import nettruyenRouter from './src/routers/nettruyenRouter';
import rewiewRouter from './src/routers/reviewRouter';
import cartRouter from './src/routers/cartRouter';
import paymentRouter from './src/routers/paymentRouters';
import notificationsRouter from './src/routers/notificationsRouter';
import orderRouter from './src/routers/orderRouter';
import adminRouter from './src/routers/adminRouter';

import cors from 'cors';
import { verifyToken } from './src/middlewares/verifyToken';
import { logMiddleware } from './src/middlewares/logMiddleware';
import LogModel from './src/models/LogModel';
dotenv.config();

const PORT = process.env.PORT || 3001;
const dbURL = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.rervmah.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const app = express();

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
});
app.use(logMiddleware);

app.use('/auth', userRouter);
app.use('/customers', customerRouter);
app.use('/products', productRouter);
app.use('/promotions', promotionRouter);
app.use('/reviews', rewiewRouter);

app.use(verifyToken);
app.use('/storage', storageRouter);
app.use('/supplier', supplierRouter);
app.use('/carts', cartRouter);
app.use('/payments', paymentRouter);
app.use('/notifications', notificationsRouter);
app.use('/orders', orderRouter);
app.use('/admin', adminRouter);

app.get('/logs', async (req, res) => {
	const { page, limit } = req.query;
	const pageNumber = parseInt(page as string) || 1;
	const limitNumber = parseInt(limit as string) || 20;

	try {
		const items = await LogModel.find()
			.sort({ createdAt: -1 })
			.skip((pageNumber - 1) * limitNumber)
			.limit(limitNumber);

		res.status(200).json({
			message: 'Logs',
			data: {
				items,
				total: await LogModel.countDocuments(),
			},
		});
	} catch (error) {
		res.status(404).json({ message: 'Error' });
	}
});

const connectDB = async () => {
	try {
		await mongoose.connect(dbURL);
		console.log(`Connect to db successfully!!!`);
	} catch (error) {
		console.log(`Can not connect to db ${error}`);
	}
};

connectDB()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Server is stating at http://localhost:${PORT}`);
		});
	})
	.catch((error) => {
		console.log(error);
	});
