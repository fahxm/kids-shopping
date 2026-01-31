const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');   
const dotenv = require('dotenv');
dotenv.config();

const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/api/users', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
// database connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected: ' + mongoose.connection.host))
    .catch(err => console.error('MongoDB Connection Error:', err));

// test route
app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
