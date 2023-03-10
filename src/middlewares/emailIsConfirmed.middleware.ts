import { body } from "express-validator";
import {UsersDbRepositoryClass} from "../repositories/users_db_repository";
const usersDbRepository = new UsersDbRepositoryClass();
export const emailIsConfirmedValidation = body("email").custom(
  async (email: string) => {
    const user = await usersDbRepository.findUserByLoginOrEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    if (user.emailConfirmation.isConfirmed === true) {
      throw new Error("email already is confirmed");
    }
    return true;
  }
);
