import { NextFunction, Request, Response } from 'express';
import * as VeterinarioService from '../services/veterinario';


const getAllVets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vets = await VeterinarioService.findAllVets()
    return res.status(200).json(vets)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

const createVet = async ({ body }: Request, res: Response, next: NextFunction) => {
  try {
    const vetCreated = await VeterinarioService.insertVet(body)
    return res.status(201).json(vetCreated)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

const login = async ({ body }: Request, res: Response, next: NextFunction) => {
  try {
    const logged = await VeterinarioService.loginVet(body)
    return res.status(200).json(logged)
  } catch (error: any) {
    console.log(error)
    next(error)
  }
}

const confirmRegister = async ({ params }: Request, res: Response, next: NextFunction) => {
  try {
    const vetConfirmed = await VeterinarioService.confirm(params.token)
    return res.status(200).json({
      message: 'Usuario confirmado exitosamente',
      vetConfirmed
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

const forgetMyPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body
    const resp = await VeterinarioService.forgetThePassword(email)
    return res.status(200).json(resp)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

const verifyOneTimeUseToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params
    const verifiedToken = await VeterinarioService.checkValidToken(token)
    return res.status(200).json(verifiedToken)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

const generateNewPassword = async ({ body, params }: Request, res: Response, next: NextFunction) => {
  try {
    const resp = await VeterinarioService.newPassword(params.token, body.password)
    return res.status(201).json(resp)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

const profile = async ({ veterinary }: Request, res: Response) => {
  return res.status(200).json(veterinary)
}

const updateProfileInfo = async ({ body, veterinary }: Request, res: Response, next: NextFunction) => {
  try {
    const profileUpdated = await VeterinarioService.updateVeterinaryProfile(veterinary?.id!, body)
    return res.status(200).json(profileUpdated)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

const updatePassword = async ({ veterinary, body }: Request, res: Response, next: NextFunction) => {
  try {
    const passUpdated = await VeterinarioService.changePassword(veterinary?.id!, body)
    return res.status(200).json(passUpdated)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

const getDetailsOneVet = async ({ params }: Request, res: Response, next: NextFunction) => {
  try {
    const vet = await VeterinarioService.getUniqueVet(params.idVet)
    return res.status(200).json(vet)
  } catch (error: any) {
    console.log(error)
    next(error)
  }
}

export {
  confirmRegister,
  createVet,
  forgetMyPassword,
  generateNewPassword,
  getAllVets,
  getDetailsOneVet,
  login,
  profile,
  updatePassword,
  updateProfileInfo,
  verifyOneTimeUseToken,
};

