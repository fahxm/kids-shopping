const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User' }
}, { timestamps: true });

const questionSchema = mongoose.Schema({
    name: { type: String, required: true },
    question: { type: String, required: true },
    answer: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User' }
}, { timestamps: true });

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
    },
    additionalImages: {
        type: [String],
        default: []
    },
    reviews: [reviewSchema],
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    questions: [questionSchema]
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
