import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import VisitorLog from '../models/VisitorLog.js';
import GuestLog from '../models/GuestLog.js';
import User from '../models/User.js';

const router = express.Router();

// Dashboard statistics
router.get('/stats', authenticate, authorize('admin', 'employee'), async (req, res) => {
    try {
        const today = new Date().setHours(0, 0, 0, 0);
        const month = new Date().toISOString().substring(0, 7);
        
        const totalVisitors = await VisitorLog.countDocuments();
        const todayCheckIns = await VisitorLog.countDocuments({
            checkInTime: { $gte: new Date(today) }
        });
        const monthCheckIns = await VisitorLog.countDocuments({
            checkInTime: { $gte: new Date(month + '-01') }
        });
        const totalUsers = await User.countDocuments({ role: 'visitor' });
        
        res.json({
            success: true,
            data: {
                totalVisitors,
                todayCheckIns,
                monthCheckIns,
                totalUsers
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Visitor analytics (last 7 days)
router.get('/analytics/daily', authenticate, authorize('admin', 'employee'), async (req, res) => {
    try {
        const data = {};
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            const count = await VisitorLog.countDocuments({
                checkInTime: {
                    $gte: new Date(dateStr),
                    $lt: new Date(new Date(dateStr).getTime() + 24 * 60 * 60 * 1000)
                }
            });
            
            data[dateStr] = count;
        }
        
        res.json({
            success: true,
            data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Repeat visitors
router.get('/repeat-visitors', authenticate, authorize('admin', 'employee'), async (req, res) => {
    try {
        const repeatVisitors = await VisitorLog.aggregate([
            {
                $group: {
                    _id: '$visitor',
                    visitCount: { $sum: 1 },
                    lastVisit: { $max: '$checkInTime' }
                }
            },
            {
                $match: {
                    visitCount: { $gte: 2 }
                }
            },
            {
                $sort: { visitCount: -1 }
            },
            {
                $limit: 10
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            }
        ]);
        
        res.json({
            success: true,
            data: repeatVisitors
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;