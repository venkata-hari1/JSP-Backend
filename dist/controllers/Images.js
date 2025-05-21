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
exports.deleteProfile = exports.ProfileImage = exports.UploadPrfoile = exports.getImages = exports.deleteImage = exports.uploadImage = void 0;
const cloudinary = require('cloudinary').v2;
const dotenv_1 = __importDefault(require("dotenv"));
const ProfileImage_1 = __importDefault(require("../model/ProfileImage"));
const Images_1 = __importDefault(require("../model/Images"));
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
            return res.status(422).json({ status: false, message: 'Image file is required' });
        }
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (!allowedTypes.includes(file.mimetype)) {
            return res.status(422).json({ status: false, message: 'Only JPG, PNG, JPEG, and WEBP images are allowed' });
        }
        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
            return res.status(422).json({ status: false, message: 'Image must not exceed 2MB' });
        }
        const stream = cloudinary.uploader.upload_stream({ folder: 'my_uploads' }, (error, result) => __awaiter(void 0, void 0, void 0, function* () {
            if (error)
                return res.status(500).json({ error });
            yield Images_1.default.create({ user: req.user.id, url: result.secure_url, public_id: result.public_id });
            res.status(200).json({
                status: true,
                message: 'Image uploaded successfully',
                url: result.secure_url,
                public_id: result.public_id,
            });
            return;
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
        const { id } = req.params;
        const image = yield Images_1.default.findById(id);
        if (!image) {
            res.status(404).json({ status: false, message: 'Image not found' });
            return;
        }
        // Delete from Cloudinary
        yield Promise.all([
            image.deleteOne(),
            cloudinary.uploader.destroy(image.public_id)
        ]);
        res.status(200).json({ status: true, message: 'Image deleted successfully' });
        return;
    }
    catch (err) {
        next(err);
    }
});
exports.deleteImage = deleteImage;
const getImages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Images_1.default.find();
        res.status(200).json({ status: true, result: result });
        return;
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch images from Cloudinary' });
        return;
    }
});
exports.getImages = getImages;
const UploadPrfoile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = req.file;
        if (!file) {
            return res.status(422).json({ status: false, message: 'Image file is required' });
        }
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (!allowedTypes.includes(file.mimetype)) {
            return res.status(422).json({ status: false, message: 'Only JPG, PNG, JPEG, and WEBP images are allowed' });
        }
        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
            return res.status(422).json({ status: false, message: 'Image must not exceed 2MB' });
        }
        const stream = cloudinary.uploader.upload_stream({ folder: 'my_uploads' }, (error, result) => __awaiter(void 0, void 0, void 0, function* () {
            if (error)
                return res.status(500).json({ error });
            yield ProfileImage_1.default.create({ user: req.user.id, url: result.secure_url, public_id: result.public_id });
            res.status(200).json({
                status: true,
                message: 'Image uploaded successfully',
                url: result.secure_url,
                public_id: result.public_id,
            });
            return;
        }));
        stream.end(req.file.buffer);
    }
    catch (err) {
        next(err);
    }
});
exports.UploadPrfoile = UploadPrfoile;
// Get single Image
const ProfileImage = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const images = yield ProfileImage_1.default.find().sort({ createdAt: -1 });
        res.status(200).json(images);
        return;
    }
    catch (err) {
        next(err);
    }
});
exports.ProfileImage = ProfileImage;
// Delete Image
const deleteProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const image = yield ProfileImage_1.default.findById(id);
        if (!image) {
            res.status(404).json({ status: false, message: 'Image not found' });
            return;
        }
        // Delete from Cloudinary
        yield Promise.all([
            image.deleteOne(),
            cloudinary.uploader.destroy(image.public_id)
        ]);
        res.status(200).json({ statua: true, message: 'Image deleted successfully' });
        return;
    }
    catch (err) {
        next(err);
    }
});
exports.deleteProfile = deleteProfile;
//# sourceMappingURL=Images.js.map