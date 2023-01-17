import bcrypt from "bcrypt";


export const generateSalt = async () => {
    return await bcrypt.genSalt(10);
}

export const generateHash = async (password: string, salt: string) => {
    return await bcrypt.hash(password, salt);
  }