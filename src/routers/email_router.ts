import { Request, Response, Router } from "express";
import { emailAdapter } from "../adapters/email_adapter";

export const emailRouter = Router();

emailRouter.post("/send", async (req: Request, res: Response) => {
  try{
    const result = await emailAdapter.sendRegistrationEmail(req.body.email);
    if (result) {
      res.sendStatus(200);
    }
  } catch (e) {
    res.status(500).send("emailRouter.post/send" + e)
  }

});
