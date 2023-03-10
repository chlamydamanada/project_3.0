import {body} from "express-validator";
import {UsersDbRepositoryClass} from "../repositories/users_db_repository";

const usersDbRepository = new UsersDbRepositoryClass()
export const emailExistValidation = body("email").custom(
  async (email: string) => {
    const user = await usersDbRepository.findUserByLoginOrEmail(email);
    if (user) {
      throw new Error("email already exist");
    }
    return true;
  }
);
