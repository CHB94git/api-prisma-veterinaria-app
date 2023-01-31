import { sign } from 'jsonwebtoken'

export const generateJwt = async (id: string) => {
  const jwt = sign({ id }, process.env.JWT_SECRET!)
  return jwt
}