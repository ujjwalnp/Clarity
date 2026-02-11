const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database connected successfully');

    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

module.exports = {
    connectDB,
};