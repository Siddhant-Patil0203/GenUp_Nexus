import "../middlewares/passportConfig.js";
import passport from "passport";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import userModel from "../models/userModel.js";
// import sendWelcomeMail from "../services/mail.js";
dotenv.config();

const SECRET = process.env.USER;
/**
 * Route: /auth/google
 * Desc:  Open google consent screen
 */
export const authGoogle = passport.authenticate('google', {scope: ["email", "profile"],});

/**
 * Route: /auth/google/callback
 * Desc: handle callback from google
 */
export const callbackGoogle = passport.authenticate("google", {
  successRedirect: "/auth/protected",
  failureRedirect: "/auth/failed",
});

/**
 * Route: auth/protected
 * desc: reditrection after successfull
 *       google auth with userdata in req
 */
export const authenticated = (req, res) => {
  const token = jwt.sign({sub: {
    email: req.user.email,
    id: req.user._id
  }}, SECRET, {
    expiresIn: "7d",
  });

//   console.log(req.user);
  const gRes = {
    name : req.user.name,
    email : req.user.email,
    picture : req.user.picture,
    userId : req.user._id
  }
  // res.status(200).json({
  //   result: req.user,
  //   token: token,
  // });

  res.redirect(process.env.CLIENT_URL + `/login?token=${token}&result=${encodeURIComponent(JSON.stringify(gRes))}`);
};

/**
 * Route: /failed
 * Desc: Redirection if google authentication failed
 */
export const failed = (req, res) => {
    res.redirect(process.env.CLIENT_URL + `/login`);
};
