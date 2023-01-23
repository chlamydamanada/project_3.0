import {UsersDbRepositoryClass} from "../repositories/users_db_repository";
import {userDbType} from "../models/userDBModel";
import {generateHash, generateSalt} from "../helpers/generator_Hash";
import {UserDbClass} from "../classes/UserDbClass";
import {AuthServiceClass} from "./auth_service";
import {inject, injectable} from "inversify";
@injectable()
export class UserServiceClass {
    constructor(@inject(AuthServiceClass) protected authService: AuthServiceClass,
                @inject(UsersDbRepositoryClass) protected usersDbRepository: UsersDbRepositoryClass) {
    }

    async createUser(
        //todo 3 general function to creat user
        login: string,
        password: string,
        email: string
    ): Promise<string> {
        const passwordSalt = await generateSalt();
        const passwordHash = await generateHash(password, passwordSalt);

        const newUserDto: userDbType = new UserDbClass(login, email, passwordHash);

        const newUserId = await this.usersDbRepository.createUser(newUserDto);
        await this.authService.confirmEmail(newUserDto.emailConfirmation.confirmationCode)
        return newUserId;
    }

    async findUserById(id: string): Promise<boolean> {
        //todo move to qwery repository and correct connection
        return await this.usersDbRepository.findUserById(id);
    }

    async deleteUser(id: string): Promise<boolean> {
        return await this.usersDbRepository.deleteUser(id);
    }
}

