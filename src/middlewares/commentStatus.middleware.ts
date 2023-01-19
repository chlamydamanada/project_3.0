import {body} from "express-validator";

export const commentStatusValidation = body("likeStatus")
    .isString()
    .custom(async (likeStatus: string) => {
        if (likeStatus === "Like" || likeStatus === "Dislike" || likeStatus === "None") {
            return true;
        }
        throw new Error("likeStatus has incorrect values");
    });