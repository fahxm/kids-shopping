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

module.exports = router;
