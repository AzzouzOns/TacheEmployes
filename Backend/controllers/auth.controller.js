import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../postgrsql.js';

const AuthController = {
    async register(req, res) {
        const { email, password, name, role } = req.body;
    
        // Validate role
        if (role !== 'admin' && role !== 'employee') {
            return res.status(400).json({ error: 'Le rôle doit être "admin" ou "employee"' });
        }
    
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({ email, password: hashedPassword, name, role });
            res.status(201).json(newUser);
        } catch (error) {
            console.error('Erreur lors de la création de l\'utilisateur :', error);
            res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur', details: error.message });
        }
    },

    async login(req, res) {
        const { email, password } = req.body;
    
        try {
            const user = await User.findOne({ where: { email } });
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect' });
            }
    
            const token = jwt.sign({ id: user.id, role: user.role }, 'votre_secret_jwt', { expiresIn: '72h' });
            
            res.status(200).json({ token, role: user.role });
        } catch (error) {
            console.error('Erreur lors de la connexion :', error);
            res.status(500).json({ error: 'Erreur lors de la connexion', details: error.message });
        }
    }
};

export default AuthController;