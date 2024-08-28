/** @format */

export const generatorRandomText = (num: number) => {
	const characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let text = '';

	for (let index = 0; index < characters.length; index++) {
		if (text.length <= (num ? num : 10)) {
			const str = characters[Math.floor(Math.random() * characters.length)];
			text += str;
		}
	}

	return text.toLocaleUpperCase();
};
