/** @format */
import { Response, Request } from 'express';
import BillModel from '../models/BillModel';
import CustomerModel from '../models/CustomModel';
import NotificationModel from '../models/NotificationModel';
import { handleSendMail } from '../utils/handleSendMail';
import SupplierModel from '../models/SupplierModel';
import ProductModel from '../models/ProductModel';
import OrderModel from '../models/OrderModel';
import SubProductModel from '../models/SubProductModel';

const addBill = async (req: any, res: any) => {
	const body = req.body;
	const uid = req.uid;

	try {
		body.customer_id = uid;
		const customer: any = await CustomerModel.findById(uid);
		const newBill = new BillModel(body);
		await newBill.save();

		// gửi email và notification cho admin
		// gửi api cho đơn vị giao hàng liên kết nếu có

		await handleSendMail({
			from: 'Me',
			to: 'bsdaoquang@gmail.com',
			html: `
				<h1>Đơn hàng mới đã được đặt</h1>
				<p>Mã đơn hàng: ${newBill._id}</p>
			`,
			subject: 'Đơn hàng mới',
		});

		const data = {
			title: 'new bill',
			body: 'Một đơn hàng mới đã được tạo',
			from: customer._doc.name,
			to: 'admin',
			fromId: uid,
			toId: 'admin',
			id: newBill._id,
			url: `httphttp://localhost:3000/orders?id=${newBill._id}`,
		};

		const notification = new NotificationModel(data);
		await notification.save();

		// push notificatio to mobile app with fcmtoken admin

		res.status(200).json({
			message: 'fafafa',
			data: newBill,
		});
	} catch (error: any) {
		res.status(400).json({
			message: error.message,
		});
	}
};

const getStatistics = async (_req: Request, res: Response) => {
	const filter = {
		isDeleted: false,
	};

	try {
		const sales = await BillModel.find({});
		const orders = await OrderModel.find({});
		const subProduct = await SubProductModel.find(filter);

		res.status(200).json({
			message: 'Success',
			data: {
				sales,
				suppliers: await SupplierModel.find(filter).countDocuments(),
				products: await ProductModel.find(filter).countDocuments(),
				orders: orders.length,
				totalOrder: orders.reduce((a, b) => a + b.total, 0),
				subProduct: subProduct.length,
				totalSubProduct: subProduct.reduce(
					(a, b) => a + b.price * (b.cost ?? 0),
					0
				),
			},
		});
	} catch (error: any) {
		res.status(400).json({
			message: error.message,
		});
	}
};

const updateBill = async (req: Request, res: Response) => {
	const { id } = req.query;
	const body = req.body;

	try {
		await BillModel.findByIdAndUpdate(id, body, { new: true });

		res.status(200).json({
			message: 'Success',
			data: [],
		});
	} catch (error: any) {
		res.status(400).json({
			message: error.message,
		});
	}
};

export { addBill, getStatistics, updateBill };
