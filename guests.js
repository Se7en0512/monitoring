import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateGuestCheckIn } from '../middleware/validation.js';
import GuestLog from '../models/GuestLog.js';

const router = express.Router();

// Guest check-in
router.post('/check-in', validateGuestCheckIn, async (req, res) => {
    try {
        const { name, age, gender, phone, address, sector, organization, visitReason } = req.body;
        
        const guestLog = new GuestLog({
            name,
            age,
            gender,
            phone,
            address,
            sector,
            organization,
            visitReason,
            checkInTime: new Date()
        });
        
        await guestLog.save();
        
        res.status(201).json({
            success: true,
            message: 'Guest check-in successful',
            data: guestLog
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Guest check-out
router.post('/:id/check-out', async (req, res) => {
    try {
        const guestLog = await GuestLog.findById(req.params.id);
        
        if (!guestLog) {
            return res.status(404).json({
                success: false,
                message: 'Check-in record not found'
            });
        }
        
        if (guestLog.checkOutTime) {
            return res.status(400).json({
                success: false,
                message: 'Already checked out'
            });
        }
        
        guestLog.checkOutTime = new Date();
        await guestLog.save();
        
        res.json({
            success: true,
            message: 'Check-out successful',
            data: guestLog
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get guest logs
router.get('/logs', authenticate, authorize('admin', 'employee'), async (req, res) => {
    try {
        const { startDate, endDate, page = 1, limit = 20 } = req.query;
        
        let query = {};
        
        if (startDate || endDate) {
            query.checkInTime = {};
            if (startDate) query.checkInTime.$gte = new Date(startDate);
            if (endDate) query.checkInTime.$lte = new Date(endDate);
        }
        
        const skip = (page - 1) * limit;
        
        const logs = await GuestLog.find(query)
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ checkInTime: -1 });
        
        const total = await GuestLog.countDocuments(query);
        
        res.json({
            success: true,
            data: logs,
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

export default router;