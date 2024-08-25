/** @format */

const register = async (req: any, res: any) => {
	const body = req.body;
	try {
		console.log(body);

		res.status(200).json({
			message: 'Register',
			data: body,
		});
	} catch (error: any) {
		res.status(404).json({
			message: error.message,
		});
	}
};

export { register };
