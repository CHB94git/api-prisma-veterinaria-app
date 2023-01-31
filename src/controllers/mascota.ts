import { NextFunction, Request, Response } from 'express';
import * as MascotaService from '../services/mascota';


const createPet = async ({ body, veterinary }: Request, res: Response, next: NextFunction) => {
  try {
    const petCreated = await MascotaService.insertPet(body, veterinary?.id!)
    return res.status(201).json(petCreated)
  } catch (error: any) {
    console.log(error)
    next(error)
  }
}

const getAllPets = async ({ veterinary }: Request, res: Response, next: NextFunction) => {
  try {
    const pets = await MascotaService.findAllPetsByVet(veterinary?.id!)
    return res.status(200).json(pets)
  } catch (error: any) {
    console.log(error)
    next(error)
  }
}

const getOnePet = async ({ params, veterinary }: Request, res: Response, next: NextFunction) => {
  const { idPet } = params
  try {
    const pet = await MascotaService.findOnePetByVet(idPet, veterinary?.id!)
    return res.status(200).json(pet)
  } catch (error: any) {
    console.log(error)
    next(error)
  }
}

const updatePet = async ({ params, veterinary, body }: Request, res: Response, next: NextFunction) => {
  const { idPet } = params
  try {
    const pet = await MascotaService.updatePetByVet(idPet, veterinary?.id!, body)
    return res.status(200).json(pet)
  } catch (error: any) {
    console.log(error)
    next(error)
  }
}

const deletePet = async ({ params, veterinary }: Request, res: Response, next: NextFunction) => {
  try {
    await MascotaService.deletePetByVet(params.idPet, veterinary?.id!)
    return res.status(204).send()
  } catch (error: any) {
    console.log(error)
    next(error)
  }
}

export {
  createPet,
  getOnePet,
  getAllPets,
  updatePet,
  deletePet,
};

