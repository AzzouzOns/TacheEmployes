import jwt from 'jsonwebtoken';
const secretKey = 'votre_secret_key';
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Accès non autorisé, aucun token fourni' });
    }

    try {
        const decoded = jwt.verify(token, 'votre_secret_jwt');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Token invalide' });
    }
};

export default authMiddleware;