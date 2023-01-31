import bcrypt from 'bcrypt';

export const encryptPassword = async (password: string) => {
  const hashPass = bcrypt.hash(password, 10)
  return hashPass
}

export const checkPassword = async (password: string, pwdHash: string) => {
  const matchPass = await bcrypt.compare(password, pwdHash)
  return matchPass
}