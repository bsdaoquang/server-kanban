"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatorRandomText = void 0;
const generatorRandomText = (num) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';
    for (let index = 0; index < characters.length; index++) {
        if (text.length <= (num ? num : 10)) {
            const str = characters[Math.floor(Math.random() * characters.length)];
            text += str;
        }
    }
    return text.toLocaleUpperCase();
};
exports.generatorRandomText = generatorRandomText;
//# sourceMappingURL=generatorRadomText.js.map