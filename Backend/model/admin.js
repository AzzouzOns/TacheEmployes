import { userModel } from './user.js';

export const adminModel = (sequelize) => {
    const User = userModel(sequelize);
    const Admin = User.scope('admin'); // scope de l'admin

    return Admin;
};
