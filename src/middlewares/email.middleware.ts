import {body} from "express-validator";

export const emailValidation = body("email")
    .isString()
    .trim()
    .isLength({min: 1})
    .isEmail()
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage("email is not correct");
