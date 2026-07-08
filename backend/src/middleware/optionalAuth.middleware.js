import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const optionalAuth = async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) return next();

    const decodedTokenInfo = jwt.verify(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decodedTokenInfo._id).select(
      "-password -refreshToken"
    );

    if (user) req.user = user;
  } catch {
    // silently ignore — user stays unauthenticated
  }
  next();
};

export default optionalAuth;
