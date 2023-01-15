import { body } from "express-validator";

export const passwordValidation = body("password")
  .isString()
  .trim()
  .isLength({ min: 6, max: 20 })
  .withMessage("password is not correct");

export const newPasswordValidation = body("newPassword")
    .isString()
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage("password is not correct");