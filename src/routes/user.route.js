import { registerUser, login , logOut } from "../controllers/user.controller.js";
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

router.route("/login").post(login)

// Secure Routes

router.route("/logout").post( verifyJwtToken , logOut)

export default router;
