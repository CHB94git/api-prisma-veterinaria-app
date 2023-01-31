import { Veterinary } from '@prisma/client';
import { prisma } from '../database/prismaClient';
import { checkPassword, CustomError, encryptPassword, generateID, generateJwt } from '../helpers';
import { emailForgetPassword, registerEmail } from '../utils';


export const findAllVets = async () => {
  return await prisma.veterinary.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export const insertVet = async (data: Veterinary) => {
  const { name, email, password, phone, web } = data
  // const passwordEncrypted = await encryptPassword(password)
  const veterinary = await prisma.veterinary.create({
    data: {
      name,
      email,
      password: await encryptPassword(password),
      confirmed: false,
      phone,
      token: generateID(),
      web
    }
  })
  await registerEmail({
    email,
    name,
    token: veterinary.token
  })
  return veterinary
}

const findOneByEmail = async (email: string) => {
  return await prisma.veterinary.findUnique({ where: { email } })
}

export const loginVet = async (data: Veterinary) => {
  const { email, password } = data

  const user = await findOneByEmail(email)

  if (!user)
    throw new CustomError(`El usuario ${ email } no existe`, 404)

  if (await checkPassword(password, user.password)) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      token: await generateJwt(user.id)
    }
  }
  throw new CustomError('Credenciales incorrectas', 403)
}

const checkToken = async (token: string) => {
  return await prisma.veterinary.findFirst({ where: { token } })
}

export const confirm = async (token: string) => {
  const confirmUser = await checkToken(token)

  if (!confirmUser)
    throw new CustomError('Token inválido - No se pudo confirmar la cuenta', 400)

  return await prisma.veterinary.update({
    where: { id: confirmUser.id },
    data: {
      token: confirmUser.token = null,
      confirmed: confirmUser.confirmed = true
    }
  })
}

export const forgetThePassword = async (email: string) => {
  const veterinaryExists = await findOneByEmail(email)

  if (!veterinaryExists)
    throw new CustomError('El usuario no existe', 404)

  try {
    await prisma.veterinary.update({
      where: { id: veterinaryExists.id },
      data: {
        token: veterinaryExists.token = generateID()
      }
    })

    await emailForgetPassword({
      email,
      name: veterinaryExists.name,
      token: veterinaryExists.token
    })

    return { message: 'Hemos enviado a su email un link de recuperación' }
  } catch (error: any) {
    throw error
  }
}

export const checkValidToken = async (token: string) => {
  const validateToken = await checkToken(token)

  if (!validateToken)
    throw new CustomError('Token inválido para reestablecer la cuenta', 400)

  return { message: 'Token válido, usuario registrado exitosamente', userConfirmed: validateToken }
}

export const newPassword = async (token: string, password: string) => {
  const veterinary = await checkToken(token)

  if (!veterinary)
    throw new CustomError('Hubo un error - Token inválido', 403)

  await prisma.veterinary.update({
    where: { id: veterinary.id },
    data: {
      password: veterinary.password = password,
      token: veterinary.token = null
    }
  })
  return { message: 'Contraseña/Password modificada con éxito' }
}

export const updateVeterinaryProfile = async (id: string, data: Veterinary) => {
  const veterinary = await prisma.veterinary.findUnique({ where: { id } })

  if (!veterinary)
    throw new CustomError('Hubo un error - usuario inexistente', 404)

  if (data.email) {
    if (veterinary.email !== data.email) {
      const { email } = data
      const existsEmail = await prisma.veterinary.findUnique({ where: { email } })
      if (existsEmail)
        throw new CustomError(`Email de usuario ${ email } ya está en uso!`, 400)
    }
  }

  return await prisma.veterinary.update({
    where: { id: veterinary.id },
    data: {
      name: data.name ?? veterinary.name,
      email: data.email ?? veterinary.email,
      web: data.web ?? veterinary.web,
      phone: data.phone ?? veterinary.phone,
    },
    select: {
      id: true,
      name: true,
      email: true,
      web: true,
      phone: true,
      token: true,
      confirmed: true,
      createdAt: true,
      updatedAt: true
    }
  })
}

interface ChangePassword {
  current_password: string
  new_password: string
}

export const changePassword = async (id: string, data: ChangePassword) => {
  const { current_password, new_password } = data
  const veterinary = await prisma.veterinary.findUnique({ where: { id } })

  if (await checkPassword(current_password, veterinary?.password!)) {
    await prisma.veterinary.update({
      data: {
        password: await encryptPassword(new_password)
      },
      where: { id: veterinary?.id }
    })
    return { message: 'Contraseña actualizada y guardada correctamente' }
  }
  throw new CustomError('La actual contraseña no coincide con nuestros registros', 400)
}

export const getUniqueVet = async (id: string) => {
  return await prisma.veterinary.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      web: true,
      phone: true,
      token: true,
      confirmed: true,
      createdAt: true,
      updatedAt: true
    }
  })
}

