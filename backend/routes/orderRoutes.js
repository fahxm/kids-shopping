const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/authMiddleware');

//create new order
router.post('/', protect, async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            totalPrice
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            res.status(400).json({ message: 'No order items' });
            return;
        } else {
            const order = new Order({
                orderItems,
                user: req.user._id,
                shippingAddress,
                paymentMethod,
                totalPrice
            });

            const createdOrder = await order.save();
            res.status(201).json(createdOrder);
        }
    } catch (error) {
        console.error('Order Create Error:', error);
        res.status(500).json({ message: error.message || 'Server Error Creating Order' });
    }
});

//Get logged in user orders
router.get('/myorders', protect, async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
});

module.exports = router;
