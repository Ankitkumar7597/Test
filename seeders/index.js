const { Admin } = require('../model/index');
const dbService = require('../utils/dbService');
const bcrypt = require('bcryptjs');

async function seedUser() {
    try {
        let userToBeInserted = await Admin.findOne({})

        if (!userToBeInserted) {
            userToBeInserted = {
                'username': process.env.ADMIN_DEFAULT_USERNAME || 'admin',
                'password': process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@123',
                'admin_email': process.env.ADMIN_DEFAULT_EMAIL || 'admin@gmail.com',
                'isDeleted': false,
                'isActive': true,
                'twoFactorStatus': 0,
            };

            // Hash the password securely
            userToBeInserted.password = await bcrypt.hash(userToBeInserted.password, 10);

            // Create the admin user
            await dbService.createOne(Admin, userToBeInserted);
            console.info('Admin model seeded 🍺');
        } else {
            console.info('Admin model already seeded 🍺');
        }

    } catch (error) {
        console.error('User seeder failed due to:', error);
    }
}

async function seedData() {
    await seedUser();
};
module.exports = seedData;