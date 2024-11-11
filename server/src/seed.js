import bcrypt from "bcryptjs";
import Admin from "./modules/admin/models/admin-models.js";

const seedAdmin = async () => {
  const adminExists = await Admin.findOne( {where:{ email: "admin@example.com"} });

  if (adminExists) {
    return console.log("Admin user already exists");
  }
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await Admin.create({
    name: "Admin User",
    email: "admin@example.com",
    password: hashedPassword,
    role: "admin",
  });

  return console.log("Admin user seeded");
};

export default seedAdmin;
