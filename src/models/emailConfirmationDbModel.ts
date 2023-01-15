export type emailConfirmationDbType = {
  confirmationCode: string;
  expirationDate: Date;
  isConfirmed: boolean;
};
