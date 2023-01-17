import {usersDbRepository} from "../repositories/users_db_repository";
import {userDbType} from "../models/userDBModel";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {generateHash, generateSalt} from "../helpers/generator_Hash";

export const usersService = {
  async createUser(
    login: string,
    password: string,
    email: string
  ): Promise<string> {
    const passwordSalt = await generateSalt();
    const passwordHash = await generateHash(password, passwordSalt);

    const newUser: userDbType = {
      login: login,
      email: email,
      passwordHash,
      createdAt: new Date().toISOString(),
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), {
          hours: 1,
          minutes: 30,
        }),
        isConfirmed: true,
      },
    };
    // make isConfirmed: true by authService!!!!!
    return await usersDbRepository.createUser(newUser);
  },
  async findUserById(id: string): Promise<boolean> {
    return await usersDbRepository.findUserById(id);
  },
  async deleteUser(id: string): Promise<boolean> {
    return await usersDbRepository.deleteUser(id);
  },
  };
