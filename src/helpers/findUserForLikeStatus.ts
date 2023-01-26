import {authService} from "../composition_root";
import {usersQwRepository} from "../repositories/user_query_repository";

export const findUserForLikeStatus = async (authorization: string | undefined | null) => {
    if (authorization) {
        let token = authorization.split(" ")[1];
        const userId = await authService.decodeToken(token);
        const user = await usersQwRepository.findUserById(userId);
        if(userId && user)
        return {
            userId,
            userLogin: user.login
        }
    }
    return null

};