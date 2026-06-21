const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware');

//inventory management 

router.get('/', async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message, stack: error.stack });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message, stack: error.stack });
    }
});

// Delete Product (Admin Only)
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Product (Admin Only)
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const { title, price, description, category, imageUrl, ageRange, stock, additionalImages } = req.body;
        const product = await Product.findById(req.params.id);

        if (product) {
            product.title = title || product.title;
            product.price = price || product.price;
            product.description = description || product.description;
            product.category = category || product.category;
            product.imageUrl = imageUrl || product.imageUrl;
            product.ageRange = ageRange || product.ageRange;
            product.stock = stock || product.stock;
            if (additionalImages !== undefined) {
                product.additionalImages = additionalImages;
            }

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Create a product
router.post('/', async (req, res) => {
    try {
        const { title, price, description, category, imageUrl, ageRange, additionalImages } = req.body;

        const product = new Product({
            title,
            price,
            description,
            category,
            imageUrl: imageUrl || 'https://via.placeholder.com/400',
            ageRange: ageRange || 'All',
            stock: 10,
            additionalImages: additionalImages || [],
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: error.message, stack: error.stack });
    }
});

// Create new review
router.post('/:id/reviews', protect, async (req, res) => {
    try {
        const { rating, comment, name } = req.body;
        const product = await Product.findById(req.params.id);

        if (product) {
            const alreadyReviewed = product.reviews.find(
                (r) => r.user.toString() === req.user._id.toString()
            );

            if (alreadyReviewed) {
                return res.status(400).json({ message: 'Product already reviewed' });
            }

            const review = {
                name: name || req.user.name,
                rating: Number(rating),
                comment,
                user: req.user._id,
            };

            product.reviews.push(review);
            product.numReviews = product.reviews.length;
            product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

            await product.save();
            res.status(201).json({ message: 'Review added' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Ask a question
router.post('/:id/questions', protect, async (req, res) => {
    try {
        const { question, name } = req.body;
        const product = await Product.findById(req.params.id);

        if (product) {
            const newQuestion = {
                name: name || req.user.name,
                question,
                user: req.user._id,
            };

            product.questions.push(newQuestion);
            await product.save();
            res.status(201).json({ message: 'Question asked' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Answer a question (Admin only)
router.put('/:id/questions/:questionId/answer', protect, admin, async (req, res) => {
    try {
        const { answer } = req.body;
        const product = await Product.findById(req.params.id);

        if (product) {
            const question = product.questions.id(req.params.questionId);
            if (question) {
                question.answer = answer;
                await product.save();
                res.json({ message: 'Question answered' });
            } else {
                res.status(404).json({ message: 'Question not found' });
            }
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
