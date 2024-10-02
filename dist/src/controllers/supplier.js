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
exports.getExportData = exports.getForm = exports.removeSupplier = exports.update = exports.getSuppliers = exports.addNew = void 0;
const supplier_1 = require("../forms/supplier");
const SupplierModel_1 = __importDefault(require("../models/SupplierModel"));
const getSuppliers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pageSize, page } = req.query;
    try {
        const skip = (page - 1) * pageSize;
        const items = yield SupplierModel_1.default.find({ isDeleted: false })
            .skip(skip)
            .limit(pageSize);
        const total = yield SupplierModel_1.default.countDocuments();
        res.status(200).json({
            message: 'Products',
            data: {
                total,
                items,
            },
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message,
        });
    }
});
exports.getSuppliers = getSuppliers;
const getExportData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { start, end } = req.query;
    const filter = {};
    if (start && end) {
        filter.createdAt = {
            $lte: end,
            $gte: start,
        };
    }
    try {
        const items = yield SupplierModel_1.default.find(filter);
        const data = [];
        if (items.length > 0) {
            items.forEach((item) => {
                const value = {};
                body.forEach((key) => {
                    var _a;
                    value[`${key}`] = `${(_a = item._doc[`${key}`]) !== null && _a !== void 0 ? _a : ''}`;
                });
                data.push(value);
            });
        }
        res.status(200).json({
            message: 'Products',
            data: data,
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message,
        });
    }
});
exports.getExportData = getExportData;
const addNew = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const newSupplier = new SupplierModel_1.default(body);
        newSupplier.save();
        res.status(200).json({
            message: 'Add new supplier successfully!!!',
            data: newSupplier,
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message,
        });
    }
});
exports.addNew = addNew;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { id } = req.query;
    try {
        yield SupplierModel_1.default.findByIdAndUpdate(id, body);
        res.status(200).json({
            message: 'Supplier updated',
            data: [],
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message,
        });
    }
});
exports.update = update;
const removeSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    try {
        yield SupplierModel_1.default.findByIdAndDelete(id);
        res.status(200).json({
            message: 'Supplier removed',
            data: [],
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message,
        });
    }
});
exports.removeSupplier = removeSupplier;
const getForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const form = {
            title: 'Supplier',
            layout: 'horizontal',
            labelCol: 6,
            wrapperCol: 18,
            formItems: supplier_1.supplierForm,
        };
        res.status(200).json({
            message: '',
            data: form,
        });
    }
    catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
});
exports.getForm = getForm;
//# sourceMappingURL=supplier.js.map