import {UsersDbRepositoryClass} from "../repositories/users_db_repository";
import {userDbType} from "../models/userDBModel";
import {generateHash, generateSalt} from "../helpers/generator_Hash";
import {UserDbClass} from "../classes/UserDbClass";
import {AuthServiceClass} from "./auth_service";

export class UserServiceClass {
    private usersDbRepository : UsersDbRepositoryClass
    private authService: AuthServiceClass;
    constructor() {
        this.usersDbRepository = new UsersDbRepositoryClass()
        this.authService = new AuthServiceClass()
    }

    async createUser(
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
        return await this.usersDbRepository.findUserById(id);
    }
    async deleteUser(id: string): Promise<boolean> {
        return await this.usersDbRepository.deleteUser(id);
    }
}

