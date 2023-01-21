import { body } from "express-validator";
import {UsersDbRepositoryClass} from "../repositories/users_db_repository";
const usersDbRepository = new UsersDbRepositoryClass();
export const loginExistValidation = body("login").custom(
  async (login: string) => {
    const user = await usersDbRepository.findUserByLoginOrEmail(login);
    if (user) {
      throw new Error("login already exist");
    }
    return true;
  }
);
