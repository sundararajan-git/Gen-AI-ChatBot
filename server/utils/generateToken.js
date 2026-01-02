import jwt from 'jsonwebtoken';

export const generateJwtToken = (id, role) => {
    return jwt.sign(
        { id, role },
        process.env.JWT_SECRET,
        { expiresIn: '15min' }
    );
};
