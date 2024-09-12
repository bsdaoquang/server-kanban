/** @format */

import CategoryModel from '../models/CategortModel';
import ProductModel from '../models/ProductModel';
import SupplierModel from '../models/SupplierModel';

const getProducts = async (req: any, res: any) => {
	try {
		res.status(200).json({
			message: 'Products',
			data: [],
		});
	} catch (error: any) {
		res.status(404).json({
			message: error.message,
		});
	}
};
const addCategory = async (req: any, res: any) => {
	const body = req.body;
	const { parentId, title, description, slug } = body;

	try {
		const category = await CategoryModel.find({
			$and: [{ parentId: { $eq: parentId } }, { slug: { $eq: slug } }],
		});

		if (category.length > 0) {
			throw Error('Category is existing!!!!');
		}

		const newCate = new CategoryModel(body);

		await newCate.save();

		res.status(200).json({
			message: 'Products',
			data: [],
		});
	} catch (error: any) {
		res.status(404).json({
			message: error.message,
		});
	}
};
const getCategories = async (req: any, res: any) => {
	const { page, pageSize } = req.query;

	try {
		const skip = (page - 1) * pageSize;

		const categories = await CategoryModel.find({
			$or: [{ isDeleted: false }, { isDeleted: null }],
		})
			.skip(skip)
			.limit(pageSize);

		res.status(200).json({
			message: 'Products',
			data: categories,
		});
	} catch (error: any) {
		res.status(404).json({
			message: error.message,
		});
	}
};

const deleteCategories = async (req: any, res: any) => {
	const { id, isDeleted } = req.query;

	// isDeleted=== true thì xoá hẳn : cập nhật lại isDeleted
	// console.log(id);
	try {
		// await CategoryModel.findByIdAndDelete(id);
		const products = await ProductModel.find({ categories: { $all: id } });

		if (products && products.length > 0) {
			products.forEach(async (item: any) => {
				const cats = item._doc.categories;

				const index = cats.findIndex((element: string) => element === id);

				if (index !== -1) {
					cats.splice(index, 1);
				}

				await ProductModel.findByIdAndUpdate(item._id, {
					categories: cats,
				});
			});
		}
		// console.log(id);

		// tìm tất cả những sản phẩm mà categories có chứa id
		// xoá id khỏi danh sách categories
		//

		if (isDeleted) {
			await CategoryModel.findByIdAndDelete(id);
		} else {
			await CategoryModel.findByIdAndUpdate(id, {
				isDeleted: false,
			});
		}
		await res.status(200).json({
			message: 'Category deleted!!!',
		});
	} catch (error: any) {
		res.status(404).json({
			message: error.message,
		});
	}
};
const updateCategory = async (req: any, res: any) => {
	// const { id, isDeleted } = req.query;
	// // isDeleted=== true thì xoá hẳn : cập nhật lại isDeleted
	// try {
	// 	// await CategoryModel.findByIdAndDelete(id);
	// 	// console.log(id);
	// 	// tìm tất cả những sản phẩm mà categories có chứa id
	// 	// xoá id khỏi danh sách categories
	// 	//
	// 	res.status(200).json({
	// 		message: 'Category deleted!!!',
	// 	});
	// } catch (error: any) {
	// 	res.status(404).json({
	// 		message: error.message,
	// 	});
	// }
};

export { getProducts, addCategory, getCategories, deleteCategories };
