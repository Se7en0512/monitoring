import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticate, authorize('admin'), async (req, res) => {
    try {
        const { page = 1, limit = 20, role } = req.query;
        
        let query = {};
        if (role) query.role = role;
        
        const skip = (page - 1) * limit;
        
        const users = await User.find(query)
            .skip(skip)
            .limit(parseInt(limit))
            .select('-password')
            .sort({ createdAt: -1 });
        
        const total = await User.countDocuments(query);
        
        res.json({
            success: true,
            data: users,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                currentPage: parseInt(page)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get user profile
router.get('/profile', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Delete user (admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;