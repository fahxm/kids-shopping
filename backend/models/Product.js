const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    category: {
        type: String,
        required: true
    },
    ageRange: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        default: 'Unisex'
    },
    imageUrl: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 10
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
