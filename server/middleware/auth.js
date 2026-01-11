import jwt from 'jsonwebtoken';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get users from JSON file
function getUsers() {
    const data = readFileSync(path.join(__dirname, '..', 'data', 'users.json'), 'utf-8');
    return JSON.parse(data).users;
}

// Verify JWT token middleware
export function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            error: 'Access denied. No token provided.',
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user
        const users = getUsers();
        const user = users.find(u => u.id === decoded.userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid token. User not found.',
            });
        }

        req.user = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: 'Token expired. Please login again.',
            });
        }
        return res.status(401).json({
            success: false,
            error: 'Invalid token.',
        });
    }
}

// Admin only middleware
export function adminOnly(req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            error: 'Access denied. Admin privileges required.',
        });
    }
    next();
}
