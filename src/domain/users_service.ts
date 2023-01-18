import {usersDbRepository} from "../repositories/users_db_repository";
import {userDbType} from "../models/userDBModel";
import {generateHash, generateSalt} from "../helpers/generator_Hash";
import {UserDbClass} from "../classes/UserDbClass";
import {authService} from "./auth_service";

class UserServiceClass {
    async createUser(
        login: string,
        password: string,
        email: string
    ): Promise<string> {
        const passwordSalt = await generateSalt();
        const passwordHash = await generateHash(password, passwordSalt);

        const newUserDto: userDbType = new UserDbClass(login, email, passwordHash);

        const newUserId = await usersDbRepository.createUser(newUserDto);
        await authService.confirmEmail(newUserDto.emailConfirmation.confirmationCode)
        return newUserId;
    }
    async findUserById(id: string): Promise<boolean> {
        return await usersDbRepository.findUserById(id);
    }
    async deleteUser(id: string): Promise<boolean> {
        return await usersDbRepository.deleteUser(id);
    }
}

export const usersService = new UserServiceClass();