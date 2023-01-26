import { NextFunction, Request, Response } from "express";
import {CommentsQweryRepositoryClass} from "../repositories/comments_qwery_repository";
import { RequestWithURL } from "../models/request_types";
const commentsQweryRepository = new CommentsQweryRepositoryClass();
export const userIsOwnerOfCommentMiddleware = async (
  req: RequestWithURL<{ commentId: string }>,
  res: Response,
  next: NextFunction
) => {
  const comment = await commentsQweryRepository.findCommentById(
    req.params.commentId
  );
  if (!comment) {
    res.status(404).send("comment doesn't exist");
    return;
  } else if (req.user!.id !== comment.commentatorInfo.userId) {
    res.status(403).send("you try edit the comment that is not your own");
    return;
  } else {
    next();
  }
};
