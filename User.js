import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        unique: true,
        lowercase: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't return password by default
    },
    fullName: {
        type: String,
        required: [true, 'Please provide your full name']
    },
    age: {
        type: Number,
        min: 1,
        max: 120
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other']
    },
    phone: {
        type: String,
        required: [true, 'Please provide a phone number']
    },
    address: {
        type: String
    },
    sector: {
        type: String,
        enum: ['Student', 'Employee', 'Self-Employed', 'Unemployed', 'Retired', 'Other']
    },
    organization: {
        type: String
    },
    role: {
        type: String,
        enum: ['visitor', 'admin', 'employee'],
        default: 'visitor'
    },
    memberId: {
        type: String,
        unique: true,
        sparse: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate unique Member ID
userSchema.pre('save', async function(next) {
    if (!this.memberId && this.role === 'visitor') {
        const time = Date.now().toString().slice(-6);
        const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
        this.memberId = `LIB-${time}-${rand}`;
    }
    next();
});

const User = mongoose.model('User', userSchema);
export default User;