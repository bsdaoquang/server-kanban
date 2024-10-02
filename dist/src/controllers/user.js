"use strict";
/** @format */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.loginWithGoogle = exports.login = exports.register = void 0;
const UserModel_1 = __importDefault(require("../models/UserModel"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const getAccesstoken_1 = require("../utils/getAccesstoken");
const generatorRadomText_1 = require("../utils/generatorRadomText");
dotenv_1.default.config();
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { email, name, password } = body;
    try {
        const user = yield UserModel_1.default.findOne({ email });
        if (user) {
            throw new Error(`Tài khoản đã tồn tại`);
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashpassword = yield bcrypt_1.default.hash(password, salt);
        body.password = hashpassword;
        const newUser = new UserModel_1.default(body);
        yield newUser.save();
        delete newUser._doc.password;
        res.status(200).json({
            message: 'Register',
            data: Object.assign(Object.assign({}, newUser._doc), { token: yield (0, getAccesstoken_1.getAccesstoken)({
                    _id: newUser._id,
                    email: newUser.email,
                    rule: 1,
                }) }),
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message,
        });
    }
});
exports.register = register;
const loginWithGoogle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const body = req.body;
    const { email, name } = body;
    try {
        const user = yield UserModel_1.default.findOne({ email });
        if (user) {
            yield UserModel_1.default.findByIdAndUpdate(user._id, body);
            const newUser = yield UserModel_1.default.findById(user._id);
            delete newUser._doc.password;
            res.status(200).json({
                message: 'Login successfuly!!!',
                data: Object.assign(Object.assign({}, newUser._doc), { token: yield (0, getAccesstoken_1.getAccesstoken)({
                        _id: newUser._id,
                        email: newUser.email,
                        rule: (_a = newUser.rule) !== null && _a !== void 0 ? _a : 1,
                    }) }),
            });
        }
        else {
            const salt = yield bcrypt_1.default.genSalt(10);
            const hashpassword = yield bcrypt_1.default.hash((0, generatorRadomText_1.generatorRandomText)(6), salt);
            body.password = hashpassword;
            const newUser = new UserModel_1.default(body);
            yield newUser.save();
            delete newUser._doc.password;
            res.status(200).json({
                message: 'Register',
                data: Object.assign(Object.assign({}, newUser._doc), { token: yield (0, getAccesstoken_1.getAccesstoken)({
                        _id: newUser._id,
                        email: newUser.email,
                        rule: 1,
                    }) }),
            });
        }
    }
    catch (error) {
        res.status(404).json({
            message: error.message,
        });
    }
});
exports.loginWithGoogle = loginWithGoogle;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const body = req.body;
    const { email, password } = body;
    try {
        const user = yield UserModel_1.default.findOne({ email });
        if (!user) {
            throw new Error(`Tài khoản không tồn tại`);
        }
        const isMatchPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatchPassword) {
            throw new Error('Đăng nhập thất bại, vui lòng kiểm tra lại Email/Password và thử lại');
        }
        delete user._doc.password;
        res.status(200).json({
            message: 'Login successfuly!!!',
            data: Object.assign(Object.assign({}, user._doc), { token: yield (0, getAccesstoken_1.getAccesstoken)({
                    _id: user._id,
                    email: user.email,
                    rule: (_a = user.rule) !== null && _a !== void 0 ? _a : 1,
                }) }),
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message,
        });
    }
});
exports.login = login;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    try {
        const user = yield UserModel_1.default.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        const token = yield (0, getAccesstoken_1.getAccesstoken)({
            _id: id,
            email: user.email,
            rule: user.rule,
        });
        res.status(200).json({
            message: 'fafa',
            data: token,
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message,
        });
    }
});
exports.refreshToken = refreshToken;
//# sourceMappingURL=user.js.map