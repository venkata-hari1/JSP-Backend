"use strict";
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
exports.getImages = exports.deleteImage = exports.uploadImage = void 0;
const cloudinary = require('cloudinary').v2;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: 'Image file is required' });
        }
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (!allowedTypes.includes(file.mimetype)) {
            return res.status(400).json({ error: 'Only JPG, PNG, JPEG, and WEBP images are allowed' });
        }
        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
            return res.status(400).json({ error: 'Image must not exceed 2MB' });
        }
        const stream = cloudinary.uploader.upload_stream({ folder: 'my_uploads' }, (error, result) => __awaiter(void 0, void 0, void 0, function* () {
            if (error)
                return res.status(500).json({ error });
            res.status(200).json({
                url: result.secure_url,
                public_id: result.public_id,
            });
        }));
        stream.end(req.file.buffer);
    }
    catch (err) {
        next(err);
    }
});
exports.uploadImage = uploadImage;
const deleteImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const public_id = `my_uploads/${req.params.public_id}`;
        const cloudinaryResult = yield cloudinary.uploader.destroy(public_id);
        if (cloudinaryResult.result !== 'ok') {
            res.status(500).json({ error: 'Cloudinary deletion failed' });
        }
        res.status(200).json({ status: true, message: 'Deleted successfully' });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteImage = deleteImage;
const getImages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield cloudinary.api.resources({
            type: 'upload',
            prefix: 'my_uploads/',
            max_results: 100,
        });
        res.status(200).json({ status: true, result: result.resources });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch images from Cloudinary' });
    }
});
exports.getImages = getImages;
//# sourceMappingURL=Images.js.map