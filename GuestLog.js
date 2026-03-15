import mongoose from 'mongoose';

const guestLogSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    sector: {
        type: String,
        enum: ['Student', 'Employee', 'Self-Employed', 'Unemployed', 'Retired', 'Other'],
        required: true
    },
    organization: {
        type: String,
        required: true
    },
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
    duration: Number,
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const GuestLog = mongoose.model('GuestLog', guestLogSchema);
export default GuestLog;