import {Response, Router} from "express";
import {
    RequestWithBody,
    RequestWithQuery,
    RequestWithURL,
} from "../models/request_types";
import {UsersQwRepositoryClass} from "../repositories/user_query_repository";
import {UserServiceClass} from "../domain/users_service";
import {userCreateType} from "../models/userCreateModel";
import {userViewType} from "../models/userViewModel";
import {baseAuthMiddleware} from "../middlewares/baseAuthorization.middleware";
import {passwordValidation} from "../middlewares/password.middleware";
import {loginValidation} from "../middlewares/login.middleware";
import {emailValidation} from "../middlewares/email.middleware";
import {inputValMiddleware} from "../middlewares/inputValue.middleware";
import {userQueryType} from "../models/userQueryModel";
import {usersViewType} from "../models/usersViewModel";
import {sortingQueryFields} from "../helpers/sortingFields";

export const usersRouter = Router();

class UserController {
    private usersService: UserServiceClass;
    private usersQwRepository: UsersQwRepositoryClass;
    constructor() {
        this.usersService = new UserServiceClass()
        this.usersQwRepository = new UsersQwRepositoryClass()
    }

    async getAllUsers(req: RequestWithQuery<userQueryType>,
                      res: Response<usersViewType | string>
    ) {
        try {
            const queryFilter = sortingQueryFields.queryFilter(req.query);
            const allUsers = await this.usersQwRepository.findAllUsers(
                queryFilter.pageNumber,
                queryFilter.pageSize,
                req.query.searchLoginTerm,
                req.query.searchEmailTerm,
                queryFilter.sortBy,
                queryFilter.sortDirection
            );

            res.status(200).send(allUsers);
        } catch (e) {
            res.status(500).send("usersRouter.get/" + e)
        }
    }

    async createUser(req: RequestWithBody<userCreateType>,
                     res: Response<userViewType | string>) {
        try {
            const userId = await this.usersService.createUser(
                req.body.login,
                req.body.password,
                req.body.email
            );
            const newUser = await this.usersQwRepository.findUserById(userId);
            res.status(201).send(newUser);
        } catch (e) {
            res.status(500).send("usersRouter.post/" + e)
        }
    }

    async deleteUserById(req: RequestWithURL<{ id: string }>,
                         res: Response<string>) {
        try {
            const isUser = await this.usersService.findUserById(req.params.id);
            if (isUser) {
                await this.usersService.deleteUser(req.params.id);
                res.sendStatus(204);
            } else {
                res.sendStatus(404);
            }
        } catch (e) {
            res.status(500).send("" + e)
        }
    }
}

const userController = new UserController();

usersRouter.get(
    "/",
    baseAuthMiddleware,
    userController.getAllUsers.bind(userController));
usersRouter.post(
    "/",
    baseAuthMiddleware,
    passwordValidation,
    loginValidation,
    emailValidation,
    inputValMiddleware,
    userController.createUser.bind(userController));
usersRouter.delete(
    "/:id",
    baseAuthMiddleware,
    inputValMiddleware,
    userController.deleteUserById.bind(userController));
