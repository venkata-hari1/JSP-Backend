import mongoose from 'mongoose';
import logger from '../Utils/WistonConfig';

export const ConnectDb = async (url: string) => {
    try {
        if (typeof url !== 'string' || !url) {
            throw new Error('Invalid MongoDB URL');
        }
        await mongoose.connect(url);
 
        logger.info('Connected to MongoDB');
    } catch (error) {
        logger.error('MongoDB connection error:', error);
        throw error;
    }
};
mongoose.connection.on('reconnected', () => {
    logger.info('MongoDB reconnected');
});
mongoose.connection.on('error', (error) => {
    logger.error('MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
});
