const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            res.json(user.cart);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Update user cart
// @route   PUT /api/cart
// @access  Private
router.put('/', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            // Sanitize cart items to ensure ID presence
            const cartItems = req.body.map(item => ({
                id: item.id || item._id, // Ensure we have an ID
                title: item.title,
                price: item.price,
                imageUrl: item.imageUrl || item.image, // Handle both cases
                quantity: item.quantity
            })).filter(item => item.id && item.title); // Filter out invalid items

            user.cart = cartItems;
            await user.save();
            res.json(user.cart);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Cart Update Error:', error); // Log detailed error
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
