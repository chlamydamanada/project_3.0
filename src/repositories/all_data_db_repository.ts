import {BlogsModel, commentsModel, postsModel, refreshTokenMetaModel, usersModel,} from "./db";

export const allDataRepository = {
    async deleteAllData(): Promise<void> {
        await Promise.all([
            BlogsModel.deleteMany({}),
            postsModel.deleteMany({}),
            usersModel.deleteMany({}),
            commentsModel.deleteMany({}),
            refreshTokenMetaModel.deleteMany({}),
        ]);
    },
};
