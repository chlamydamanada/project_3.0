import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";

export class UserDbClass {
    createdAt: string
    constructor(
        public login: string,
        public email: string,
        public passwordHash: string,
    ) {
        this.createdAt = new Date().toISOString()

    }
}


class EmailConfirmationClass {
    confirmationCode: string
    expirationDate: Date
    isConfirmed: boolean
    constructor() {
        this.confirmationCode = uuidv4()
        this.expirationDate = add(new Date(), {
            hours: 1,
            minutes: 30,
        })
        this.isConfirmed = false
    }
}