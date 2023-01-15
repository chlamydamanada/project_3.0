import {emailConfirmationType} from "../models/emailConfirmationServiceModel";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";

export const createNewConfirmationCode = (): emailConfirmationType => {
    const newEmailConfirmation: emailConfirmationType = {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), {
            hours: 1,
            minutes: 30,
        }),
        isConfirmed: false,
    };
    return newEmailConfirmation;
};