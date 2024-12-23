import bcrypt from 'bcrypt';
import userModel from '../model/user.js';
import sequelize from '../config/database.js';

const User = userModel(sequelize);

const UserController = {
    async createUser(req, res) {
        const { name, email, password, role } = req.body;
    
        if (role !== 'admin' && role !== 'employee') {
            return res.status(400).json({ error: 'Le rôle doit être "admin" ou "employee"' });
        }
    
        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await User.create({ name, email, password: hashedPassword, role });
            res.status(201).json(newUser);
        } catch (error) {
            console.error('Erreur lors de la création de l\'utilisateur :', error);
            res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur', details: error.message });
        }
    },

    async getAllUsers(req, res) {
        try {
            const users = await User.findAll();
            res.status(200).json(users);
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs :', error);
            res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
        }
    },

    async getUserById(req, res) {
        const userId = req.params.id;
    
        try {
            const user = await User.findByPk(userId);
    
            if (!user) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }
    
            res.status(200).json(user);
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur :', error);
            res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur' });
        }
    },

    async updateUser(req, res) {
        const userId = req.params.id;
        const { name, email, password, role } = req.body;

        console.log(`ID utilisateur reçu : ${userId}`);
        
        try {
            const user = await User.findByPk(userId);
            console.log(`Utilisateur trouvé : ${user}`);

            if (!user) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }

            user.name = name;
            user.email = email;
            user.password = password;
            user.role = role;

            await user.save();

            res.status(200).json(user);
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
            res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur' });
        }
    },

    async deleteUser(req, res) {
        const userId = req.params.id;

        try {
            const user = await User.findByPk(userId);

            if (!user) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }

            await user.destroy();
            res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'utilisateur :', error);
            res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur' });
        }
    }
};

export default UserController;
