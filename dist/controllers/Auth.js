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
exports.getUser = exports.EditUser = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AuthSchema_1 = __importDefault(require("../model/AuthSchema"));
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
const indianPhoneRegex = /^[6-9]\d{9}$/;
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { admin, email, password } = req.body;
        // Check required fields
        if (!admin || !email || !password) {
            yield session.abortTransaction();
            session.endSession();
            return res
                .status(422)
                .json({ status: false, message: 'All fields are required' });
        }
        const exist = yield AuthSchema_1.default.findOne().session(session);
        if (exist) {
            yield session.abortTransaction();
            session.endSession();
            return res.status(409).json({ status: false, message: 'Admin already exists' });
        }
        // Validate email
        if (!emailRegex.test(email)) {
            yield session.abortTransaction();
            session.endSession();
            return res.status(422).json({ status: false, message: 'Invalid email format' });
        }
        // Validate password
        if (!passwordRegex.test(password)) {
            yield session.abortTransaction();
            session.endSession();
            return res.status(422).json({ status: false, message: 'Password must be at least 8 characters long and include at least one letter and one number', });
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hash = yield bcryptjs_1.default.hash(password, salt);
        const user = new AuthSchema_1.default({ admin, email, password: hash });
        yield user.save({ session });
        yield session.commitTransaction();
        session.endSession();
        return res.status(200).json({ status: true, message: 'Admin registered successfully' });
    }
    catch (err) {
        yield session.abortTransaction();
        session.endSession();
        next(err);
    }
});
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(422).json({ status: false, message: 'All fields are required' });
        }
        const exist = yield AuthSchema_1.default.findOne({ email });
        if (!exist) {
            return res.status(404).json({ status: false, message: 'User not found' });
        }
        const isMatch = yield bcryptjs_1.default.compare(password, exist.password);
        if (!isMatch) {
            return res.status(422).json({ status: false, message: 'Invalid password' });
        }
        let payload = {
            user: {
                id: exist._id
            }
        };
        AuthSchema_1.default.findByIdAndUpdate({ _id: exist._id }, { $set: { isAdmin: true } }, { new: true });
        jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: '10d' }, (err, token) => {
            if (err) {
                return res.status(401).json({ status: false, message: 'Token generation falied' });
            }
            return res.status(200).json({ status: true, message: 'Login successfully', token });
        });
    }
    catch (err) {
        next(err);
    }
});
exports.login = login;
const EditUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { email, password, admin, mobile } = req.body;
        if (email && !emailRegex.test(email)) {
            yield session.abortTransaction();
            session.endSession();
            return res.status(422).json({ status: false, message: 'Invalid email format' });
        }
        if (password && !passwordRegex.test(password)) {
            yield session.abortTransaction();
            session.endSession();
            return res.status(422).json({
                status: false,
                message: 'Password must be at least 8 characters long and include at least one letter and one number',
            });
        }
        if (mobile && !indianPhoneRegex.test(mobile)) {
            yield session.abortTransaction();
            session.endSession();
            return res.status(422).json({
                status: false,
                message: 'Invalid Indian mobile number. It must be 10 digits starting with 6-9.',
            });
        }
        const user = yield AuthSchema_1.default.findById(req.user.id).select('admin email').session(session);
        if (!user) {
            yield session.abortTransaction();
            session.endSession();
            return res.status(404).json({ status: false, message: 'User not found' });
        }
        if (email)
            user.email = email;
        if (admin)
            user.admin = admin;
        if (password) {
            const salt = yield bcryptjs_1.default.genSalt(10);
            user.password = yield bcryptjs_1.default.hash(password, salt);
        }
        if (mobile)
            user.mobile = mobile;
        yield user.save({ session });
        yield session.commitTransaction();
        session.endSession();
        return res.status(200).json({ status: true, message: 'User updated successfully', user });
    }
    catch (err) {
        yield session.abortTransaction();
        session.endSession();
        next(err);
    }
});
exports.EditUser = EditUser;
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield AuthSchema_1.default.findById(req.user.id).select('admin email password mobile');
        res.status(200).json({ status: true, data });
    }
    catch (err) {
        next(err);
    }
});
exports.getUser = getUser;
//# sourceMappingURL=Auth.js.map