/** @format */

import e, { Request, Response } from 'express';
import CategoryModel from '../models/CategortModel';
import ProductModel from '../models/ProductModel';
import SubProductModel, { BillProductModel } from '../models/SubProductModel';

interface SelectModel {
	label: string;
	value: string;
}

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
			data: newCate,
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

const getCategoryDetail = async (req: any, res: any) => {
	const { id } = req.query;

	try {
		const item = await CategoryModel.findById(id);

		res.status(200).json({
			message: 'Products',
			data: item,
		});
	} catch (error: any) {
		res.status(404).json({
			message: error.message,
		});
	}
};

const findAndRemoveCategoryInProducts = async (id: string) => {
	// const item = await CategoryModel.findById(id);
	const items = await CategoryModel.find({ parentId: id });

	if (items.length > 0) {
		items.forEach(
			async (item: any) => await findAndRemoveCategoryInProducts(item._id)
		);
	}

	await handleRemoveCategoryInProducts(id);
	// const cats = await CategoryModel.find({ parentId: id });
	// if (cats.length > 0) {
	// 	cats.forEach(async (item: any) => {
	// 		const values: any = await getCategoriesIds([], item._id);
	// 		if (values.length > 0) {
	// 			console.log(values);
	// 		} else {
	// 			data.push(item._id);
	// 		}
	// 	});
	// }
	// return data;
};

// @daoquang-livecode
// @bsdaoquang

const handleRemoveCategoryInProducts = async (id: string) => {
	await CategoryModel.findByIdAndDelete(id);
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
};

