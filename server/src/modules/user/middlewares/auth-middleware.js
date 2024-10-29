// middleware/auth.js

import { verifyToken } from "../../../utils/jwt-helper.js";
import User from "../models/auth-model.js";

const authenticateUser = async (token) => {
  if (!token) {
    throw new Error("Authorization token is missing");
  }

  const decodedToken = verifyToken(token.replace("Bearer ", "")); // Strip "Bearer "
  const userId = decodedToken.id;
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export default authenticateUser;
