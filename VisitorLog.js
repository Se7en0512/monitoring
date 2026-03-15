import mongoose from 'mongoose';

const visitorLogSchema = new mongoose.Schema({
    visitor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    visitorName: String,
    memberId: String,
    visitReason: {
        type: String,
        enum: ['Study', 'Reading', 'Research', 'Computer/Internet', 'Borrowing Books', 
               'Returning Books', 'Meeting/Event', 'Reference Help', 'Other'],
        required: true
    },
    checkInTime: {
        type: Date,
        default: Date.now
    },
    checkOutTime: Date,
    duration: Number, // in minutes
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Calculate duration before saving
visitorLogSchema.pre('save', function(next) {
    if (this.checkOutTime && this.checkInTime) {
        this.duration = Math.round((this.checkOutTime - this.checkInTime) / 60000);
    }
    next();
});

const VisitorLog = mongoose.model('VisitorLog', visitorLogSchema);
export default VisitorLog;