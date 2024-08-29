/** @format */

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

export { getProducts };
