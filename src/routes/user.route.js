import {
  registerUser,
  login,
  logOut,
  forgotPassword,
  refreshAccessToken,
  resetPassword,
  getUserDetails
} from "../controllers/user.controller.js";
import { verifyJwtToken } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import express from "express";
const router = express.Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(login);

router.route("password/forgot").post(forgotPassword)

router.route("/password/reset").put(resetPassword)

router.route("/refresh-token").post(refreshAccessToken)


// Secure Routes
router.route("/logout").post(verifyJwtToken, logOut);

router.route("/me").get(verifyJwtToken , getUserDetails)


export default router;
