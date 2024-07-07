import bcrypt from "bcryptjs";

export const hashPassword = (password: string) => {
  return bcrypt.hash(password, 10);
};
export const comparePassword = (
  passwordToCompare: string,
  hashedPassword: string
) => {
  return bcrypt.compare(passwordToCompare, hashedPassword);
};
