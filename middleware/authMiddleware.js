const jwt = require('jsonwebtoken');
const db = require('../db'); // আপনার knex ডাটাবেজ কানেকশন

// ১. টোকেন তৈরি করার হেল্পার ফাংশন
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

// ২. প্রটেক্টেড রাউটের জন্য ভেরিফিকেশন মিডলওয়্যার
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Header থেকে 'Bearer <token>' আলাদা করা
            token = req.headers.authorization.split(' ')[1];

            // টোকেন ভেরিফাই করা
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Knex দিয়ে ডাটাবেজ থেকে ইউজার বের করা (পাসওয়ার্ড ছাড়া)
            const user = await db('users').where({ id: decoded.id }).first();

            if (!user) {
                return res.status(401).json({ success: false, message: 'User not found' });
            }

            // রিকোয়েস্ট অবজেক্টে ইউজার ডাটা অ্যাসাইন করা
            req.user = user;
            next();
        } catch (error) {
            console.error('JWT Verification Error:', error.message);
            return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token found' });
    }
};

module.exports = { generateToken, protect };