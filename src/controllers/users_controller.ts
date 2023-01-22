import {UserServiceClass} from "../domain/users_service";
import {UsersQwRepositoryClass} from "../repositories/user_query_repository";
import {RequestWithBody, RequestWithQuery, RequestWithURL} from "../models/request_types";
import {userQueryType} from "../models/userQueryModel";
import {Response} from "express";
import {usersViewType} from "../models/usersViewModel";
import {sortingQueryFields} from "../helpers/sortingFields";
import {userCreateType} from "../models/userCreateModel";
import {userViewType} from "../models/userViewModel";

export class UserController {
    constructor(protected usersService: UserServiceClass,
                protected usersQwRepository: UsersQwRepositoryClass) {
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