const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/authMiddleware');

// Get all orders (Admin only)
router.get('/', protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders' });
    }
});

// Get specific user orders (Admin only)
router.get('/user/:userId', protect, admin, async (req, res) => {
    try {
        console.log('Fetching orders for user:', req.params.userId);
        const orders = await Order.find({ user: req.params.userId });
        console.log('Found orders:', orders.length);
        res.json(orders);
    } catch (error) {
        console.error('Error in /user/:userId:', error);
        res.status(500).json({ message: 'Error fetching user orders', error: error.message });
    }
});

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
