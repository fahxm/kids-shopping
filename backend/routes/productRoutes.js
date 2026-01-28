const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

//inventory management 
//'/' accessall inventories
//  ':id' access a unique inventory
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

// @desc    Create a product
// @route   POST /api/products
// @access  Private (Admin) - Protected in frontend for now
router.post('/', async (req, res) => {
    try {
        const { title, price, description, category, imageUrl, ageRange } = req.body;

        const product = new Product({
            title,
            price,
            description,
            category,
            imageUrl: imageUrl || 'https://via.placeholder.com/400',
            ageRange: ageRange || 'All',
            stock: 10, // Default stock
            // user: req.user._id // We will add this when we have full auth
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: error.message, stack: error.stack });
    }
});

module.exports = router;
