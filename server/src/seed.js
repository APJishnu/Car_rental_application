import bcrypt from 'bcryptjs';
import Admin from './models/admin-models.js';

const seedAdmin = async () => {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await Admin.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: hashedPassword,
    role: 'admin'
  });
};

export default seedAdmin;
