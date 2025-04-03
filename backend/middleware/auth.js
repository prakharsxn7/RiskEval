import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const token = authHeader.split(' ')[1]; // Bearer <token>
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

export const verifyBankUser = (req, res, next) => {
    if (req.user.userType !== 'bank') {
        return res.status(403).json({ message: 'Access denied. Bank users only.' });
    }
    next();
};

export const verifyCustomer = (req, res, next) => {
    if (req.user.userType !== 'customer') {
        return res.status(403).json({ message: 'Access denied. Customers only.' });
    }
    next();
}; 