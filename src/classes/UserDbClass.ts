import {EmailConfirmationClass} from "./EmailConfirmationClass";

export class UserDbClass {
    createdAt: string
    emailConfirmation: EmailConfirmationClass
    constructor(
        public login: string,
        public email: string,
        public passwordHash: string,
    ) {
        this.createdAt = new Date().toISOString()
        this.emailConfirmation = new EmailConfirmationClass()
    }
}


