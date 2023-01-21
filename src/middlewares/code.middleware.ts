import {body} from "express-validator";
import {UsersDbRepositoryClass} from "../repositories/users_db_repository";

const usersDbRepository = new UsersDbRepositoryClass();
export const codeValidation = body("code")
  .isString()
  .custom(async (code: string) => {
    const user = await usersDbRepository.findUserByCode(code);

    if (user.emailConfirmation.isConfirmed === true) {
      throw new Error("email is confirmed");
    }
    if (user.emailConfirmation.expirationDate < new Date()) {
      throw new Error("Confirmation time is out");
    }
    return true;
  });
export const recoveryCodeValidation = body("recoveryCode")
    .isString()
    .custom(async (code: string) => {
        const user = await usersDbRepository.findUserByCode(code);

        if (user.emailConfirmation.isConfirmed === true) {
            throw new Error("email is confirmed");
        }
        if (user.emailConfirmation.expirationDate < new Date()) {
            throw new Error("Confirmation time is out");
        }
        return true;
    });