const deleteCategories = async (req: any, res: any) => {
	const { id, isDeleted } = req.query;

	try {
		await findAndRemoveCategoryInProducts(id);

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
	const { id } = req.query;
	const body = req.body;

	try {
		await CategoryModel.findByIdAndUpdate(id, body);

		const item = await CategoryModel.findById(id);

		res.status(200).json({
			message: 'Category deleted!!!',
			data: item,
		});
	} catch (error: any) {
		res.status(404).json({
			message: error.message,
		});
	}
};

// Products
const addProduct = async (req: any, res: any) => {
	const body = req.body;

	try {
		const newProduct = new ProductModel(body);

		await newProduct.save();

		res.status(200).json({
			message: 'Products',
			data: newProduct,
		});
	} catch (error: any) {
		res.status(404).json({
			message: error.message,
		});
	}
};

const getProducts = async (req: any, res: any) => {
	const { page, pageSize, title, catIds } = req.query;

	await checkDeletedProduct();

	const filter: any = {};

	filter.isDeleted = false;

	if (title) {
		filter.slug = { $regex: title };
	}

	if (catIds) {
		const categoriesIds = catIds.includes(',') ? catIds.split(',') : [catIds];
		filter.categories = { $in: categoriesIds };
	}

	try {
		const skip = (page - 1) * pageSize;

		const products = await ProductModel.find(filter).skip(skip).limit(pageSize);
		const count = await ProductModel.find(filter);

		const total = await ProductModel.find({
			isDeleted: false,
		});

		const pageCount = Math.ceil(count.length / pageSize);

		const promises = products.map(async (item: any) => {
			const children = await SubProductModel.find({
				productId: item._id,
				isDeleted: false,
			});

			const cats = item._doc.categories;
			const categories =
				cats.length > 0
					? cats.map(async (id: string) => {
							const cat = await CategoryModel.findById(id);

							return cat;
					  })
					: [];

			const dataCategories = await Promise.all(categories);
			return {
				...item._doc,
				categories: dataCategories,
				subItems: children ?? [],
			};
		});

		const items = await Promise.all(promises);
		res.status(200).json({
			message: 'Products',
			data: {
				items,
				totalItems: total.length,
				pageCount,
			},
		});
	} catch (error: any) {
		res.status(404).json({
			message: error.message,
		});
	}
};

const getMinMaxPrice = async (id: string) => {
	const subItems = await SubProductModel.find({ productId: id });

	const nums = subItems.map((item) => item.price);

	return [Math.min(...nums), Math.max(...nums)];
};

const getBestSellers = async (req: any, res: any) => {
	try {
		const products = await BillProductModel.find();

		if (products.length > 0) {
		} else {
			const items = await ProductModel.find().limit(8);
			const data: any = [];

			items.forEach(async (item: any) => {
				data.push({ ...item._doc, price: await getMinMaxPrice(item._id) });

				data.length === items.length && res.status(200).json({ data });
			});
		}
	} catch (error: any) {
		res.status(404).json({
			message: error.message,
		});
	}
};

const checkDeletedProduct = async () => {
	// console.log('Get and check deleted product about 30 days from now');
	/*

		const productDeleted = await ProductModel.find({
			isDeleted: true
		})
	

		productDeleted.forEach(product => {


		const users = await userModel.find({
			favouritest: {$all: product_id}
		})

		if(users.length === 0)
			remove product
		})
	*/
};

const getProductDetail = async (req: any, res: any) => {
	const { id } = req.query;
	try {
		const item = await ProductModel.findById(id);
		const subProducts = await SubProductModel.find({
			productId: id,
			isDeleted: false,
		});

		res.status(200).json({
			message: 'Products',
			data: {
				product: item,
				subProducts,
			},
		});
	} catch (error: any) {
		res.status(404).json({
			message: error.message,
		});
	}
};

const removeSubProduct = async (req: any, res: any) => {
	const { id, isSoftDelete } = req.query;

	try {
		if (isSoftDelete) {
			await SubProductModel.findByIdAndUpdate(id, {
				isDeleted: true,
			});
		} else {
			await SubProductModel.findByIdAndDelete(id);
		}

		res.status(200).json({
			message: 'Removed!!!',
		});
	} catch (error: any) {
		res.status(404).json({
			message: error.message,
		});
	}
};

const updateSubProduct = async (req: any, res: any) => {
	const { id } = req.query;
	const body = req.body;
	try {
		await SubProductModel.findByIdAndUpdate(id, body);

		res.status(200).json({
			message: 'Updated!!!',
		});
	} catch (error: any) {
		res.status(404).json({
			message: error.message,
		});
	}
};

const addSubProduct = async (req: any, res: any) => {
	const body = req.body;

	try {
		const subProduct = new SubProductModel(body);

		await subProduct.save();

		res.status(200).json({
			message: 'Add sub product successfully!!!',
			data: subProduct,
		});
	} catch (error: any) {
		res.status(404).json({
			message: error.message,
		});
	}
};

const getAllSubProducts = async (_req: Request, res: Response) => {
	try {
		res.status(200).json({
			message: 'Update all OK',
		});
	} catch (error: any) {
		res.status(404).json({
			error: error.message,
		});
	}
};

const handleRemoveSubProduct = async (items: any[]) => {
	items.forEach(async (item) => {
		await SubProductModel.findByIdAndUpdate(item._id, {
			isDeleted: true,
		});
	});
};

const removeProduct = async (req: any, res: any) => {
	const { id } = req.query;

	try {
		const subItems = await SubProductModel.find({ productId: id });

		if (subItems.length > 0) {
			await handleRemoveSubProduct(subItems);
		}

		await ProductModel.findByIdAndUpdate(id, {
			isDeleted: true,
		});

		res.status(200).json({
			message: 'Product removed!!',
		});
	} catch (error: any) {
		res.status(404).json({
			message: error.message,
		});
	}
};

const updateProduct = async (req: any, res: any) => {
	const { id } = req.query;
	const body = req.body;

	try {
		await ProductModel.findByIdAndUpdate(id, body);

		res.status(200).json({
			message: 'Product updated!!',
		});
	} catch (error: any) {
		res.status(404).json({
			message: error.message,
		});
	}
};

const getFilterValues = async (req: any, res: any) => {
	try {
		const datas = await SubProductModel.find();

		const colors: string[] = [];
		const sizes: SelectModel[] = [];
		const prices: number[] = [];

		if (datas.length > 0) {
			datas.forEach((item) => {
				item.color && !colors.includes(item.color) && colors.push(item.color);
				item.size && sizes.push({ label: item.size, value: item.size });
				prices.push(item.price);
			});
		}

		// console.log(datas);

		res.status(200).json({
			message: 'fafa',
			data: {
				colors,
				prices,
				sizes,
			},
		});
	} catch (error: any) {
		res.status(404).json({
			message: error.message,
		});
	}
};

const filterProducts = async (req: any, res: any) => {
	const body = req.body;

	const { colors, size, price, categories } = body;
	let filter: any = {};

	if (colors && colors.length > 0) {
		filter.color = { $all: colors };
	}

	if (size) {
		filter.size = { $eq: size };
	}

	if (price && price.length > 0) {
		filter['$and'] = [
			{
				price: { $lte: price[1] },
			},
			{
				price: {
					$gte: price[0],
				},
			},
		];
	}

	try {
		const subProducts = await SubProductModel.find(filter);

		if (categories) {
		} else {
		}

		const productIds: string[] = [];
		const products: any = [];
		if (subProducts.length > 0) {
			subProducts.forEach(
				(item) =>
					!productIds.includes(item.productId) &&
					productIds.push(item.productId)
			);

			productIds.forEach(async (id) => {
				const product: any = await ProductModel.findById(id);
				const children = subProducts.filter(
					(element) => element.productId === id
				);
				const items = { ...product._doc, subItems: children };

				products.push(items);

				if (products.length === productIds.length) {
					res.status(200).json({
						data: {
							items: products,
							totalItems: products.length,
						},
					});
				}
			});
		} else {
			res.status(200).json({ data: [] });
		}
	} catch (error: any) {
		res.status(404).json({
			message: error.message,
		});
	}
};
const getRelatedProducts = async (req: any, res: any) => {
	const { id } = req.query;
	try {
		const product = await ProductModel.findById(id);

		if (!product) {
			throw new Error('Product not found');
		}

		const categoryId =
			product.categories && product.categories.length > 0
				? product.categories[0]
				: undefined;

		if (!categoryId) {
			throw new Error('Categories not found!');
		}

		const items = await ProductModel.find({ categories: { $in: categoryId } });

		const datas = items.length > 4 ? items.splice(0, 4) : items;

		const products: any = [];

		datas.forEach(async (item: any) => {
			products.push({ ...item._doc, price: await getMinMaxPrice(item._id) });

			products.length === datas.length &&
				res.status(200).json({ data: products });
		});
		// res.status(200).json({ data: products });
	} catch (error: any) {
		res.status(404).json({
			message: error.message,
		});
	}
};

const getProductOptions = async (_req: any, res: any) => {
	try {
		const items = await ProductModel.find({
			isDeleted: false,
		});

		const data = items.map((item) => ({
			value: item._id,
			label: item.title,
		}));

		res.status(200).json({
			data,
			message: 'OK',
		});
	} catch (error: any) {
		res.status(404).json({
			message: error.message,
		});
	}
};

export {
	addCategory,
	deleteCategories,
	getCategories,
	getProducts,
	updateCategory,
	addProduct,
	getCategoryDetail,
	addSubProduct,
	removeProduct,
	getProductDetail,
	updateProduct,
	getFilterValues,
	filterProducts,
	removeSubProduct,
	updateSubProduct,
	getBestSellers,
	getRelatedProducts,
	getAllSubProducts,
	getProductOptions,
};
