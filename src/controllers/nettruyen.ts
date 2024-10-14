/** @format */

import axios from 'axios';
const baseurl = 'https://nettruyenww.com';

const getChappters = async (req: any, res: any) => {
	const { api } = req.query;

	try {
		const results = await axios({
			url: baseurl + api,
			method: 'get',
		});

		res.status(200).json({
			message: 'Chapters',
			data: results.data,
		});
	} catch (error: any) {
		res.status(404).json({
			message: error.message,
		});
	}
};

const getChapDetail = async (req: any, res: any) => {
	const { chapId, chuong } = req.query;

	try {
		const items: [] = [];

		// for (let index = 0; index < 11; index++) {

		const result = await axios({
			url: `https://nettruyenww.com/truyen-tranh/vo-luyen-dinh-phong/chuong-1152/534296`,
			method: 'get',
		});

		const item = {};
		const pages = result.data.split('<div class="page-chapter">');
		for (let index = 1; index < pages.length; index++) {
			index < 12 && console.log(pages[index]);
		}

		res.status(200).json({
			message: '',
			data: result.data,
		});
	} catch (error: any) {
		// console.log(error);
		res.status(403).json({
			message: error.message,
		});
	}
};

export { getChappters, getChapDetail };
