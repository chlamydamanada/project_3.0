import {userViewType} from "../models/userViewModel";
import {ObjectId} from "mongodb";
import {usersViewType} from "../models/usersViewModel";
import {sortingQueryFields} from "../helpers/sortingFields";
import {usersModel} from "./db";
import {injectable} from "inversify";
@injectable()
export class UsersQwRepositoryClass {
  async findAllUsers(
    pageNumber: number,
    pageSize: number,
    searchLoginTerm: string | undefined,
    searchEmailTerm: string | undefined,
    sortBy: string,
    sortDirection: 1 | -1
  ): Promise<usersViewType> {
    const loginAndEmailFilter = sortingQueryFields.loginAndEmailFilter(
      searchLoginTerm,
      searchEmailTerm
    );
    const totalCount = await usersModel.count(loginAndEmailFilter);
        const allUsers = await usersModel
      .find(loginAndEmailFilter)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection })
      .lean();
    const items = allUsers.map((u) => ({
      id: u._id.toString(),
      login: u.login,
      email: u.email,
      createdAt: u.createdAt,
    }));
    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: items,
    };
  }
  async findUserById(userId: string): Promise<userViewType | undefined> {
    const user = await usersModel.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return undefined;
    } else {
      return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
      };
    }
  }
  async findUserByRefreshToken(
    refreshToken: string
  ): Promise<userViewType | undefined> {
    const user = await usersModel.findOne({ refreshToken: refreshToken });
    if (!user) {
      return undefined;
    } else {
      return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
      };
    }
  }
};
export const usersQwRepository = new UsersQwRepositoryClass();