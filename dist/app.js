"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const WistonConfig_1 = __importDefault(require("./Utils/WistonConfig"));
const dotenv_1 = __importDefault(require("dotenv"));
const Main_1 = __importDefault(require("./routes/Main"));
const db_1 = require("./connect/db");
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
dotenv_1.default.config();
const PORT = process.env.PORT || 80;
const app = (0, express_1.default)();
const MONGO_URL = process.env.MONGOURL || '';
// Middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use('/api', Main_1.default);
// 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: 'Page Not Found' });
});
// Error Handler
app.use((err, req, res, next) => {
    const errStatus = err.status || 500;
    const errMessage = err.message || 'Internal Server Error';
    res.status(errStatus).json({
        success: false,
        status: errStatus,
        message: errMessage,
        stack: err.stack,
    });
});
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        WistonConfig_1.default.info(`Server running on port ${PORT}`);
    });
}
// Connect to MongoDB (Vercel will call this when the function is invoked)
(0, db_1.ConnectDb)(MONGO_URL).catch((error) => {
    WistonConfig_1.default.error('Failed to connect to MongoDB:', error);
});
// Export the app for Vercel
exports.default = app;
//# sourceMappingURL=app.js.map